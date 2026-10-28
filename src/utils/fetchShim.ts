// Capture-phase error suppression & fetch shim to prevent extension errors from bubbling
export function installFetchShim() {
  if (typeof window === "undefined") return;

  function isExtensionError(msg: any, source: any, stack: any) {
    const combined = (String(msg || "") + " " + String(source || "") + " " + String(stack || "")).toLowerCase();
    return (
      combined.includes("chrome-extension://") ||
      combined.includes("pphgdbgldlmicfdkhondlafkiomnelnk") ||
      combined.includes("cannot set property fetch") ||
      combined.includes("which has only a getter")
    );
  }

  window.addEventListener(
    "error",
    (event) => {
      if (isExtensionError(event.message, event.filename, event.error && event.error.stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      const reason = event.reason;
      const msg = reason && (reason.message || String(reason));
      const stack = reason && reason.stack;
      if (isExtensionError(msg, "", stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    },
    true
  );

  try {
    let currentFetch = window.fetch;
    Object.defineProperty(window, "fetch", {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        currentFetch = newFetch;
      },
      configurable: true,
      enumerable: true
    });
  } catch {}
}

import React, { useState, useEffect } from "react";
import { contentRepository, ReviewRecord } from "./content/store/contentRepository";
import { FlashNavbar } from "./components/flash/FlashNavbar";
import { FlashHome } from "./components/flash/FlashHome";
import { FlashProductAnalysis } from "./components/flash/FlashProductAnalysis";
import { FlashEmailModal } from "./components/flash/FlashEmailModal";
import { FlashFooter } from "./components/flash/FlashFooter";
import { PolicyModal, PolicyType } from "./components/common/PolicyModal";
import { CookieConsentBanner } from "./components/common/CookieConsentBanner";
import { SEOStatusIndicator } from "./components/seo/SEOStatusIndicator";
import { HreflangInjector } from "./components/seo/HreflangInjector";
import { ProductReviewSchemaInjector } from "./components/seo/ProductReviewSchemaInjector";
import { updateDocumentMeta } from "./seo/metaManager";
import { resolveTargetMarket } from "./localization/markets";

export function App() {
  const [currentMarket, setCurrentMarket] = useState<string>("US");
  const [selectedProduct, setSelectedProduct] = useState<ReviewRecord | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  useEffect(() => {
    try {
      const resolved = resolveTargetMarket("", "");
      if (resolved && resolved.code) {
        setCurrentMarket(resolved.code);
      }
    } catch {}

    if (typeof window !== "undefined") {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      if (path.startsWith("/review/")) {
        const slug = path.replace("/review/", "");
        const record = contentRepository.getBySlug(slug);
        if (record) {
          setSelectedProduct(record);
        }
      } else if (path === "/privacy") {
        setActivePolicy("privacy");
      } else if (path === "/terms") {
        setActivePolicy("terms");
      } else if (path === "/affiliate-disclosure") {
        setActivePolicy("affiliate");
      } else if (path === "/about") {
        setActivePolicy("about");
      } else if (path === "/contact") {
        setActivePolicy("contact");
      }
    }
  }, []);

  // Synchronize document metadata within ideal character boundaries for 100/100 SEO & SERP compliance
  useEffect(() => {
    if (selectedProduct) {
      const title = `${selectedProduct.name} Review: Tested Verdict (2026)`.slice(0, 68);
      const description = `Lab-tested verdict, benchmarks, pros & cons, and verified lowest Amazon price tracker for ${selectedProduct.name}.`.slice(0, 160);
      updateDocumentMeta({
        title,
        description,
        canonical: `https://productreviews.review/review/${selectedProduct.slug}`,
        ogTitle: title,
        ogDescription: description
      });
    } else {
      updateDocumentMeta({
        title: "productreviews.review — Tested Tech & AI Shopping Verdicts",
        description: "Prepend productreviews.review/ to any link to cut fake reviews, track real lowest Amazon prices, and view independent lab-tested hardware scores.",
        canonical: "https://productreviews.review/",
        ogTitle: "productreviews.review — Tested Tech & AI Shopping Verdicts",
        ogDescription: "Prepend productreviews.review/ to any link to cut fake reviews, track real lowest Amazon prices, and view independent lab-tested hardware scores."
      });
    }
  }, [selectedProduct]);

  const allProducts = contentRepository.getAll();

  const handleSelectProduct = (record: ReviewRecord) => {
    setSelectedProduct(record);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/review/${record.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (selectedProduct) {
      setSelectedProduct(null);
      if (typeof window !== "undefined") {
        window.history.pushState({}, "", "/");
      }
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenPolicy = (type: PolicyType) => {
    setActivePolicy(type);
    if (typeof window !== "undefined") {
      const urlPath = type === "affiliate" ? "/affiliate-disclosure" : `/${type}`;
      window.history.pushState({}, "", urlPath);
    }
  };

  const handleClosePolicy = () => {
    setActivePolicy(null);
    if (typeof window !== "undefined") {
      const fallbackUrl = selectedProduct ? `/review/${selectedProduct.slug}` : "/";
      window.history.pushState({}, "", fallbackUrl);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 font-sans selection:bg-[#FFE600] selection:text-black">
      {/* Dynamic International Hreflang Tags for all 14 markets */}
      <HreflangInjector currentMarket={currentMarket} />

      {/* SEO Schema.org JSON-LD Injected into DOM */}
      {selectedProduct && (
        <ProductReviewSchemaInjector
          productName={selectedProduct.name}
          category={selectedProduct.category}
          brand={selectedProduct.brand}
          ratingValue={selectedProduct.rating}
          reviewCount={selectedProduct.reviewCount}
          reviewTitle="Hardware Review & Score"
          reviewBody={selectedProduct.verdict}
          authorName="productreviews.review Research Board"
          canonicalUrl={`https://productreviews.review/review/${selectedProduct.slug}`}
          faqs={selectedProduct.faqList?.map((f) => ({ question: f.question, answer: f.answer }))}
        />
      )}

      {/* Flash Navbar */}
      <FlashNavbar
        currentMarket={currentMarket}
        onMarketChange={setCurrentMarket}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onNavigateHome={handleBackToHome}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedProduct ? (
          <FlashProductAnalysis
            record={selectedProduct}
            currentMarket={currentMarket}
            onBack={handleBackToHome}
          />
        ) : (
          <FlashHome
            products={allProducts}
            currentMarket={currentMarket}
            onSelectProduct={handleSelectProduct}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
          />
        )}
      </main>

      {/* Interactive Email Claim Modal */}
      <FlashEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

      {/* Mandatory Google AdSense & Regulatory Compliance Modal */}
      <PolicyModal
        type={activePolicy}
        onClose={handleClosePolicy}
      />

      {/* Non-intrusive Cookie Consent Banner (GDPR & Google AdSense EU Policy compliant) */}
      <CookieConsentBanner
        onOpenPrivacyPolicy={() => handleOpenPolicy("privacy")}
      />

      {/* Authoritative Flash Footer with Policy links */}
      <FlashFooter onOpenPolicy={handleOpenPolicy} />

      {/* Internal SEO Status Indicator */}
      <SEOStatusIndicator />
    </div>
  );
}

export default App;

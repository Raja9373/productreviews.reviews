import React, { useState, useEffect } from "react";
import { contentRepository, ReviewRecord } from "./content/store/contentRepository";
import { FlashNavbar } from "./components/flash/FlashNavbar";
import { FlashHome } from "./components/flash/FlashHome";
import { FlashProductAnalysis } from "./components/flash/FlashProductAnalysis";
import { FlashComparisonView, COMPARISON_PAIRS, ComparisonPair } from "./components/flash/FlashComparisonView";
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
  const [selectedComparison, setSelectedComparison] = useState<ComparisonPair | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  const syncStateFromLocation = () => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname.replace(/\/+$/, "") || "/";

    if (path.startsWith("/review/")) {
      const slug = path.replace("/review/", "");
      const record = contentRepository.getBySlug(slug);
      if (record) {
        setSelectedProduct(record);
        setSelectedComparison(null);
        setActivePolicy(null);
        return;
      }
    } else if (path.startsWith("/compare/")) {
      const slug = path.replace("/compare/", "");
      const comp = COMPARISON_PAIRS.find((c) => c.slug === slug);
      if (comp) {
        setSelectedComparison(comp);
        setSelectedProduct(null);
        setActivePolicy(null);
        return;
      }
    } else if (path === "/privacy") {
      setActivePolicy("privacy");
      return;
    } else if (path === "/terms") {
      setActivePolicy("terms");
      return;
    } else if (path === "/affiliate-disclosure") {
      setActivePolicy("affiliate");
      return;
    } else if (path === "/about") {
      setActivePolicy("about");
      return;
    } else if (path === "/contact") {
      setActivePolicy("contact");
      return;
    } else if (path === "/editorial-policy") {
      setActivePolicy("editorial");
      return;
    }

    setSelectedProduct(null);
    setSelectedComparison(null);
    setActivePolicy(null);
  };

  useEffect(() => {
    try {
      const resolved = resolveTargetMarket("", "");
      if (resolved && resolved.code) {
        setCurrentMarket(resolved.code);
      }
    } catch {}

    syncStateFromLocation();

    const handlePopState = () => {
      syncStateFromLocation();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Synchronize document metadata within ideal character boundaries for 100/100 SEO & SERP compliance
  useEffect(() => {
    if (selectedProduct) {
      const title = `${selectedProduct.name} Review: Tested Verdict (2025)`.slice(0, 68);
      const description = `Lab-tested verdict, benchmarks, pros & cons, and verified lowest Amazon price tracker for ${selectedProduct.name}.`.slice(0, 160);
      updateDocumentMeta({
        title,
        description,
        canonical: `https://productreviews.review/review/${selectedProduct.slug}`,
        ogTitle: title,
        ogDescription: description
      });
    } else if (selectedComparison) {
      const title = selectedComparison.title.slice(0, 68);
      const description = selectedComparison.metaDescription.slice(0, 160);
      updateDocumentMeta({
        title,
        description,
        canonical: `https://productreviews.review/compare/${selectedComparison.slug}`,
        ogTitle: title,
        ogDescription: description
      });
    } else if (activePolicy) {
      const policyTitles: Record<PolicyType, string> = {
        privacy: "Privacy Policy & Cookie Disclosure | productreviews.review",
        terms: "Terms of Service | productreviews.review",
        affiliate: "Amazon Affiliate Disclosure | productreviews.review",
        about: "About Our Hardware Testing Lab | productreviews.review",
        contact: "Contact Us & Editorial Support | productreviews.review",
        editorial: "Editorial Policy & Testing Methodology | productreviews.review"
      };
      const policyPaths: Record<PolicyType, string> = {
        privacy: "/privacy",
        terms: "/terms",
        affiliate: "/affiliate-disclosure",
        about: "/about",
        contact: "/contact",
        editorial: "/editorial-policy"
      };
      const title = policyTitles[activePolicy];
      const description = "Official editorial governance, lab testing methodology, privacy commitments, and Amazon Associate disclosures for productreviews.review.";
      updateDocumentMeta({
        title,
        description,
        canonical: `https://productreviews.review${policyPaths[activePolicy]}`,
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
  }, [selectedProduct, selectedComparison, activePolicy]);

  const allProducts = contentRepository.getAll();

  const handleSelectProduct = (record: ReviewRecord) => {
    setSelectedProduct(record);
    setSelectedComparison(null);
    setActivePolicy(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/review/${record.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectComparison = (comp: ComparisonPair) => {
    setSelectedComparison(comp);
    setSelectedProduct(null);
    setActivePolicy(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/compare/${comp.slug}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setSelectedComparison(null);
    setActivePolicy(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (selectedProduct || selectedComparison) {
      setSelectedProduct(null);
      setSelectedComparison(null);
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
      const urlPath =
        type === "affiliate"
          ? "/affiliate-disclosure"
          : type === "editorial"
          ? "/editorial-policy"
          : `/${type}`;
      window.history.pushState({}, "", urlPath);
    }
  };

  const handleClosePolicy = () => {
    setActivePolicy(null);
    if (typeof window !== "undefined") {
      const fallbackUrl = selectedProduct
        ? `/review/${selectedProduct.slug}`
        : selectedComparison
        ? `/compare/${selectedComparison.slug}`
        : "/";
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
            onSelectOtherProduct={handleSelectProduct}
            onSelectComparison={handleSelectComparison}
          />
        ) : selectedComparison ? (
          <FlashComparisonView
            comparison={selectedComparison}
            currentMarket={currentMarket}
            onBack={handleBackToHome}
            onSelectProduct={handleSelectProduct}
            onSelectComparison={handleSelectComparison}
          />
        ) : (
          <FlashHome
            products={allProducts}
            currentMarket={currentMarket}
            onSelectProduct={handleSelectProduct}
            onSelectComparison={handleSelectComparison}
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

      {/* Authoritative Flash Footer with Crawlable Internal Directory */}
      <FlashFooter
        onOpenPolicy={handleOpenPolicy}
        onSelectProduct={handleSelectProduct}
        onSelectComparison={handleSelectComparison}
      />

      {/* Internal SEO Status Indicator */}
      <SEOStatusIndicator />
    </div>
  );
}

export default App;

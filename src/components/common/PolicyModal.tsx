import React from "react";
import { X, ShieldCheck, Lock, FileText, ShoppingBag, Info, Mail, CheckCircle2, ExternalLink } from "lucide-react";

export type PolicyType = "privacy" | "terms" | "affiliate" | "about" | "contact";

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden text-zinc-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            {type === "privacy" && <Lock className="w-5 h-5 text-[#FFE600]" />}
            {type === "terms" && <FileText className="w-5 h-5 text-[#FFE600]" />}
            {type === "affiliate" && <ShoppingBag className="w-5 h-5 text-[#FFE600]" />}
            {type === "about" && <Info className="w-5 h-5 text-[#FFE600]" />}
            {type === "contact" && <Mail className="w-5 h-5 text-[#FFE600]" />}

            <div>
              <h2 className="text-lg font-black text-white capitalize">
                {type === "privacy" && "Privacy Policy & Cookie Disclosure"}
                {type === "terms" && "Terms of Service"}
                {type === "affiliate" && "Amazon Affiliate & Commission Disclosure"}
                {type === "about" && "About productreviews.review"}
                {type === "contact" && "Contact Us & Editorial Support"}
              </h2>
              <span className="text-[11px] font-mono text-zinc-500">
                Official Compliance Documentation · Updated October 2026
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          {/* 1. PRIVACY POLICY */}
          {type === "privacy" && (
            <div className="space-y-4">
              <section className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Overview & Privacy Commitment</span>
                </h3>
                <p>
                  At <strong>productreviews.review</strong>, accessible from <span className="font-mono text-[#FFE600]">https://productreviews.review</span>, the privacy of our visitors is of paramount importance. This Privacy Policy document details the types of information collected and recorded by productreviews.review and how we use, safeguard, and disclose it.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">1. Google AdSense & Third-Party Advertising Cookies</h4>
                <p>
                  Google is a third-party vendor on our site. Google uses cookies, specifically the <strong>DoubleClick DART cookie</strong> and advertising identifiers, to serve ads to our site visitors based upon their visit to <span className="font-mono text-[#FFE600]">https://productreviews.review</span> and other sites on the internet.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>
                    Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                  </li>
                  <li>
                    Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
                  </li>
                  <li>
                    Users may opt out of personalized advertising by visiting{" "}
                    <a 
                      href="https://www.google.com/settings/ads" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#FFE600] underline inline-flex items-center gap-1"
                    >
                      Google Ads Settings <ExternalLink className="w-3 h-3" />
                    </a>{" "}
                    or through the Network Advertising Initiative at{" "}
                    <a 
                      href="http://www.aboutads.info/choices/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#FFE600] underline inline-flex items-center gap-1"
                    >
                      aboutads.info <ExternalLink className="w-3 h-3" />
                    </a>.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">2. Log Files & Analytics</h4>
                <p>
                  productreviews.review follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">3. Amazon Associates & Affiliate Cookies</h4>
                <p>
                  When you click on outbound product links to Amazon (US, IN, UK, DE, FR, ES, IT, CA, JP, AU, etc.), Amazon may place tracking cookies on your browser to track qualifying purchases. These cookies carry no personal identity and operate strictly in accordance with Amazon's Operating Agreement.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-sm font-bold text-white">4. GDPR & CCPA Privacy Rights</h4>
                <p>
                  Under European Union (GDPR) and California Consumer Privacy Act (CCPA) regulations, visitors have the right to request access to their personal data, request correction of inaccurate data, request erasure, object to processing, and request data portability. To exercise any of these rights, contact us at <strong>alokmohansharma.delhi@gmail.com</strong>.
                </p>
              </section>
            </div>
          )}

          {/* 2. TERMS OF SERVICE */}
          {type === "terms" && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Agreement to Terms</h3>
                <p>
                  By accessing or using <strong>productreviews.review</strong>, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Informational Purpose & Benchmarks</h3>
                <p>
                  All benchmarks, reviews, scores, and editorial verdicts published on productreviews.review are provided for general informational and purchasing guidance. While our team performs rigorous battery, thermal, and acoustic testing, hardware specifications and retail prices fluctuate across regional distributors. We encourage verifying final specs and seller credentials directly on Amazon before completing checkout.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Intellectual Property Rights</h3>
                <p>
                  All proprietary algorithms, score methodologies, written reviews, charts, and branding displayed on productreviews.review are protected by copyright, trademark, and intellectual property laws. Content may not be copied, reproduced, or distributed without explicit written consent.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">4. Limitation of Liability</h3>
                <p>
                  In no event shall productreviews.review, its editors, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of products reviewed on this platform or purchases made on external retailer sites.
                </p>
              </section>
            </div>
          )}

          {/* 3. AFFILIATE DISCLOSURE */}
          {type === "affiliate" && (
            <div className="space-y-4">
              <div className="bg-[#FFE600]/10 border border-[#FFE600]/25 p-4 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FFE600] block mb-1">
                  Amazon Associates Operating Agreement Disclosure:
                </span>
                <p className="text-zinc-100 font-semibold text-sm">
                  "As an Amazon Associate, productreviews.review earns from qualifying purchases."
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">How Our Affiliate Relationships Work</h3>
                <p>
                  productreviews.review is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com, Amazon.in, Amazon.co.uk, Amazon.de, Amazon.ca, Amazon.fr, Amazon.es, Amazon.it, Amazon.co.jp, and other international Amazon properties.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Zero Influence on Editorial Scores</h3>
                <p>
                  Our Flash Score algorithm and editorial review board maintain strict separation between editorial content and affiliate operations:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                  <li>We never accept paid sponsorships to inflate product ratings or rankings.</li>
                  <li>Products with low hardware durability or high return rates receive critical reviews regardless of commission rates.</li>
                  <li>Clicking an affiliate link costs you zero extra money; Amazon pays us a modest referral fee out of their own advertising budget.</li>
                </ul>
              </section>
            </div>
          )}

          {/* 4. ABOUT US */}
          {type === "about" && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Our Mission: Truth in Consumer Technology</h3>
                <p>
                  The internet is saturated with sponsored influencer hype, fake Amazon ratings, and AI-generated review spam. <strong>productreviews.review</strong> was built to solve this exact problem: providing consumers with honest, data-backed hardware evaluations and true lowest-price discovery.
                </p>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="font-bold text-white block mb-1">Rigorous Lab Benchmarks</span>
                  <span className="text-zinc-400 text-xs">Every phone, laptop, and audio device undergoes standardized battery depletion cycles, thermal imaging under sustained loads, and mic acoustic tests.</span>
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="font-bold text-white block mb-1">Global Amazon Engine</span>
                  <span className="text-zinc-400 text-xs">We actively monitor ASIN price histories across 14 international Amazon stores so shoppers never overpay during fake lightning sales.</span>
                </div>
              </section>

              <section className="pt-2">
                <h3 className="text-sm font-bold text-white mb-1">Editorial Team & Leadership</h3>
                <p className="text-zinc-300">
                  Founded and maintained by technology researcher <strong>Alok Mohan Sharma</strong> (Delhi, India) alongside hardware engineers and independent audio/display testers across Bengaluru and San Francisco.
                </p>
              </section>
            </div>
          )}

          {/* 5. CONTACT US */}
          {type === "contact" && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="text-sm font-bold text-white">Get in Touch with Our Editorial Team</h3>
                <p>
                  Have a question about a product verdict, want to report a price discrepancy on Amazon, or have an editorial suggestion? We welcome inquiries from readers and manufacturers.
                </p>
              </section>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/25 flex items-center justify-center text-[#FFE600]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 block font-mono">Primary Editorial & Publisher Email:</span>
                    <a href="mailto:alokmohansharma.delhi@gmail.com" className="text-sm sm:text-base font-bold text-white hover:text-[#FFE600] transition-colors">
                      alokmohansharma.delhi@gmail.com
                    </a>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>Publisher: Alok Mohan Sharma</span>
                  <span className="font-mono">Timezone: UTC+05:30 (Kolkata / IST)</span>
                </div>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                <span className="font-bold text-zinc-300 block mb-1">Response Time Guarantee:</span>
                <span>We review all editorial corrections, DMCA notices, and privacy requests within 24 to 48 business hours.</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            productreviews.review · Independent & Verified
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};

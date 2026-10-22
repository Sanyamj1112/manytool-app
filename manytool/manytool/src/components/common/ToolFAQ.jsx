import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ToolFAQ({ faqs = [], title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  // JSON-LD schema for Google rich FAQ snippet
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="flex items-center gap-2 mb-2">
        <HelpCircle size={15} className="text-cyan-400" />
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">{title}</h3>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm overflow-hidden transition-colors hover:border-white/15"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer select-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3.5 pb-3 text-xs text-gray-400 leading-relaxed border-t border-white/[0.04] pt-2">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

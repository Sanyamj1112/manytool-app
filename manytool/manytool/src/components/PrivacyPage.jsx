import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Lock, BarChart2, Cookie, RefreshCw, Mail, ShieldCheck } from 'lucide-react';

const sections = [
  {
    icon: Lock,
    title: 'Data Processing — Client-Side Only',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    content: 'All utilities (word counting, case conversion, password generation, unit conversion, etc.) happen entirely inside your browser. Your inputs are never transmitted to or stored on our servers.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Personal Data Collection',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    content: 'We do NOT track or store your personal identity, private files, or text. Our platform is built with a privacy-first mindset where everything stays strictly on your machine.',
  },
  {
    icon: BarChart2,
    title: 'Anonymous Usage Metrics',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    content: 'We only look at aggregate, non-identifying page visit counts to understand which tools are useful and keep the servers running smoothly. No personal profiles are created.',
  },
  {
    icon: Cookie,
    title: 'Cookies & Storage',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    content: 'We use local browser storage only for user preferences (such as remembering your theme or sidebar preferences). No third-party advertising cookies are used.',
  },
  {
    icon: RefreshCw,
    title: 'Policy Updates',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    content: 'We may update this policy to reflect platform updates. Our core commitment — zero storage of your personal data — will never change.',
  },
  {
    icon: Mail,
    title: 'Contact',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    content: 'Questions about privacy? Reach us at manytool211@gmail.com',
  },
];

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto py-10 space-y-10">
    <Helmet>
      <title>Privacy Policy | ManyTool</title>
      <meta name="description" content="ManyTool privacy policy — what we collect, what we don't, and how we protect your data." />
    </Helmet>

    {/* Header */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
        Privacy Policy
      </span>
      <h1 className="text-4xl font-extrabold text-white tracking-tight">
        Your Privacy,{' '}
        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Our Commitment
        </span>
      </h1>
    </motion.div>

    {/* Summary callout */}
    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
      <p className="text-emerald-300 font-semibold text-sm">
        ✅ <strong>Short version:</strong> We do NOT store your text, inputs, or personal information. All processing runs 100% locally in your browser. Your data stays entirely with you.
      </p>
    </div>

    {/* Sections */}
    <div className="space-y-5">
      {sections.map(({ icon: Icon, title, color, content }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-white/8 backdrop-blur-xl space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${color}`}>
              <Icon size={16} />
            </div>
            <h2 className="font-bold text-white text-base">{title}</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default PrivacyPage;
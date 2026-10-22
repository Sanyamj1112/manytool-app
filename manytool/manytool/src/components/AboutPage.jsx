import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Code, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
  { name: 'Word Counter', desc: 'Real-time word and text analysis', color: 'text-cyan-400', path: '/tools/word-counter' },
  { name: 'Case Converter', desc: 'Transform text styles instantly', color: 'text-purple-400', path: '/tools/case-converter' },
  { name: 'Lorem Ipsum', desc: 'Generate placeholder content', color: 'text-amber-400', path: '/tools/lorem-ipsum' },
  { name: 'Slug Generator', desc: 'Create SEO-friendly URL slugs', color: 'text-emerald-400', path: '/tools/slug-generator' },
  { name: 'Age Calculator', desc: 'Precise chronological calculator', color: 'text-pink-400', path: '/tools/age-calculator' },
  { name: 'Password Generator', desc: 'Military-grade secure passwords', color: 'text-blue-400', path: '/tools/password-generator' },
  { name: 'Unit Converter', desc: 'Convert any measurement unit', color: 'text-teal-400', path: '/tools/unit-converter' },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Everything runs instantly in your browser. No server delays, no loading screens.', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data never leaves your device. No personal information is stored or collected.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { icon: Globe, title: 'Completely Free', desc: 'No subscriptions, no paywalls, no login required. Free for everyone, forever.', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { icon: Code, title: 'Modern Precision', desc: 'Client-side algorithms bring maximum speed and precision to all text tools and calculations.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
];

const AboutPage = () => (
  <div className="max-w-4xl mx-auto py-10 space-y-16">
    <Helmet>
      <title>About ManyTool — Free Online Utility Suite</title>
      <meta name="description" content="Learn about ManyTool — a free, fast, secure utility suite built for developers, writers, and creators. Word counter, password generator, and more." />
    </Helmet>

    {/* Hero */}
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
      <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold uppercase tracking-widest">
        About Us
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        Built for People Who{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Build Things
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
        ManyTool is a free, fast, and intelligent utility suite designed for developers, content creators,
        and digital professionals who need reliable tools without the friction.
      </p>
    </motion.div>

    {/* Features */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {features.map(({ icon: Icon, title, desc, color }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-white/8 backdrop-blur-xl"
        >
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${color}`}>
            <Icon size={20} />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </div>

    {/* Tools List */}
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-white">Our Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map(({ name, desc, color, path }) => (
          <Link key={path} to={path} className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/8 hover:border-white/20 transition-all">
            <div>
              <p className={`font-bold text-sm ${color}`}>{name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>

    {/* Mission */}
    <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent border border-cyan-500/20">
      <h2 className="text-2xl font-black text-white mb-4">Our Mission</h2>
      <p className="text-gray-400 text-base leading-relaxed mb-4">
        We believe that powerful developer tools should be accessible to everyone — not just those with expensive subscriptions.
        ManyTool is committed to growing its toolkit based on real user needs.
      </p>
      <p className="text-gray-500 text-sm font-semibold italic">
        "Built with precision, for those who build the future." — Team ManyTool
      </p>
    </div>
  </div>
);

export default AboutPage;
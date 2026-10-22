/**
 * QRCodeGenerator.jsx
 * Generate QR codes for URL, UPI, WiFi, WhatsApp, Plain Text
 * Client-side only using qrcode.react
 */

import React, { useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { QrCode, Download, Copy, Check, Info } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import ToolFAQ from '@/components/common/ToolFAQ';

// FAQ in Pure English
const faqs = [
  {
    q: 'Is my data or generated QR code stored on any server?',
    a: 'No. All QR code generation is performed locally in your browser. None of your data is ever transmitted or stored on any server.',
  },
  {
    q: 'How does the UPI QR code work for payments?',
    a: 'It generates a standard UPI payment URI. When scanned with Google Pay, PhonePe, Paytm, or BHIM, it directly opens the payment screen with your UPI ID and preset amount.',
  },
  {
    q: 'What resolution should I use for printing QR codes?',
    a: 'For print materials such as posters, business cards, or tent cards, we recommend 256px or 300px for optimal scanner readability.',
  },
  {
    q: 'How does the Wi-Fi QR code work?',
    a: 'When scanned with any smartphone camera, it allows guests to instantly connect to your Wi-Fi network without manually typing the password.',
  },
];

const MODES = [
  { id: 'url', label: '🌐 URL / Link' },
  { id: 'upi', label: '💰 UPI Payment' },
  { id: 'wifi', label: '📶 Wi-Fi' },
  { id: 'whatsapp', label: '💬 WhatsApp' },
  { id: 'text', label: '📝 Plain Text' },
];

const QR_SIZES = [128, 200, 256, 300];

function buildQRValue(mode, fields) {
  switch (mode) {
    case 'url':
      return fields.url || '';
    case 'upi':
      return `upi://pay?pa=${encodeURIComponent(fields.upiId || '')}&pn=${encodeURIComponent(fields.name || '')}&am=${fields.amount || ''}&cu=INR`;
    case 'wifi':
      return `WIFI:T:${fields.security || 'WPA'};S:${fields.ssid || ''};P:${fields.password || ''};;`;
    case 'whatsapp': {
      const num = (fields.phone || '').replace(/\D/g, '');
      const msg = encodeURIComponent(fields.message || '');
      return `https://wa.me/${num}${msg ? '?text=' + msg : ''}`;
    }
    case 'text':
    default:
      return fields.text || '';
  }
}

export default function QRCodeGenerator() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialMode = () => {
    if (location.pathname.includes('upi') || searchParams.get('type') === 'upi') return 'upi';
    if (location.pathname.includes('wifi') || searchParams.get('type') === 'wifi') return 'wifi';
    if (location.pathname.includes('whatsapp') || searchParams.get('type') === 'whatsapp') return 'whatsapp';
    return 'url';
  };

  const [mode, setMode] = useState(getInitialMode);
  const [fields, setFields] = useState({
    url: '', upiId: '', name: '', amount: '',
    ssid: '', password: '', security: 'WPA',
    phone: '', message: '', text: '',
  });
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#06b6d4');
  const [bgColor, setBgColor] = useState('#070913');
  const [copied, setCopied] = useState(false);

  const qrValue = buildQRValue(mode, fields);
  const hasValue = qrValue.length > 0;

  const f = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const inputCls = 'w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600';

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-canvas canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `manytool-qr-${mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageMeta = mode === 'upi' ? {
    title: 'Free UPI QR Code Generator for Google Pay, PhonePe, Paytm | ManyTool',
    desc: 'Create free UPI payment QR codes for Google Pay, PhonePe, and Paytm. Accept instant digital payments with zero transaction fees at ManyTool.',
  } : mode === 'wifi' ? {
    title: 'Free Wi-Fi QR Code Generator — Connect Without Passwords | ManyTool',
    desc: 'Generate Wi-Fi QR codes to let visitors and friends connect directly to your home or office network with one scan.',
  } : mode === 'whatsapp' ? {
    title: 'Free WhatsApp QR Code Generator — Direct Chat Links | ManyTool',
    desc: 'Generate WhatsApp QR codes for direct instant messaging with pre-filled messages and phone numbers.',
  } : {
    title: 'Free QR Code Generator — UPI, WiFi, URL, WhatsApp | ManyTool',
    desc: 'Generate QR codes for URL, UPI payment (GPay/PhonePe), WiFi, WhatsApp, and text. Free, instant, and private QR code maker at ManyTool.',
  };

  return (
    <div className="min-h-screen text-gray-100 relative pb-16">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.desc} />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[8%] left-[8%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.06] blur-[180px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[8%] right-[8%] w-[550px] h-[550px] rounded-full bg-violet-500/[0.05] blur-[170px] animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,19,0.5)_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
              <QrCode size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">QR Code Generator</h1>
              <p className="text-sm text-gray-400">Generate custom QR codes for URLs, UPI payments, Wi-Fi, WhatsApp & text</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Panel */}
          <div className="space-y-5">
            {/* Mode Selector */}
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                    ${mode === m.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900/60 border-white/10 text-gray-400 hover:border-cyan-400/30 hover:text-cyan-300'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dynamic Input Fields */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] space-y-4"
            >
              {mode === 'url' && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Website URL</label>
                  <input className={inputCls} placeholder="https://example.com" value={fields.url} onChange={f('url')} />
                </div>
              )}

              {mode === 'upi' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">UPI ID / VPA</label>
                    <input className={inputCls} placeholder="username@okhdfcbank" value={fields.upiId} onChange={f('upiId')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Payee Name</label>
                    <input className={inputCls} placeholder="Merchant or Business Name" value={fields.name} onChange={f('name')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Amount (Optional)</label>
                    <input className={inputCls} type="number" placeholder="0.00" value={fields.amount} onChange={f('amount')} />
                  </div>
                </>
              )}

              {mode === 'wifi' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Network Name (SSID)</label>
                    <input className={inputCls} placeholder="Office_Guest_WiFi" value={fields.ssid} onChange={f('ssid')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
                    <input className={inputCls} type="password" placeholder="Wi-Fi Password" value={fields.password} onChange={f('password')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Security Type</label>
                    <select className={inputCls} value={fields.security} onChange={f('security')}>
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </>
              )}

              {mode === 'whatsapp' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Phone Number (with country code)</label>
                    <input className={inputCls} placeholder="+1234567890" value={fields.phone} onChange={f('phone')} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Pre-filled Message (Optional)</label>
                    <textarea className={inputCls + ' resize-none'} rows={3} placeholder="Hello, I would like to inquire about..." value={fields.message} onChange={f('message')} />
                  </div>
                </>
              )}

              {mode === 'text' && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Plain Text</label>
                  <textarea className={inputCls + ' resize-none'} rows={4} placeholder="Enter your text here..." value={fields.text} onChange={f('text')} />
                </div>
              )}
            </motion.div>

            {/* Customization */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appearance</p>

              {/* Size */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-gray-500">Resolution</label>
                  <span className="text-xs text-cyan-400 font-mono">{size}×{size}px</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {QR_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all
                        ${size === s ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/60 border-white/10 text-gray-500 hover:text-cyan-300'}`}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">QR Color</label>
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Background</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview Panel */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] flex flex-col items-center gap-6">

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider self-start">Live Preview</p>

            <div id="qr-canvas" className="flex items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/5">
              {hasValue ? (
                <QRCodeCanvas
                  value={qrValue}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="M"
                  includeMargin={true}
                  style={{ borderRadius: '8px' }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-600 py-8 px-12">
                  <QrCode size={64} className="opacity-30" />
                  <p className="text-sm text-center">Fill out the form on the left<br />to preview your QR code</p>
                </div>
              )}
            </div>

            {hasValue && (
              <div className="flex flex-wrap gap-3 w-full justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Download size={16} /> Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-gray-300 font-semibold text-sm transition-all cursor-pointer"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Content'}
                </button>
              </div>
            )}

            {mode === 'upi' && hasValue && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-xs text-amber-300 w-full">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>Compatible with all UPI apps: Google Pay, PhonePe, Paytm, and BHIM.</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 text-sm text-gray-400">
          <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <p>All QR codes are generated directly in your browser. No data is stored or transmitted to external servers — 100% private.</p>
        </div>

        {/* Sleek Compact FAQ */}
        <ToolFAQ faqs={faqs} title="QR Code Generator FAQs" />
      </div>
    </div>
  );
}

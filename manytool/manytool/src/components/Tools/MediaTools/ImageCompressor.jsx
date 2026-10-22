/**
 * ImageCompressor.jsx
 * Client-side image compression using Canvas API
 * No server upload needed — 100% private
 */

import React, { useState, useRef, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ImageDown, Upload, Download, Trash2, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import ToolFAQ from '@/components/common/ToolFAQ';

// FAQ Data in Pure English
const faqs = [
  {
    q: 'Are my images uploaded to any server?',
    a: 'No, never. All image compression happens entirely inside your web browser using the HTML5 Canvas API. Your files never leave your device.',
  },
  {
    q: 'Which image formats are supported?',
    a: 'JPG, JPEG, PNG, WebP, and standard image formats are fully supported.',
  },
  {
    q: 'What is the relation between image quality and file size?',
    a: 'Lowering the quality decreases the file size. A quality setting between 75% and 85% provides the optimal balance of crisp visuals and lightweight file size.',
  },
  {
    q: 'Will my image lose noticeable quality after compression?',
    a: 'At 70% to 85% quality, compression artifacts are virtually imperceptible to the human eye while saving up to 80% storage space.',
  },
];

const PRESETS = [
  { label: 'Under 50 KB', targetKB: 50 },
  { label: 'Under 100 KB', targetKB: 100 },
  { label: 'Under 200 KB', targetKB: 200 },
  { label: 'Under 500 KB', targetKB: 500 },
];

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function compressImage(file, quality, maxWidth = 1920) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressToTarget(file, targetKB) {
  let lo = 0.1, hi = 0.95, best = null;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    const blob = await compressImage(file, mid);
    if (blob.size / 1024 <= targetKB) {
      lo = mid;
      best = blob;
    } else {
      hi = mid;
    }
    if (hi - lo < 0.02) break;
  }
  if (!best) best = await compressImage(file, lo);
  return best;
}

export default function ImageCompressor() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialPreset = () => {
    if (location.pathname.includes('50kb') || searchParams.get('size') === '50kb') return 0;
    if (location.pathname.includes('100kb') || searchParams.get('size') === '100kb') return 1;
    if (location.pathname.includes('200kb') || searchParams.get('size') === '200kb') return 2;
    return null;
  };

  const [original, setOriginal] = useState(null); // { file, url, size }
  const [result, setResult] = useState(null);      // { blob, url, size }
  const [quality, setQuality] = useState(80);
  const [preset, setPreset] = useState(getInitialPreset);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setOriginal({ file, url, size: file.size });
    setResult(null);
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleCompress = async () => {
    if (!original) return;
    setLoading(true);
    try {
      let blob;
      if (preset !== null) {
        blob = await compressToTarget(original.file, PRESETS[preset].targetKB);
      } else {
        blob = await compressImage(original.file, quality / 100);
      }
      const url = URL.createObjectURL(blob);
      setResult({ blob, url, size: blob.size });
    } catch {
      alert('Compression failed. Please try another image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed_${original.file.name.replace(/\.[^.]+$/, '')}.jpg`;
    a.click();
  };

  const reset = () => {
    setOriginal(null);
    setResult(null);
    setPreset(null);
    setQuality(80);
  };

  const savings = result && original ? Math.max(0, ((original.size - result.size) / original.size) * 100) : 0;

  const pageMeta = location.pathname.includes('50kb') ? {
    title: 'Compress Image to Under 50KB Online Free | ManyTool',
    desc: 'Compress and reduce JPG, PNG, and WebP image file sizes to under 50KB online for free. Fast, client-side, and 100% private at ManyTool.',
  } : location.pathname.includes('100kb') ? {
    title: 'Compress Image to Under 100KB Online Free | ManyTool',
    desc: 'Reduce photo file size under 100KB without visible quality loss. Free, instant, and private image compression tool.',
  } : {
    title: 'Free Image Compressor Online — Reduce Image Size | ManyTool',
    desc: 'Compress JPG, PNG, WebP images for free online. Reduce image size without losing quality. 100% private — works in your browser, no upload needed.',
  };

  return (
    <div className="min-h-screen text-gray-100 relative pb-16">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.desc} />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-rose-500/[0.06] blur-[180px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[10%] right-[5%] w-[550px] h-[550px] rounded-full bg-orange-500/[0.05] blur-[170px] animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-600/[0.04] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,19,0.5)_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30">
              <ImageDown size={24} className="text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Image Compressor</h1>
              <p className="text-sm text-gray-400">Reduce image size locally in your browser — instant, free & 100% private</p>
            </div>
          </div>
        </motion.div>

        {/* Drop Zone */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {!original ? (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300
                ${dragOver ? 'border-rose-400 bg-rose-500/10' : 'border-white/10 hover:border-rose-400/50 hover:bg-rose-500/5 bg-slate-900/40'}`}
            >
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Upload size={32} className="text-rose-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Drop your image here, or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, WebP, GIF</p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Before/After Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/8 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Original</span>
                    <span className="text-xs text-rose-400 font-mono">{formatBytes(original.size)}</span>
                  </div>
                  <img src={original.url} alt="Original" className="w-full h-48 object-contain bg-black/20 p-2" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/8 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compressed</span>
                    {result && <span className="text-xs text-emerald-400 font-mono">{formatBytes(result.size)}</span>}
                  </div>
                  <div className="w-full h-48 flex items-center justify-center bg-black/20">
                    {result ? (
                      <img src={result.url} alt="Compressed" className="w-full h-48 object-contain p-2" />
                    ) : (
                      <p className="text-gray-600 text-sm">Compressed preview will appear here</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              {result && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <span className="text-emerald-300 font-bold text-lg">{savings.toFixed(1)}% size reduction!</span>
                  <span className="text-gray-400 text-sm">({formatBytes(original.size)} → {formatBytes(result.size)})</span>
                </motion.div>
              )}

              {/* Controls */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] space-y-5">
                {/* Presets */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => { setPreset(i); setQuality(80); }}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                          ${preset === i
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                            : 'bg-slate-900/60 border-white/10 text-gray-400 hover:border-rose-400/30 hover:text-rose-300'}`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setPreset(null)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                        ${preset === null
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-slate-900/60 border-white/10 text-gray-400 hover:border-rose-400/30 hover:text-rose-300'}`}
                    >
                      Custom Quality
                    </button>
                  </div>
                </div>

                {/* Quality Slider */}
                {preset === null && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quality</p>
                      <span className="text-rose-400 font-mono font-bold">{quality}%</span>
                    </div>
                    <input
                      type="range" min={10} max={95} value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                      <span>Smaller file</span><span>Better quality</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleCompress}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                  >
                    {loading ? <RefreshCw size={16} className="animate-spin" /> : <ImageDown size={16} />}
                    {loading ? 'Compressing...' : 'Compress Image'}
                  </button>
                  {result && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 font-bold text-sm transition-all cursor-pointer"
                    >
                      <Download size={16} /> Download
                    </button>
                  )}
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-400 font-semibold text-sm transition-all cursor-pointer border border-white/8"
                  >
                    <Trash2 size={14} /> Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 text-sm text-gray-400">
          <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <p>Your images are processed entirely within your browser and are never uploaded to any external server — 100% private.</p>
        </div>

        {/* Sleek Compact FAQ */}
        <ToolFAQ faqs={faqs} title="Image Compressor FAQs" />
      </div>
    </div>
  );
}

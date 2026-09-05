import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
 import { JananiLogo } from './JananiLogo';
 import { JANANI_INFO } from '../constants/branding';
 import { ThreeDVisualizer } from './ThreeDVisualizer';
 import { ThreeDCard } from './ThreeDCard';
 import { motion } from 'motion/react';
 import {
   Lock,
   User,
   ShieldCheck,
   Building2,
   Phone,
   ArrowRight,
   AlertCircle,
   Stethoscope,
   FlaskConical,
   KeyRound,
   FileCheck2,
   Activity,
   Sparkles,
 } from 'lucide-react';
import OfficialLogo from './OfficialLogo';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your Staff ID or Username.');
      return;
    }
    setError(null);
    const res = await login(username, password);
    if (!res.success) {
      setError(res.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickRoleLogin = (userKey: string, defaultPass: string) => {
    setUsername(userKey);
    setPassword(defaultPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* 3D Medical Ambient Mesh in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
        <ThreeDVisualizer mode="dna" height="100%" interactive={true} />
      </div>

      {/* Decorative Radial Lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Clinical System Header */}
      <header className="relative z-10 border-b border-teal-900/40 bg-slate-950/70 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between text-xs text-teal-200/80">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold tracking-wide text-slate-200">
            Janani LIMS Cloud • Laboratory Information &amp; Clinical Management
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>{JANANI_INFO.established}</span>
          <span>•</span>
          <span>Hotline: {JANANI_INFO.contacts.phone}</span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hospital Branding & Department Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Certified Diagnostic Laboratory • Feni</span>
            </div>

            <div className="space-y-3">
              <OfficialLogo/>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Precision clinical biochemistry, automated hematology, 500mA digital radiography (DR), 4D color Doppler ultrasound, and pathology laboratory services.
              </p>
            </div>

            {/* Department Feature Badges with 3D Depth */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/75 backdrop-blur-md border border-teal-800/40 rounded-2xl p-4 flex flex-col gap-1.5 shadow-lg hover:border-teal-500/60 transition group">
                <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-100">Automated Lab</span>
                <span className="text-[11px] text-slate-400">Hematology, LFT, KFT, Lipids</span>
              </div>

              <div className="bg-slate-900/75 backdrop-blur-md border border-teal-800/40 rounded-2xl p-4 flex flex-col gap-1.5 shadow-lg hover:border-teal-500/60 transition group">
                <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-100">Digital Imaging</span>
                <span className="text-[11px] text-slate-400">500mA DR X-Ray &amp; 4D USG</span>
              </div>

              <div className="bg-slate-900/75 backdrop-blur-md border border-teal-800/40 rounded-2xl p-4 flex flex-col gap-1.5 shadow-lg hover:border-teal-500/60 transition group col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-700/50 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-100">Verified Reports</span>
                <span className="text-[11px] text-slate-400">QR &amp; Barcode Verification</span>
              </div>
            </div>

            {/* Address & Licensing Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-400 bg-slate-950/60 border border-slate-800/80 backdrop-blur-md rounded-xl p-3.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{JANANI_INFO.address.line1}, {JANANI_INFO.address.city}</span>
              </div>
              <span className="hidden sm:inline text-slate-700">|</span>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{JANANI_INFO.contacts.phone} / {JANANI_INFO.contacts.whatsapp}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Tilt Authentication Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-5"
          >
            <ThreeDCard depth={10} glareEffect={true}>
              <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
                {/* Glowing Top Ambient Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400" />

                <div className="mb-6 text-left">
                  <div className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Secure Sign-In</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Staff Authentication</h2>
                  <p className="text-slate-400 text-xs mt-1">
                    Enter authorized laboratory credentials to access clinical workloads.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5 p-3.5 rounded-xl bg-red-950/90 border border-red-500/60 text-red-200 text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Staff ID / Username
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. admin, doctor, labtech"
                        required
                        className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm transition outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Security Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm transition outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer tactile-btn"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Verifying Signature...
                      </span>
                    ) : (
                      <>
                        <span>Secure Access Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Fast Staff Role Selectors */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" />
                      Quick Staff Profiles:
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('admin', 'admin123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('doctor', 'doctor123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Doctor
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('pathologist', 'path123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Pathologist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('radiologist', 'admin123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Radiologist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('labtech', 'labtech123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Lab Tech
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickRoleLogin('receptionist', 'recep123')}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-teal-950/80 border border-slate-800 hover:border-teal-500 text-slate-200 transition font-bold text-center cursor-pointer text-[11px]"
                    >
                      Reception
                    </button>
                  </div>
                </div>
              </div>
            </ThreeDCard>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} {JANANI_INFO.fullName}. All rights reserved. • DGHS Reg: {JANANI_INFO.licenseNo} • Amin Tower, Feni, Bangladesh.
        </p>
      </footer>
    </div>
  );
};

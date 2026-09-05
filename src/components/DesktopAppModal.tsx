import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Download,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Terminal,
  ShieldCheck,
  X,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { JANANI_INFO } from '../constants/branding';

interface DesktopAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const DesktopAppModal: React.FC<DesktopAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // Fallback guide
      alert(
        'To install as a Desktop App:\n\n1. In Microsoft Edge or Google Chrome, click the "Install" icon (square with down arrow) in the address bar on the right side.\n2. Click "Install" to create a desktop shortcut and windowed app.'
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setInstalledSuccess(true);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error('Error during desktop app installation:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center p-2 backdrop-blur-md shrink-0 shadow-inner">
              <img
                src="/fj.png"
                alt="Janani Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Desktop Application Suite
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Janani LIMS Desktop Software
              </h2>
              <p className="text-xs text-teal-200">
                Standalone clinical laboratory &amp; diagnostic management system for Windows &amp; Mac.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Status Alert if Installed */}
          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Desktop Software Active &amp; Installed</p>
                <p className="text-xs text-emerald-700">
                  You are currently running the application in native standalone desktop mode.
                </p>
              </div>
            </div>
          )}

          {/* Option 1: Native PWA Desktop Install */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-teal-300 transition space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    1. Direct Desktop Installation (Recommended)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Installs Janani LIMS directly onto your Windows/Mac Desktop, Start Menu, and Taskbar. Opens in a dedicated window without browser bars.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleInstallPWA}
                className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" />
                Install Desktop Application
              </button>
              <span className="text-[11px] text-slate-500">
                Works on Chrome, Microsoft Edge, Brave &amp; Opera
              </span>
            </div>
          </div>

          {/* Option 2: Windows 1-Click Launchers */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  2. Compiled Windows Desktop Launcher Files
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Direct standalone launchers for Windows PCs (Windows 10, 11, 8, 7).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="/Launch-Janani-Desktop.bat"
                download="Launch-Janani-Desktop.bat"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition group text-left"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    Launch-Janani-Desktop.bat
                  </div>
                  <div className="text-[11px] text-slate-500">1-Click Windows App Launcher</div>
                </div>
                <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                  .BAT
                </span>
              </a>

              <a
                href="/Janani-Desktop-App.vbs"
                download="Janani-Desktop-App.vbs"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition group text-left"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    Janani-Desktop-App.vbs
                  </div>
                  <div className="text-[11px] text-slate-500">Silent Desktop Runner</div>
                </div>
                <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                  .VBS
                </span>
              </a>

              <a
                href="/Install-Janani-Desktop-Shortcut.ps1"
                download="Install-Janani-Desktop-Shortcut.ps1"
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl transition group text-left"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    Install-Janani-Desktop-Shortcut.ps1
                  </div>
                  <div className="text-[11px] text-slate-500">PowerShell Desktop Installer</div>
                </div>
                <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                  .PS1
                </span>
              </a>

              <a
                href="/Janani-Diagnostic-Center-Desktop-Software.zip"
                download="Janani-Diagnostic-Center-Desktop-Software.zip"
                className="flex items-center justify-between p-3.5 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 rounded-xl transition group text-left"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-teal-950 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-teal-700" />
                    Complete Desktop Software Package
                  </div>
                  <div className="text-[11px] text-teal-700">All desktop setup tools &amp; assets</div>
                </div>
                <span className="text-[10px] font-bold bg-teal-800 text-white px-2 py-1 rounded-md">
                  ZIP
                </span>
              </a>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
              <ShieldCheck className="w-4 h-4 text-teal-700 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Active QR Verify</div>
              <div className="text-[10px] text-slate-500">Live Scannable Gateway</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
              <Cpu className="w-4 h-4 text-teal-700 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">3-Verifier Signoff</div>
              <div className="text-[10px] text-slate-500">2 Techs &amp; 1 Doctor</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
              <Layers className="w-4 h-4 text-teal-700 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Custom Paper Sizes</div>
              <div className="text-[10px] text-slate-500">A4, A5, Letter, Custom</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
              <div className="text-[11px] font-bold text-slate-900">Clean Medical UI</div>
              <div className="text-[10px] text-slate-500">Inter &amp; JetBrains Mono</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Janani Diagnostic Center • Amin Tower, Trunk Road, Feni
          </span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

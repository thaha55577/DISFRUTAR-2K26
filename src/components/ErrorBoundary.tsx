import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled runtime error captured by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#050814] text-white font-space flex items-center justify-center p-4 selection:bg-[#536BFF]">
          <div className="relative w-full max-w-lg bg-[#07091C]/90 border border-red-500/30 rounded-[28px] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_24px_64px_rgba(239,68,68,0.2)] text-center space-y-5 overflow-hidden">
            
            <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full inline-block">
                Application State Recovery
              </span>
              <h2 className="text-2xl font-bold text-white tracking-wide font-space">
                Unexpected Session Notice
              </h2>
              <p className="text-white/60 text-xs sm:text-sm font-sans leading-relaxed">
                A temporary rendering issue occurred while retrieving your team details. Don't worry, your registration data remains completely safe.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left font-mono text-xs text-white/70 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto h-[46px] px-6 rounded-full bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white font-space text-xs font-semibold flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_20px_rgba(83,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Portal</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto h-[46px] px-6 rounded-full border border-white/14 bg-white/5 text-white/80 font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

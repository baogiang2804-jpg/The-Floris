import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Floris ErrorBoundary đã bắt lỗi:', error, errorInfo);
    this.setState({ error, errorInfo });
    try {
      (window as unknown as { __floris_last_error: unknown }).__floris_last_error = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };
    } catch {}
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Lỗi khi xóa bộ nhớ đệm:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-amber-50/40 to-emerald-50/40 flex items-center justify-center p-4 font-['Quicksand',sans-serif]">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-200/40 border border-rose-100 text-center">
            {/* Blossom Icon Decoration */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-rose-500 shadow-inner">
              <span className="text-3xl animate-bounce">🌸</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-['Cormorant_Garamond',serif]">
              Floris Atelier
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-semibold mb-4">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Đã xảy ra sự cố hiển thị</span>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Hương hoa mùa xuân đang cần được làm mới lại trên thiết bị của bạn. Vui lòng bấm nút bên dưới để khôi phục ứng dụng.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-300/40 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium text-xs border border-amber-200/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Đặt lại bộ nhớ đệm (Reset dữ liệu mẫu)</span>
              </button>
            </div>

            {/* Collapsible Error Details */}
            {this.state.error && (
              <details className="mt-6 text-left border-t border-rose-100/80 pt-4">
                <summary className="text-xs text-rose-500 font-semibold cursor-pointer hover:text-rose-600 flex items-center gap-1 select-none">
                  <Sparkles className="w-3 h-3" />
                  <span>Chi tiết lỗi kỹ thuật</span>
                </summary>
                <div className="mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-700 font-mono overflow-auto max-h-40 whitespace-pre-wrap break-words">
                  <div className="text-rose-600 font-bold mb-1">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  {this.state.error.stack}
                </div>
              </details>
            )}

            <p className="mt-6 text-[11px] text-gray-400">
              Tổ 1 — Lớp 12A13 • THPT Nguyễn Thị Minh Khai
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

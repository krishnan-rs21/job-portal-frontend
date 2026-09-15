import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  resetKey?: string;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: this.props.resetKey };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: ErrorBoundaryProps, state: ErrorBoundaryState) {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey };
    }
    return null;
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-5xl font-extrabold text-indigo-600">Oops</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-500">An unexpected error occurred while displaying this page.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reload page
          </button>
          <a href="/" className="btn-secondary">
            Go home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

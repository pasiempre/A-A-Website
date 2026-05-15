"use client";

import React from "react";

type AdminModuleErrorBoundaryProps = {
  children: React.ReactNode;
  onRetry?: () => void;
};

type AdminModuleErrorBoundaryState = {
  hasError: boolean;
};

export class AdminModuleErrorBoundary extends React.Component<
  AdminModuleErrorBoundaryProps,
  AdminModuleErrorBoundaryState
> {
  constructor(props: AdminModuleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AdminModuleErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[admin-module-error-boundary]", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-900">
          <p className="text-sm font-semibold">Module failed to render.</p>
          <p className="mt-1 text-sm">Try loading this section again.</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-3 rounded-md border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-800 hover:bg-rose-100"
          >
            Retry module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

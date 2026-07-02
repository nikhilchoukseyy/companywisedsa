import { Component } from 'react';
import { captureAnalyticsException } from '../utils/analytics';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    captureAnalyticsException(error, {
      source: 'react_render',
      component_stack: errorInfo?.componentStack || '',
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto flex min-h-[40vh] w-full max-w-[900px] items-center justify-center px-4 py-12">
          <div className="w-full rounded-[24px] border border-border bg-surface p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">App error</div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-text-primary">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              We captured the error and kept the rest of the app isolated.
            </p>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

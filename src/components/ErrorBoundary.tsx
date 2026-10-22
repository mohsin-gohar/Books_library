import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Athenaeum runtime error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
          <div className="max-w-md text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
              <span className="font-serif text-2xl">!</span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              The reading room hit an unexpected error. Your saved bookshelf and notes are safe.
            </p>
            {this.state.error?.message && (
              <p className="text-xs font-mono text-stone-400 break-words">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={this.handleReset}
              className="px-5 py-2 text-sm font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

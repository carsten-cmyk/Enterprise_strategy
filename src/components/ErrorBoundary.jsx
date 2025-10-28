import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              Something went wrong
            </h1>
            <div className="bg-white p-4 rounded border border-red-200 mb-4">
              <h2 className="font-semibold text-red-700 mb-2">Error:</h2>
              <pre className="text-sm text-red-600 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            {this.state.errorInfo && (
              <div className="bg-white p-4 rounded border border-red-200 mb-4">
                <h2 className="font-semibold text-red-700 mb-2">Stack Trace:</h2>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            <Button
              variant="primary"
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.href = '/';
              }}
            >
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import { useEffect, useState } from 'react';

const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const componentDidCatch = (error, errorInfo) => {
      setError(error);
      setErrorInfo(errorInfo);
      // You can also log error messages to an error reporting service here
    };

    window.addEventListener('error', componentDidCatch);
    return () => window.removeEventListener('error', componentDidCatch);
  }, []);

  if (errorInfo) {
    // Error path
    return (
      <div>
        <h3>Không thể tải trang...</h3>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {error && error.toString()}
          <br />
          {errorInfo.componentStack}
        </details>
      </div>
    );
  }

  // Normally, just render children
  return children;
};

export default ErrorBoundary;

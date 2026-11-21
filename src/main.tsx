import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RuntimeErrorFallback(props: { error: Error; resetErrorBoundary?: () => void }) {
  return (
    <div className="fixed inset-0 grid place-items-center bg-ea-black p-4 text-ea-white">
      <div className="relative w-full max-w-lg rounded-2xl border border-ea-grey/30 bg-ea-ink p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-xl font-bold">Something went wrong</h3>
        </div>
        <p className="mb-4 text-sm text-ea-grey">
          An error occurred while loading this page. You can try refreshing or resetting the application state.
        </p>

        <pre className="max-h-48 overflow-auto rounded-lg border border-red-900/50 bg-red-950/30 p-3 font-mono text-xs text-red-300">
          {props.error.message}
        </pre>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-ea-green px-4 py-2 text-sm font-bold text-ea-black transition hover:bg-ea-green/90"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={RuntimeErrorFallback}
      onReset={() => queryClient.clear()}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);

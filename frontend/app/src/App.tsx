import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRouter } from "@/router/AppRouter";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;

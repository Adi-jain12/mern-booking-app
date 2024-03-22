import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from "./contexts/AppContext.tsx";

// if we get ann error then by default react query will do a retry indefinitely
// Pros : if server is dying temporarily and comes back itself the doesnt have to do anything
// Cons : its quite expensive so it will make a lot of requests from the browser which we do not want so setting this off as below => retry: 0
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* App getting access to all react query things by wrapping App to QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

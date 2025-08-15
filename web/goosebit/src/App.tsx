import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { SetupGuard } from "./components/setup-guard";
import { composeProviders } from "./lib/compose-providers";
import { Devices } from "./pages/devices/devices";
import { Layout } from "./pages/layout/layout";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { Settings } from "./pages/settings/settings";
import { Software } from "./pages/software/software";
import { ThemeProvider } from "./providers/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const Providers = composeProviders([
  [ThemeProvider, { defaultTheme: "system", storageKey: "goosebit-ui-theme" }],
  [QueryClientProvider, { client: queryClient }],
  [BrowserRouter],
]);

function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

function AppRoutes() {
  return (
    <SetupGuard>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to={"/devices"} />} />
          <Route path="devices" element={<Devices />} />
          <Route path="software" element={<Software />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </SetupGuard>
  );
}

export default App;

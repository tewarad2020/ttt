import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* react-query provider*/}
    <QueryClientProvider client={queryClient}>
      {/* useContext provider*/}
      <UserProvider>
        <MantineProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MantineProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);

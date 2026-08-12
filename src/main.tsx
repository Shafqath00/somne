import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;

// Clear any pre-rendered content before React mounts.
// Pre-rendered HTML is for search engine bots (who don't run JS).
// Real users get the full interactive React SPA.
rootElement.innerHTML = "";

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>
);

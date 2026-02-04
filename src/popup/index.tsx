import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient } from "lib/query-client";
import { createChromeStoragePersister } from "lib/persister";
import { App } from "src/popup/App";
import "src/popup/styles.css";

const persister = createChromeStoragePersister();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <App />
    </PersistQueryClientProvider>
  </StrictMode>,
);

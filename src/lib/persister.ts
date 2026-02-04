import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

const CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";

export const createChromeStoragePersister = (): Persister => ({
  persistClient: async (client: PersistedClient) => {
    await chrome.storage.local.set({
      [CACHE_KEY]: JSON.stringify(client),
    });
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    const result = await chrome.storage.local.get(CACHE_KEY);
    return result[CACHE_KEY] ? JSON.parse(result[CACHE_KEY]) : undefined;
  },
  removeClient: async () => {
    await chrome.storage.local.remove(CACHE_KEY);
  },
});

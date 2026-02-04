import { EmailIssue, DismissedEmail } from "src/types";

export const fetchIssues = async (): Promise<EmailIssue[]> => {
  const response = await chrome.runtime.sendMessage({ type: "GET_ISSUES" });
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error || "Failed to fetch issues");
};

export const fetchDismissedEmails = async (): Promise<DismissedEmail[]> => {
  const response = await chrome.runtime.sendMessage({ type: "GET_DISMISSED" });
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error || "Failed to fetch dismissed emails");
};

export const dismissEmail = async (email: string): Promise<void> => {
  const response = await chrome.runtime.sendMessage({
    type: "DISMISS_EMAIL",
    email,
  });
  if (!response.success) {
    throw new Error(response.error || "Failed to dismiss email");
  }
};

export const clearHistory = async (): Promise<void> => {
  const response = await chrome.runtime.sendMessage({ type: "CLEAR_HISTORY" });
  if (!response.success) {
    throw new Error(response.error || "Failed to clear history");
  }
};

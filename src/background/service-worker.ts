import { EmailIssue, DismissedEmail } from "src/types";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;
const FIVE_SECONDS = 5000;

const scanForEmails = (text: string): string[] => {
  const matches = text.match(EMAIL_REGEX);
  return matches ? [...new Set(matches)] : [];
};

const anonymizeEmails = (text: string, emails: string[]): string =>
  emails.reduce(
    (acc, email) =>
      acc.replace(
        new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        "[EMAIL_ADDRESS]",
      ),
    text,
  );

const scanAndAnonymize = async (payload: {
  url: string;
  body: string;
  detectedEmails?: string[];
}) => {
  const { url, body, detectedEmails } = payload;
  const emails = detectedEmails || scanForEmails(body);

  if (emails.length === 0) {
    return { anonymizedBody: body, modified: false, emails: [] };
  }

  const dismissed = await getDismissedEmails();
  const dismissedSet = new Set(dismissed.map((d) => d.email));
  const nonDismissedEmails = emails.filter((email) => !dismissedSet.has(email));

  const anonymizedBody = anonymizeEmails(body, emails);

  if (nonDismissedEmails.length > 0) {
    await handleEmailDetected({
      emails: nonDismissedEmails,
      url,
      timestamp: Date.now(),
    });
  }

  return { anonymizedBody, modified: true, emails: nonDismissedEmails };
};

const handleEmailDetected = async (data: {
  emails: string[];
  url: string;
  timestamp: number;
}) => {
  const { emails, url, timestamp } = data;
  const result = await chrome.storage.local.get(["emailIssues"]);
  const existingIssues: EmailIssue[] = result.emailIssues || [];

  const newIssue: EmailIssue = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    emails,
    url,
    timestamp,
  };

  await chrome.storage.local.set({
    emailIssues: [...existingIssues, newIssue],
  });

  notifyUser(emails);
};

const getIssues = async (): Promise<EmailIssue[]> => {
  const result = await chrome.storage.local.get(["emailIssues"]);
  return result.emailIssues || [];
};

const getDismissedEmails = async (): Promise<DismissedEmail[]> => {
  const result = await chrome.storage.local.get(["dismissedEmails"]);
  const dismissed: DismissedEmail[] = result.dismissedEmails || [];
  const now = Date.now();
  const validDismissals = dismissed.filter((d) => d.expiresAt > now);

  if (validDismissals.length !== dismissed.length) {
    await chrome.storage.local.set({ dismissedEmails: validDismissals });
  }

  return validDismissals;
};

const dismissEmail = async (email: string) => {
  const result = await chrome.storage.local.get(["dismissedEmails"]);
  const dismissed: DismissedEmail[] = result.dismissedEmails || [];
  const filtered = dismissed.filter((d) => d.email !== email);

  const newDismissal: DismissedEmail = {
    email,
    dismissedAt: Date.now(),
    expiresAt: Date.now() + TWENTY_FOUR_HOURS,
  };

  await chrome.storage.local.set({
    dismissedEmails: [...filtered, newDismissal],
  });
};

const clearHistory = async () => {
  await chrome.storage.local.set({ emailIssues: [], dismissedEmails: [] });
};

const notifyUser = (emails: string[]) => {
  chrome.action.setBadgeText({ text: emails.length.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });

  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, FIVE_SECONDS);
};

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const handlers: Record<string, () => Promise<unknown>> = {
    SCAN_AND_ANONYMIZE: () => scanAndAnonymize(message.payload),
    GET_ISSUES: getIssues,
    GET_DISMISSED: getDismissedEmails,
    DISMISS_EMAIL: () => dismissEmail(message.email),
    CLEAR_HISTORY: clearHistory,
  };

  const handler = handlers[message.type];
  if (handler) {
    handler()
      .then((data) => {
        if (message.type === "SCAN_AND_ANONYMIZE") {
          sendResponse(data);
        } else {
          sendResponse({ success: true, data });
        }
      })
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

setInterval(getDismissedEmails, ONE_HOUR);

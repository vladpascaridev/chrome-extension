const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const scanForEmails = (text: string): string[] => {
  const matches = text.match(EMAIL_REGEX);
  return matches ? [...new Set(matches)] : [];
};

const getInputText = (): string => {
  const textarea = document.querySelector("#prompt-textarea");
  if (textarea) {
    if (textarea instanceof HTMLTextAreaElement) {
      return textarea.value;
    }
    return textarea.textContent || "";
  }
  return "";
};

const setInputText = (text: string) => {
  const textarea = document.querySelector("#prompt-textarea");
  if (textarea) {
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.value = text;
    } else {
      textarea.textContent = text;
    }
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
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

const triggerSend = () => {
  const sendBtn = document.querySelector(
    'button[data-testid="send-button"]',
  ) as HTMLButtonElement | null;
  if (sendBtn) {
    sendBtn.click();
  }
};

let isProcessing = false;

const processEmails = async (text: string, emails: string[]) => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const response = await chrome.runtime.sendMessage({
      type: "SCAN_AND_ANONYMIZE",
      payload: {
        url: window.location.href,
        body: text,
        detectedEmails: emails,
      },
    });

    const nonDismissedEmails: string[] = response?.emails || [];

    if (nonDismissedEmails.length > 0) {
      const anonymized = anonymizeEmails(text, nonDismissedEmails);
      setInputText(anonymized);

      alert(
        `⚠️ Email Detection Alert\n\n${nonDismissedEmails.length} email address(es) detected:\n${nonDismissedEmails.map((e: string) => `• ${e}`).join("\n")}\n\nEmails replaced with [EMAIL_ADDRESS]. Press Send again.`,
      );
    } else {
      triggerSend();
    }
  } finally {
    isProcessing = false;
  }
};

const observer = new MutationObserver(() => {
  const text = getInputText();
  const emails = scanForEmails(text);

  if (emails.length > 0) {
    console.log("[EmailMonitor] Emails found in input:", emails);
  }
});

const init = () => {
  const textarea = document.querySelector("#prompt-textarea");
  if (textarea) {
    observer.observe(textarea, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
        const text = getInputText();
        const emails = scanForEmails(text);

        if (emails.length > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          processEmails(text, emails);
        }
      }
    },
    true,
  );

  document.addEventListener(
    "click",
    (e) => {
      if (isProcessing) return;

      const target = e.target as HTMLElement;
      const sendBtn = target.closest('button[data-testid="send-button"]');

      if (sendBtn) {
        const text = getInputText();
        const emails = scanForEmails(text);

        if (emails.length > 0) {
          e.preventDefault();
          e.stopImmediatePropagation();
          processEmails(text, emails);
        }
      }
    },
    true,
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

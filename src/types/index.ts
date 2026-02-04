export interface EmailIssue {
  id: string;
  emails: string[];
  url: string;
  timestamp: number;
}

export interface DismissedEmail {
  email: string;
  dismissedAt: number;
  expiresAt: number;
}

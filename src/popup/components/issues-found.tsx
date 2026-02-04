import { useIssues } from "hooks/useEmailQueries";
import { Card } from "components/ui/card/card";
import { CardContent } from "components/ui/card/card-content";
import { CardHeader } from "components/ui/card/card-header";
import { CardTitle } from "components/ui/card/card-title";
import { Badge } from "components/ui/badge";
import { Alert } from "components/ui/alert/alert";
import { AlertDescription } from "components/ui/alert/alert-description";
import { AlertTitle } from "components/ui/alert/alert-title";
import { Info } from "lucide-react";
import { EmailItem } from "./email-item";

export const IssuesFound = () => {
  const { data: issues = [] } = useIssues();
  const latestIssue = issues.length > 0 ? issues[issues.length - 1] : null;

  if (!latestIssue) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-lg font-semibold mb-2">No Issues Detected</h3>
        <p className="text-muted-foreground max-w-[280px]">
          No email addresses have been detected in your recent ChatGPT prompts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Latest Detection</CardTitle>
            <Badge variant="outline">
              {new Date(latestIssue.timestamp).toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-1">
            <div className="flex gap-2">
              <span className="font-medium text-muted-foreground">URL:</span>
              <span className="truncate">{latestIssue.url}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-muted-foreground">
                Emails Detected:
              </span>
              <Badge>{latestIssue.emails.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Detected Email Addresses:</h4>
        {latestIssue.emails.map((email: string, index: number) => (
          <EmailItem key={index} email={email} />
        ))}
      </div>

      <Alert variant="warning">
        <Info className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          These email addresses were automatically anonymized to{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-xs">
            [EMAIL_ADDRESS]
          </code>{" "}
          before sending to ChatGPT.
        </AlertDescription>
      </Alert>
    </div>
  );
};

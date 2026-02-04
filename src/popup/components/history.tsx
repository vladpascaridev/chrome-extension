import { useState } from "react";
import { useIssues, useClearHistory } from "hooks/useEmailQueries";
import { Card } from "components/ui/card/card";
import { CardContent } from "components/ui/card/card-content";
import { CardHeader } from "components/ui/card/card-header";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { EmailItem } from "./email-item";

export const History = () => {
  const { data: issues = [] } = useIssues();
  const clearHistoryMutation = useClearHistory();
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      clearHistoryMutation.mutate();
    }
  };

  const toggleIssue = (issueId: string) => {
    setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
  };

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold mb-2">No History</h3>
        <p className="text-muted-foreground">
          No email detections have been recorded yet.
        </p>
      </div>
    );
  }

  const sortedIssues = [...issues].sort((a, b) => b.timestamp - a.timestamp);
  const totalEmails = issues.reduce(
    (sum, issue) => sum + issue.emails.length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Detection History</h3>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClearHistory}
          disabled={clearHistoryMutation.isPending}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-violet-600 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{issues.length}</div>
            <div className="text-xs text-white/80">Total Detections</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-600 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{totalEmails}</div>
            <div className="text-xs text-white/80">Total Emails</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {sortedIssues.map((issue) => {
          const isExpanded = expandedIssueId === issue.id;

          return (
            <Card key={issue.id} className={isExpanded ? "border-primary" : ""}>
              <CardHeader
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleIssue(issue.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm">
                      {new Date(issue.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Badge>
                    {issue.emails.length} email
                    {issue.emails.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 pb-3 px-3 space-y-3">
                  <div className="text-xs text-muted-foreground truncate">
                    <strong>URL:</strong> {issue.url}
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs">Email Addresses:</strong>
                    {issue.emails.map((email: string, index: number) => (
                      <EmailItem key={index} email={email} />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

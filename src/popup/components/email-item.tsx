import {
  useDismissedEmails,
  useDismissEmail,
  useTimeRemaining,
} from "hooks/useEmailQueries";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Mail, CheckCircle2, Clock } from "lucide-react";

interface EmailItemProps {
  email: string;
}

export const EmailItem = ({ email }: EmailItemProps) => {
  const { data: dismissedEmails = [] } = useDismissedEmails();
  const dismissMutation = useDismissEmail();
  const timeRemaining = useTimeRemaining(email);

  const isDismissed = dismissedEmails.some(
    (d) => d.email === email && d.expiresAt > Date.now(),
  );

  const handleDismiss = () => {
    dismissMutation.mutate(email);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        isDismissed
          ? "bg-muted/50 opacity-70"
          : "bg-card hover:border-primary/50"
      } transition-colors`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-mono text-sm truncate">{email}</span>
        {isDismissed && timeRemaining && (
          <Badge variant="secondary" className="shrink-0 gap-1">
            <Clock className="h-3 w-3" />
            {timeRemaining}
          </Badge>
        )}
      </div>
      <Button
        size="sm"
        variant={isDismissed ? "secondary" : "default"}
        onClick={handleDismiss}
        disabled={isDismissed || dismissMutation.isPending}
        className="shrink-0 ml-2"
      >
        {isDismissed ? (
          <>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Dismissed
          </>
        ) : (
          "Dismiss"
        )}
      </Button>
    </div>
  );
};

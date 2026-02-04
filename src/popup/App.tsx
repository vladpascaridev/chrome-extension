import { useState } from "react";
import { useIssues } from "hooks/useEmailQueries";
import { IssuesFound } from "src/popup/components/issues-found";
import { History } from "src/popup/components/history";
import { Tabs } from "components/ui/tabs/tabs";
import { TabsContent } from "components/ui/tabs/tabs-content";
import { TabsList } from "components/ui/tabs/tabs-list";
import { TabsTrigger } from "components/ui/tabs/tabs-trigger";
import { Card } from "components/ui/card/card";
import { CardHeader } from "components/ui/card/card-header";
import { CardTitle } from "components/ui/card/card-title";
import { CardDescription } from "components/ui/card/card-description";
import {
  Shield,
  AlertTriangle,
  History as HistoryIcon,
  Loader2,
} from "lucide-react";

type TabType = "issues" | "history";

export const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>("issues");
  const { isLoading } = useIssues();

  if (isLoading) {
    return (
      <div className="w-[600px] h-[500px] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] h-[500px] flex flex-col bg-background">
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <CardTitle className="text-xl">ChatGPT Email Monitor</CardTitle>
          </div>
          <CardDescription className="text-white/90">
            Protecting your privacy
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabType)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0 h-auto">
          <TabsTrigger
            value="issues"
            className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background py-3"
          >
            <AlertTriangle className="h-4 w-4" />
            Issues Found
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-1 gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background py-3"
          >
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="issues" className="m-0 h-full">
            <IssuesFound />
          </TabsContent>
          <TabsContent value="history" className="m-0 h-full">
            <History />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

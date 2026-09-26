"use client";

import * as React from "react";
import {
  MessageSquare,
  Send,
  GraduationCap,
  Building2,
  Users,
  Search,
  CheckCheck,
  Paperclip,
  Radio,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Badge } from "@/features/shared/components/ui/badge";
import { Input } from "@/features/shared/components/ui/input";
import {
  useConversations,
  useConversationMessages,
  useIndustryQueries,
} from "@/features/industry/hooks/use-industry-queries";
import { useIndustryStore } from "@/features/industry/hooks/use-industry-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STAKEHOLDER_FILTERS = ["All", "University", "Government", "Students", "NGOs"] as const;

export default function IndustryMessagesPage() {
  const { data: conversations } = useConversations();
  const [selectedConvId, setSelectedConvId] = React.useState("conv-1");
  const [stakeholderTab, setStakeholderTab] = React.useState<typeof STAKEHOLDER_FILTERS[number]>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [messageText, setMessageText] = React.useState("");

  const { data: messages } = useConversationMessages(selectedConvId);
  const { sendMessageMutation } = useIndustryQueries();
  const { user } = useIndustryStore();

  // Simulated WebSocket heartbeat indicator
  const [isWsConnected, setIsWsConnected] = React.useState(true);

  const filteredConversations = React.useMemo(() => {
    let list = conversations || [];
    if (stakeholderTab !== "All") {
      list = list.filter((c) => c.participantCategory === stakeholderTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.participantName.toLowerCase().includes(q) ||
          c.participantOrg.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, stakeholderTab, searchQuery]);

  const activeConv = conversations?.find((c) => c.id === selectedConvId) || conversations?.[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId) return;
    sendMessageMutation.mutate({
      conversationId: selectedConvId,
      content: messageText.trim(),
    });
    setMessageText("");
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "University":
        return <Badge variant="secondary" className="text-[10px]">Academia</Badge>;
      case "Government":
        return <Badge variant="warning" className="text-[10px]">Government</Badge>;
      case "Students":
        return <Badge variant="info" className="text-[10px]">Scholars</Badge>;
      case "NGOs":
        return <Badge variant="success" className="text-[10px]">NGO</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Real-Time Messaging Hub</h1>
          <p className="text-sm text-muted-foreground">
            Encrypted communication channels across Universities, Municipal Authorities, Student Fellows, and Civil Society NGOs.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 font-bold text-xs gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>WebSocket Stream Active</span>
        </Badge>
      </div>

      {/* Main Chat Grid (Left: Inbox Channels, Right: Active Thread) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[720px] rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm">
        {/* Left 1 Col: Channels & Filter Tabs */}
        <div className="border-r border-border/70 flex flex-col h-full bg-muted/20">
          {/* Stakeholder Filters Bar */}
          <div className="p-3 border-b border-border/60 space-y-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {STAKEHOLDER_FILTERS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStakeholderTab(tab)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                    stakeholderTab === tab
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-8 text-xs h-8 rounded-xl bg-card border-border/70"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    "p-3 rounded-2xl cursor-pointer transition-all border",
                    isSelected
                      ? "bg-amber-500/10 border-amber-500/40 text-foreground"
                      : "border-transparent hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <p className={cn("text-xs truncate", isSelected ? "font-black" : "font-bold text-foreground")}>
                          {conv.participantName}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{conv.participantOrg}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTimestamp}</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 pt-1">
                    {getCategoryBadge(conv.participantCategory)}
                    {conv.unreadCount > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Conversation Stream & Composer */}
        <div className="lg:col-span-2 flex flex-col h-full bg-card">
          {activeConv ? (
            <>
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card/80">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow">
                    {activeConv.participantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground">{activeConv.participantName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {activeConv.participantOrg} • {activeConv.projectContext || "Academic Research"}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] font-semibold">
                  Channel: {activeConv.participantCategory}
                </Badge>
              </div>

              {/* Message History Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {(messages || []).map((msg) => {
                  const isMine = msg.sender.id === user?.id || msg.sender.role === "system";
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex flex-col max-w-[80%]", isMine ? "ml-auto items-end" : "mr-auto items-start")}
                    >
                      <span className="text-[10px] font-semibold text-muted-foreground px-1 mb-0.5">
                        {msg.sender.name}
                      </span>
                      <div
                        className={cn(
                          "p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm",
                          isMine
                            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-none"
                            : "bg-muted/70 text-foreground border border-border/70 rounded-bl-none"
                        )}
                      >
                        <p>{msg.content}</p>
                        {msg.attachments && (
                          <div className="mt-2 pt-2 border-t border-white/20 text-[11px] font-mono flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>{msg.attachments[0].name}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground px-1 mt-0.5">{msg.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-border/60 bg-muted/20 flex gap-2">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Reply to ${activeConv.participantName}...`}
                  className="rounded-2xl text-xs bg-card border-border/80"
                />
                <Button type="submit" variant="gradient" size="sm" className="rounded-2xl px-4 font-bold shrink-0">
                  <Send className="h-3.5 w-3.5 mr-1" />
                  <span>Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <MessageSquare className="h-10 w-10 stroke-1" />
              <p className="text-sm font-semibold">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

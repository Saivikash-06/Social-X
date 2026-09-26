"use client";

import * as React from "react";
import { MessageSquare, Send, Search, User, CheckCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/features/shared/components/ui/avatar";
import { useNgoConversations, useNgoMessages, useNgoQueries } from "@/features/ngo/hooks/use-ngo-queries";

export default function NgoMessagesPage() {
  const { data: conversations } = useNgoConversations();
  const [selectedConvId, setSelectedConvId] = React.useState<string>("conv-01");
  const { data: messages } = useNgoMessages(selectedConvId);
  const { sendMessageMutation } = useNgoQueries();
  const [messageInput, setMessageInput] = React.useState("");

  const currentConv = (conversations || []).find((c) => c.id === selectedConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessageMutation.mutate({
      conversationId: selectedConvId,
      content: messageInput,
    });
    setMessageInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          <span>Operational Communications Desk</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Encrypted real-time channel with nodal line officers, academic mentors, and field volunteer leads
        </p>
      </div>

      {/* Main Chat Layout */}
      <Card className="rounded-3xl border-border/80 bg-card overflow-hidden shadow-xl h-[600px] flex flex-col md:flex-row">
        {/* Left: Conversations List */}
        <div className="w-full md:w-80 border-r border-border/80 flex flex-col bg-muted/20">
          <div className="p-4 border-b border-border/80">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Conversations</h3>
            <Input placeholder="Search threads..." className="rounded-xl text-xs bg-muted/40 h-8" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {(conversations || []).map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 ${
                  selectedConvId === conv.id
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : "hover:bg-muted/50 border border-transparent"
                }`}
              >
                <Avatar className="h-10 w-10 rounded-xl shrink-0">
                  <AvatarImage src={conv.avatarUrl} />
                  <AvatarFallback className="text-xs font-bold bg-emerald-500/10 text-emerald-600">
                    {conv.partnerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-foreground truncate">{conv.partnerName}</p>
                    <span className="text-[10px] text-muted-foreground">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{conv.partnerOrg}</p>
                  <p className="text-[11px] text-foreground/80 truncate mt-1">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="flex-1 flex flex-col bg-card">
          {/* Header */}
          <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 rounded-xl">
                <AvatarImage src={currentConv?.avatarUrl} />
                <AvatarFallback className="text-xs font-bold">
                  {currentConv?.partnerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-xs font-bold text-foreground">{currentConv?.partnerName}</h4>
                <p className="text-[10px] text-muted-foreground">
                  {currentConv?.partnerType} • {currentConv?.partnerOrg}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                    msg.isSelf
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-muted/50 border border-border text-foreground rounded-bl-xs"
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] ${
                      msg.isSelf ? "text-emerald-200" : "text-muted-foreground"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.isSelf && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border/80 flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type operational response..."
              className="rounded-2xl text-xs bg-muted/30"
            />
            <Button
              type="submit"
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 px-4"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

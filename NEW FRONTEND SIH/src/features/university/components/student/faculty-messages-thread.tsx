'use client';

import * as React from 'react';
import { Send, User, CheckCheck, Clock, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';

interface Message {
  id: string;
  sender: 'student' | 'faculty';
  name: string;
  avatarText: string;
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'faculty',
    name: 'Dr. Elena Rostova',
    avatarText: 'ER',
    content:
      'Alex, please ensure your edge inverter microcontroller code uses interrupt-driven ADC sampling to minimize idle power drain before the field pilot.',
    timestamp: 'Yesterday at 4:15 PM',
  },
  {
    id: 'msg-2',
    sender: 'student',
    name: 'Alex Rivera (You)',
    avatarText: 'AR',
    content:
      'Understood Dr. Rostova. I refactored the polling loop to DMA-driven hardware buffers. Firmware benchmark showed a 34% drop in battery power consumption.',
    timestamp: 'Yesterday at 5:30 PM',
  },
  {
    id: 'msg-3',
    sender: 'faculty',
    name: 'Dr. Elena Rostova',
    avatarText: 'ER',
    content:
      'Outstanding work! Please upload the binary compiled artifact and oscilloscope trace under Phase 2 deliverables so I can sign off on the milestone.',
    timestamp: 'Today at 9:10 AM',
  },
];

export function FacultyMessagesThread() {
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      name: 'Alex Rivera (You)',
      avatarText: 'AR',
      content: inputMessage.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate faculty auto-acknowledgment
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'faculty',
          name: 'Dr. Elena Rostova',
          avatarText: 'ER',
          content: 'Received. I will review this in the afternoon lab session.',
          timestamp: 'Just now',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Thread Header */}
      <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
            ER
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Dr. Elena Rostova (Faculty Advisor)
            </h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online • Responds within 2 hours
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isMe = m.sender === 'student';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[80%] ${
                isMe ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isMe
                    ? 'bg-cyan-600 text-white'
                    : 'bg-primary/10 text-primary border border-primary/20'
                }`}
              >
                {m.avatarText}
              </div>

              <div className="space-y-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-muted/70 text-foreground rounded-tl-none border border-border/60'
                  }`}
                >
                  {m.content}
                </div>
                <div
                  className={`flex items-center gap-1 text-[10px] text-muted-foreground ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isMe && <CheckCheck className="h-3 w-3 text-cyan-600" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-border/80 p-3 bg-muted/20"
      >
        <Input
          placeholder="Ask Dr. Rostova about experimental setups, benchmarks, or grant releases..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="text-xs bg-background"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

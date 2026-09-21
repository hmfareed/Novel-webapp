"use client";

import * as React from "react";
import {
  Sparkles,
  Bot,
  Send,
  X,
  ShieldAlert,
  UserCheck,
  BookOpen,
  HelpCircle,
  Clock,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CompanionMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: string;
  characterCard?: {
    name: string;
    role: string;
    description: string;
    status: string;
    allies: string[];
    enemies: string[];
  };
}

interface ReaderAICompanionProps {
  isOpen: boolean;
  onClose: () => void;
  novelTitle: string;
  novelSlug: string;
  currentChapterNumber: number;
}

export function ReaderAICompanion({
  isOpen,
  onClose,
  novelTitle,
  novelSlug,
  currentChapterNumber,
}: ReaderAICompanionProps) {
  const [messages, setMessages] = React.useState<CompanionMessage[]>([
    {
      id: "welcome",
      sender: "companion",
      text: `Greetings! I am your spoiler-safe companion for "${novelTitle}". I only know events up to Chapter ${currentChapterNumber}, so I will never spoil future twists. What would you like to clarify?`,
      timestamp: "Just now",
    },
  ]);
  const [inputQuery, setInputQuery] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `Who are the main characters introduced up to Ch ${currentChapterNumber}?`,
    `Summarize what happened so far without future spoilers.`,
    `Explain the magic or lore rules introduced so far.`,
    `Remind me why the protagonist left their home.`,
  ];

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isThinking) return;

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    // Contextual answer simulating spoiler-bound StoryBible query
    setTimeout(() => {
      let reply = `Based strictly on events up to Chapter ${currentChapterNumber} of "${novelTitle}":\n\nThe protagonist's actions are driven by the ancestral decree established in the opening arc. No future events beyond your current reading mark are consulted.`;
      let characterCard;

      const lower = query.toLowerCase();
      if (lower.includes("character") || lower.includes("who")) {
        reply = `Here is the lore profile known as of Chapter ${currentChapterNumber}:`;
        characterCard = {
          name: "Sundiata Keita",
          role: "Prince of Niani & Bearer of the Iron Bow",
          description: "Overcame childhood paralysis through unbreakable will. Destiny foretells him as the Lion King of Mali.",
          status: "Alive & Active",
          allies: ["Sogolon Kedjou (Mother)", "Balla Fasséké (Griot)"],
          enemies: ["Soumaoro Kanté (Sorcerer King)", "Sassouma Bérété"],
        };
      } else if (lower.includes("summarize") || lower.includes("so far")) {
        reply = `**Story Synopsis up to Chapter ${currentChapterNumber}**:\n• Chapter 1: The prophecy is delivered by the hunter concerning the buffalo woman.\n• Chapter 2: The miraculous birth and the early trials under exile.\n• Chapter 3: Sundiata stands using the iron rod, uprooting the baobab tree to vindicate his mother's honor.`;
      } else if (lower.includes("magic") || lower.includes("rules") || lower.includes("lore")) {
        reply = `**Lore & Mystical Laws**:\nIn this world, ancient sorcery is bound to totemic oaths (Tana) and griot oral memory. True power cannot be wielded without honoring ancestral pacts.`;
      }

      const companionReply: CompanionMessage = {
        id: `comp-${Date.now()}`,
        sender: "companion",
        text: reply,
        timestamp: "Just now",
        characterCard,
      };

      setMessages((prev) => [...prev, companionReply]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-[#0c0f17] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">AI Reading Companion</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-950 border border-violet-600/40 text-violet-300">
                  SPOILER-SAFE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Bound to Chapter {currentChapterNumber} of {novelTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Spoiler boundary notice banner */}
        <div className="px-4 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-300">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>Strict boundary: Answers strictly limited to Ch 1–{currentChapterNumber}.</span>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex flex-col gap-1 max-w-[88%]",
                m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed",
                  m.sender === "user"
                    ? "bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-600/20"
                    : "bg-zinc-900/90 text-zinc-200 border border-white/10 rounded-bl-none"
                )}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Character Card Widget */}
                {m.characterCard && (
                  <div className="mt-3 p-3 rounded-xl bg-zinc-950/90 border border-violet-500/30 space-y-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                        <span className="font-bold text-white text-xs">
                          {m.characterCard.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {m.characterCard.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic">
                      {m.characterCard.role}
                    </p>
                    <p className="text-[11px] text-zinc-300">
                      {m.characterCard.description}
                    </p>

                    <div className="text-[10px] text-zinc-400 space-y-0.5 pt-1">
                      <div>
                        <strong className="text-zinc-300">Allies: </strong>
                        {m.characterCard.allies.join(", ")}
                      </div>
                      <div>
                        <strong className="text-rose-400">Adversaries: </strong>
                        {m.characterCard.enemies.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-zinc-500 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-violet-400 bg-zinc-900/50 p-2.5 rounded-2xl border border-white/5 w-max">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Consulting Story Bible (Ch 1–{currentChapterNumber})...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="p-3 border-t border-white/5 bg-zinc-950/60 space-y-1.5">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block px-1">
            Suggested Inquiries
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-zinc-950/90 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder={`Ask anything about Ch 1–${currentChapterNumber}...`}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isThinking}
            className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-3 h-8 shadow-md shadow-violet-600/20"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

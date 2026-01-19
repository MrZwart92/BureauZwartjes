"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface IntakeChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// Parse message content for options buttons
function parseMessageContent(content: string): {
  text: string;
  options: string[] | null;
} {
  const optionsMatch = content.match(/\[OPTIONS\]([\s\S]*?)\[\/OPTIONS\]/);
  if (optionsMatch) {
    const text = content.replace(/\[OPTIONS\][\s\S]*?\[\/OPTIONS\]/, "").trim();
    const options = optionsMatch[1]
      .split("|")
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    return { text, options };
  }
  return { text: content, options: null };
}

// Clean message content for display (remove special tags)
function cleanContent(content: string): string {
  return content
    .replace(/\[OPTIONS\][\s\S]*?\[\/OPTIONS\]/g, "")
    .replace(/\[INTAKE_COMPLETE\][\s\S]*/g, "")
    .trim();
}

export function IntakeChat({ isOpen, onClose }: IntakeChatProps) {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: t("welcome"),
        },
      ]);
    }
  }, [isOpen, messages.length, t]);

  const sendMessageWithContent = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageContent.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            locale,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to send message");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";
        const assistantId = (Date.now() + 1).toString();

        // Add empty assistant message
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            assistantMessage += chunk;

            // Check if intake is complete
            if (assistantMessage.includes("[INTAKE_COMPLETE]")) {
              setIsComplete(true);
            }

            // Clean content for display
            const displayContent = cleanContent(assistantMessage);

            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: displayContent } : m
              )
            );
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: `Er is iets misgegaan: ${errorMessage}`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, locale]
  );

  const sendMessage = useCallback(() => {
    sendMessageWithContent(input);
  }, [input, sendMessageWithContent]);

  const handleOptionClick = (option: string) => {
    sendMessageWithContent(option);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    setMessages([]);
    setInput("");
    setIsComplete(false);
    onClose();
  };

  // Get options from the last assistant message
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const { options: currentOptions } = lastAssistantMessage
    ? parseMessageContent(lastAssistantMessage.content)
    : { options: null };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - wider: 50% on large screens */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90%] md:w-[70%] lg:w-[50%] sm:max-h-[85vh] bg-surface rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                {t("title")}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-background transition-colors"
                aria-label={t("close")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const { text } = parseMessageContent(message.content);
                const cleanedText = cleanContent(text);

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-accent text-white rounded-br-md"
                          : "bg-background text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{cleanedText}</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Option buttons */}
              {currentOptions && !isLoading && !isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {currentOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="px-4 py-2 bg-background border border-border rounded-full text-foreground hover:border-accent hover:text-accent transition-colors text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-background rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-sm text-foreground/60">
                        {t("typing")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/10 border border-accent/30 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t("complete.title")}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    {t("complete.description")}
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent-hover transition-colors"
                  >
                    {t("complete.cta")}
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!isComplete && (
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("placeholder")}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="px-4 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

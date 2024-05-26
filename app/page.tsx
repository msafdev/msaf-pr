"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";

import { ClientMessage } from "@/lib/actions";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-provider";

import { CornerDownLeft, Plus } from "lucide-react";
import { RxGithubLogo } from "react-icons/rx";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setInput("");
    setIsLoading(true);
    setError(null); // Clear previous errors

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: nanoid(), role: "user", display: input },
    ]);

    try {
      const message = await continueConversation(input);

      if (!message) {
        throw new Error("No response from server.");
      }

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message,
      ]);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <main className="w-full h-[100svh] px-4 flex justify-center relative">
      <div className="flex gap-x-4 z-30 w-full px-4 py-4 md:pt-6 md:pb-6 md:px-0 max-w-4xl items-center absolute top-0 left-auto bg-gradient-to-b from-background via-background/80 to-transparent">
        <code className="text-2xl font-bold mr-auto">Pr</code>
        <Link href="/" target="_blank">
          <RxGithubLogo className="text-lg" />
        </Link>
        <ModeToggle />
      </div>

      <div className="flex flex-col h-full pt-20 pb-20 md:pt-24 lg:pb-24 overflow-auto no-scrollbar w-full max-w-4xl items-center">
        {conversation.length === 0 ? (
          <div className="flex flex-col gap-y-3 h-full items-center justify-center">
            <code className="text-lg md:text-2xl font-medium text-center">
              How can I help you today?
            </code>
          </div>
        ) : (
          <div className="flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8 w-full">
            {conversation.map((message: ClientMessage) => (
              <div
                key={message.id}
                className={`flex items-center gap-x-2 [&>svg]:animate-spin ${
                  message.role === "user"
                    ? "justify-end text-base md:text-lg text-right bg-secondary text-secondary-foreground border w-fit ml-auto px-4 rounded-full py-1.5"
                    : "justify-start font-mono text-sm md:text-base"
                }`}
              >
                {message.display}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}

      <form
        className="flex items-center z-30 absolute bottom-0 px-4 py-4 md:pt-8 md:pb-6 md:px-0 left-auto max-w-4xl w-full bg-gradient-to-b from-transparent via-background/80 to-background"
        onSubmit={handleSubmit}
      >
        <div className="flex w-full items-center gap-2 bg-foreground px-2 md:px-4 py-1 md:py-3 rounded-full">
          <Button
            className="px-2 py-2 bg-transparent hover:bg-transparent hover:text-background text-muted-foreground"
            type="button"
            onClick={handleReload}
            disabled={isLoading}
          >
            <Plus />
          </Button>
          <Input
            className="bg-transparent text-lg w-full border-0 ring-transparent outline-transparent border-transparent text-background focus-visible:ring-offset-0 focus-visible:ring-0"
            placeholder="Ask me anything!"
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            required
            disabled={isLoading}
          />
          <Button
            className="px-2 py-2 bg-transparent hover:bg-transparent hover:text-background text-muted-foreground"
            disabled={isLoading}
          >
            <CornerDownLeft />
          </Button>
        </div>
      </form>
    </main>
  );
}

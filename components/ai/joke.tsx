"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Joke } from "@/lib/schemas";

export const JokeComponent = ({ joke }: { joke?: Joke }) => {
  const [showPunchline, setShowPunchline] = useState(false);
  return (
    <div className="bg-popover border flex-wrap text-popover-foreground pl-4 pr-4 py-4 md:pl-8 md:pr-4 gap-4 rounded-md w-full flex items-center justify-between">
      <p className="mb-0">{showPunchline ? joke?.punchline : joke?.setup}</p>
      <Button
        onClick={() => setShowPunchline(true)}
        disabled={showPunchline}
        variant="outline"
      >
        Show Punchline!
      </Button>
    </div>
  );
};

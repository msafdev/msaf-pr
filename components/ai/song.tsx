"use client";

import { Song } from "@/lib/schemas";
import { searchSpotity } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const SongComponent = ({ song }: { song?: Song }) => {
  return (
    <div className="text-accent-foreground rounded-md grid lg:grid-cols-3 w-full gap-3 md:gap-4">
      {song?.map((songs, index) => (
        <div key={index} className="font-sans px-4 py-4 lg:py-6 lg:px-8 w-full group anim border rounded-xl bg-background hover:bg-accent group">
          <div className="flex flex-col gap-y-3 lg:gap-y-4 col-span-2 lg:col-span-4 h-full justify-between">
            <Link
              href={`${searchSpotity(`${songs?.name} ${songs?.artist}`)}`}
              className="flex w-fit"
              target="_blank"
            >
              <h2 className="font-medium anim gap-x-1 text-lg text-foreground group-hover:text-accent-foreground leading-tight">{songs?.name}
              <ArrowUpRight
                size={14}
                className="ml-1 text-foreground inline-block group-hover:text-accent-foreground -translate-y-2 group-hover:scale-100 scale-0 anim"
              />
              </h2>
            </Link>
            <div className="flex items-end justify-between gap-x-3">
              <code className="text-sm text-muted-foreground leading-tight">
                by{" "}
                <span className="text-foreground font-medium">
                  {songs?.artist}
                </span>
              </code>
              <code className="text-sm text-muted-foreground">
                {songs?.duration}
              </code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

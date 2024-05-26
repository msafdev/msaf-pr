"use server";

import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { google } from "@ai-sdk/google";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { JokeComponent } from "@/components/ai/joke";
import { generateObject, generateText } from "ai";
import { jokeSchema, placeSchema, songSchema } from "./schemas";
import { PlaceComponent } from "@/components/ai/place";
import { LoaderCircle } from "lucide-react";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SongComponent } from "@/components/ai/song";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: google("models/gemini-1.5-pro-latest"),
    system: `
      You are a general purpose assistant, you can help the user with a variety of tasks. You can tell jokes, give place and song recommendations, and much more. You are a professional, don't use emote.
      `,
    messages: [...history.get(), { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }
      if (content) {
        return (
          <article className="markdown-container">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </article>
        );
      } else {
        return (
          <p>
            Something went wrong, please try again later. If the problem
            persists, please contact the developer.
          </p>
        );
      }
    },
    tools: {
      getJoke: {
        description:
          "A tool when the user wants a joke. The joke should make the user laugh.",
        parameters: z.object({
          category: z.string().optional().describe("the category of the joke"),
        }),
        generate: async function* ({ category }) {
          yield <LoaderCircle />;
          const joke = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: jokeSchema,
            prompt:
              "Generate a joke that will make the user laugh. The joke should be in the category of " +
              category +
              ". If no category is provided, ask the user for a category.",
          });
          return <JokeComponent joke={joke.object} />;
        },
      },
      getPlaces: {
        description:
          "A tool when the user wants place recommendations based on the location and type.",
        parameters: z.object({
          location: z.string().describe("the user's location"),
          type: z.string().optional().describe("the type of place"),
        }),
        generate: async function* ({ location, type }) {
          yield <LoaderCircle className="loader-circle" />;
          const places = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: placeSchema,
            prompt:
              "Generate an array of places to visit in " +
              location +
              " with the type of " +
              (type || "any type") +
              ". The array should contain at least 5 places.",
          });
          if (places && places.object && Array.isArray(places.object)) {
            return <PlaceComponent place={places.object} />;
          } else {
            return <p>Something went wrong, please try again later.</p>;
          }
        },
      },
      getSongs: {
        description:
          "A tool when the user wants song recommendations based on the genre.",
        parameters: z.object({
          genre: z.string().optional().describe("the genre of the song"),
          singer: z.string().optional().describe("the singer of the song"),
        }),
        generate: async function* ({ genre, singer }) {
          yield <LoaderCircle />;
          const songs = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: songSchema,
            prompt:
              "Generate songs recommendation in the genre of " +
              (genre || "any genres") +
              "or by the singer " +
              (singer || "any singer") +
              ". Return an array of 3 songs.",
          });
          if (songs && songs.object && Array.isArray(songs.object)) {
            return <SongComponent song={songs.object} />;
          } else {
            return <p>Something went wrong, please try again later.</p>;
          }
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});

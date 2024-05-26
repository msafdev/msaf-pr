import { DeepPartial } from "ai";
import { access } from "fs";
import { z } from "zod";

export const jokeSchema = z.object({
  setup: z.string().describe("the setup of the joke"),
  punchline: z.string().describe("the punchline of the joke"),
});

export type Joke = DeepPartial<typeof jokeSchema>;

export const placeSchema = z.array(
  z.object({
    name: z.string().describe("the name of the place"),
    location: z.string().describe("the location of the place"),
    price: z.string().describe("the price range of the place from $ to $$$$"),
    hours: z
      .string()
      .describe(
        "the hours of operation of the place, from opening to closing time. The hours should be in the format 'HH:MM - HH:MM', if the place is open 24/7, the hours should be 'Open 24/7'"
      ),
    rating: z
      .number()
      .describe(
        "the rating of the place, the ratings should never be a decimal number!"
      ),
    wifi: z.boolean().optional().describe("whether the place has wifi"),
    smoking: z
      .boolean()
      .optional()
      .describe("whether the place allows smoking"),
    alcohol: z
      .boolean()
      .optional()
      .describe("whether the place serves alcohol"),
    parking: z.boolean().optional().describe("whether the place has parking"),
    accessibility: z
      .boolean()
      .optional()
      .describe("whether the place is accessible for people with disabilities"),
  })
);

export type Place = DeepPartial<typeof placeSchema>;

export const songSchema = z.array(
  z.object({
    name: z.string().describe("the name of the song"),
    artist: z.string().describe("the artist of the song"),
    genre: z.string().describe("the genre of the song"),
    duration: z
      .string()
      .describe("the duration of the song in the format 'MM:SS'"),
  })
);

export type Song = DeepPartial<typeof songSchema>;

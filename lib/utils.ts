import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function searchGMaps(query: string | undefined) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query || ""
  )}`;
}

export function searchSpotity(query: string | undefined) {
  return `https://open.spotify.com/search/${encodeURIComponent(query || "")}`;
}

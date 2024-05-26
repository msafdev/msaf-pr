"use client";

import { Place } from "@/lib/schemas";
import {
  Accessibility,
  ArrowUpRight,
  Beer,
  Cigarette,
  ParkingCircle,
  Star,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { searchGMaps } from "@/lib/utils";

export const PlaceComponent = ({ place }: { place?: Place }) => {
  return (
    <div className="text-accent-foreground rounded-md flex justify-between w-full flex-wrap gap-3 md:gap-4">
      {place?.map((places, index) => (
        <div
          key={index}
          className="grid bg-background anim group hover:bg-accent grid-cols-2 grid-rows-1 lg:grid-rows-1 lg:grid-cols-6 gap-4 md:gap-8 font-sans px-6 py-6 md:px-8 w-full border rounded-xl"
        >
          <div className="flex flex-col gap-y-2 lg:gap-y-4 md:gap-y-3 col-span-2 lg:col-span-4">
            <Link
              href={`${searchGMaps(`${places?.name} ${places?.location}`)}`}
              className="flex w-fit"
              target="_blank"
            >
              <h2 className="font-medium anim gap-x-1 text-lg text-foreground group-hover:text-accent-foreground leading-tight">
                {places?.name}
                <ArrowUpRight
                  size={14}
                  className="ml-1 text-foreground inline-block group-hover:text-accent-foreground -translate-y-2 group-hover:scale-100 scale-0 anim"
                />
              </h2>
            </Link>
            <code className="text-sm text-muted-foreground">
              {places?.location}
            </code>
          </div>
          <div className="col-span-2 flex items-center gap-4 md:gap-8 w-full justify-between flex-wrap">
            <div className="flex flex-col gap-y-2 lg:gap-y-4 md:gap-y-3 justify-end lg:justify-between w-auto grow">
              <div className="flex items-center">
                {[...Array(places?.rating)].map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-0">
                {places?.hours}
              </p>
            </div>

            <div className="flex flex-col gap-y-2 lg:gap-y-4 md:gap-y-3 justify-end lg:justify-between items-end w-auto grow">
              <div className="flex items-center gap-x-2">
                {places?.wifi && <Wifi size={14} />}
                {places?.smoking && <Cigarette size={14} />}
                {places?.alcohol && <Beer size={14} />}
                {places?.parking && <ParkingCircle size={14} />}
                {places?.accessibility && <Accessibility size={14} />}
              </div>
              <code className="text-sm text-foreground group-hover:text-accent-foreground font-semibold">
                {places?.price}
              </code>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

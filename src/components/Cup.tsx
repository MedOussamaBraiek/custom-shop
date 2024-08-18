/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

const Cup = ({ imgSrc, dark = false, className, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        "relative pointer-eventes-none z-50 overflow-hidden bg-transparent ",
        className
      )}
      {...props}
    >
      <img
        className={`pointer-events-none z-50 select-none  max-w-[400px] `}
        src={dark ? "/cups/black-cup.png" : "/cups/white-cup.png"}
        alt="cup image"
      />

      <div className="absolute z-10 inset-0 ">
        <img
          src={imgSrc}
          className="object-cover  min-w-full min-h-full"
          alt="overlaying"
        />
      </div>
    </div>
  );
};

export default Cup;

"use client";

import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { ProductColor } from "@prisma/client";

const PhonePreview = ({
  croppedImageUrl,
  color,
}: {
  croppedImageUrl: string;
  color: ProductColor;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [renderedDimentions, setRenderedDimentions] = useState({
    height: 0,
    width: 0,
  });

  const handleResize = () => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setRenderedDimentions({
      height,
      width,
    });
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [ref.current]);

  let caseBackgroundColor = "bg-black";
  if (color === "white") caseBackgroundColor = "bg-white";

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          left:
            renderedDimentions.width / 2 -
            renderedDimentions.width / (1216 / 121),
          top: renderedDimentions.height / 6.22,
        }}
      >
        <img
          width={renderedDimentions.width / (3000 / 637)}
          alt="user image"
          src={croppedImageUrl}
          className={cn(
            "phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",
            caseBackgroundColor
          )}
        />
      </div>

      <div className="relative h-full w-full z-40">
        <img
          src="/clearphone.png"
          className="pointer-event-none h-full w-full antialiased rounded-md"
          alt="phone"
        />
      </div>
    </AspectRatio>
  );
};

export default PhonePreview;

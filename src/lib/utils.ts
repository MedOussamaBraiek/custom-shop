import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("en-TN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  
  return `${formatter.format(price)} DT`
}

export function constructMetaData({
  title = "JOCKER-SHOP",
  description = "Create Custom Products",
  image = "/step-3.png",
  icons = "/favicon.ico",
} : {
  title?: string,
  description?: string,
  image?: string,
  icons?: string,
} = {}): Metadata {
  return {
    title, description, openGraph: {
      title, description, images:[{url: image}]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@oussemabraiek"
    },
    icons,
    metadataBase: new URL("https://jocker-shop.vercel.app/")
  }
}
"use client";

import { useEffect, useState } from "react";
import DesignPreview1 from "./DesignPreview1";
import { ProductType, ShirtSize } from "@prisma/client";

interface DesignConfig {
  productType: ProductType;
  color: string;
  size: ShirtSize;
  uploadedImage: string;
  resultImage: string;
  amount: number;
}

const Page = () => {
  const [configuration, setConfiguration] = useState<DesignConfig | null>(null);

  useEffect(() => {
    // Check if we're in the browser (client-side)
    const designConfigString = localStorage.getItem("designConfig");

    if (designConfigString) {
      const designConfig = JSON.parse(designConfigString);
      const { productType, color, size, uploadedImage, resultImage, amount } =
        designConfig;

      if (
        productType &&
        color &&
        size &&
        uploadedImage &&
        resultImage &&
        amount
      ) {
        setConfiguration({
          productType,
          color,
          size,
          uploadedImage,
          resultImage,
          amount,
        });
      }
    }
  }, []);

  if (!configuration) {
    return <p>Loading or invalid configuration...</p>; // Handle the loading or invalid state
  }

  return <DesignPreview1 configuration={configuration} />;
};

export default Page;

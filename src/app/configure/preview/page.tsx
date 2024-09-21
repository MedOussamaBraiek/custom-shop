"use client";

import { useEffect, useState } from "react";
import DesignPreview1 from "./DesignPreview1";

interface DesignConfig {
  productType: string;
  color: string;
  size: string;
  uploadedImage: string;
  finalDesign: string;
  amount: string;
}

const Page = () => {
  const [configuration, setConfiguration] = useState<DesignConfig | null>(null);

  useEffect(() => {
    // Check if we're in the browser (client-side)
    const designConfigString = localStorage.getItem("designConfig");

    if (designConfigString) {
      const designConfig = JSON.parse(designConfigString);
      const { productType, color, size, uploadedImage, finalDesign, amount } =
        designConfig;

      if (
        productType &&
        color &&
        size &&
        uploadedImage &&
        finalDesign &&
        amount
      ) {
        setConfiguration({
          productType,
          color,
          size,
          uploadedImage,
          finalDesign,
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

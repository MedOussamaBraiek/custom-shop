"use client";

import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, FINISHES, SIZES } from "@/validators/option-validator";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoginModal from "@/components/LoginModal";
import Tshirt from "@/components/Tshirt";
import Cup from "@/components/Cup";
import Sac from "@/components/Sac";

const DesignPreview1 = ({
  configuration,
}: {
  configuration: {
    productType: string;
    color: string;
    size: string;
    uploadedImage: string;
    finalDesign: string;
    amount: string;
  };
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { productType, color, size, uploadedImage, finalDesign, amount } =
    configuration;
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => setShowConfetti(true), []);

  console.log(amount);

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  // const { label: modelLabel } = SIZES.options.find(
  //   ({ value }) => value === size
  // )!;

  // let totalPrice = BASE_PRICE;
  // if (material === "polycarbonate")
  //   totalPrice += PRODUCT_PRICES.material.polycarbonate;
  // if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Pleasse try again",
        variant: "destructive",
      });
    },
  });

  // const handleCheckout = () => {
  //   if (user) {
  //     // create payment session
  //     createPaymentSession({ configId: id });
  //   } else {
  //     // need to log in
  //     localStorage.setItem("configurationId", id);
  //     setIsLoginModalOpen(true);
  //   }
  // };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none selected-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center ">
        <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
          <img
            src="/arrow.png"
            className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
          />

          <div className="relative max-h-[500px] h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
            <img
              src={uploadedImage}
              className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
            />
          </div>

          <img className="w-full object-cover" src={finalDesign} />
        </div>

        {/* <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Your {color} {productType.toUpperCase()}
          </h3>

          {size && <p className="mt-3 text-base">Size: {size}</p>}
        </div> */}

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Your {color} {productType.toUpperCase()}
          </h3>

          {size && <p className="mt-3 text-base">Size: {size}</p>}

          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-x-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absoption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 ">
            <div className="bg-gray-50 p-6 sm:rounded-lg m:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">{amount}</p>
                </div>

                {/* {finish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                ) : null}

                {material === "polycarbonate" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                ) : null} */}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-medium text-gray-900">Order total</p>
                  {/* <p className="font-medium text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p> */}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end pb-12">
              <Button
                onClick={() => {}}
                loadingText="loading"
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview1;

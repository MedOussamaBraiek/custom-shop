"use client";

import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, FINISHES, SIZES } from "@/validators/option-validator";
import { Configuration, ProductType, ShirtSize } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./actions";
import { usePathname, useRouter } from "next/navigation";
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
    productType: ProductType;
    color: string;
    size: ShirtSize;
    uploadedImage: string;
    resultImage: string;
    amount: number;
  };
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { productType, color, size, uploadedImage, resultImage, amount } =
    configuration;
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useKindeBrowserClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => setShowConfetti(true), []);

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  const [formData, setFormData] = useState({
    configuration: configuration,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [disable, setDisable] = useState(false);
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      // If user is logged in, proceed to create the configuration and order
      try {
        setDisable(true);

        const response = await createCheckoutSession({
          formData: {
            productType: formData.configuration.productType,
            uploadedImage: formData.configuration.uploadedImage,
            resultImage: formData.configuration.resultImage,
            size: formData.configuration.size,
            color: formData.configuration.color,
            amount: formData.configuration.amount,
            userName: formData.name,
            userEmail: formData.email,
            userPhone: formData.phone,
            userAddress: formData.address,
          },
        });

        if (response.success) {
          localStorage.setItem("orderId", JSON.stringify(response.orderId));
          toast({
            title: "Order Submitted",
            description: `Thank you, ${formData.name}, your order has been placed.`,
            variant: "default",
          });
          router.push(`/thank-you?orderId=${response.orderId}`);
        } else {
          throw new Error("Error creating order");
        }
      } catch (error) {
        toast({
          title: "Order Submission Failed",
          description:
            "There was an issue with submitting your order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDisable(false);
      }
    } else {
      localStorage.setItem("configuration", JSON.stringify(formData));
      setIsLoginModalOpen(true);
    }
    toast({
      title: "Form Submitted",
      description: `Thank you, ${formData.name}, your information has been received.`,
      variant: "default",
    });
  };

  useEffect(() => {
    setShowConfetti(true);

    // Check if configuration exists in localStorage and restore it after login
    const savedConfiguration = localStorage.getItem("configuration");
    if (savedConfiguration && user) {
      const parsedConfig = JSON.parse(savedConfiguration);
      setFormData(parsedConfig);
      localStorage.removeItem("configuration");
    }
  }, [user]);

  const STEPS = [
    {
      name: "Étape 1 : Ajouter une image",
      description: "Choisissez une image pour votre produit",
      url: "/upload",
    },
    {
      name: "Étape 2 : Personnaliser la conception",
      description: "Personnalisez votre produit",
      url: "/design",
    },
    {
      name: "Étape 3 : Résumé",
      description: "Révisez votre conception finale",
      url: "/preview",
    },
  ];

  const pathname = usePathname();

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

      <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
        {STEPS.map((step, i) => {
          const isCurrent = pathname.endsWith(step.url);
          const isCompleted =
            i < STEPS.findIndex((s) => pathname.includes(s.url));

          const imgPath = `/step-${i + 1}.png`;

          return (
            <li key={step.name} className="relative overflow-hidden lg:flex-1">
              <div>
                <span
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                    {
                      "bg-zinc-700": isCurrent,
                      "bg-primary": isCompleted,
                    }
                  )}
                  aria-hidden="true"
                />

                <span
                  className={cn(
                    i !== 0 ? "lg:pl-9" : "",
                    "flex items-center px-6 py-4 text-sm font-medium"
                  )}
                >
                  <span className="flex-shrink-0">
                    <img
                      src={imgPath || "/step-3.png"}
                      className={cn(
                        "flex h-20 w-20 object-contain items-center justify-center",
                        {
                          "border-none": isCompleted,
                          "border-zinc-700": isCurrent,
                        }
                      )}
                    />
                  </span>

                  <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                    <span
                      className={cn("text-sm font-semibold text-zinc-700", {
                        "text-primary": isCompleted,
                        "text-zinc-700": isCurrent,
                      })}
                    >
                      {step.name}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {step.description}
                    </span>
                  </span>
                </span>

                {/* separator */}
                {i !== 0 ? (
                  <div className="absolute inset-0 hidden w-3 lg:block">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 12 82"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0V31L10.5 41L0.5 51V82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-20 flex flex-col items-center ">
        <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
          <img
            src="/arrow.png"
            className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0"
          />

          <div className="relative max-h-[500px] h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
            <img
              src={uploadedImage}
              className="rounded-md object-contain bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full"
            />
          </div>

          <img className="w-full object-cover" src={resultImage} />
        </div>

        <div className="mt-6 sm:col-span-9 md:row-end-1">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">
            Ton {color} {productType.toUpperCase()}
          </h3>

          {size && <p className="mt-3 text-base">Taille: {size}</p>}

          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            En stock et prêt à être expédié
          </div>
        </div>

        <div className="sm:col-span-12 md:col-span-9 text-base sm:w-[60%]  w-[80%]">
          {/* <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-x-6 md:py-10">
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
          </div> */}

          <div className="mt-8 ">
            <div className="bg-gray-50 p-6 sm:rounded-lg m:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Prix ​​de base</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(amount / 100)}
                  </p>
                </div>

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-medium text-gray-900">
                    Total (avec livraison)
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatPrice((amount + 7_00) / 100)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 text-[14px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 text-[14px]"
                  required
                />
              </div>

              <div className="mt-8 flex justify-end pb-12">
                <Button
                  type="submit"
                  className="px-4 sm:px-6 lg:px-8"
                  disabled={disable}
                >
                  Soumettre <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                </Button>
              </div>
            </form>

            {/* <div className="mt-8 flex justify-end pb-12">
              <Button
                onClick={() => {}}
                loadingText="loading"
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview1;

"use client";

import HandleCompnent from "@/components/HandleCompnent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  PRODUCTS,
  SIZES,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, ArrowRight } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator1 = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    size: (typeof SIZES.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
    product: (typeof PRODUCTS.options)[number];
  }>({
    color: COLORS[1],
    size: SIZES.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
    product: PRODUCTS.options[0],
  });

  const [renderedDimentions, setRenderedDimentions] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderedPositions, setRenderedPositions] = useState({
    x: 350,
    y: 0,
  });

  const productRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tshirtRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  const [shirtCanvas, setShirtCanvas] = useState({
    width: 400,
    height: 350,
  });
  const [cupCanvas, setCupCanvas] = useState({
    width: 400,
    height: 220,
  });
  const [sacCanvas, setSacCanvas] = useState({
    width: 380,
    height: 280,
  });

  const offsets = {
    shirt: { left: 280, top: 60 },
    cup: { left: 150, top: 200 },
    sac: { left: 250, top: 150 },
  };

  useEffect(() => {
    const { left: productOffsetLeft, top: productOffsetTop } = offsets[
      options.product.value
    ] || { left: 0, top: 0 };

    const { left: shirtLeft, top: shirtTop } =
      productRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    const { left: containerLeft, top: containerTop } =
      containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };

    const leftOffset = shirtLeft + productOffsetLeft - containerLeft;
    const topOffset = shirtTop - productOffsetTop - containerTop;

    const actualX = renderedPositions.x - leftOffset;
    const actualY = renderedPositions.y - topOffset;

    // Set the initial position and dimensions
    setRenderedPositions({ x: actualX, y: actualY });
    setRenderedDimentions({
      width: imageDimensions.width / 4,
      height: imageDimensions.height / 4,
    });
  }, [options.product, imageDimensions]);

  async function saveConfiguration() {
    try {
      const {
        left: shirtLeft,
        top: shirtTop,
        width,
        height,
      } = productRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const { left: productOffsetLeft, top: productOffsetTop } = offsets[
        options.product.value
      ] || { left: 0, top: 0 };

      const leftOffset = shirtLeft - productOffsetLeft - containerLeft;
      const topOffset = shirtTop - productOffsetTop - containerTop;

      //   const leftOffset = shirtLeft - containerLeft;
      //   const topOffset = shirtTop - containerTop;

      const actualX = renderedPositions.x - leftOffset;
      const actualY = renderedPositions.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimentions.width,
        renderedDimentions.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "customImage.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving yout config, please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const filterProduct = (product: String) => {
    console.log(product);
    if (options.product.value === "shirt") {
      if (options.color.value === "white") {
        return (
          <img
            src={
              options.color.value === "white"
                ? "/tshirts/white-shirt-front.png"
                : "/tshirts/black-shirt-front.png"
            }
            alt="shirt"
            className="relative object-fit max-w-[400px] min-h-[575px]"
          />
        );
      }
    } else if (options.product.value === "cup") {
      if (options.color.value === "white") {
        return (
          <img
            src={
              options.color.value === "white"
                ? "/cups/white-cup.png"
                : "/cups/black-cup.png"
            }
            alt="cup"
            className="relative object-fit max-w-[400px]"
          />
        );
      }
    } else {
      return (
        <img
          src="/sac.png"
          alt="sac"
          className="relative object-fit max-w-[400px]"
        />
      );
    }
  };

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <AspectRatio
          ref={productRef}
          className="pointer-events-none flex items-center justify-center  relative z-50 w-full"
        >
          {filterProduct(options.product.value)}
        </AspectRatio>

        <div
          ref={tshirtRef}
          className={`absolute  border border-dashed border-gray-500
            ${
              options.product.value === "cup"
                ? "mr-24 mt-10"
                : options.product.value === "sac"
                ? "mt-20"
                : ""
            }`}
          style={{
            // width: shirtCanvas.width - 180,
            // height: shirtCanvas.height + 50,
            width:
              options.product.value === "shirt"
                ? shirtCanvas.width - 180
                : options.product.value === "cup"
                ? cupCanvas.width - 130
                : sacCanvas.width - 150,
            height:
              options.product.value === "shirt"
                ? shirtCanvas.height + 50
                : options.product.value === "cup"
                ? cupCanvas.height + 40
                : sacCanvas.height + 10,
          }}
        >
          <Rnd
            bounds="parent"
            size={renderedDimentions}
            position={renderedPositions}
            default={{
              x: 350,
              y: 0,
              width: imageDimensions.width / 4,
              height: imageDimensions.height / 4,
            }}
            onResizeStop={(_, __, ref, ___, { x, y }) => {
              setRenderedDimentions({
                height: parseInt(ref.style.height.slice(0, -2)),
                width: parseInt(ref.style.width.slice(0, -2)),
              });
              setRenderedPositions({ x, y });
            }}
            onDragStop={(_, data) => {
              const { x, y } = data;
              setRenderedPositions({ x, y });
            }}
            className="absolute z-[99] "
            lockAspectRatio
            resizeHandleComponent={{
              bottomRight: <HandleCompnent />,
              bottomLeft: <HandleCompnent />,
              topRight: <HandleCompnent />,
              topLeft: <HandleCompnent />,
            }}
          >
            <div className="relative w-full h-full">
              <NextImage
                src={imageUrl}
                layout="fill"
                alt="uploaded image"
                className="pointer-events-none"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Rnd>
        </div>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1  flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Personnalisez votre produit{" "}
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <Label>Product: {options.product.label}</Label>

            <div className="flex items-center gap-5 my-3">
              <img
                src="/tshirts/white-shirt-front.png"
                alt="shirt"
                className="size-16 object-contain transition-all hover:scale-110 cursor-pointer mr-2"
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Shirt",
                      value: "shirt",
                    },
                  }))
                }
              />
              <img
                src="/cups/white-cup.png"
                alt="shirt"
                className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Cup",
                      value: "cup",
                    },
                  }))
                }
              />
              <img
                src="/sac.png"
                alt="shirt"
                className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Sac",
                      value: "sac",
                    },
                  }))
                }
              />
            </div>

            <Label>Couleur: {options.color.label}</Label>

            {options.product.label === "Shirt" ? (
              <div className="flex span-x-3 mt-3">
                <img
                  src="/tshirts/white-shirt-front.png"
                  alt="shirt"
                  className="size-14 object-contain transition-all hover:scale-110 cursor-pointer mr-2"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      color: {
                        label: "Blanc",
                        value: "white",
                        tw: "white",
                      },
                    }))
                  }
                />
                <img
                  src="/tshirts/black-shirt-front.png"
                  alt="shirt"
                  className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      color: {
                        label: "Noir",
                        value: "black",
                        tw: "black",
                      },
                    }))
                  }
                />
              </div>
            ) : options.product.label === "Cup" ? (
              <div className="flex gap-3 mt-3">
                <img
                  src="/cups/white-cup.png"
                  alt="cup"
                  className="size-14 object-contain transition-all hover:scale-110 cursor-pointer mr-2"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      color: {
                        label: "Blanc",
                        value: "white",
                        tw: "white",
                      },
                    }))
                  }
                />
                <img
                  src="/cups/black-cup.png"
                  alt="cup"
                  className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      color: {
                        label: "Noir",
                        value: "black",
                        tw: "black",
                      },
                    }))
                  }
                />
              </div>
            ) : (
              <img
                src="/sac.png"
                alt="sac"
                className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    color: {
                      label: "Beige",
                      value: "beige",
                      tw: "amber-100",
                    },
                  }))
                }
              />
            )}

            {options.product.value === "shirt" && (
              <div className="relative  mt-4 h-full flex flex-col justify-between">
                <div className="flex flex-col gap-6">
                  <div className="relative flex flex-col gap-3 w-full mt-2">
                    <Label>Taille</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {options.size.label}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {SIZES.options.map((size) => (
                          <DropdownMenuItem
                            key={size.label}
                            className={cn(
                              "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                              {
                                "bg-zinc-100":
                                  size.label === options.size.label,
                              }
                            )}
                            onClick={() =>
                              setOptions((prev) => ({ ...prev, size }))
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                size.label === options.size.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {size.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* {[MATERIALS, FINISHES].map(
                 ({ name, options: selectableOptions }) => (
                   <RadioGroup
                     key={name}
                     value={options[name]}
                     onChange={(val) => {
                       setOptions((prev) => ({ ...prev, [name]: val }));
                     }}
                   >
                     <Label>
                       {name.slice(0, 1).toUpperCase() + name.slice(1)}
                     </Label>
                     <div className="mt-3 space-y-4">
                       {selectableOptions.map((option) => (
                         <RadioGroup.Option
                           key={option.value}
                           value={option}
                           className={({ active, checked }) =>
                             cn(
                               "relative blcok cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                               {
                                 "border-primary": active || checked,
                               }
                             )
                           }
                         >
                           <span className="flex items-center">
                             <span className="flex flex-col text-sm">
                               <RadioGroup.Label
                                 className="font-medium text-gray-900"
                                 as="span"
                               >
                                 {option.label}
                               </RadioGroup.Label>

                               {option.description ? (
                                 <RadioGroup.Description
                                   as="span"
                                   className="text-gray-500"
                                 >
                                   <span className="block sm:inline">
                                     {option.description}
                                   </span>
                                 </RadioGroup.Description>
                               ) : null}
                             </span>
                           </span>

                           <RadioGroup.Description
                             as="span"
                             className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                           >
                             <span className="font-medium text-gray-900">
                               {formatPrice(option.price / 100)}
                             </span>
                           </RadioGroup.Description>
                         </RadioGroup.Option>
                       ))}
                     </div>
                   </RadioGroup>
                 )
               )} */}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-5 w-full g-zinc-200" />
          <div className="w-full h-full justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                isLoading={isPending}
                disabled={isPending}
                loadingText="Saving"
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    size: options.size.value,
                    product: options.product.value,
                  })
                }
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator1;

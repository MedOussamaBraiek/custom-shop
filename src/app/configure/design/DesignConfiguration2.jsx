"use client";

import HandleCompnent from "@/components/HandleCompnent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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

import * as fabric from "fabric";

// interface DesignConfiguratorProps {
//   configId: string;
//   imageUrl: string;
//   imageDimensions: { width: number; height: number };
// }
// interface FabricCanvas extends HTMLCanvasElement {
//   __fabric_initialized?: boolean;
// }

// type ProductType = "shirt" | "cup" | "sac";

// interface DesignArea {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

const DesignConfigurator2 = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [options, setOptions] = useState({
    color: COLORS[1],
    size: SIZES.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
    product: PRODUCTS.options[0],
  });

  // const [selectedImage, setSelectedImage] = (useState < File) | (null > null);

  // const productRef = useRef < HTMLDivElement > null;
  // const containerRef = useRef < HTMLDivElement > null;
  // const tshirtRef = useRef < HTMLDivElement > null;

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

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const filterProduct = () => {
    switch (options.product.value) {
      case "shirt":
        return options.color.value === "white"
          ? "/tshirts/white-shirt-front.png"
          : "/tshirts/black-shirt-front.png";
      case "cup":
        return options.color.value === "white"
          ? "/cups/white-cup.png"
          : "/cups/black-cup.png";
      case "sac":
        return "/sac.png";
      default:
        return null;
    }
  };

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tshirtSize, setTshirtSize] = useState({ width: 400, height: 600 });

  const defaultSizes = {
    shirt: { width: 400, height: 600 },
    cup: { width: 400, height: 320 },
    sac: { width: 320, height: 500 },
  };

  const [backgroundImage, setBackgroundImage] = useState(
    "/tshirts/white-shirt-front.png"
  );
  const [uploadedImage, setUploadedImage] = useState(null);

  const designAreas = {
    shirt: { x: 100, y: 120, width: 200, height: 380 },
    cup: { x: -60, y: 10, width: 320, height: 290 },
    sac: { x: -5, y: 50, width: 270, height: 450 },
  };

  const [productType, setProductType] = useState("shirt");
  const [designArea, setDesignArea] = useState(designAreas[productType]);

  useEffect(() => {
    // Set product designArea and size based on productType
    setTshirtSize(defaultSizes[productType]);
    setDesignArea(designAreas[productType]);
  }, [productType]);

  const handleProductChange = (newProductType) => {
    setProductType(newProductType);
  };

  useEffect(() => {
    const newBackgroundImage = filterProduct(); // Function to get the background image URL
    if (newBackgroundImage) {
      setBackgroundImage(newBackgroundImage);
      loadBackgroundImage(newBackgroundImage, productType);
    }
  }, [productType, options]);

  const loadBackgroundImage = (urlImg, productType) => {
    if (!canvas) return;

    fabric.Image.fromURL(
      urlImg,
      (imgElement) => {
        const image = new fabric.Image(imgElement);
        if (image) {
          const { x, y, width, height } = designAreas[productType];
          canvas.backgroundImage = image;
          image.set({
            left: x,
            top: y,
            scaleX: width / image.width,
            scaleY: height / image.height,
          });
          canvas.renderAll();
        } else {
          console.error("Failed to load product image.");
        }
      },
      { crossOrigin: "anonymous" }
    );
  };

  useEffect(() => {
    if (
      !canvas &&
      canvasRef.current &&
      !canvasRef.current.__fabric_initialized
    ) {
      const newCanvas = new fabric.Canvas(canvasRef.current);
      canvasRef.current.__fabric_initialized = true;
      setCanvas(newCanvas);

      const urlImg = filterProduct();
      if (urlImg) {
        loadBackgroundImage(urlImg, productType);
      }
    }

    // Cleanup function
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvasRef.current]);

  const currentImageRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const predefinedImages = [
    "/galery/monastir.png",
    "/galery/tunisia.png",
    "/galery/tunisian.png",
    "/galery/one-piece-wanted.jpg",
    "/galery/marvel.png",
    "/galery/shield.png",
    "/galery/shield2.png",
    "/galery/love.png",
    "/galery/golden.png",
    "/galery/girl.png",
    "/galery/girl2.png",
    "/galery/flash.png",
    "/galery/boss1.png",
    "/galery/boss2.png",
    "/galery/boss3.png",
    "/galery/battman.png",
    "/galery/avengers.png",
    "/galery/boom.png",
    "/galery/controle.png",
    "/galery/deadpool.png",
    "/galery/deadpool2.png",
    "/galery/deadpool3.png",
    "/galery/hulk.png",
  ];

  const handleAddImage = (e) => {
    if (!canvas || !e.target.files?.length) return;

    const imgObj = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgElement = document.createElement("img");

      // Handle the possibility that result might be null
      if (event.target?.result && typeof event.target.result === "string") {
        imgElement.src = event.target.result;
        setUploadedImage(event.target.result);

        imgElement.onload = () => {
          const image = new fabric.Image(imgElement);

          // Set image size and position to fit within the design area
          const ratio = Math.min(
            designArea.width / imgElement.width,
            designArea.height / imgElement.height
          );
          image.scale(ratio);

          // Center image within the design area
          image.set({
            left: (designArea.width - image.getScaledWidth()) / 2,
            top: (designArea.height - image.getScaledHeight()) / 2,
          });

          if (currentImageRef.current) {
            canvas.remove(currentImageRef.current);
          }

          canvas.add(image);
          currentImageRef.current = image;
          canvas.renderAll();
        };
      } else {
        console.error("Failed to load image data.");
      }
    };

    reader.readAsDataURL(imgObj);
  };

  const handlePredefinedImageClick = (imageSrc) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageSrc;

    imgElement.onload = () => {
      const image = new fabric.Image(imgElement);

      const ratio = Math.min(
        designArea.width / imgElement.width,
        designArea.height / imgElement.height
      );
      image.scale(ratio);

      image.set({
        left: (designArea.width - image.getScaledWidth()) / 2,
        top: (designArea.height - image.getScaledHeight()) / 2,
      });

      if (currentImageRef.current) {
        canvas.remove(currentImageRef.current);
      }

      setUploadedImage(imageSrc);

      canvas.add(image);
      currentImageRef.current = image;
      canvas.renderAll();
    };
  };

  const [selectedColor, setSelectedColor] = useState(options.color.value);
  const [selectedSize, setSelectedSize] = useState("");

  // Capture changes when user selects a product or color
  useEffect(() => {
    setSelectedColor(options.color.value);
    setSelectedSize(options.size.label);
  }, [options.color.value, options.size.label]);

  const [disableButton, setDisableButton] = useState(false);
  const handleSaveDesign = () => {
    if (!canvas) return;

    try {
      setDisableButton(true);
      const offscreenCanvas = document.createElement("canvas");
      const context = offscreenCanvas.getContext("2d");

      if (!context) {
        throw new Error("Failed to get canvas context.");
      }

      offscreenCanvas.width = tshirtSize.width;
      offscreenCanvas.height = tshirtSize.height;

      const tshirtImage = new Image();
      tshirtImage.src = backgroundImage;

      tshirtImage.onload = () => {
        context.drawImage(
          tshirtImage,
          0,
          0,
          tshirtSize.width,
          tshirtSize.height
        );

        // Get the CSS properties
        const paddingTop = productType === "sac" ? 100 : 0;
        const justifyContent = productType === "cup" ? "flex-start" : "center";

        // Calculate alignment
        const alignX =
          justifyContent === "flex-start"
            ? 0
            : (tshirtSize.width - canvas.width) / 2;
        const alignY = paddingTop;

        const fabricDataUrl = canvas.toDataURL({
          format: "png",
          quality: 1.0,
          multiplier: 1,
        });

        const fabricImage = new Image();
        fabricImage.src = fabricDataUrl;

        fabricImage.onload = () => {
          context.drawImage(
            fabricImage,
            (tshirtSize.width - canvas.width) / 2,
            (tshirtSize.height - canvas.height) / 2,
            canvas.width,
            canvas.height
          );

          const finalDataUrl = offscreenCanvas.toDataURL("image/png");

          // const link = document.createElement("a");
          // link.href = finalDataUrl;
          // link.download = "tshirt_design.png";
          // link.click();

          // Save all the config
          const designConfig = {
            productType,
            color: selectedColor,
            size: selectedSize,
            uploadedImage: uploadedImage,
            resultImage: finalDataUrl,
            amount:
              productType === "shirt"
                ? 30_00
                : productType === "cup"
                ? 15_00
                : productType === "sac"
                ? 20_00
                : formatPrice(0),
          };

          localStorage.setItem("designConfig", JSON.stringify(designConfig));
          router.push("/configure/preview");
        };
      };
    } catch (err) {
      toast({
        title: "Error",
        description: "There was an issue saving your design.",
        variant: "destructive",
      });
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (!canvas || !canvasRef.current) return;

    try {
      const { width, height, x, y } = designArea;

      if (width <= 0 || height <= 0) {
        throw new Error("Invalid design area dimensions.");
      }

      // Set canvas width and height based on design area
      canvas.setWidth(width);
      canvas.setHeight(height);

      const canvasEl = canvasRef.current;
      if (canvasEl) {
        canvasEl.style.width = `${width}px`;
        canvasEl.style.height = `${height}px`;
        canvasEl.style.top = `${y}px`;
        canvasEl.style.left = `${x}px`;
      }

      canvas.renderAll();
    } catch (error) {
      console.error("Error updating canvas dimensions:", error);
    }
  }, [designArea, canvas]);

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div className="relative h-[37.5rem] overflow-hidden  w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:col-span-2 col-span-full">
        {/* <TShirtDesigner /> */}
        <div
          style={{
            position: "relative",
            width: `${tshirtSize.width}px`,
            height: `${tshirtSize.height}px`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${backgroundImage})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // display: "flex",
            // justifyContent: `${productType == "cup" ? "flex-start" : "center"}`,
            // alignItems: "center",
            // paddingTop: `${productType == "sac" ? "100px" : "0"}`,
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              border: `1px dotted gray`,
            }}
          ></canvas>
        </div>

        {options.product.value == "shirt" && (
          <div className="absolute top-2 flex w-full justify-center gap-6">
            <button
              style={{ backgroundColor: "#16A34A" }}
              className="bg-[#16A34A] text-white rounded-md px-2 py-0.5"
              onClick={() => {
                setBackgroundImage(
                  `/tshirts/${options.color.value}-shirt-front.png`
                );
              }}
            >
              Face avant
            </button>
            <button
              style={{ backgroundColor: "#16A34A" }}
              className="bg-[#16A34A] text-white rounded-md px-2 py-0.5"
              onClick={() => {
                setBackgroundImage(
                  `/tshirts/${options.color.value}-shirt-back.png`
                );
              }}
            >
              Face arrière
            </button>
          </div>
        )}
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

            <div
              className="flex flex-col gap-3 mb-5"
              style={{ marginBottom: "10px" }}
            >
              <Label>Image: </Label>
              <div className="flex items-center gap-3">
                <div className="custom-file-input ">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleAddImage}
                    hidden
                  />
                  <label
                    htmlFor="file-upload"
                    className="file-label cursor-pointer "
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "8px",
                    }}
                  >
                    Entrer une image <span className="icon">📁</span>
                  </label>
                </div>

                <button
                  style={{
                    backgroundColor: "#16a34a",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "8px",
                    maxWidth: "181px",
                  }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="bg-blue-500 text-white rounded"
                >
                  Galerie
                </button>
              </div>
            </div>

            {menuOpen && (
              <div
                className="absolute bg-white border border-gray-300 shadow-lg mt-1 p-1 max-h-[300px] overflow-y-auto"
                style={{
                  maxHeight: "300px",
                  maxWidth: "80%",
                  overflowY: "auto",
                  zIndex: "10000",
                }}
              >
                <ul
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                  className=" gap-5"
                >
                  {predefinedImages.map((src, index) => (
                    <li key={index} className="my-2 border border-gray-300">
                      <img
                        src={src}
                        alt={`Predefined ${index}`}
                        className="w-20 h-20 object-cover cursor-pointer"
                        onClick={() => {
                          handlePredefinedImageClick(src);
                          setMenuOpen(false);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Label>Produit: {options.product.label}</Label>

            <div className="flex items-center gap-5 my-3">
              <img
                src="/tshirts/white-shirt-front.png"
                alt="shirt"
                className="size-16 object-contain transition-all hover:scale-110 cursor-pointer mr-2"
                onClick={() => {
                  handleProductChange("shirt");
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Shirt",
                      value: "shirt",
                    },
                  }));
                }}
              />
              <img
                src="/cups/white-cup.png"
                alt="cup"
                className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                onClick={() => {
                  handleProductChange("cup");
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Cup",
                      value: "cup",
                    },
                  }));
                }}
              />
              <img
                src="/sac.png"
                alt="sac"
                className="size-14 object-contain transition-all hover:scale-110 cursor-pointer"
                onClick={() => {
                  handleProductChange("sac");
                  setOptions((prev) => ({
                    ...prev,
                    product: {
                      label: "Sac",
                      value: "sac",
                    },
                  }));
                }}
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
                {productType === "shirt"
                  ? formatPrice(30_00 / 100)
                  : productType === "cup"
                  ? formatPrice(15_00 / 100)
                  : formatPrice(20_00 / 100)}
              </p>
              <Button
                // isLoading={isPending}
                // disabled={isPending}
                loadingText="Saving"
                onClick={() => handleSaveDesign()}
                size="sm"
                className="w-full"
                disabled={disableButton}
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

export default DesignConfigurator2;

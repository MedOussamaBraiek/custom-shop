"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <MaxWidthWrapper className="flex-1 flex flex-col items-center w-full">
      {children}
    </MaxWidthWrapper>
  );
};

export default Layout;

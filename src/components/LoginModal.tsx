import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className=" z-[99999999] top-[50%] left-[50%] max-w-[520px] w-[90%]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            <Image
              src="/snake-1.png"
              fill
              alt="snake"
              className="object-contain"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Login to to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">
              Your configuration was ssaved!
            </span>{" "}
            Pleae login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

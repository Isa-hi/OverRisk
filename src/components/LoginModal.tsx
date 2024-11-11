import type { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";

type LoginModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
export default function LoginModal({ isOpen, setIsOpen }: LoginModalProps) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto size-24 mb-2">
            <Image
              fill
              src="/overrisk-logo.png"
              alt="Logo"
              className=" object-contain"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900" >Inicia sesión para continuar</DialogTitle>
          <DialogDescription className="text-center text-base py-2">
            <span className="text-zinc-900">
                ¡Tu configuración se ha guardado! 
            </span>{' '}
            Por favor, inicia sesión para continuar con tu pedido.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
            <LoginLink className={buttonVariants({variant: 'outline'})}>Iniciar sesión</LoginLink>
            <RegisterLink className={buttonVariants({variant: 'default'})}>Registrarse</RegisterLink>
        </div>

      </DialogContent>
    </Dialog>
  );
}

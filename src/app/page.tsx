import ItemList from "@/components/landing-page/ItemList";
import UserImageCircle from "@/components/landing-page/UserImageCircle";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section className="text-center">
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolue w-28 left-0 -top-20 hidden lg:block">
                <img
                  src="/overrisk-logo.png"
                  alt="Logo de OverRisk"
                  className="w-full"
                />
              </div>
              <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                La mejor{" "}
                <span className="bg-orange-600 text-white px-2">
                  ropa darkwork
                </span>{" "}
                en México
              </h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                <span className="font-semibold">
                  Toma el riesgo de ser tú mismo
                </span>{" "}
                con nuestra ropa darkwork. Encuentra las mejores prendas para tu
                estilo en OverRisk.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2 ">
                  <ItemList text="Material de alta calidad y durabilidad" />
                  <ItemList text="Diseños personalizados y exclusivos" />
                  <ItemList text="Envíos a todo México" />
                </div>
              </ul>

              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-4">
                  <UserImageCircle user="user-1.png" />
                  <UserImageCircle user="user-2.png" />
                  <UserImageCircle user="user-3.png" />
                  <UserImageCircle user="user-4.png" />
                  <UserImageCircle user="user-5.png" />
                </div>

                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="size-6 text-amber-500 fill-amber-500" />
                    <Star className="size-6 text-amber-500 fill-amber-500" />
                    <Star className="size-6 text-amber-500 fill-amber-500" />
                    <Star className="size-6 text-amber-500 fill-amber-500" />
                    <Star className="size-6 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-sm">
                    4.9/5 en base a{" "}
                    <span className="font-semibold">+100 reseñas</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-xl">
              <img
                src="/darkwork-clothes.png"
                alt="Ropa Darkwork"
                className="absolue w-96 lg:w-96 left-56 -top-20 select-none hidden sm:block lg:hidden xl:block"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}

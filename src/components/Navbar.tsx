import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight, ShoppingCartIcon } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    const isUserInDB = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!isUserInDB) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.family_name,
          email: user.email!,
        },
      });
    }
  }
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-orange-200 bg-white/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-orange-200">
          <Link href="/" className="flex z-40 font-semibold">
            Over<span className="text-orange-600">Risk</span>
          </Link>

          <div className="h-full flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Cerrar sesión
                </Link>
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard ✨
                  </Link>
                )}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Crear diseño
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Registrarse
                </Link>
                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Iniciar sesión
                </Link>

                <div className="w-px h-8 bg-orange-200 hidden sm:block" />

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Crear diseño
                  <ArrowRight className="ml-1.5 size-5" />
                </Link>

                <Link
                  href="/shopping-cart"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1 !bg-black",
                  })}
                >
                  <ShoppingCartIcon className="size-16" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

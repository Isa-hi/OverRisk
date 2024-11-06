import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const user = undefined;
  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-orange-200 bg-white/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-orange-200">
            <Link href='/' className="flex z-40 font-semibold">
            Over<span className="text-orange-600">Risk</span>
            </Link>

            <div className="h-full flex items-center space-x-4">
                {user ? (
                    <>
                        <Link href='/api/auth/logout' className={''}></Link>
                    </>
                ) : (
                    <div></div>
                )}
            </div>

        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

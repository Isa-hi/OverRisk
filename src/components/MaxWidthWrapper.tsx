import { cn } from "@/lib/utils";

type MaxWidthWrapperProps = {
    className?: string;
    children: React.ReactNode;
};
export default function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div className={cn("h-full mx-auto max-w-screen-xl w-full px-2.5 md:px-20", className)}>
        {children}
    </div>
  )
}

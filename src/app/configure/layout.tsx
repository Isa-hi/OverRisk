import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      {children}
    </MaxWidthWrapper>
  );
}

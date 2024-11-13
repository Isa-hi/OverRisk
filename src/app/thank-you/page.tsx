import { Suspense } from "react";
import ThankYou from "./ThankYou";

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ThankYou />
      </Suspense>
    </>
  );
}
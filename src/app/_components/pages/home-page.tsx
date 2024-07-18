"use client";

import { useRouter } from "next/navigation";

import { useCounterStore } from "~/providers/counter-store-provider";
import { useAuthStore } from "~/providers/auth-store-provider";

export const HomePage = () => {
  const router = useRouter();

  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  );

  const { isAuthenticated } = useAuthStore((state) => state);

  if (!isAuthenticated) {
    router.push("/signup");
  }

  return (
    <div>
      Count: {count}
      <hr />
      <button type="button" onClick={() => void incrementCount()}>
        Increment Count
      </button>
      <button type="button" onClick={() => void decrementCount()}>
        Decrement Count
      </button>
    </div>
  );
};

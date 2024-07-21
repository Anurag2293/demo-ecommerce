"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "~/providers/auth-store-provider";
import { useToast } from "~/components/ui/use-toast";

export function Toolbar() {
  const router = useRouter();
  const { name, isAuthenticated, updateAuthState } = useAuthStore((state) => state);
  const { toast } = useToast();

  // const utils = api.useUtils();

  const handleLogout = async () => {
    localStorage.clear();

    updateAuthState({
      userId: -1,
      email: "",
      name: "",
      otp: "",
      isVerified: false,
      isAuthenticated: false,
    })

    toast({
      // title: "Welcome to ECOMMERCE!",
      description: "Logged out successfully!",
    });

    router.push("/login");
  };

  return (
    <div className="flex justify-end gap-x-5 px-10 py-3">
      <p className="h-3 text-xs font-normal">Help</p>
      <p className="h-3 text-xs font-normal">{"Orders & Returns"}</p>
      <p className="h-3 text-xs font-normal">
        Hi, {isAuthenticated ? name : "John"}
      </p>
      {isAuthenticated && (
        <p
          onClick={handleLogout}
          className="h-3 cursor-pointer text-xs font-normal"
        >
          Logout
        </p>
      )}
    </div>
  );
}

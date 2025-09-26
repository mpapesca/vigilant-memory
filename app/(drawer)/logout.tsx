import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // This screen shouldn't be rendered, just redirect
    router.replace("../login");
  }, [router]);

  return null;
}

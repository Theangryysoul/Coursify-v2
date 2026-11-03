import type { Metadata } from "next";

import RegisterPage from "@/views/auth/RegisterPage";

export const metadata: Metadata = {
  title: "Create account",
};

export default function Page() {
  return <RegisterPage />;
}

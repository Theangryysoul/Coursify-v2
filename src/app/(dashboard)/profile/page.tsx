import type { Metadata } from "next";

import ProfilePage from "@/views/profile/ProfilePage";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfilePage />;
}

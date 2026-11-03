import type { Metadata } from "next";

import ImportPage from "@/views/import/ImportPage";

export const metadata: Metadata = {
  title: "Import course",
};

export default function Page() {
  return <ImportPage />;
}

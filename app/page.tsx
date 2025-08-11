import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to main page when accessing localhost:3000
  redirect("/main");
}

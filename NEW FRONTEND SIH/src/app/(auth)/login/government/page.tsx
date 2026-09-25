import { redirect } from "next/navigation";

export default function GovernmentLoginRedirect() {
  redirect("/official-login");
}

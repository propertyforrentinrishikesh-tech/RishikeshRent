import HostelRegistration from "@/components/PartnerFront/HostelRegistration";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decode } from "next-auth/jwt";

export default async function PropertyRegistrationPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("partner_registration_token")?.value;

  if (!tokenCookie) {
    redirect("/partner/register");
  }

  let initialData = {};
  try {
    const decoded = await decode({ token: tokenCookie, secret: process.env.NEXTAUTH_SECRET });
    if (decoded) {
      initialData = {
        email: decoded.email || "",
        propertyName: decoded.propertyName || "",
        contactNumber: decoded.contactNumber || "",
      };
    }
  } catch (err) {
    console.error("Failed to decode token", err);
  }

  return <HostelRegistration initialData={initialData} />;
}


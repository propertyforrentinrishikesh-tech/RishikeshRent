import "./globals.css";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SearchProvider } from "@/context/SearchContext";
import OverlayButton from "@/components/OverlayButton";
import GoogleTranslate from "@/components/GoogleTranslate";
import { MenuProvider } from "@/context/MenuProvider";


export const metadata = {
  metadataBase: new URL("https://rishikeshrent.com/"),
  title: {
    default: "Rishikesh Rent is a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences.",
    template: "%s | Rishikesh Rent",
  },
  description:
    "We provide a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences. Whether you're looking for cozy apartments, spacious villas, or serene cottages with a view of the Ganges, we have something for everyone. Our rental options are ideal for short-term stays, long-term living, or even for those seeking a peaceful retreat in this spiritual hub. With flexible leasing options and prime locations across Rishikesh, we ensure you find the perfect place that suits your lifestyle and budget.",
  keywords:
    "Rishikesh Rent, Properties for rent in Rishikesh, Cozy apartments, Spacious villas, Serene cottages, Ganges view, Flexible leasing options, Prime locations, Spiritual hub, Rishikesh, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Rishikesh Rent is a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences.",
    description:
      "Rishikesh Rent is a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences.",
    images: ["/logo.png"],
    url: "https://rishikeshrent.com/",
    site_name: "Rishikesh Rent",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishikesh Rent is a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences.",
    description:"We provide a wide range of properties for rent in the beautiful city of Rishikesh, catering to various needs and preferences. Whether you're looking for cozy apartments, spacious villas, or serene cottages with a view of the Ganges, we have something for everyone. Our rental options are ideal for short-term stays, long-term living, or even for those seeking a peaceful retreat in this spiritual hub. With flexible leasing options and prime locations across Rishikesh, we ensure you find the perfect place that suits your lifestyle and budget.",
    images: ["/logo.png"],
  },
  other: {
    "author": "Rishikesh Rent",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
  },
};
export const revalidate = 3600;

async function getMenuItems() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getMenuCategories`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("MenuItems Fetch Error:", error);
    return [];
  }
}
import { CartProvider } from "../context/CartContext";
// import CartSyncOnLogin from "../context/CartSyncOnLogin";

export default async function RootLayout({ children }) {
  const isPaid = process.env.NEXT_PUBLIC_IS_PAID === "true";
  const menuItems = await getMenuItems();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-gilda`}>
        {isPaid ? (
          <CartProvider>
            <NextTopLoader color="#006eff" height={3} showSpinner={false} zIndex={1600} />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2500, style: { fontFamily: "var(--font-GildaDisplay)" } }} />
            <SessionWrapper>
              {/* <CartSyncOnLogin /> */}
              <SearchProvider>
                 <MenuProvider menuItems={menuItems}>
                  <Header menuItems={menuItems} />
                {/* <GoogleTranslate /> */}
                <main>
                  <OverlayButton />
                  {children}
                </main>
                <Footer />
                </MenuProvider>
              </SearchProvider>
            </SessionWrapper>
          </CartProvider>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black text-center">
              Payment Pending. Please Contact Admin.
            </h1>
          </div>
        )}
      </body>
    </html>
  );
}

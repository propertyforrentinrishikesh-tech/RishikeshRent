"use client"
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import TopAdvertisementMarquee from "./TopAdvertisementMarquee";
import { ChevronDown, Headphones, LogOutIcon, Mail, Mic2, Phone, Truck, User2Icon } from "lucide-react"
import Link from "next/link"
import MenuBar from "./MenuBar"
import { Button } from "./ui/button"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import LanguageSelector from "./LanguageSelector"
import SearchBar from "./SearchBar"
import Cart from "./Cart";
import { ShoppingCart, Heart, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import ResponsiveNavbar from "./ResponsiveNavbar";
const Header = ({ menuItems, companyBasicInfo = null }) => {
  // console.log("menuItems", menuItems)
  const authDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const pathName = usePathname();
  const hideNavigation =
    pathName.includes("admin") ||
    pathName.includes("vendor/login") ||
    pathName.includes("page") ||
    pathName.includes("sign-up") ||
    pathName.includes("sign-in") ||
    pathName.includes("customEnquiry");
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasMenuData, setHasMenuData] = useState(false);

  const [navbarSections, setNavbarSections] = useState([]);
  const companyName = companyBasicInfo?.companyName || 'Kag Premium Homes';
  const desktopLogoSrc = companyBasicInfo?.mainLogo?.url || companyBasicInfo?.footerLogo?.url || '/image.png';
  const mobileLogoSrc = companyBasicInfo?.mobileUiLogo?.url || companyBasicInfo?.mainLogo?.url || '/HeaderLogo.png';

  const loadNavbarSections = async () => {
    try {
      const response = await fetch("/api/navbar-sections");
      const data = await response.json();
      setNavbarSections(Array.isArray(data) ? data : []);
    } catch (error) {
      setNavbarSections([]);
    }
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close auth dropdown if open and click is outside
      if (isAuthDropdownOpen && authDropdownRef.current && !authDropdownRef.current.contains(e.target)) {
        // Check if the click is not on the profile menu
        if (!profileMenuRef.current || !profileMenuRef.current.contains(e.target)) {
          setIsAuthDropdownOpen(false);
        }
      }

      // Close profile menu if open and click is outside
      if (isProfileOpen && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        // Check if the click is not on the auth dropdown
        if (!authDropdownRef.current || !authDropdownRef.current.contains(e.target)) {
          setIsProfileOpen(false);
        }
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isAuthDropdownOpen, isProfileOpen]);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    loadNavbarSections();

    const handleNavbarSectionsUpdated = () => {
      loadNavbarSections();
    };

    window.addEventListener("navbarSectionsUpdated", handleNavbarSectionsUpdated);

    return () => {
      window.removeEventListener("navbarSectionsUpdated", handleNavbarSectionsUpdated);
    };
  }, []);

  // useEffect(() => {
  //   fetch("/api/getAllMenuItems")
  //     .then(res => res.json())
  //     .then(data => setMenuItems(data));
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowHeader(true);
      } else if (window.scrollY > lastScrollY) {
        setShowHeader(false); // scrolling down
      } else {
        setShowHeader(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Only render header after mount to avoid hydration mismatch
  if (!isMounted) return null;

  const isUser = session && !session.user.isAdmin;

  return (
    <>
      <header
        className={`print:hidden ${pathName.includes("admin") ||
          pathName.includes("page") ||
          pathName.includes("sign-up") ||
          pathName.includes("sign-in") ||
          pathName.includes("customEnquiry")

          ? "hidden"
          : "block"
          } border-b font-barlow tracking-wider w-full bg-white text-black`}
      >
        <div className="hidden md:flex items-start">
          <TopAdvertisementMarquee />
          {/* Login/Cart section on the right */}
          <div className="flex items-center justify-center gap-3 bg-orange-500 w-[18%] px-5 py-[4px]">
            {/* <div className="flex items-center gap-3">
              <Link href="/partner/login"
                className="text-white text-sm hover:underline hover:scale-105 text-nowrap transition-all duration-300"
              >
                Property Extranet
              </Link>
            </div> */}
            {/* <div className="w-px h-6 bg-black"></div> */}
            <div className="flex items-center gap-2">
              <Link href="#" className="flex items-center gap-1.5 hover:scale-105 hover:underline text-sm text-white px-2 rounded-md transition-colors">
                <Headphones size={16} />
                Support
              </Link>
            </div>
            <div className="w-px h-6 bg-black"></div>
            <div className="relative" ref={profileMenuRef}>
              {status === "loading" ? (
                <Loader2 className="animate-spin text-blue-600" size={30} />
              ) : isUser ? (
                <>
                  {/* Profile Picture Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="focus:outline-none border-dashed border-4 border-blue-600 rounded-full"
                  >
                    <Image
                      src={session.user.image || "/user.png"}
                      alt="Profile"
                      width={44}
                      height={44}
                      className="rounded-full cursor-pointer"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute top-14 mt-2 w-fit text-black bg-white shadow-lg rounded-lg border z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="px-4 pt-2 text-sm font-bold text-gray-700">
                        {session.user.name}
                      </p>
                      <p className="px-4 pb-2 text-sm text-gray-700">
                        {session.user.email}
                      </p>
                      <div className="h-px bg-gray-200" />
                      {/* <Link
                          href="/dashboard"
                          className="flex items-center rounded-lg w-full text-left px-4 py-2 hover:bg-blue-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User2Icon size={20} className="mr-2" /> Dashboard
                        </Link> */}
                      <button
                        className="flex items-center rounded-lg w-full text-red-600 text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => signOut()}
                      >
                        <LogOutIcon size={20} className="mr-2" /> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative" ref={authDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAuthDropdownOpen(!isAuthDropdownOpen);
                    }}
                    className="flex gap-2 items-center rounded-md px-2 transition-colors hover:scale-105 hover:underline text-white"
                  >
                    <User className="" size={20} />
                    <h2 className="text-sm ">Login</h2>
                  </button>
                  <AnimatePresence>
                    {isAuthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-8 -right-5 w-[150px] text-black bg-white shadow-lg rounded-lg border z-[9999]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href="/sign-in"
                          onClick={() => setIsAuthDropdownOpen(false)}
                          className="block px-2 py-2 hover:bg-gray-300 text-sm"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/sign-up"
                          onClick={() => setIsAuthDropdownOpen(false)}
                          className="block px-2 py-2 hover:bg-gray-300 text-sm border-t border-gray-300"
                        >
                          Create Account
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:flex hidden items-center justify-between gap-4 border-b border-gray-400 ">
          <div className="flex flex-row justify-between w-full items-center">
            {/* Logo on the left */}
            <div className="flex item-start gap-2">
              <Link href={"/"}>
                <Image
                  className="h-20 w-full object-contain"
                  src={desktopLogoSrc}
                  alt={companyName}
                  width={240}
                  height={80}
                  priority
                />
              </Link>

              {/* <div className="w-[1px] bg-black h-18"></div> */}
              <div className="flex item-center gap-2 justify-center">
                <Link href="/partner/register"
                  className="flex items-center gap-2"
                >
                  <div>
                    <img src="/Hotel.png" className="w-12 object-contain" alt="" />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-yellow-700 text-sm">List Your Property</p>
                    <p className="text-black text-sm">Hostels & Rental</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className={`relative hidden lg:flex flex-1 justify-center px-2 
            print:hidden ${hideNavigation ? "hidden" : "block"}`}>
              {!hideNavigation && <ResponsiveNavbar sections={navbarSections} />}
            </div>
          </div>
        </div>
      </header>
      {/* Show only on md and larger screens, and only if not in admin section */}
      {/* Show only on md and larger screens, and only if not in admin section */}
      {hideNavigation || (
        <div className="hidden md:block sticky top-0 z-60" style={{ display: hasMenuData ? undefined : 'none' }}>
          <div className="w-full print:hidden">
            <div
              className={`bg-white py-2 border-b border-gray-200 transition-all duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
                }`}
            >
              <div className="container mx-auto px-4">
                <MenuBar menuItems={menuItems} navbarSections={navbarSections} onDataChange={setHasMenuData} />
              </div>
            </div>
          </div>
        </div>
      )}
      {!hideNavigation &&
        <div className="lg:hidden flex items-center justify-between md:justify-between py-1 px-2 h-16 bg-[#0f172a]">
          <div className="relative flex items-center">
            {/* <MenuBar menuItems={menuItems.filter(item => item.active)} /> */}
            <MenuBar menuItems={menuItems} navbarSections={navbarSections} />
          </div>
          <Link href={"/"}>
            <Image
              className="w-[150px] object-contain"
              src={mobileLogoSrc}
              alt={companyName}
              width={150}
              height={75}
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              {status === "loading" ? (
                <Loader2 className="animate-spin text-white" size={36} />
              ) : isUser ? (
                <>
                  {/* Profile Picture Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="focus:outline-none border-dashed border-4 border-blue-600 rounded-full"
                  >
                    <Image
                      src={session.user.image || "/user.png"}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="rounded-full cursor-pointer"
                    />
                  </button>
                  <SearchBar />

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute top-14 right-0 mt-2 w-fit text-black bg-white shadow-lg rounded-lg border z-100">
                      <p className="px-4 pt-2 text-sm font-bold text-gray-700">{session.user.name}</p>
                      <p className="px-4 pb-2 text-sm text-gray-700">{session.user.email}</p>
                      <div className="h-px bg-gray-200" />
                      <Link
                        href="/dashboard?section=orders"
                        className="flex items-center rounded-lg w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User2Icon size={20} className="mr-2" /> Dashboard
                      </Link>
                      {/* <Link
                        href={`/account/${session.user.id}`}
                        className="flex items-center rounded-lg w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User2Icon size={20} className="mr-2" /> My Account
                      </Link> */}
                      <button
                        className="flex items-center rounded-lg w-full text-red-600 text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => signOut()}
                      >
                        <LogOutIcon size={20} className="mr-2" /> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative" ref={authDropdownRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAuthDropdownOpen(!isAuthDropdownOpen);
                    }}
                    className="flex items-center px-4 py-2"
                  >
                    <User className="ml-2 text-white" size={20} />
                  </button>
                  {isAuthDropdownOpen && (
                    <div
                      className="absolute top-10 right-0 mt-2 w-48 text-black bg-white shadow-lg rounded-lg border z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href="/sign-in"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAuthDropdownOpen(false);
                        }}
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAuthDropdownOpen(false);
                        }}
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      }
    </>
  )
}

export default Header

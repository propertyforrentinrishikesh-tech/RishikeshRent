"use client"
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import TopAdvertisementMarquee from "./TopAdvertisementMarquee";
import { ChevronDown, LogOutIcon, Mail, Phone, Truck, User2Icon } from "lucide-react"
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
import { useCart } from "../context/CartContext";
import { ArrowDown, Menu, X } from "lucide-react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
const Header = () => {
  const authDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [initialCartTab, setInitialCartTab] = useState('cart');
  const { data: session, status } = useSession();
  const { cart = [], wishlist = [] } = useCart();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openFixedMenu, setOpenFixedMenu] = useState(null);
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
    fetch("/api/getAllMenuItems")
      .then(res => res.json())
      .then(data => setMenuItems(data));
  }, []);

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
          } border-b font-barlow tracking-wider w-full bg-black text-white`}
      >
        <div className="hidden md:flex items-center">

          <TopAdvertisementMarquee />
          {/* Login/Cart section on the right */}
          <div className="flex items-center justify-center gap-3 bg-orange-500 w-[30%] px-5 py-[4px]">
            <div className="relative" ref={profileMenuRef}>
              {status === "loading" ? (
                <Loader2 className="animate-spin text-blue-600" size={25} />
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
                      className="rounded-full cursor-pointer w-8 h-8"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute top-10 right-0 mt-2 w-fit text-black bg-white shadow-lg rounded-lg border z-[999]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="px-4 pt-2 text-sm font-bold text-gray-700">{session.user.name}</p>
                      <p className="px-4 pb-2 text-sm text-gray-700">{session.user.email}</p>
                      <div className="h-px bg-gray-200" />
                      <Link
                        href="/dashboard?section=orders"
                        className="flex items-center rounded-lg w-full text-left px-4 py-2 hover:bg-blue-100"
                        onClick={() => setIsProfileOpen(false)}
                      >Dashboard
                      </Link>
                      <button
                        className="flex items-center rounded-lg w-full text-red-600 text-left px-4 py-2 hover:bg-blue-100 hover:underline"
                        onClick={() => signOut()}
                      >
                        <LogOutIcon size={15} className="mr-2" /> Sign Out
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
                    className="flex flex-col items-center py-2 hover:underline hover:scale-105 transition-all duration-300"
                  >

                    <h2 className="text-sm">Login</h2>
                  </button>
                  <AnimatePresence>
                    {isAuthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 w-48 text-black bg-white shadow-lg rounded-lg border z-[9999]"
                        
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href="/sign-in"
                          onClick={() => setIsAuthDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-blue-100 text-sm"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/sign-up"
                          onClick={() => setIsAuthDropdownOpen(false)}
                          className="block px-4 py-2 hover:bg-blue-100 text-sm border-t border-gray-100"
                        >
                          Create Account
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <div className="w-[2px] bg-white h-6"></div>
            <div className="flex items-center gap-3">
              <Link href="/partner/login"
                className="text-white text-sm hover:underline  hover:scale-105 transition-all duration-300"
              >
                Property Extranet
              </Link>
              <div className="w-[2px] bg-white h-6"></div>
              <Link
                href="#"
                className="text-white text-sm hover:underline hover:scale-105 transition-all duration-300">
                Travel Partner
              </Link>
            </div>
          </div>
        </div>
        <div className="md:flex hidden items-center justify-between gap-8 border-b py-1 border-gray-400 md:px-8 ">
          <div className="flex flex-row justify-between w-full items-center px-8">
            {/* Logo on the left */}
            <div className="flex item-center gap-5">
              <Link href={"/"}>
                <img className="w-48 object-contain drop-shadow-xl" src="/HeaderLogo.png" alt="Rishikesh Handmade" />
              </Link>

                <div className="w-[2px] bg-white h-18"></div>
              <div className="flex item-center gap-2 justify-center">
                <Link href="/partner/register" 
                className="flex items-center gap-2"
                >
                <div>
                  <img src="/Hotel.png" className="w-12 object-contain" alt="" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-yellow-400 text-sm">List Your Property</p>
                  <p className="text-white text-sm">Grow your Business</p>
                </div>
                </Link>
              </div>
            </div>
            <div className="w-[40%]">
              <SearchBar />
            </div>

            <div className="flex flex-col items-center bg-black text-white py-2 rounded-md w-fit px-4">
              {/* WhatsApp Logo + Main Number */}
              <div className="flex items-center space-x-2">
                <img
                  src="/whatapp.png"
                  alt="WhatsApp"
                  className="w-6 h-6"
                />
                <span className="text-green-500 text-xl font-bold">01169266090</span>
              </div>

              {/* Secondary Numbers */}
              <div className="text-sm mt-1">
                +91 7060320678, 9557839999
              </div>
            </div>

          </div>
        </div>
      </header>
      {/* Show only on md and larger screens, and only if not in admin section */}
      <div className="hidden md:block sticky top-0 z-50">
        {!pathName.includes("admin")
        || !pathName.includes("partner/login")
        || !pathName.includes("partner/register")
         && (
          <div className="w-full print:hidden">
            <div className={`bg-white py-2 border-b border-gray-200 transition-all duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
              <div className="container mx-auto px-4">
                <MenuBar menuItems={menuItems} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden flex items-center justify-between md:justify-between py-1 px-2">
        <div className="relative flex items-center">
          {/* <MenuBar menuItems={menuItems.filter(item => item.active)} /> */}
          <MenuBar menuItems={menuItems} />
        </div>
        <Link href={"/"}>
          <img className="w-[150px] object-contain drop-shadow-xl" src="/HeaderLogo.png" alt="Rishikesh Handmade" />
        </Link>

        <div className="flex items-center gap-3">

          <button
            className="relative p-2 rounded-full hover:bg-neutral-100 transition"
            onClick={() => { setInitialCartTab('wishlist'); setIsCartOpen(true); }}
            aria-label="Open Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {wishlist.length}
              </span>
            )}
          </button>
          {/* Cart & Wishlist Icons */}
          {/* <button
            className="relative p-2 rounded-full hover:bg-neutral-100 transition"
            onClick={() => { setInitialCartTab('cart'); setIsCartOpen(true); }}
            aria-label="Open Cart"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                {cart.length}
              </span>
            )}
          </button> */}

          {/* <Cart open={isCartOpen} onClose={() => setIsCartOpen(false)} initialTab={initialCartTab} /> */}
          {/* <Truck /> */}

          <div className="relative">
            {status === "loading" ? (
              <Loader2 className="animate-spin text-blue-600" size={36} />
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
                  <User className="ml-2" size={20} />
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

    </>
  )
}

export default Header

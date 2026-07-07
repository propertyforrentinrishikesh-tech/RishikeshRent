"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

const ResponsiveNavbar = ({ sections = [] }) => {
  const visibleSections = sections
    .filter((section) => section?.active)
    .sort((left, right) => (left.order || 0) - (right.order || 0));

  if (!visibleSections.length) {
    return null;
  }

  return (
    <NavigationMenu.Root className="hidden relative z-[99] isolate lg:flex w-full justify-center">
      <NavigationMenu.List className="relative z-[99] flex items-center justify-center gap-1 rounded-md bg-white px-1 py-1">
        {visibleSections.map((section) => {
          const hasSubSections = Array.isArray(section.subSections) && section.subSections.some((item) => item?.active);
          const sortedSubSections = (section.subSections || [])
            .filter((item) => item?.active)
            .sort((left, right) => (left.order || 0) - (right.order || 0));

          if (!hasSubSections) {
            return (
              <NavigationMenu.Item key={section._id || section.title}>
                <Link
                  href={section.url || "#"}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-300 text-nowrap hover:text-black"
                >
                  {section.title}
                </Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={section._id || section.title} className="relative flex justify-center">
              <NavigationMenu.Trigger className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-300 text-nowrap data-[state=open]:bg-gray-300 data-[state=open]:text-black">
                {section.title}
                {/* <ArrowDown className="size-3" /> */}
              </NavigationMenu.Trigger>
              <NavigationMenu.Content asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-full mt-3 -mintranslate-x-1/2 min-w-[240px] w-max rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
                >
                  <div className="grid gap-1">
                    {sortedSubSections.map((subSection, index) => (
                      <motion.div
                        key={subSection._id || subSection.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.2,
                        }}
                      >
                        <Link
                          href={subSection.url || "#"}
                          className="block rounded-md px-4 py-3 text-sm text-gray-700 hover:bg-gray-200 hover:text-black transition-colors"
                        >
                          {subSection.title}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default ResponsiveNavbar;
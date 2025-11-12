/**
 * Barber Booker Hamburger Menu
 *
 * Comprehensive slide-in navigation for booking system
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Home,
  Calendar,
  Scissors,
  Settings,
  Users,
  Clock,
  Bell,
  Gift,
  Shield,
  HelpCircle,
  Mail,
  BookOpen,
  CreditCard,
  BarChart3,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "MAIN",
    items: [
      { id: "home", label: "Home", href: "/", icon: Home },
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { id: "barbers", label: "Barbers", href: "/barbers", icon: Scissors },
      { id: "connected", label: "Connected Accounts", href: "/connected", icon: Users },
    ]
  },
  {
    title: "BOOKING & CALENDAR",
    items: [
      { id: "book", label: "Book Appointment", href: "/#booking", icon: Calendar },
      { id: "appointments", label: "My Appointments", href: "/dashboard#appointments", icon: Clock },
      { id: "availability", label: "Manage Availability", href: "/dashboard#availability", icon: Calendar },
    ]
  },
  {
    title: "FEATURES",
    items: [
      { id: "loyalty", label: "Loyalty Program", href: "/#loyalty", icon: Gift },
      { id: "notifications", label: "Notifications", href: "/#notifications", icon: Bell },
      { id: "cancellation", label: "Cancellation Policy", href: "/#policy", icon: Shield },
    ]
  },
  {
    title: "ADMIN",
    items: [
      { id: "admin-login", label: "Admin Login", href: "/admin-login", icon: Shield },
      { id: "admin", label: "Admin Dashboard", href: "/admin", icon: Settings },
    ]
  },
  {
    title: "HELP & SUPPORT",
    items: [
      { id: "tour", label: "Take Tour", href: "/#tour", icon: HelpCircle },
      { id: "guide", label: "Setup Guide", href: "/#guide", icon: BookOpen },
      { id: "contact", label: "Contact Us", href: "/#contact", icon: Mail },
    ]
  }
];

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/" && location === "/") {
      return true;
    }
    if (href.startsWith("/#")) {
      return false; // Hash links handled separately
    }
    return location.startsWith(href) && href !== "/";
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleHashLink = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const hash = href.substring(2);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-amber-400 hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-md"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 z-50",
          "bg-gradient-to-b from-amber-900/95 via-amber-950/95 to-black/95 backdrop-blur-xl border-r border-amber-700/30",
          "transform transition-transform duration-300 ease-in-out",
          "shadow-2xl shadow-amber-600/10",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-amber-700/30 bg-gradient-to-r from-amber-900/80 to-amber-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Scissors className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-amber-400 font-bold text-sm">Barber Booker</h1>
              <p className="text-xs text-amber-300/60">Premium Booking</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-amber-400/70 hover:text-amber-400 transition-colors rounded-md"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Sections */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="py-4">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? "mt-6" : ""}>
                <div className="px-4 mb-2">
                  <h3 className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">
                    {section.title}
                  </h3>
                </div>
                <div className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const isHashLink = item.href.startsWith("/#");

                    if (isHashLink) {
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleHashLink(item.href)}
                          className={cn(
                            "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden text-left",
                            "text-amber-200/70 hover:bg-amber-600/10 hover:text-amber-400"
                          )}
                        >
                          {/* Hover shimmer effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium text-sm relative z-10">{item.label}</span>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={handleLinkClick}
                      >
                        <a
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden",
                            active
                              ? "bg-amber-600/20 text-amber-400 border-l-2 border-amber-400"
                              : "text-amber-200/70 hover:bg-amber-600/10 hover:text-amber-400"
                          )}
                        >
                          {/* Hover shimmer effect */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent" />

                          <Icon className={cn("h-5 w-5 flex-shrink-0", active ? "text-amber-400" : "")} />
                          <span className="font-medium text-sm relative z-10">{item.label}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-amber-700/30 bg-gradient-to-r from-amber-900/80 to-amber-950/80">
          <div className="text-xs text-amber-300/40 text-center">
            <p className="font-semibold text-amber-400">SmartFlow Systems</p>
            <p>© 2025 Premium Booking</p>
          </div>
        </div>
      </div>
    </>
  );
}

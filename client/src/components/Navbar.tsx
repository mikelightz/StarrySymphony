import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CartItem } from "@/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Get cart data to show item count
  interface CartData {
    id: number;
    items: CartItem[];
    total: number;
  }

  const { data: cart } = useQuery<CartData>({
    queryKey: ["/cart"],
    // Disable the automatic error when the cart is not found
    // It's normal to not have a cart in the beginning
    refetchOnWindowFocus: true,
    retry: false,
    refetchInterval: 2000, // Auto-refresh cart every 2 seconds
    staleTime: 1000, // Consider data stale after 1 second
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 shadow-sm" : "bg-cream/80"
      }`}
    >
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-terracotta font-prata text-xl md:text-2xl font-bold"
          >
            OMFLOR WELLNESS
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <NavLink href="/" active={isActive("/")}>
              Home
            </NavLink>
            <NavLink href="/about" active={isActive("/about")}>
              About
            </NavLink>
            <NavLink href="/offerings" active={isActive("/offerings")}>
              Offerings
            </NavLink>
            {/* <NavLink href="/natal-chart" active={isActive("/natal-chart")}>
              Natal Chart
            </NavLink> */}
            <NavLink href="/shop" active={isActive("/shop")}>
              Shop
            </NavLink>
            <NavLink href="/contact" active={isActive("/contact")}>
              Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <a
                className="relative text-deepblue hover:text-terracotta transition duration-300"
                aria-label="View cart"
              >
                <ShoppingBag className="h-6 w-6" />
                {cart && cart.items && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </a>
            </Link>

            <button
              className="md:hidden text-deepblue"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-4">
                <MobileNavLink
                  href="/"
                  active={isActive("/")}
                  onClick={closeMenu}
                >
                  Home
                </MobileNavLink>
                <MobileNavLink
                  href="/about"
                  active={isActive("/about")}
                  onClick={closeMenu}
                >
                  About
                </MobileNavLink>
                <MobileNavLink
                  href="/offerings"
                  active={isActive("/offerings")}
                  onClick={closeMenu}
                >
                  Offerings
                </MobileNavLink>
                {/* <MobileNavLink
                  href="/natal-chart"
                  active={isActive("/natal-chart")}
                  onClick={closeMenu}
                >
                  Natal Chart
                </MobileNavLink> */}
                <MobileNavLink
                  href="/shop"
                  active={isActive("/shop")}
                  onClick={closeMenu}
                >
                  Shop
                </MobileNavLink>
                <MobileNavLink
                  href="/cart"
                  active={isActive("/cart")}
                  onClick={closeMenu}
                >
                  Cart
                </MobileNavLink>
                <MobileNavLink
                  href="/contact"
                  active={isActive("/contact")}
                  onClick={closeMenu}
                >
                  Contact
                </MobileNavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link href={href}>
      <a
        className={`tab-underline text-deepblue hover:text-terracotta transition duration-300 ${
          active ? "active-tab" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
}

function MobileNavLink({ href, children, active, onClick }: NavLinkProps) {
  return (
    <Link href={href}>
      <a
        className={`text-deepblue hover:text-terracotta transition duration-300 py-2 border-b border-neutral ${
          active ? "font-medium" : ""
        }`}
        onClick={onClick}
      >
        {children}
      </a>
    </Link>
  );
}

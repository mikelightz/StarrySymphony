import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (location !== href) {
      setLocation(href);
    }
    // Close mobile menu if open
    setIsOpen(false);
  };

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
      className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${scrolled
        ? "bg-background/95 shadow-sm backdrop-blur-md border-b border-border/40 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className={`${scrolled ? "text-gold" : "text-cloth"} tracking-[0.2em] font-playfair text-lg md:text-2xl uppercase flex items-center gap-2 transition-all duration-300 hover:text-copper`}
            onClick={(e) => handleNav(e, "/")}
          >
            <span className={`${scrolled ? "text-gold" : "text-cloth"} text-sm md:text-xl transition-colors duration-300`}>✧</span> OMFLOR WELLNESS
          </a>

          <div className="hidden md:flex space-x-10 items-center font-lato text-sm tracking-widest uppercase">
            <NavLink href="/" active={isActive("/")}>
              Home
            </NavLink>
            <NavLink href="/about" active={isActive("/about")}>
              About
            </NavLink>
            <NavLink href="/offerings" active={isActive("/offerings")}>
              Offerings
            </NavLink>
            <NavLink href="/natal-chart" active={isActive("/natal-chart")}>
              Birth Chart
            </NavLink>
            <NavLink href="/shop" active={isActive("/shop")}>
              Shop
            </NavLink>
            <NavLink href="/contact" active={isActive("/contact")}>
              Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className={`md:hidden ${scrolled ? "text-gold" : "text-cloth"} hover:text-copper transition-colors`}
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
              className="md:hidden mt-4 pb-4 overflow-hidden bg-background/95 backdrop-blur-sm rounded-b-xl border-x border-b border-border/40 -mx-4 px-4 shadow-lg"
            >
              <div className="flex flex-col space-y-2 pt-4 font-lato text-sm tracking-widest uppercase">
                <MobileNavLink href="/" active={isActive("/")} onClick={closeMenu}>
                  Home
                </MobileNavLink>
                <MobileNavLink href="/about" active={isActive("/about")} onClick={closeMenu}>
                  About
                </MobileNavLink>
                <MobileNavLink href="/offerings" active={isActive("/offerings")} onClick={closeMenu}>
                  Offerings
                </MobileNavLink>
                <MobileNavLink href="/natal-chart" active={isActive("/natal-chart")} onClick={closeMenu}>
                  Birth Chart
                </MobileNavLink>
                <MobileNavLink href="/shop" active={isActive("/shop")} onClick={closeMenu}>
                  Shop
                </MobileNavLink>
                <MobileNavLink href="/contact" active={isActive("/contact")} onClick={closeMenu}>
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
  const [, setLocation] = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLocation(href);
  };

  return (
    <a
      href={href}
      className={`tab-underline text-foreground hover:text-copper transition-colors duration-300 ${active ? "active-tab opacity-100" : "opacity-80 hover:opacity-100"
        }`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children, active, onClick }: NavLinkProps) {
  const [, setLocation] = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setLocation(href);
    if (onClick) onClick();
  };

  return (
    <a
      href={href}
      className={`text-foreground hover:text-copper transition-colors duration-300 py-3 border-b border-border/40 ${active ? "text-copper font-bold" : "opacity-80 hover:opacity-100"
        }`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

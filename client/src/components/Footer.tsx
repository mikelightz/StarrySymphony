import { Instagram, Facebook, Mail } from "lucide-react";
import MoonPhases from "@/components/MoonPhases";
import NewsletterForm from "@/components/NewsletterForm";
import { useLocation } from "wouter";

export default function Footer() {
  const [, setLocation] = useLocation();

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setLocation(href);
  };

  return (
    <footer className="bg-background text-foreground py-16 relative z-10 mt-safe border-t border-border/40">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="text-center md:text-left max-w-sm">
            <h2 className="font-playfair tracking-widest uppercase font-light text-2xl mb-4 text-foreground">OmFlor Wellness</h2>
            <p className="text-muted-foreground mb-6 font-lato font-light leading-relaxed">
              Your sacred space for astrological wisdom and embodied living.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <SocialLink
                href="https://www.instagram.com/omflorwellness/"
                icon={<Instagram size={18} />}
              />
              <SocialLink
                href="https://facebook.com"
                icon={<Facebook size={18} />}
              />
              <SocialLink
                href="mailto:omflorwellness@gmail.com"
                icon={<Mail size={18} />}
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <NewsletterForm />
          </div>
        </div>

        {/* Moon phase divider */}
        <div className="my-12 opacity-80">
          <MoonPhases color="gold" />
        </div>

        <div className="text-center text-muted-foreground/80 text-sm font-lato font-light tracking-wide">
          <p>
            &copy; {new Date().getFullYear()} OmFlor Wellness. All rights
            reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="/privacy"
              className="hover:text-gold transition duration-300"
              onClick={(e) => handleNav(e, "/privacy")}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-gold transition duration-300"
              onClick={(e) => handleNav(e, "/terms")}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="text-muted-foreground hover:text-gold transition duration-300 transform hover:scale-110"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

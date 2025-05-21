import { Instagram, Facebook, Mail } from "lucide-react";
import MoonPhases from "@/components/MoonPhases";
import NewsletterForm from "@/components/NewsletterForm";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-darkolivegreen text-white py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="text-center md:text-left max-w-sm">
            <h2 className="font-playfair text-2xl mb-4">OmFlor Wellness</h2>
            <p className="text-gray-300 mb-6">
              Guiding you back to yourself through lunar wisdom, embodiment
              practices, and psychosomatic healing.
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
        <div className="my-12">
          <MoonPhases color="gold" />
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} OmFlor Wellness. All rights
            reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/privacy">
              <a className="hover:text-gray-300 transition duration-300">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-gray-300 transition duration-300">
                Terms of Service
              </a>
            </Link>
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
      className="text-gray-300 hover:text-gold transition duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

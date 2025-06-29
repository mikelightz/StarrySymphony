import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  const submitContact = useMutation({
    mutationFn: (data: ContactFormData) => apiRequest("POST", "/contact", data),
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Message not sent",
        description:
          error.message ||
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContact.mutate(data);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.h1
          className="font-playfair text-4xl md:text-5xl text-center mb-16 text-deepblue"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Contact
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-playfair text-2xl mb-6 text-terracotta">
                Get in Touch
              </h2>
              <p className="text-gray-700 mb-8">
                Have questions about our offerings or want to learn more about
                how we can support your wellness journey? Fill out the form or
                reach out directly through our social channels.
              </p>

              <div className="mb-10">
                <h3 className="font-medium text-deepblue mb-4">
                  Connect With Us
                </h3>
                <div className="flex space-x-4">
                  <SocialLink
                    href="https://www.instagram.com/omflorwellness/"
                    icon={<Instagram size={24} />}
                    label="Instagram"
                  />
                  <SocialLink
                    href="https://facebook.com"
                    icon={<Facebook size={24} />}
                    label="Facebook"
                  />
                </div>
              </div>

              {/* Celestial elements */}
              <div className="mt-12 p-8 bg-white rounded-lg shadow-md">
                <h3 className="font-playfair text-xl mb-4 text-deepblue">
                  Lunar Office Hours
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">New Moon:</span> Reflection &
                  intention setting
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Waxing Moon:</span> Building
                  momentum
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Full Moon:</span> Celebration &
                  release
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Waning Moon:</span> Integration
                  & rest
                </p>
              </div>
            </motion.div>
          </div>

          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white p-8 rounded-xl shadow-md">
                <h3 className="font-playfair text-xl mb-6 text-deepblue">
                  Contact Us
                </h3>
                <p className="text-gray-700 mb-6">
                  Fill out the form below to send us a message. We'll get back
                  to you as soon as possible.
                </p>

                {/* JotForm Embed */}
                <div className="jotform-embed">
                  <iframe
                    id="JotFormIFrame"
                    title="Contact Form"
                    src="https://form.jotform.com/251386728462162"
                    style={{ width: "100%", height: "539px", border: "none" }}
                    allow="camera; microphone; autoplay; encrypted-media;"
                  ></iframe>
                  <p className="text-xs text-gray-500 mt-4">
                    Powered by JotForm
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="text-2xl text-terracotta hover:text-deepblue transition duration-300"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

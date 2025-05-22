import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeNewsletter = useMutation({
    mutationFn: (data: NewsletterFormData) =>
      apiRequest("POST", "/api/newsletter/subscribe", data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    setIsSubmitting(true);
    subscribeNewsletter.mutate(data);
  };

  return (
    <div className="bg-[#a24b27] bg-opacity-50 rounded-lg p-6 max-w-md mx-auto md:mx-0">
      <h3 className="font-playfair text-xl mb-4 text-center md:text-left">
        Stay Lunar-Aligned
      </h3>
      <p className="text-gray-300 mb-4 text-center md:text-left">
        Join our newsletter for lunar updates, embodiment practices, and special
        offers.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-grow">
          <input
            type="email"
            placeholder="Your email address"
            className={`px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-gold w-full ${
              errors.email ? "border-red-500" : ""
            }`}
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gold text-deepblue px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300 whitespace-nowrap"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}

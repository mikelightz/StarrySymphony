import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import { Link } from "wouter";
import { MoonPhasesSVG } from "@/components/CelestialIllustrations";

export default function MoonMasterclass() {
  return (
    <div className="pt-24 pb-16 bg-neutral bg-opacity-20">
      <div className="container-custom max-w-5xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="font-playfair text-4xl md:text-5xl text-deepblue mb-6">
            Unlock Your Inner Wisdom with the Moon Masterclass
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Journey through the lunar cycles for profound self-discovery, emotional balance, and embodied living.
          </p>
          <div className="mt-8 flex justify-center">
            <MoonPhasesSVG className="w-48 h-48 text-deepblue opacity-90" />
          </div>
        </motion.div>
        
        {/* The Promise Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-terracotta mb-6 text-center">
            Are You Ready to Align with Nature's Rhythm?
          </h2>
          <div className="text-gray-700 space-y-4">
            <p>
              In our fast-paced modern world, many of us feel disconnected—from ourselves, from others, from the natural world. We seek balance, understanding, and a deeper sense of purpose. We long for a framework that helps us navigate life's ebbs and flows with grace and intention.
            </p>
            <p>
              The Moon Masterclass offers exactly this—a time-tested pathway back to your innate wisdom through the ancient practice of living in harmony with lunar cycles. By understanding and working with the moon's phases, you'll gain powerful tools for self-discovery, emotional equilibrium, and embodied living.
            </p>
          </div>
        </motion.div>
        
        {/* Course Content Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-deepblue mb-10 text-center">
            What You'll Discover in the Masterclass:
          </h2>
          
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-deepblue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-playfair text-terracotta mb-3">
                  Video Modules: Journey Through Each Moon Phase
                </h3>
                <p className="text-gray-700 mb-4">
                  Eight comprehensive video modules guide you through each phase of the lunar cycle, offering deep insights and practical wisdom for every stage. 
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Module 1: The Magic of the New Moon - Setting Intentions</li>
                  <li>Module 2: Waxing Moon Wisdom - Building Momentum</li>
                  <li>Module 3: Full Moon Illumination - Celebrating & Releasing</li>
                  <li>Module 4: Waning Moon Medicine - Reflection & Integration</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-terracotta flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-playfair text-olive mb-3">
                  Somatic Practices: Embodying Lunar Wisdom
                </h3>
                <p className="text-gray-700">
                  Learn powerful body-based practices that help you physically integrate the qualities of each moon phase. These somatic exercises deepen your connection to lunar rhythms and bring embodied awareness to your daily life.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-playfair text-deepblue mb-3">
                  Journaling Prompts & Reflection Exercises
                </h3>
                <p className="text-gray-700">
                  Deepen your personal insights with thoughtfully crafted journaling prompts specific to each lunar phase. These written exercises help clarify intentions, process emotions, and track your growth throughout the lunar cycle.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-olive flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-playfair text-terracotta mb-3">
                  Lunar Tracking Tools & Templates
                </h3>
                <p className="text-gray-700">
                  Practical calendars, trackers, and templates help you easily integrate lunar awareness into your daily life. These tools allow you to plan activities in alignment with the moon's energy and track patterns in your emotional and physical wellbeing.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-deepblue flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-playfair text-gold mb-3">
                  BONUS: Seasonal Lunar Guides
                </h3>
                <p className="text-gray-700">
                  Special bonus guides for working with the unique qualities of each season's moon cycles. Learn how to harness the distinctive energies of seasonal transitions and special lunar events like eclipses and supermoons.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Who Is This For? Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-deepblue mb-8 text-center">
            Is This Masterclass For You?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="min-w-10 h-10 bg-terracotta rounded-full flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-gray-700">You're seeking deeper self-awareness and tools for emotional regulation</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="min-w-10 h-10 bg-terracotta rounded-full flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-gray-700">You want to create meaningful rituals and practices that connect you to natural cycles</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="min-w-10 h-10 bg-terracotta rounded-full flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-gray-700">You're curious about moon cycles but aren't sure how to practically apply this ancient wisdom</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="min-w-10 h-10 bg-terracotta rounded-full flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-gray-700">You're looking for a structure to support personal growth and intentional living</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="min-w-10 h-10 bg-terracotta rounded-full flex items-center justify-center mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p className="text-gray-700">You value somatic (body-based) approaches to wellbeing and personal development</p>
            </div>
          </div>
        </motion.div>
        
        {/* About Instructor Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
                <img 
                  src="/images/new_3.jpg" 
                  alt="Sierra Flor" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="font-playfair text-3xl text-deepblue mb-4 text-center md:text-left">
                Meet Your Guide, Sierra Flor
              </h2>
              <p className="text-gray-700 mb-4">
                Sierra is a somatic educator, moon enthusiast, and dedicated guide to those seeking alignment with natural cycles. With over a decade of experience in holistic wellness and feminine embodiment practices, she brings a unique blend of practical wisdom, scientific understanding, and intuitive guidance to her work.
              </p>
              <p className="text-gray-700">
                Having witnessed countless transformations through lunar living—both in her own life and in the lives of hundreds of students—Sierra is passionate about making this ancient wisdom accessible and relevant for modern life. Her teaching style is warm, grounded, and empowering, creating a safe container for deep exploration and authentic growth.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Benefits Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-deepblue mb-8 text-center">
            What You'll Gain:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Lunar Understanding</h3>
              </div>
              <p className="text-gray-700">
                A profound understanding of how lunar energies influence your life, emotions, and creative cycles.
              </p>
            </div>
            
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Emotional Navigation</h3>
              </div>
              <p className="text-gray-700">
                Practical tools to navigate emotional ebbs and flows with grace, understanding, and self-compassion.
              </p>
            </div>
            
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Personalized Practices</h3>
              </div>
              <p className="text-gray-700">
                The ability to create personalized rituals and practices that support your unique intentions and life journey.
              </p>
            </div>
            
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-deepblue rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Intuitive Connection</h3>
              </div>
              <p className="text-gray-700">
                A deeper connection to your intuition and inner wisdom, allowing for more aligned decision-making.
              </p>
            </div>
            
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-terracotta rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Embodied Living</h3>
              </div>
              <p className="text-gray-700">
                A sense of embodiment and presence that brings greater joy, ease, and flow to your daily experience.
              </p>
            </div>
            
            <div className="bg-neutral bg-opacity-30 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-deepblue">Rhythmic Awareness</h3>
              </div>
              <p className="text-gray-700">
                The gift of living in harmony with natural cycles, creating a more sustainable and balanced approach to productivity and rest.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Testimonials Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-deepblue mb-10 text-center">
            What Our Students Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral bg-opacity-20 p-6 rounded-lg">
              <p className="text-gray-700 italic mb-4">
                "The Moon Masterclass completely transformed my relationship with time and my own inner rhythms. I finally understand why I feel the way I do during different parts of the month, and I have concrete tools to work with these energies instead of fighting against them."
              </p>
              <p className="font-medium text-deepblue">- Maya K.</p>
            </div>
            
            <div className="bg-neutral bg-opacity-20 p-6 rounded-lg">
              <p className="text-gray-700 italic mb-4">
                "As someone who was totally new to moon cycles, I was worried this might be too 'out there' for me. I was so wrong! Sierra presents everything in such a grounded, practical way. The somatic practices have been especially powerful for helping me process emotions I used to just push down."
              </p>
              <p className="font-medium text-deepblue">- James T.</p>
            </div>
            
            <div className="bg-neutral bg-opacity-20 p-6 rounded-lg">
              <p className="text-gray-700 italic mb-4">
                "This course gave me the structure and support I needed to establish consistent self-care practices. The journaling prompts are incredible for gaining clarity, and I love how the content is accessible whenever I need it. Worth every penny!"
              </p>
              <p className="font-medium text-deepblue">- Sophia R.</p>
            </div>
          </div>
        </motion.div>
        
        {/* Enrollment Section */}
        <motion.div
          className="bg-deepblue text-white p-8 md:p-12 rounded-xl shadow-md mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl mb-6">
            Ready to Begin Your Lunar Journey?
          </h2>
          <p className="text-xl mb-8">Investment: $197</p>
          
          <Link href="/shop">
            <button className="bg-gold hover:bg-opacity-90 text-white px-8 py-4 rounded-lg text-lg font-medium transition duration-300 transform hover:scale-105">
              Enroll in the Moon Masterclass Now
            </button>
          </Link>
          
          <p className="mt-6 text-neutral-200">
            Lifetime access to all course materials and future updates
          </p>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div
          className="bg-white p-8 md:p-12 rounded-xl shadow-md mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl text-deepblue mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-terracotta mb-2">How long will I have access to the course materials?</h3>
              <p className="text-gray-700">
                You'll have lifetime access to all the course materials, including any future updates or additions. Once you enroll, the content is yours to keep forever.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-terracotta mb-2">Is this course suitable for beginners?</h3>
              <p className="text-gray-700">
                Absolutely! The Moon Masterclass is designed for all levels of experience. Whether you're completely new to lunar wisdom or have been working with moon cycles for years, you'll find valuable insights and practices.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-terracotta mb-2">What technology do I need?</h3>
              <p className="text-gray-700">
                All you need is a device with internet access to view the videos and download the materials. The course works well on computers, tablets, and smartphones.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-terracotta mb-2">Is there a refund policy?</h3>
              <p className="text-gray-700">
                Yes, we offer a 14-day satisfaction guarantee. If you're not completely satisfied with the course after trying it, simply email us within 14 days of purchase for a full refund.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Back to Offerings Link */}
        <div className="text-center mb-8">
          <Link href="/offerings">
            <a className="text-deepblue hover:text-terracotta transition duration-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Offerings
            </a>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/jkasprzyk17", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/jakub-kasprzyk/",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://x.com/jkasprzyk17",
      label: "Twitter",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
    >
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants} className="mb-8 lg:hidden">
              <motion.div
                className="relative inline-block group"
                variants={imageVariants}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-2xl opacity-50"
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative w-48 h-48 mx-auto sm:w-64 sm:h-64">
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background:
                        "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
                      padding: "3px",
                    }}
                  >
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full"></div>
                  </motion.div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                    <Image
                      src="/images/profile.jpg"
                      alt="Jakub Kasprzyk"
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority
                      sizes="(max-width: 640px) 192px, 256px"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              hey, I&apos;m{" "}
              <span className="text-blue-600 dark:text-blue-400">Jakub</span> 👋
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
            >
              I&apos;m a{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                Mobile Software Engineer
              </span>{" "}
              with 3.5 years of commercial experience, based in{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                Kraków, PL
              </span>
              . I&apos;ve been programming since I was 15, and I&apos;m passionate about
              building innovative mobile applications that make a difference. I
              love working with React Native, Expo, and modern mobile
              technologies to create seamless user experiences.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12"
            >
              {["Expo", "React Native", "TypeScript", "React"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium hover:scale-110 transition-transform"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start gap-6 mb-8"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex justify-center lg:justify-start"
            >
              <motion.a
                href="#experience"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
            </motion.div>
          </div>

          {/* Right side - Profile Image (Desktop) */}
          <motion.div variants={imageVariants} className="hidden lg:block">
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated gradient ring */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-30"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Rotating gradient border */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  background:
                    "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)",
                  padding: "4px",
                }}
              >
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full"></div>
              </motion.div>

              {/* Profile image */}
              <motion.div
                className="relative w-full max-w-md aspect-square rounded-full overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl"
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
                }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Jakub Kasprzyk - Mobile Software Engineer"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority
                  sizes="(max-width: 768px) 0px, 400px"
                />
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-xl"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-1/2 -right-8 w-16 h-16 bg-pink-500 rounded-full opacity-15 blur-lg"
                animate={{
                  x: [0, 10, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

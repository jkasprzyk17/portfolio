"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { experiences } from "@/data/experience";

export default function Experience() {
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
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            My professional journey and the projects I&apos;ve worked on.
          </p>
        </motion.div>

        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {experiences.map((experience) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex items-start gap-4">
                  {experience.companyLogo && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-700 p-2">
                      <Image
                        src={experience.companyLogo}
                        alt={`${experience.company} logo`}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {experience.title}
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                      {experience.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {experience.location}
                    </p>
                  </div>
                </div>
                <span className="text-gray-500 dark:text-gray-500 text-sm mt-2 sm:mt-0">
                  {experience.period}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                {experience.description.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {experience.projects && experience.projects.length > 0 && (
                <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Key Projects:
                  </h4>
                  {experience.projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {project.logo && (
                          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-gray-600 p-1.5">
                            <Image
                              src={project.logo}
                              alt={`${project.name} logo`}
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <h5 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {project.name}
                        </h5>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                        {project.description}
                      </p>
                      {project.features && project.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Key Features:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {project.features.map((feature, fIdx) => (
                              <li key={fIdx}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {experience.technologies && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {experience.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.65, 0, 0.35, 1] as const;

export default function Hero() {
  return (
    <section id="home" className="pt-16 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mb-8"
      >
        <Image
          src="/images/profile.jpg"
          alt="Jakub Kasprzyk"
          width={72}
          height={72}
          priority
          className="rounded-full ring-1 ring-line"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease, delay: 0.05 }}
        className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg mb-5"
      >
        hey, I&apos;m Jakub <span className="inline-block">👋</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.12 }}
        className="space-y-4 text-[15.5px] leading-7 text-fg-2"
      >
        <p>
          I&apos;m a Mobile Software Engineer based in Kraków, building
          cross-platform apps with{" "}
          <span className="text-fg">React Native</span> and{" "}
          <span className="text-fg">Expo</span>. Currently at{" "}
          <a
            href="https://appmagic.io"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            App Magic
          </a>
          , shipping AI-powered mobile products.
        </p>
        <p>
          Previously at{" "}
          <a
            href="https://swmansion.com"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Software Mansion
          </a>{" "}
          contributing to{" "}
          <a
            href="https://radon.swmansion.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Radon IDE
          </a>
          , and three years at{" "}
          <a
            href="https://mymusic.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            MyMusic
          </a>{" "}
          working on{" "}
          <a
            href="https://mugo.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            MUGO
          </a>{" "}
          and{" "}
          <a
            href="https://justwin.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            JustWin
          </a>
          .
        </p>
        <p>
          On the side I&apos;m building{" "}
          <a
            href="https://latwaustna.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            Łatwa Ustna
          </a>
          , an AI tutor that helps Polish students prepare for the written and oral matura exam.
        </p>
      </motion.div>
    </section>
  );
}

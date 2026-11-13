import OsToggle from "@/components/phone/OsToggle";

// CSS entrance (.rise-in) rather than a JS one: the text has to be readable
// before any JavaScript arrives, not server-rendered at opacity 0.
export default function Intro() {
  return (
    <section id="home" className="intro">
      <h1 className="rise-in font-display text-[2.6rem] leading-[1.04] sm:text-[3.4rem] xl:text-[4.25rem] xl:leading-[1] tracking-[-0.025em] text-fg text-balance">
        I build mobile apps, and the{" "}
        <em className="text-accent">native modules</em> underneath them.
      </h1>

      <p
        style={{ animationDelay: "60ms" }}
        // Phone mode only: on the plain page the "about" section right below
        // opens with the same facts, at length.
        className="js-only rise-in mt-7 max-w-[30rem] text-[16px] leading-7 text-fg-2 text-pretty"
      >
        20-year-old mobile engineer from Kraków. At{" "}
        <a
          href="https://www.gmi.software"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link"
        >
          GMI software
        </a>{" "}
        I build <span className="text-fg">React Native</span> apps and
        open-source native modules.
      </p>

      <div
        style={{ animationDelay: "120ms" }}
        className="rise-in mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[14px]"
      >
        {/* The press scale sits on the inner span: .rise-in's fill holds
            `transform` on the wrapper and would swallow it. */}
        <a href="/cv" className="group inline-flex">
          <span className="pressable inline-flex items-center gap-1.5 rounded-full bg-fg text-bg px-4 h-9 font-medium">
            View my CV
            <span
              aria-hidden
              className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </a>
        <a
          href="https://github.com/jkasprzyk17"
          target="_blank"
          rel="noopener noreferrer"
          className="prose-link font-mono text-[13px]"
        >
          github.com/jkasprzyk17
        </a>
      </div>

      {/* On a phone this would push the device below the first screen, so
          there the toggle sits under it instead (see page.tsx). */}
      <div
        style={{ animationDelay: "180ms" }}
        className="rise-in mt-7 max-sm:hidden"
      >
        <OsToggle />
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import AppIcon from "../AppIcon";
import AppScreen from "../AppScreen";
import { Info, InfoLink, SectionTitle, type InfoRow } from "../Info";

type Listing = {
  name: string;
  icon: string;
  /** One line under the name: who it was built for, or that it is his own. */
  maker: string;
  description: string;
  features: string[];
  url?: string;
  /** Everything else the data knows, as label–value rows. */
  facts: InfoRow[];
};

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function find(name: string): Listing | undefined {
  for (const job of experiences) {
    const p = job.projects?.find((x) => x.name === name && x.logo);
    if (!p) continue;
    return {
      name: p.name,
      icon: p.logo!,
      maker: job.company.split(" / ").pop()!,
      description: p.description,
      features: p.features,
      url: p.url,
      facts: [
        {
          label: "Company",
          value: job.companyUrl ? (
            <InfoLink href={job.companyUrl}>{job.company}</InfoLink>
          ) : (
            job.company
          ),
        },
        { label: "Role", value: job.title },
        { label: "Period", value: job.period },
        { label: "Built with", value: p.technologies.join(", ") },
        ...(p.url
          ? [
              {
                label: "Website",
                value: <InfoLink href={p.url}>{host(p.url)}</InfoLink>,
              },
            ]
          : []),
      ],
    };
  }

  const own = projects.find((p) => p.title === name && p.image);
  if (!own) return;
  const links: [string, string | undefined][] = [
    ["Website", own.liveUrl],
    ["Source", own.githubUrl],
    ["App Store", own.appStoreUrl],
    ["Google Play", own.playStoreUrl],
  ];
  return {
    name: own.title,
    icon: own.image!,
    maker: "Own project",
    description: own.longDescription ?? own.description,
    features: own.features ?? [],
    url: own.liveUrl ?? own.githubUrl,
    facts: [
      { label: "Built with", value: own.technologies.join(", ") },
      ...links.flatMap(([label, href]) =>
        href
          ? [{ label, value: <InfoLink href={href}>{host(href)}</InfoLink> }]
          : [],
      ),
    ],
  };
}

// One app Jakub shipped, laid out like its page in an app store: the icon
// sets the mood (it is also the blurred glow behind the header), then what
// the app is, what it does, and the facts.
export default function ShippedApp({ name }: { name: string }) {
  const app = find(name);
  // This page has no title bar, so its content scrolls up under the status
  // bar. Once it has, a fade there keeps the clock readable; at the top
  // there is nothing to fade, and the glow stays clean.
  const [scrolled, setScrolled] = useState(false);
  if (!app) return <AppScreen title={name}>{null}</AppScreen>;

  return (
    <div className="scr" data-scrolled={scrolled || undefined}>
      <div aria-hidden className="listing__scrim" />
      <div
        className="scr__body listing"
        onScroll={(e) => {
          const next = e.currentTarget.scrollTop > 8;
          setScrolled((prev) => (prev === next ? prev : next));
        }}
      >
        <div
          aria-hidden
          className="listing__glow"
          style={{ backgroundImage: `url(${app.icon})` }}
        />

        <header className="listing__head">
          <AppIcon
            icon={{ kind: "image", src: app.icon }}
            style={{ fontSize: 84 }}
          />
          <div className="listing__id">
            <h2 className="listing__name">{app.name}</h2>
            <p className="listing__context">{app.maker}</p>
            {app.url && (
              <a
                className="pill"
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open <ArrowUpRight size={13} aria-hidden />
              </a>
            )}
          </div>
        </header>

        <p className="listing__about">{app.description}</p>

        {app.features.length > 0 && (
          <>
            <SectionTitle>Features</SectionTitle>
            <ul className="listing__features">
              {app.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </>
        )}

        <SectionTitle>Information</SectionTitle>
        <Info rows={app.facts} />
      </div>
    </div>
  );
}

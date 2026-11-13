"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { libraries, type Library } from "@/data/libraries";
import AppScreen, { ListRow } from "../AppScreen";
import { Info, InfoLink, SectionTitle } from "../Info";
import Stack, { useStack } from "../Stack";

const shortName = (name: string) => name.replace(/^@[^/]+\//, "");

function Install({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  // The clipboard API only exists on secure origins (https or localhost).
  // Anywhere else the command is still there to select by hand.
  const canCopy =
    typeof navigator !== "undefined" &&
    typeof window !== "undefined" &&
    window.isSecureContext &&
    !!navigator.clipboard;

  return (
    <div className="install">
      <code>{command}</code>
      {canCopy && (
        <button
          type="button"
          aria-label={copied ? "Copied" : "Copy install command"}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(command);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            } catch {
              // Permission denied or no focus: leave the text to select.
            }
          }}
        >
          <span className="icon-swap">
            <Copy size={14} data-hidden={copied || undefined} />
            <Check size={14} data-hidden={!copied || undefined} />
          </span>
        </button>
      )}
    </div>
  );
}

function LibraryScreen({ library }: { library: Library }) {
  const { pop } = useStack();
  return (
    <AppScreen
      title={<span className="oss__name">{shortName(library.name)}</span>}
      back={{ label: "Open source", onClick: pop }}
    >
      <p className="oss__about">{library.description}</p>

      {library.install && (
        <>
          <Install command={library.install} />
          <p className="oss__hint">
            Setup and requirements are in the{" "}
            <a
              href={`${library.githubUrl}#readme`}
              target="_blank"
              rel="noopener noreferrer"
            >
              README
            </a>
            .
          </p>
        </>
      )}

      <div className="oss__links">
        {library.npmUrl && (
          <a
            className="pill"
            href={library.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            npm <ArrowUpRight size={13} aria-hidden />
          </a>
        )}
        <a
          className="pill pill--quiet"
          href={library.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowUpRight size={13} aria-hidden />
        </a>
      </div>

      <SectionTitle>Information</SectionTitle>
      <Info
        rows={[
          { label: "Built with", value: library.tags.join(", ") },
          {
            label: "Source",
            value: (
              <InfoLink href={library.githubUrl}>
                {library.githubUrl.replace("https://github.com/", "")}
              </InfoLink>
            ),
          },
        ]}
      />
    </AppScreen>
  );
}

function LibraryList() {
  const { push } = useStack();
  return (
    <AppScreen title="Open source">
      <ul className="lrows">
        {libraries.map((library) => (
          <ListRow
            key={library.id}
            title={<span className="oss__name">{shortName(library.name)}</span>}
            onClick={() => push(<LibraryScreen library={library} />)}
          >
            <p className="lrow__clamp">{library.description}</p>
          </ListRow>
        ))}
      </ul>
    </AppScreen>
  );
}

export default function OssApp() {
  return (
    <Stack>
      <LibraryList />
    </Stack>
  );
}

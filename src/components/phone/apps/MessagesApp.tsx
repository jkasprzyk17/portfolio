"use client";

import { useState } from "react";
import Image, { getImageProps } from "next/image";
import { ArrowUp } from "lucide-react";
import { contact } from "@/data/profile";

const NAME = "Jakub Kasprzyk";
// The same right-sized, optimised photo the top bar uses, not the 200 kB
// original for a 40px circle.
const PHOTO = {
  src: "/images/profile.jpg",
  width: 40,
  height: 40,
  alt: "",
} as const;

// Fetch it as soon as this chunk arrives. The chunk is loaded in the
// background while the visitor is still on the home screen, so the photo is
// already there when the app opens rather than requested at that moment.
if (typeof window !== "undefined") {
  const { props } = getImageProps(PHOTO);
  const warm = new window.Image();
  if (props.srcSet) warm.srcset = props.srcSet;
  warm.src = props.src;
}

// If the photo can't be loaded (offline, a blocked request), initials stand
// in for it. A broken-image glyph is never the right thing to show.
function Avatar() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="msg__avatar msg__avatar--initials" aria-hidden>
        {NAME.split(" ")
          .map((part) => part[0])
          .join("")}
      </span>
    );
  }
  return (
    <Image
      {...PHOTO}
      alt=""
      loading="eager"
      className="msg__avatar"
      onError={() => setFailed(true)}
    />
  );
}

// The wording in the bubbles is the contact section's, sentence for sentence.
// Nothing typed here leaves the visitor's device: "send" is a mailto: link
// that opens their own mail app with the text filled in.
export default function MessagesApp() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const text = draft.trim();
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    "Hi Jakub",
  )}&body=${encodeURIComponent(text)}`;

  return (
    <div className="msg">
      <header className="msg__bar">
        <Avatar />
        <h2 className="msg__name">{NAME}</h2>
      </header>

      <div className="msg__thread">
        <p className="bubble">Say hi.</p>
        <p className="bubble">
          Email me at <a href={`mailto:${contact.email}`}>{contact.email}</a> or
          call <a href={contact.phoneHref}>{contact.phone}</a>.
        </p>
        <p className="bubble">
          You can also reach me on{" "}
          {contact.socials.map((s, i) => (
            <span key={s.href}>
              {i > 0 && (i === contact.socials.length - 1 ? " or " : ", ")}
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
          .
        </p>

        {sent.map((message, i) => (
          <p key={i} className="bubble bubble--out">
            {message}
          </p>
        ))}
        {sent.length > 0 && (
          <p className="msg__status" aria-live="polite">
            Finish sending in your mail app
          </p>
        )}
      </div>

      <div className="msg__composer">
        <label className="sr-only" htmlFor="msg-draft">
          Message
        </label>
        <textarea
          id="msg-draft"
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message"
          className="msg__input"
        />
        {/* A real link, so it works exactly like tapping an email address;
            without text it isn't a link at all. */}
        <a
          className="msg__send"
          href={text ? mailto : undefined}
          aria-disabled={!text}
          aria-label="Send by email"
          onClick={() => {
            if (!text) return;
            setSent((all) => [...all, text]);
            setDraft("");
          }}
        >
          <ArrowUp size={16} aria-hidden />
        </a>
      </div>
    </div>
  );
}

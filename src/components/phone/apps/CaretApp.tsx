"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { contributions } from "@/data/contributions";
import AppScreen from "../AppScreen";

// Both fixes are about the same symptom: a single-line TextInput on iOS
// drawing a few points off its vertical centre after its native view had
// been used by a different TextInput. The numbers and conditions below come
// from the pull requests themselves; the fields are drawn in CSS to show
// what that looked like and are not the real component.
export default function CaretApp() {
  const [fixed, setFixed] = useState(false);

  return (
    <AppScreen title="Caret">
      <p className="caret__lead">
        Two fixes of mine in React Native core. A single-line{" "}
        <code>TextInput</code> on iOS could draw off its vertical centre after
        its native view was reused.
      </p>

      <div className="seg" role="group" aria-label="Show the field">
        <button
          type="button"
          aria-pressed={!fixed}
          onClick={() => setFixed(false)}
        >
          Before
        </button>
        <button
          type="button"
          aria-pressed={fixed}
          onClick={() => setFixed(true)}
        >
          After
        </button>
      </div>

      <div className="caret__demo" data-fixed={fixed || undefined}>
        <div className="caret__case">
          <div className="field">
            <input
              className="field__input field__input--high"
              defaultValue="Hello"
              aria-label="Example field with typed text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <span className="field__centre" aria-hidden />
          </div>
          <p className="caret__note">
            <strong>Typed text and caret.</strong> Tap in. View last used by a
            32 pt field: while focused, the caret and text sit above centre
            (4.67 pt in the issue&apos;s reproducer).
          </p>
        </div>

        <div className="caret__case">
          <div className="field">
            <input
              className="field__input field__input--low"
              placeholder="Search"
              aria-label="Example field with a placeholder"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <span className="field__centre" aria-hidden />
          </div>
          <p className="caret__note">
            <strong>Placeholder.</strong> View last used by a field with a
            lineHeight: placeholder drawn below centre. Typed text was not
            affected.
          </p>
        </div>
      </div>

      <p className="caret__disclaimer">
        Drawn in CSS to show what it looked like. Not the real component.
      </p>

      <ul className="caret__prs">
        {contributions.map((c) => (
          <li key={c.id}>
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              <span className="caret__pr">
                {c.project} #{c.url.split("/").pop()}
                <ArrowUpRight size={13} aria-hidden />
              </span>
              <span className="caret__pr-title">{c.title}</span>
              <span className="caret__pr-meta">merged · {c.date}</span>
            </a>
          </li>
        ))}
      </ul>
    </AppScreen>
  );
}

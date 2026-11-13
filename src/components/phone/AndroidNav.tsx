"use client";

import { useContext } from "react";
import { Circle, Square, Triangle } from "lucide-react";
import { PhoneNavContext } from "./nav";

// Part of the Android skin (see OsToggle and the "Android skin" block in
// phone.css): the three-button bar that replaces the home indicator. Hidden
// by CSS unless <html data-os="android">, so it costs nothing on iOS.
export default function AndroidNav() {
  const nav = useContext(PhoneNavContext);
  return (
    <div className="android-nav">
      <button type="button" aria-label="Back" onClick={() => nav?.back()}>
        <Triangle size={15} aria-hidden style={{ rotate: "-90deg" }} />
      </button>
      <button type="button" aria-label="Home" onClick={() => nav?.home()}>
        <Circle size={15} aria-hidden />
      </button>
      {/* There is no app switcher here; the button is drawn for the bar to
          look right and says so to assistive tech. */}
      <button type="button" aria-label="Recent apps" disabled>
        <Square size={14} aria-hidden />
      </button>
    </div>
  );
}

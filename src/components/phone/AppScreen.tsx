import type { ReactNode } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The frame every app except the map draws itself in: room for the status
 * bar, an optional back button, a large title with any actions beside it,
 * and a body that scrolls on its own without dragging the page along.
 */
export default function AppScreen({
  title,
  back,
  actions,
  children,
  className = "",
}: {
  title: ReactNode;
  back?: { label: string; onClick: () => void };
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scr ${className}`}>
      <header className="scr__bar">
        <div className="scr__nav">
          {back ? (
            <button
              type="button"
              className="scr__back"
              onClick={back.onClick}
              aria-label={`Back to ${back.label}`}
            >
              {/* iOS names where you came from; Android just points back.
                  CSS shows one or the other. */}
              <span className="scr__back-ios">
                <ChevronLeft size={18} aria-hidden />
                {back.label}
              </span>
              <ArrowLeft size={20} aria-hidden className="scr__back-android" />
            </button>
          ) : null}
        </div>
        {/* h2: the page's one h1 is the headline beside the phone. */}
        {actions ? (
          <div className="scr__head">
            <h2 className="scr__title">{title}</h2>
            <div className="scr__actions">{actions}</div>
          </div>
        ) : (
          <h2 className="scr__title">{title}</h2>
        )}
      </header>
      <div className="scr__body">{children}</div>
    </div>
  );
}

/**
 * A tappable row in a list. The button is only the title; it is stretched
 * over the whole row with a pseudo-element, so the row can hold paragraphs
 * and other content a <button> isn't allowed to contain.
 */
export function ListRow({
  title,
  onClick,
  children,
}: {
  title: ReactNode;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <li className="lrow">
      <div className="lrow__main">
        <button type="button" className="lrow__hit" onClick={onClick}>
          {title}
        </button>
        {children && <div className="lrow__sub">{children}</div>}
      </div>
      <ChevronRight size={16} aria-hidden className="lrow__chevron" />
    </li>
  );
}

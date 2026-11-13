"use client";

import Bio from "@/components/Bio";
import { now } from "@/data/notes";
import AppScreen, { ListRow } from "../AppScreen";
import Stack, { useStack } from "../Stack";

function AboutNote() {
  const { pop } = useStack();
  return (
    <AppScreen title="About me" back={{ label: "Notes", onClick: pop }}>
      <div className="note-text">
        <Bio />
      </div>
    </AppScreen>
  );
}

function NowNote() {
  const { pop } = useStack();
  return (
    <AppScreen title="Now" back={{ label: "Notes", onClick: pop }}>
      <ul className="note-list">
        {now.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </AppScreen>
  );
}

function NotesList() {
  const { push } = useStack();
  return (
    <AppScreen title="Notes">
      <ul className="lrows">
        <ListRow title="About me" onClick={() => push(<AboutNote />)}>
          {/* The preview is the note itself, clamped: no second copy of the
              words to keep in sync. */}
          <div className="lrow__clamp" aria-hidden inert>
            <Bio />
          </div>
        </ListRow>
        {/* Only once it has been written: see src/data/notes.ts. */}
        {now.length > 0 && (
          <ListRow title="Now" onClick={() => push(<NowNote />)}>
            <p className="lrow__clamp">{now[0]}</p>
          </ListRow>
        )}
      </ul>
    </AppScreen>
  );
}

export default function NotesApp() {
  return (
    <Stack>
      <NotesList />
    </Stack>
  );
}

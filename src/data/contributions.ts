export interface Contribution {
  id: string;
  project: string;
  title: string;
  url: string;
  date: string;
}

// Only changes that have landed upstream. Open pull requests stay out until
// they are merged, so nothing here claims more than the project accepted.
export const contributions: Contribution[] = [
  {
    id: "2",
    project: "react-native",
    title:
      "Fixed TextInput placeholders on iOS drawing off-center after a lineHeight was removed or the view was recycled.",
    url: "https://github.com/react/react-native/pull/59195",
    date: "Oct 2026",
  },
  {
    id: "1",
    project: "react-native",
    title:
      "Fixed the caret and text drawing off-center in recycled single-line TextInputs on iOS.",
    url: "https://github.com/react/react-native/pull/59190",
    date: "Oct 2026",
  },
];

export interface EducationItem {
  id: string;
  school: string;
  schoolUrl?: string;
  field: string;
  location: string;
  period: string;
}

// School names are proper nouns kept in Polish, like Kraków and Łatwa Ustna
// elsewhere.
export const education: EducationItem[] = [
  {
    id: "2",
    school: "Politechnika Krakowska",
    schoolUrl: "https://www.pk.edu.pl/",
    field: "Bachelor of Engineering in Applied Computer Science",
    location: "Kraków, PL",
    period: "2026 – Present",
  },
  {
    id: "1",
    school: "Zespół Szkół Elektrycznych nr 1",
    schoolUrl: "https://www.zsel1.pl/",
    field: "Software Development Technician",
    location: "Kraków, PL",
    period: "2021 – 2026",
  },
];

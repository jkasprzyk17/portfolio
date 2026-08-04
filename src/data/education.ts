export interface EducationItem {
  id: string;
  school: string;
  schoolUrl?: string;
  field: string;
  location: string;
  period: string;
}

export const education: EducationItem[] = [
  {
    id: "1",
    // Proper noun kept in Polish, like Kraków and Łatwa Ustna elsewhere.
    school: "Zespół Szkół Elektrycznych nr 1",
    schoolUrl: "https://www.zsel1.pl/",
    field: "Software Development Technician",
    location: "Kraków, PL",
    period: "2021 – 2026",
  },
];

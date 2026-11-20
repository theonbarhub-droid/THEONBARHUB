// Source: Law Society of Ontario, "Lawyer licensing exam dates and deadlines"
// https://lso.ca/becoming-licensed/lawyer-licensing-process/licensing-examinations/examination-dates-and-deadlines
// Checked 2026-11-20. The LSO says dates are subject to change.

export type Exam = "Barrister" | "Solicitor";

export interface Sitting {
  id: string;
  season: "Summer" | "Fall" | "Winter";
  exam: Exam;
  examDate: string; // YYYY-MM-DD
  materialsYear: string;
  materialsRelease: string;
  applicationDeadline: string;
  accommodationDeadline: string;
  registrationDeadline: string; // also the deferral and cancellation deadline
}

export const LSO_DATES_URL =
  "https://lso.ca/becoming-licensed/lawyer-licensing-process/licensing-examinations/examination-dates-and-deadlines";
export const DATES_CHECKED = "2026-11-20";

export const sittings: Sitting[] = [
  { id: "fall-2026-barrister", season: "Fall", exam: "Barrister", examDate: "2026-11-03", materialsYear: "2026-27", materialsRelease: "2026-04-13", applicationDeadline: "2026-07-28", accommodationDeadline: "2026-08-04", registrationDeadline: "2026-09-21" },
  { id: "fall-2026-solicitor", season: "Fall", exam: "Solicitor", examDate: "2026-11-17", materialsYear: "2026-27", materialsRelease: "2026-04-13", applicationDeadline: "2026-07-28", accommodationDeadline: "2026-08-04", registrationDeadline: "2026-10-02" },
  { id: "winter-2027-barrister", season: "Winter", exam: "Barrister", examDate: "2027-02-25", materialsYear: "2026-27", materialsRelease: "2026-04-13", applicationDeadline: "2026-11-10", accommodationDeadline: "2027-01-12", registrationDeadline: "2027-01-12" },
  { id: "winter-2027-solicitor", season: "Winter", exam: "Solicitor", examDate: "2027-03-11", materialsYear: "2026-27", materialsRelease: "2026-04-13", applicationDeadline: "2026-11-10", accommodationDeadline: "2027-01-12", registrationDeadline: "2027-01-27" },
  { id: "summer-2027-barrister", season: "Summer", exam: "Barrister", examDate: "2027-06-08", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-03-01", accommodationDeadline: "2027-04-28", registrationDeadline: "2027-04-28" },
  { id: "summer-2027-solicitor", season: "Summer", exam: "Solicitor", examDate: "2027-06-22", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-03-01", accommodationDeadline: "2027-04-28", registrationDeadline: "2027-05-12" },
  { id: "fall-2027-barrister", season: "Fall", exam: "Barrister", examDate: "2027-11-02", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-07-28", accommodationDeadline: "2027-09-20", registrationDeadline: "2027-09-20" },
  { id: "fall-2027-solicitor", season: "Fall", exam: "Solicitor", examDate: "2027-11-16", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-07-28", accommodationDeadline: "2027-09-20", registrationDeadline: "2027-10-04" },
  { id: "winter-2028-barrister", season: "Winter", exam: "Barrister", examDate: "2028-02-22", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-11-26", accommodationDeadline: "2028-01-10", registrationDeadline: "2028-01-12" },
  { id: "winter-2028-solicitor", season: "Winter", exam: "Solicitor", examDate: "2028-03-07", materialsYear: "2027-28", materialsRelease: "2027-04-13", applicationDeadline: "2027-11-26", accommodationDeadline: "2028-01-10", registrationDeadline: "2028-01-28" },
];

// Results windows are OnBar Hub estimates, not LSO dates. Built from release days
// candidates reported for past sittings: Barrister results have landed about
// 37 to 45 days after the exam; Solicitor results about 6 to 8 weeks after,
// with the winter holidays pushing November Solicitor results into early January.
export interface ResultsEstimate {
  sittingId: string;
  windowStart: string;
  windowEnd: string;
  note: string;
}

export const resultsEstimates: ResultsEstimate[] = [
  {
    sittingId: "fall-2026-barrister",
    windowStart: "2026-12-10",
    windowEnd: "2026-12-18",
    note: "Past November Barrister results arrived in mid-December, before the LSO's holiday closure.",
  },
  {
    sittingId: "fall-2026-solicitor",
    windowStart: "2027-01-06",
    windowEnd: "2027-01-13",
    note: "The last two November Solicitor sittings released results on January 9, 2025 and January 7, 2026.",
  },
];

export function getSitting(id: string) {
  return sittings.find((s) => s.id === id);
}

import { formattingDateObj } from "../utils";

export type ShowMode = "all" | "unfinished" | "completed";

type DateGroups<T> = { [date: string]: T[] };

export function groupCalendarEvents<T>(
  groups: DateGroups<T>,
  mode: ShowMode,
  isDone: (item: T) => boolean,
  doneDate: (item: T) => number,
) {
  const dueDates: DateGroups<T> = {};
  const completedDates: DateGroups<T> = {};
  const events: DateGroups<T> = {};

  const add = (target: DateGroups<T>, date: string, item: T) => {
    (target[date] ??= []).push(item);
  };

  for (const [dueDate, items] of Object.entries(groups ?? {})) {
    for (const item of items) {
      const done = isDone(item);
      const showDue = !!dueDate && mode !== "completed" &&
        (mode === "all" || !done);

      if (showDue) {
        add(dueDates, dueDate, item);
        add(events, dueDate, item);
      }

      const timestamp = doneDate(item);
      if (mode === "unfinished" || !done || !Number.isFinite(timestamp) || timestamp <= 0) continue;

      const date = new Date(timestamp * 1000);
      if (Number.isNaN(date.getTime())) continue;

      const completionDate = formattingDateObj(date);
      add(completedDates, completionDate, item);
      // A task due and completed on the same day appears once in the agenda.
      if (!showDue || completionDate !== dueDate) {
        add(events, completionDate, item);
      }
    }
  }

  return { dueDates, completedDates, events };
}

export function getCalendarAgenda<T>(
  groups: { dueDates: DateGroups<T>; completedDates: DateGroups<T> },
  date: string,
  getId: (item: T) => number,
) {
  const completed = groups.completedDates[date] ?? [];
  const completedIds = new Set(completed.map(getId));
  // Same-day due dates belong in the completed list, with a due-date label.
  const due = (groups.dueDates[date] ?? []).filter(
    (item) => !completedIds.has(getId(item)),
  );

  return { due, completed };
}

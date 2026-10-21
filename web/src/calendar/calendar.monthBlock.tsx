import { Signal } from "@preact/signals";

import { DayCell, formatingDateStr } from "./calendar.dayCell";
import { daysInitial, monthNames } from "../constants";

import { TasksWithProject, UnsortedTask } from "./types";

interface MonthBlockProps {
  year: number;
  month: number;
  selectedDate: Signal<string>;
  isCompact: boolean;
  dueDatesTasksList: { [key: string]: TasksWithProject[] };
  dueDatesUnsortedsList: { [key: string]: UnsortedTask[] };
}

const generateCalendarGrid = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ] as (number | null)[];
};

export function MonthBlock({
  year,
  month,
  selectedDate,
  isCompact,
  dueDatesTasksList,
  dueDatesUnsortedsList,
}: MonthBlockProps) {
  const daysGrid = generateCalendarGrid(year, month);

  return (
    <div
      className={`${isCompact ? "bg-white p-4 rounded-sm border border-slate-100" : ""}`}
    >
      <h3
        className={`font-bold text-slate-800 mb-2 ${isCompact ? "text-sm text-center" : "hidden"}`}
      >
        {monthNames[month]}{" "}
        <span className="text-slate-400 font-normal">{year}</span>
      </h3>

      {/* Labels */}
      <div className="grid grid-cols-7 mb-2">
        {daysInitial.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-bold text-slate-400 opacity-60"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={`grid grid-cols-7 ${isCompact ? "gap-0.5" : "gap-2"}`}>
        {daysGrid.map((day, i) => (
          <DayCell
            key={i}
            dayNum={day}
            year={year}
            month={month}
            selectedDate={selectedDate}
            isCompact={isCompact}
            taskCount={
              dueDatesTasksList[formatingDateStr(year, month, day)]?.length
            }
            unsortedCount={
              dueDatesUnsortedsList[formatingDateStr(year, month, day)]?.length
            }
          />
        ))}
      </div>
    </div>
  );
}

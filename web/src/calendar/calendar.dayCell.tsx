import { Signal } from "@preact/signals";

interface DayCellProps {
  dayNum: number | null;
  year: number;
  month: number;
  selectedDate: Signal<string>;
  isCompact: boolean;
  taskCount: number;
  unsortedCount: number;
}

// Return YYYY-MM-DD
export function formatingDateStr(year: number, month: number, date: number | null) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

export function DayCell({
  dayNum,
  month,
  year,
  selectedDate,
  isCompact,
  taskCount,
  unsortedCount,
}: DayCellProps) {
  if (!dayNum) return <div />;

  const dateStr = formatingDateStr(year, month, dayNum);
  const isSelected = selectedDate.value === dateStr;
  const isToday =
    new Date().toDateString() === new Date(year, month, dayNum).toDateString();

  // COMPACT MODE (For 4, 6, 12 month views)
  if (isCompact) {
    return (
      <button
        onClick={() => (selectedDate.value = dateStr)}
        className={`
          aspect-square cursor-pointer flex items-center justify-center text-xs my-1 transition-all border-2 border-gray-200
          ${isSelected
            ? "bg-background text-white font-bold scale-110 shadow-sm"
            : "text-slate-600 hover:bg-slate-100"
          }
          ${isToday && !isSelected ? "text-indigo-600 font-bold bg-indigo-50" : ""}
          ${!isToday && !isSelected ? "bg-slate-50 font-semibold" : ""}
          ${taskCount > 0 ? "border-y-3 border-y-gray-400" : ""}
          ${unsortedCount > 0 ? "border-x-3 border-gray-400" : ""}
        `}
      >
        <div className="relative">
          {dayNum}
          {/* Tiny Dot for Event */}
          {!isSelected && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-indigo-400}"></div>
          )}
        </div>
      </button>
    );
  }

  // REGULAR MODE (For 1 Month View)
  return (
    <button
      onClick={() => (selectedDate.value = dateStr)}
      className={`
        aspect-square cursor-pointer rounded-sm flex flex-col items-center justify-between py-2 transition-all duration-200 border-3 border-gray-200
        ${isSelected
          ? "bg-background text-white shadow-lg shadow-indigo-200 scale-105 z-10"
          : "bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-200"
        }
        ${isToday && !isSelected ? "bg-indigo-50/50 text-indigo-700 font-bold" : ""}
      `}
    >
      <span className={`text-sm ${isSelected ? "font-bold" : "font-medium"}`}>
        {dayNum}
      </span>
      <div className="flex flex-col gap-y-1">
        <div className="grid grid-cols-6 gap-0.5">
          {Array.from({ length: taskCount }, (_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${isSelected ? "bg-white" : "bg-hover"} `}
              title="A Task"
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-0.5">
          {Array.from({ length: unsortedCount }, (_, idx) => (
            <div
              key={idx}
              className="w-3 h-3 bg-[#2eaadb]"
              title="An Unsorted Task"
            />
          ))}
        </div>
      </div>
    </button>
  );
}

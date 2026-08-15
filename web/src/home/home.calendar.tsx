import { useState } from "preact/hooks";
import { useSignal, useComputed, Signal, ReadonlySignal } from "@preact/signals";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";

import { Task } from "./types";

interface HomeCalendar {
  tasks: Signal<Task[]>;
  shownTasks: ReadonlySignal<Task[]>;
  taskFilters: any;
}

export function Calendar({
  tasks,
  shownTasks,
  taskFilters,
}: HomeCalendar) {
  // Track the first month of the 3-month view
  const [firstMonth, setFirstMonth] = useState(startOfMonth(new Date()));
  const currentYear = useSignal(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate 3 months starting from firstMonth
  const months = Array.from({ length: 3 }, (_, i) => {
    const monthDate = addMonths(firstMonth, i);
    const nthDayOfWeek = monthDate.getDay();
    const dateOffset = (24 * 60 * 60 * 1000) * nthDayOfWeek;
    const startOfGrid = new Date(monthDate); // Grid of calendar
    startOfGrid.setTime(startOfGrid.getTime() - dateOffset);
    return {
      date: monthDate,
      days: eachDayOfInterval({
        start: startOfGrid,
        end: endOfMonth(monthDate),
      }),
    };
  });

  const handlePrev = () => {
    setFirstMonth((prev) => subMonths(prev, 1));
  };

  const handleNext = () => {
    setFirstMonth((prev) => addMonths(prev, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    taskFilters.value = {
      ...taskFilters.value,
      selectedProject: format(day, "dd MMMM yyyy"),
      time: format(day, "yyyy-MM-dd"),
    }
  };

  const allTasksDates = useComputed(() => {
    const len = tasks.value.length;
    const dates = [];
    for (let i = 0; i < len; i++) {
      dates.push(tasks.value[i].due_date)
    }
    return dates;
  });

  const shownTasksDates = useComputed(() => {
    const len = shownTasks.value.length;
    const dates = [];
    for (let i = 0; i < len; i++) {
      dates.push(shownTasks.value[i].due_date)
    }
    return dates;
  });

  const tasksDoneDates = useComputed(() => {
    const len = shownTasks.value.length;
    const dates = [];
    for (let i = 0; i < len; i++) {
      if (shownTasks.value[i].done_date !== 0) {
        const doneDateUnix = new Date(shownTasks.value[i].done_date * 1000);
        dates.push(format(doneDateUnix, 'yyyy-MM-dd'));
      }
    }
    return dates;
  });

  const isShowDoneDate = useSignal(false);

  return (
    <div className="max-w-7xl text-lg mx-auto mb-5">
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mb-1">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <h2
          className="text-xl font-medium text-gray-800 min-w-max cursor-pointer"
          onClick={() => setSelectedDate(new Date())}
        >
          Calendar
        </h2>

        <button
          onClick={handleNext}
          className="p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div title="The dates where you completed task(s)" className="w-full flex flex-row justify-end-safe items-center mb-1 cursor-pointer">
        <button
          onClick={() => isShowDoneDate.value = !isShowDoneDate.value}
          type="button"
          id="show-done-date"
          class={`relative inline-flex h-5 w-9 items-center rounded-lg transition
                    ${isShowDoneDate.value ? "bg-background" : "bg-blue-200"}`}
        >
          <span
            class={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ease-in-out
                    ${isShowDoneDate.value ? "translate-x-5" : "translate-x-1"}`}
          ></span>
        </button>
        <label
          for="show-done-date"
          class={`ml-1 text-md cursor-pointer
                ${isShowDoneDate.value ? "text-background font-semibold" : "text-gray-500"}`}
        >
          Completed Dates
        </label>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {months.map((month, monthIdx) => (
          <div key={monthIdx} className="border border-gray-200 overflow-hidden">
            <h2
              onClick={() =>
                taskFilters.value = {
                  ...taskFilters.value,
                  selectedProject: format(month.date, "MMMM yyyy"),
                  time: format(month.date, "MMMM yyyy"),
                }
              }
              className="text-xl text-gray-700 py-2 bg-white text-center min-w-max cursor-pointer"
            >
              {new Date(month.date).getFullYear() == currentYear.value
                ? format(month.date, "MMMM")
                : format(month.date, "MMMM yyyy")
              }
            </h2>
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 bg-[#e0fffd] py-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-base font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 bg-white">
              {month.days.map((day, idx) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isCurrentMonth = isSameMonth(day, month.date);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);
                const isShown = shownTasksDates.value.includes(dateStr);
                const isDone = tasksDoneDates.value.includes(dateStr) && isShowDoneDate.value;
                const isInAll = allTasksDates.value.includes(dateStr);

                const stateCls = isSelected ? 'bg-background text-white rounded-sm'
                  : isDone ? 'bg-[#709ec1] rounded-sm'
                    : isShown ? 'bg-blue-200 rounded-sm'
                      : isCurrentDay ? 'bg-blue-50 text-blue-600 rounded-sm'
                        : isInAll ? 'bg-[#f6f7f8] rounded-sm'
                          : 'hover:bg-gray-100';

                return (
                  <button
                    key={idx}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-12 mx-0.5 my-0.5 font-medium flex items-center justify-center text-base cursor-pointer
                      ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                      ${stateCls}
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import { useState } from "preact/hooks";
import { ReportsTimeRange } from "../components/constants";
import { TimeRangeType } from "./hooks";

interface TimeToggleProps {
  timeRange: string;
  setTimeRange: (range: TimeRangeType) => string;
}

export default function TimeToggle({
  timeRange,
  setTimeRange,
}: TimeToggleProps) {
  // Add state to handle the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // The options for dropdown
  const dropdownOptions = Object.values(ReportsTimeRange).slice(2,);

  // Check if the currently selected timeRange is one of the dropdown options
  const isDropdownSelected = dropdownOptions.includes(timeRange as TimeRangeType);

  return (
    <div className="bg-white p-1.5 rounded-xl border border-slate-200 inline-flex shadow-sm">

      {
        ["Week", "Month"].map((range) => (
          <button
            key={range as TimeRangeType}
            onClick={() => {
              setTimeRange(range as TimeRangeType);
              setIsDropdownOpen(false); // Close dropdown if open
            }}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${timeRange === range
              ? "bg-background text-white shadow-md shadow-indigo-200"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
          >
            {range}
          </button>
        ))
      }

      {/* Dropdown Button Container */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${isDropdownSelected
            ? "bg-background text-white shadow-md shadow-indigo-200"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
        >
          {/* Show the selected dropdown value, or default to '1 Year' */}
          {isDropdownSelected ? timeRange : "1 Year"}

          {/* Small chevron icon to indicate it's a dropdown */}
          <svg
            className={`w-6 h-6 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden py-1">
            {dropdownOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setTimeRange(option as TimeRangeType);
                  setIsDropdownOpen(false); // Close after selection
                }}
                className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors ${timeRange === option
                  ? "bg-slate-50 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

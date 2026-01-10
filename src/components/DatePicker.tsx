import { useState, useRef, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  startOfToday,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
}

const CustomDatePicker = ({
  selected,
  onChange,
  placeholder = "Selecteer een datum",
  minDate,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const today = minDate || startOfToday();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <div className="flex space-x-1">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = isBefore(cloneDay, today);
        const isSelected = selected && isSameDay(cloneDay, selected);
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-9 w-9 flex items-center justify-center cursor-pointer text-sm transition-all rounded-lg
              ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600" : "text-gray-700 dark:text-gray-200"}
              ${isSelected ? "bg-blue-600 text-white! font-bold shadow-lg shadow-blue-500/30" : "hover:bg-blue-50 dark:hover:bg-blue-900/30"}
              ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
            `}
            onClick={() => {
              if (!isDisabled) {
                onChange(cloneDay);
                setIsOpen(false);
              }
            }}>
            {format(day, "d")}
            {isSameDay(day, today) && !isSelected && (
              <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="px-3 pb-3">{rows}</div>;
  };

  return (
    <div className="relative inline-block w-full" ref={containerRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full px-4 py-2.5 rounded-xl border transition-all cursor-pointer shadow-sm
          ${isOpen ? "border-blue-500 ring-4 ring-blue-500/10" : "border-gray-200 dark:border-gray-700 hover:border-blue-400"}
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <CalendarIcon
          className={`mr-3 h-5 w-5 ${isOpen ? "text-blue-500" : "text-gray-400"}`}
        />
        <span className={!selected ? "text-gray-400" : ""}>
          {selected ? format(selected, "PPP") : placeholder}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden min-w-[320px]">
          {renderHeader()}
          {renderDays()}
          {renderCells()}

          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex justify-between">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setIsOpen(false);
              }}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Vandaag
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="text-xs font-medium text-gray-500 hover:text-red-500">
              Wissen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

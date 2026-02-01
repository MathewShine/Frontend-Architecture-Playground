/**
 * Calendar Utility Functions
 * Handles date calculations, navigation, and CSV export
 */

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

/**
 * Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * Get month name from month number (1-12)
 */
export const getMonthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
};

/**
 * Get short month name
 */
export const getShortMonthName = (month) => {
  return getMonthName(month).substring(0, 3);
};

/**
 * Get previous month (returns 1-12 month)
 */
export const getPreviousMonth = (year, month) => {
  if (month === 1) {
    return { year: year - 1, month: 12 };
  }
  return { year, month: month - 1 };
};

/**
 * Get next month (returns 1-12 month)
 */
export const getNextMonth = (year, month) => {
  if (month === 12) {
    return { year: year + 1, month: 1 };
  }
  return { year, month: month + 1 };
};

/**
 * Check if a date is today
 */
export const isToday = (year, month, day) => {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
};

/**
 * Format date as YYYY-MM-DD
 */
export const formatDate = (year, month, day) => {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
};

/**
 * Parse date string YYYY-MM-DD to components
 */
export const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
};

/**
 * Get calendar grid data (includes previous/next month overflow days)
 */
export const getCalendarGrid = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const grid = [];

  // Previous month overflow
  const prevMonth = getPreviousMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(prevMonth.year, prevMonth.month);
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      day: daysInPrevMonth - i,
      month: prevMonth.month,
      year: prevMonth.year,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      isToday: year === currentYear && month === currentMonth && day === currentDay,
    });
  }

  // Next month overflow - only fill to complete 5 weeks (35 days total)
  const remainingCells = 35 - grid.length;
  const nextMonth = getNextMonth(year, month);
  for (let day = 1; day <= remainingCells; day++) {
    grid.push({
      day,
      month: nextMonth.month,
      year: nextMonth.year,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  return grid;
};

/**
 * Export events to CSV
 */
export const exportToCSV = (events, year, month) => {
  const headers = [
    "Date",
    "Ticker",
    "Company Name",
    "Event Type",
    "Market Cap",
    "EPS Actual",
    "EPS Forecast",
    "Revenue Actual",
    "Revenue Forecast",
  ];

  const monthStr = String(month).padStart(2, "0");
  const filteredEvents = events.filter((event) =>
    event.date.startsWith(`${year}-${monthStr}`)
  );

  const rows = filteredEvents.map((event) => [
    event.date,
    event.ticker || "N/A",
    event.company_name || "N/A",
    event.eventType,
    event.market_cap || "N/A",
    event.eps_actual || "N/A",
    event.eps_forecast || "N/A",
    event.revenue_actual || "N/A",
    event.revenue_forecast || "N/A",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};

/**
 * Download CSV file
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format event time for display
 */
export const formatEventTime = (time) => {
  if (!time) return "";
  return time;
};

/**
 * Get day of week name
 */
export const getDayName = (dayIndex) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
};

/**
 * Get short day name
 */
export const getShortDayName = (dayIndex) => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[dayIndex];
};

/**
 * Get events for entire month
 */
export const getEventsForMonth = (events, year, month) => {
  const monthStr = String(month).padStart(2, "0");
  return events.filter((event) => event.date.startsWith(`${year}-${monthStr}`));
};

/**
 * Count events by type for a month
 */
export const getEventStatistics = (events, year, month) => {
  const monthEvents = getEventsForMonth(events, year, month);
  
  const stats = {
    total: monthEvents.length,
    earnings: 0,
    highImpact: 0,
  };

  monthEvents.forEach((event) => {
    if (event.eventType === "EARNINGS") stats.earnings++;
    if (event.impact === "High") stats.highImpact++;
  });

  return stats;
};

/**
 * Find earnings wave period (consecutive days with high earnings activity)
 */
export const findEarningsWave = (events, year, month) => {
  const monthEvents = getEventsForMonth(events, year, month);
  const earningsEvents = monthEvents.filter((e) => e.eventType === "EARNINGS");
  
  if (earningsEvents.length === 0) return null;

  // Group by date
  const dateGroups = {};
  earningsEvents.forEach((event) => {
    if (!dateGroups[event.date]) {
      dateGroups[event.date] = [];
    }
    dateGroups[event.date].push(event);
  });

  // Find date range with most activity
  const dates = Object.keys(dateGroups).sort();
  if (dates.length === 0) return null;

  // Simple approach: find first and last date with earnings
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);

  return {
    start: `${getShortMonthName(startDate.getMonth() + 1)} ${startDate.getDate()}`,
    end: `${getShortMonthName(endDate.getMonth() + 1)} ${endDate.getDate()}`,
  };
};

/**
 * Generate calendar grid data as 2D array (weeks)
 */
export const generateCalendarGrid = (year, month) => {
  const flatGrid = getCalendarGrid(year, month);
  
  // Convert flat array to 2D array (weeks)
  const weeks = [];
  for (let i = 0; i < flatGrid.length; i += 7) {
    weeks.push(flatGrid.slice(i, i + 7));
  }
  
  return weeks;
};

/**
 * Get events for a specific date
 */
export const getEventsForDate = (events, year, month, day) => {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  const dateKey = `${year}-${monthStr}-${dayStr}`;
  
  return events.filter((event) => event.date === dateKey);
};

/**
 * Format date key (YYYY-MM-DD)
 */
export const formatDateKey = (year, month, day) => {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  return `${year}-${monthStr}-${dayStr}`;
};
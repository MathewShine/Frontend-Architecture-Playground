import { fetchEarningsCalendar } from "../MarketCalendar/earningsApi";

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get current month and year
 */
export const getCurrentMonthYear = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1, // 1-12
  };
};

/**
 * Check if given year/month is the current month
 */
export const isCurrentMonth = (year, month) => {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() + 1 === month;
};

/**
 * Fetch and process earnings events for specified month
 */
export const fetchNewsEventsData = async (year, month) => {
  const todayDate = getTodayDate();
  const isCurrentMonthView = isCurrentMonth(year, month);

  try {
    const allEvents = await fetchEarningsCalendar(year, month);

    // Sort by market cap descending (for display order within same date)
    const sortedEvents = allEvents.sort((a, b) => {
      const capA = a.market_cap || 0;
      const capB = b.market_cap || 0;
      return capB - capA;
    });

    let earningsInfoEvents = [];
    let monthlyOverviewEvents = [];

    if (isCurrentMonthView) {
      // CURRENT MONTH LOGIC:
      // Earnings Info = Today's events only
      // Monthly Overview = Rest of month (excluding today)
      earningsInfoEvents = sortedEvents.filter((event) => event.date === todayDate);
      monthlyOverviewEvents = sortedEvents.filter((event) => event.date !== todayDate);
    } else {
      // NON-CURRENT MONTH LOGIC:
      // Earnings Info = First date's events only
      // Monthly Overview = ALL dates (including first date)
      
      if (sortedEvents.length > 0) {
        // Find the earliest date in the month
        const sortedByDate = [...sortedEvents].sort((a, b) => 
          a.date.localeCompare(b.date)
        );
        const firstDate = sortedByDate[0].date;

        // Earnings Info: ALL events from the first date (sorted by market cap)
        earningsInfoEvents = sortedEvents.filter((event) => event.date === firstDate);
        
        // Monthly Overview: ALL events from ALL dates (including first date)
        monthlyOverviewEvents = sortedEvents; // Show everything in monthly overview
      }
    }

    return {
      earningsInfoEvents, // Events for left section (Earnings Info)
      monthlyOverviewEvents, // Events for right section (Monthly Overview)
      allEvents: sortedEvents,
      isCurrentMonth: isCurrentMonthView,
    };
  } catch (error) {
    console.error("Error fetching news events data:", error);
    return {
      earningsInfoEvents: [],
      monthlyOverviewEvents: [],
      allEvents: [],
      isCurrentMonth: isCurrentMonthView,
    };
  }
};

/**
 * Transform API event to Earnings Section format
 */
export const transformToEarningsFormat = (apiEvent) => {
  return {
    id: apiEvent.id,
    ticker: apiEvent.ticker,
    company: apiEvent.company_name,
    type: "Earnings Call",
    market_cap: apiEvent.market_cap,
    date: apiEvent.date,
    eps_forecast: apiEvent.eps_forecast,
    eps_actual: apiEvent.eps_actual,
    revenue_forecast: apiEvent.revenue_forecast,
    revenue_actual: apiEvent.revenue_actual,
  };
};

/**
 * Transform API event to Market News format
 */
export const transformToMarketNewsFormat = (apiEvent) => {
  // Extract date parts for display
  const date = new Date(apiEvent.date);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[date.getMonth()];

  return {
    id: apiEvent.id,
    date: apiEvent.date,
    displayDate: `${monthName} ${day}`,
    ticker: apiEvent.ticker,
    title: `${apiEvent.ticker} - ${apiEvent.company_name} Earnings Report`,
    company: apiEvent.company_name,
    source: "Earnings Calendar",
    category: "Earnings Report",
    categoryColor: "#137fec",
    priority: apiEvent.impact === "High",
    market_cap: apiEvent.market_cap,
    impact: apiEvent.impact,
  };
};

/**
 * Export events to CSV file
 */
export const exportEventsToCSV = (events, filename) => {
  // CSV Headers
  const headers = [
    "Date",
    "Ticker",
    "Company Name",
    "Market Cap (B)",
    "EPS Forecast",
    "EPS Actual",
    "Revenue Forecast (B)",
    "Revenue Actual (B)",
    "Impact Level",
  ];

  // Convert events to CSV rows
  const rows = events.map((event) => [
    event.date,
    event.ticker,
    event.company_name,
    event.market_cap ? (event.market_cap / 1000000000).toFixed(2) : "N/A",
    event.eps_forecast ? event.eps_forecast.toFixed(2) : "N/A",
    event.eps_actual ? event.eps_actual.toFixed(2) : "N/A",
    event.revenue_forecast
      ? (event.revenue_forecast / 1000000000).toFixed(2)
      : "N/A",
    event.revenue_actual
      ? (event.revenue_actual / 1000000000).toFixed(2)
      : "N/A",
    event.impact || "N/A",
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Create blob and download
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

// Tab configuration
export const tabs = [
  { label: "All Briefing", value: "all", count: null },
  { label: "Today", value: "earnings", count: null },
  { label: "Economic Data", value: "economic", count: null },
  { label: "Corporate Actions", value: "corporate", count: null },
];
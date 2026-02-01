// Earnings API Integration
// Fetches real earnings data from Azure backend

const API_BASE_URL = "";
const API_CODE = "";

/**
 * Fetch earnings calendar data from API
 * @param {number} year - Year (e.g., 2026)
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Array of earnings events
 */
export const fetchEarningsCalendar = async (year, month) => {
  try {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthStr = monthNames[month - 1];
    
    const url = `${API_BASE_URL}/earnings/calendar?month=${monthStr}&year=${year}&code=${API_CODE}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return transformAPIData(data);
  } catch (error) {
    console.error("Error fetching earnings calendar:", error);
    return [];
  }
};

/**
 * Transform API response to calendar event format
 */
const transformAPIData = (apiResponse) => {
  if (!apiResponse.data || !apiResponse.data.days) {
    return [];
  }

  const events = [];
  
  apiResponse.data.days.forEach((day) => {
    if (day.count === 0) return;
    
    day.events.forEach((event, index) => {
      events.push({
        id: `${event.ticker}-${day.date}-${index}`,
        date: day.date,
        ticker: event.ticker,
        company_name: event.company_name,
        eventType: "EARNINGS",
        title: "Earnings Report",
        time: "After Market Close",
        market_cap: event.market_cap,
        eps_actual: event.eps_actual,
        eps_forecast: event.eps_forecast,
        revenue_actual: event.revenue_actual,
        revenue_forecast: event.revenue_forecast,
        reporting_time: event.reporting_time,
        impact: determineImpact(event.market_cap),
      });
    });
  });

  return events;
};

/**
 * Determine impact level based on market cap
 * High: > $100B
 * Medium: > $10B
 * Low: < $10B
 */
const determineImpact = (marketCap) => {
  if (!marketCap) return "Low";
  if (marketCap > 100000000000) return "High";
  if (marketCap > 10000000000) return "Medium";
  return "Low";
};

/**
 * Get events by date (YYYY-MM-DD format)
 */
export const getEventsByDate = (events, date) => {
  return events.filter((event) => event.date === date);
};

/**
 * Get events by ticker
 */
export const getEventsByTicker = (events, ticker) => {
  return events.filter((event) => event.ticker === ticker);
};

/**
 * Count events by type
 */
export const countEventsByType = (events) => {
  return {
    earnings: events.filter((e) => e.eventType === "EARNINGS").length,
  };
};
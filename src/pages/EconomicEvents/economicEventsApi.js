// Economic Events API Integration
// Fetches economic events and market holidays from Azure backend

const API_BASE_URL = "";
const API_CODE = "";

/**
 * Fetch economic events calendar data from API
 * @param {number} year - Year (e.g., 2026)
 * @param {number} month - Month (1-12)
 * @returns {Promise<Array>} Array of economic events
 */
export const fetchEconomicCalendar = async (year, month) => {
  try {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthStr = monthNames[month - 1];
    
    const url = `${API_BASE_URL}/events/calendar?month=${monthStr}&year=${year}&code=${API_CODE}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return transformAPIData(data);
  } catch (error) {
    console.error("Error fetching economic events calendar:", error);
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
      if (event.type === "economic") {
        events.push({
          id: `${event.event}-${day.date}-${index}`,
          date: day.date,
          type: "economic",
          country: event.country,
          currency: event.currency,
          event: event.event,
          impact: event.impact,
          time: event.time,
          values: event.values,
          source: event.source,
        });
      } else if (event.type === "holiday") {
        events.push({
          id: `holiday-${day.date}-${index}`,
          date: day.date,
          type: "holiday",
          exchange: event.exchange,
          name: event.name,
          is_closed: event.is_closed,
          is_fully_closed: event.is_fully_closed,
          adjusted_hours: event.adjusted_hours,
          source: event.source,
        });
      }
    });
  });

  return events;
};

/**
 * Get events by date (YYYY-MM-DD format)
 */
export const getEventsByDate = (events, date) => {
  return events.filter((event) => event.date === date);
};

/**
 * Count events by type
 */
export const countEventsByType = (events) => {
  return {
    economic: events.filter((e) => e.type === "economic").length,
    holidays: events.filter((e) => e.type === "holiday").length,
  };
};

/**
 * Get high impact events
 */
export const getHighImpactEvents = (events) => {
  return events.filter((e) => e.type === "economic" && e.impact === "High");
};

/**
 * Format time for display (HH:MM:SS to HH:MM AM/PM)
 */
export const formatEventTime = (time) => {
  if (!time) return "";
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Format value with unit
 */
export const formatValue = (value, unit) => {
  if (value === null || value === undefined) return "N/A";
  
  if (unit === "%") {
    return `${value}%`;
  } else if (unit === "M") {
    return `${value}M`;
  } else if (unit === "B") {
    return `${value}B`;
  }
  
  return value.toString();
};
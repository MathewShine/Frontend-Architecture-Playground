// Previous Earnings API Integration
// Fetches last 4 quarters of earnings data for a ticker

const API_BASE_URL = "";

/**
 * Fetch previous 4 quarters earnings data
 * @param {string} ticker - Stock ticker symbol (e.g., "MSFT")
 * @returns {Promise<Object>} Previous earnings data with 4 quarters
 */
export const fetchPreviousEarnings = async (ticker) => {
  try {
    const url = `${API_BASE_URL}/earnings/previous?ticker=${ticker}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return transformPreviousEarningsData(data);
  } catch (error) {
    console.error("Error fetching previous earnings:", error);
    throw error;
  }
};

/**
 * Transform API response to component-friendly format
 */
const transformPreviousEarningsData = (apiResponse) => {
  if (!apiResponse.data || !apiResponse.data.earnings) {
    throw new Error("Invalid API response structure");
  }

  const { symbol, earnings } = apiResponse.data;

  // Reverse to get chronological order (oldest first)
  const sortedEarnings = [...earnings].reverse();

  return {
    ticker: symbol,
    quarters: sortedEarnings.map((quarter, index) => {
      // Determine quarter number from date
      const date = new Date(quarter.date);
      const month = date.getMonth() + 1; // 1-12
      let quarterNum = Math.ceil(month / 3);
      
      return {
        quarter: `Q${quarterNum}`,
        date: quarter.date,
        displayDate: formatQuarterDate(quarter.date),
        
        // EPS data - Change is actual vs estimated
        epsActual: quarter.eps_actual,
        epsEstimated: quarter.eps_estimated,
        epsChange: calculatePercentageChange(quarter.eps_estimated, quarter.eps_actual),
        epsBeaten: quarter.eps_actual > quarter.eps_estimated,
        
        // Revenue data - Change is actual vs estimated
        revenueActual: quarter.revenue_actual,
        revenueEstimated: quarter.revenue_estimated,
        revenueChange: calculatePercentageChange(quarter.revenue_estimated, quarter.revenue_actual),
        revenueBeaten: quarter.revenue_actual > quarter.revenue_estimated,
        
        // Price data for 7-day chart (3 before + earnings day + 3 after)
        priceData: quarter.price ? {
          before: quarter.price.before || [],
          earningsDay: quarter.price.earnings_day || null,
          after: quarter.price.after || [],
          earningsReaction: quarter.price.earnings_reaction || null,
        } : null,
      };
    }),
  };
};

/**
 * Format date to "MMM YYYY" (e.g., "JAN 2025")
 */
const formatQuarterDate = (dateStr) => {
  const date = new Date(dateStr);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Calculate percentage change between estimated and actual
 */
const calculatePercentageChange = (estimated, actual) => {
  if (!estimated || estimated === 0) return 0;
  return ((actual - estimated) / estimated) * 100;
};

/**
 * Format large numbers (e.g., 77673000000 -> "$77.7B")
 */
export const formatRevenue = (value) => {
  if (!value) return "N/A";
  
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
};

/**
 * Format volume (e.g., 36023004 -> "36.0M")
 */
export const formatVolume = (value) => {
  if (!value) return "N/A";
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

/**
 * Calculate YoY growth percentage
 */
export const calculateYoYGrowth = (quarters) => {
  if (quarters.length < 2) return null;
  
  const latest = quarters[quarters.length - 1];
  const previous = quarters[quarters.length - 2];
  
  if (!previous.revenueActual || previous.revenueActual === 0) return null;
  
  const growth = ((latest.revenueActual - previous.revenueActual) / previous.revenueActual) * 100;
  return growth;
};

/**
 * Format date to short format (e.g., "10/30")
 */
export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};
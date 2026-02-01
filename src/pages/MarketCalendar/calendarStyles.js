// Calendar Styles - Dark Mode and Light Mode
// Only EARNINGS event type supported

export const eventTypeColors = {
  EARNINGS: {
    dark: {
      primary: "#4ade80", // Light green for dark mode
      background: "rgba(74, 222, 128, 0.1)",
      border: "rgba(74, 222, 128, 0.2)",
    },
    light: {
      primary: "#137fec",
      background: "rgba(19, 127, 236, 0.1)",
      border: "rgba(19, 127, 236, 0.2)",
    },
  },
};

export const getEventIndicatorStyle = (eventType, darkMode = true) => {
  if (eventType === "EARNINGS") {
    const colors = darkMode ? eventTypeColors.EARNINGS.dark : eventTypeColors.EARNINGS.light;
    return {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: colors.primary,
    };
  }
  return {};
};

// Helper to get event colors based on mode
export const getEventColors = (eventType, darkMode = true) => {
  if (eventType === "EARNINGS") {
    return darkMode ? eventTypeColors.EARNINGS.dark : eventTypeColors.EARNINGS.light;
  }
  return eventTypeColors.EARNINGS.dark; // fallback
};

export const dialogStyles = {
  light: {
    background: "#ffffff",
    headerBackground: "rgba(248, 250, 252, 0.5)",
    cellBackground: "#ffffff",
    cellHoverBackground: "rgba(248, 250, 252, 1)",
    borderColor: "#e2e8f0",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    todayBackground: "rgba(19, 127, 236, 0.05)",
    todayBorder: "rgba(19, 127, 236, 0.5)",
    overlayBackground: "rgba(15, 23, 42, 0.4)",
  },
  dark: {
    background: "#0B0E11",
    headerBackground: "rgba(255, 255, 255, 0.02)",
    cellBackground: "#0B0E11",
    cellHoverBackground: "rgba(255, 255, 255, 0.03)",
    borderColor: "#233648",
    textPrimary: "#ffffff",
    textSecondary: "#92adc9",
    todayBackground: "rgba(19, 127, 236, 0.1)",
    todayBorder: "rgba(19, 127, 236, 0.5)",
    overlayBackground: "rgba(0, 0, 0, 0.5)",
  },
};

export const getThemeStyles = (darkMode) => {
  return darkMode ? dialogStyles.dark : dialogStyles.light;
};

export const commonStyles = {
  primaryColor: "#137fec",
  fontFamily: "'Manrope', sans-serif",
  borderRadius: "8px",
  borderRadiusLg: "12px",
  transitionDuration: "200ms",
};

export const impactColors = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
};
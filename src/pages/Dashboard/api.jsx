import { API_ENDPOINTS } from "./apiConstants";

/**
 * Check backend health status
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkHealthAPI = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.status === "Success") {
      return {
        success: true,
        message: data.message || "Backend connection established",
      };
    } else {
      return {
        success: false,
        message: "Backend health check failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to connect to backend server",
    };
  }
};

/**
 * Check database readiness
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkReadyAPI = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.READY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && data.status === "Success") {
      return {
        success: true,
        message: data.message || "Database connection available",
      };
    } else {
      return {
        success: false,
        message: "Database connection unavailable",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to verify database connection",
    };
  }
};
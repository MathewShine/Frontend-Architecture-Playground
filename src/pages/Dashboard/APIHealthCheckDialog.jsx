import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  Box,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  BubbleChart,
  Storage,
  Lock,
  PowerSettingsNew,
} from "@mui/icons-material";
import alogoPivotLogo from "../../assets/algopivot-logo.png";

const APIHealthCheckDialog = ({ open, onHealthCheckComplete, darkMode }) => {
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState("checking"); // checking, success, failed
  const [readyStatus, setReadyStatus] = useState("pending"); // pending, checking, success, failed
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      performHealthChecks();
    }
  }, [open]);

  const performHealthChecks = async () => {
    // Step 1: Check Health API
    setHealthStatus("checking");
    setProgress(35);

    try {
      const { checkHealthAPI } = await import("./api");
      const healthResult = await checkHealthAPI();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (healthResult.success) {
        setHealthStatus("success");
        setProgress(50);
        
        // Step 2: Check Ready API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setReadyStatus("checking");
        setProgress(70);

        const { checkReadyAPI } = await import("./api");
        const readyResult = await checkReadyAPI();

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (readyResult.success) {
          setReadyStatus("success");
          setProgress(100);
          
          // All checks passed
          await new Promise((resolve) => setTimeout(resolve, 800));
          onHealthCheckComplete(true);
        } else {
          setReadyStatus("failed");
          setProgress(50);
          setErrorMessage(
            "Database connectivity failed. Unable to fetch data at the moment."
          );
        }
      } else {
        setHealthStatus("failed");
        setProgress(20);
        setErrorMessage(
          "Service health check failed. Unable to connect to backend."
        );
      }
    } catch (error) {
      setHealthStatus("failed");
      setProgress(20);
      setErrorMessage("Connection error. Please check your network.");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const showError = healthStatus === "failed" || readyStatus === "failed";

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          bgcolor: darkMode ? "#111a22" : "#ffffff",
          backgroundImage: "none",
          border: darkMode ? "1px solid #233648" : "1px solid #cbd5e1",
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          maxWidth: 520,
        },
      }}
      BackdropProps={{
        sx: {
          bgcolor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      {/* Top Progress Line */}
      <Box
        sx={{
          height: 4,
          width: "100%",
          bgcolor: darkMode ? "#324d67" : "#cbd5e1",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${progress}%`,
            bgcolor: "#137fec",
            transition: "width 0.7s ease-in-out",
          }}
        />
      </Box>

      {/* Header Section */}
      <Box
        sx={{
          p: 4,
          borderBottom: darkMode ? "1px solid #233648" : "1px solid #e2e8f0",
        }}
      >
        {/* Logo and Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(19, 127, 236, 0.1)",
              p: 1,
              borderRadius: "8px",
            }}
          >
            <Box
              component="img"
              src={alogoPivotLogo}
              alt="AlgoPivot Logo"
              sx={{
                width: 24,
                height: 24,
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: darkMode ? "#ffffff" : "#0a0a0c",
              letterSpacing: "-0.02em",
            }}
          >
            AlgoPivot
          </Typography>
        </Box>

        {/* Title and Status Badge */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: darkMode ? "#ffffff" : "#0a0a0c",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {showError ? "Connection Error" : "Connecting AlgoPivot Systems"}
          </Typography>
          
          {!showError && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: "8px",
                bgcolor: "rgba(19, 127, 236, 0.2)",
                border: "1px solid rgba(19, 127, 236, 0.3)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  width: 8,
                  height: 8,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    bgcolor: "#137fec",
                    opacity: 0.75,
                    animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                    "@keyframes ping": {
                      "0%": {
                        transform: "scale(1)",
                        opacity: 1,
                      },
                      "75%, 100%": {
                        transform: "scale(2)",
                        opacity: 0,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "relative",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#137fec",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#137fec",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Initializing...
              </Typography>
            </Box>
          )}

          {showError && (
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "#ef4444",
                fontWeight: 500,
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Content Section: Vertical Stepper */}
      <Box sx={{ p: 4 }}>
        {/* Step 1: Service Health Check */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: 1,
            mb: 0.5,
          }}
        >
          {/* Icon and Line */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor:
                  healthStatus === "checking"
                    ? "rgba(19, 127, 236, 0.2)"
                    : healthStatus === "success"
                    ? "rgba(34, 197, 94, 0.2)"
                    : healthStatus === "failed"
                    ? "rgba(239, 68, 68, 0.2)"
                    : darkMode
                    ? "#233648"
                    : "#e2e8f0",
                color:
                  healthStatus === "checking"
                    ? "#137fec"
                    : healthStatus === "success"
                    ? "#22c55e"
                    : healthStatus === "failed"
                    ? "#ef4444"
                    : "#92adc9",
              }}
            >
              <BubbleChart sx={{ fontSize: 24 }} />
            </Box>
            <Box
              sx={{
                width: 2,
                height: 40,
                bgcolor: darkMode ? "#324d67" : "#cbd5e1",
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ pt: 0.5, pb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                    lineHeight: 1.2,
                  }}
                >
                  Service Health Check
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#92adc9",
                    mt: 0.5,
                  }}
                >
                  {healthStatus === "checking"
                    ? "Checking API availability and endpoint latency..."
                    : healthStatus === "success"
                    ? "Service endpoint healthy and responsive"
                    : "Service health check failed"}
                </Typography>
              </Box>
              {healthStatus === "checking" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: "2px solid #137fec",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 3s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
              )}
              {healthStatus === "success" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  ✓
                </Box>
              )}
              {healthStatus === "failed" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Step 2: Database Connectivity Check */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "48px 1fr",
            gap: 1,
            opacity: readyStatus === "pending" ? 0.5 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor:
                  readyStatus === "checking"
                    ? "rgba(19, 127, 236, 0.2)"
                    : readyStatus === "success"
                    ? "rgba(34, 197, 94, 0.2)"
                    : readyStatus === "failed"
                    ? "rgba(239, 68, 68, 0.2)"
                    : darkMode
                    ? "#233648"
                    : "#e2e8f0",
                color:
                  readyStatus === "checking"
                    ? "#137fec"
                    : readyStatus === "success"
                    ? "#22c55e"
                    : readyStatus === "failed"
                    ? "#ef4444"
                    : "#92adc9",
              }}
            >
              <Storage sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ pt: 0.5, pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: darkMode ? "#ffffff" : "#0a0a0c",
                    lineHeight: 1.2,
                  }}
                >
                  Database Connectivity Check
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#92adc9",
                    mt: 0.5,
                  }}
                >
                  {readyStatus === "pending"
                    ? "Waiting for service handshake..."
                    : readyStatus === "checking"
                    ? "Verifying database connection and readiness..."
                    : readyStatus === "success"
                    ? "Database connection established"
                    : "Database connectivity failed"}
                </Typography>
              </Box>
              {readyStatus === "checking" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: "2px solid #137fec",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 3s linear infinite",
                  }}
                />
              )}
              {readyStatus === "success" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  ✓
                </Box>
              )}
              {readyStatus === "failed" && (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          px: 4,
          py: 3,
          bgcolor: darkMode ? "rgba(24, 36, 48, 0.5)" : "rgba(0, 0, 0, 0.02)",
          borderTop: darkMode ? "1px solid #233648" : "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#92adc9",
              }}
            >
              System Readiness Score
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: darkMode ? "#ffffff" : "#0a0a0c",
              }}
            >
              {progress}%
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: 8,
              borderRadius: "999px",
              bgcolor: darkMode ? "#324d67" : "#cbd5e1",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: "#137fec",
                borderRadius: "999px",
                transition: "width 1s ease-in-out",
              }}
            />
          </Box>
        </Box>
        
        <Typography
          sx={{
            fontSize: "0.688rem",
            color: "#5d7d9b",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            mt: 1,
          }}
        >
          Security Check In Progress
        </Typography>

        {/* Logout Button on Error */}
        {showError && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<PowerSettingsNew />}
            onClick={handleLogout}
            sx={{
              mt: 3,
              height: 44,
              bgcolor: "#ef4444",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.938rem",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#dc2626",
              },
            }}
          >
            Logout
          </Button>
        )}
      </Box>

      {/* Bottom Brand Bar */}
      <Box
        sx={{
          px: 4,
          py: 1.5,
          bgcolor: darkMode ? "#0d141b" : "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.625rem",
            color: "#5d7d9b",
            fontWeight: 500,
          }}
        >
          VERSION 0.1.0-STABLE
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Lock sx={{ fontSize: 14, color: "#5d7d9b" }} />
          <Typography
            sx={{
              fontSize: "0.625rem",
              color: "#5d7d9b",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Encrypted Connection
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default APIHealthCheckDialog;
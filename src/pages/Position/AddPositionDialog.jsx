import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close, Search, Add } from "@mui/icons-material";

const AddPositionDialog = ({ open, onClose, darkMode = true }) => {
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [notes, setNotes] = useState("");

  const tickers = [
    { value: "AAPL", label: "AAPL - Apple Inc." },
    { value: "MSFT", label: "MSFT - Microsoft Corp." },
    { value: "NVDA", label: "NVDA - NVIDIA Corporation" },
    { value: "TSLA", label: "TSLA - Tesla, Inc." },
    { value: "GOOGL", label: "GOOGL - Alphabet Inc." },
    { value: "AMZN", label: "AMZN - Amazon.com Inc." },
    { value: "META", label: "META - Meta Platforms Inc." },
  ];

  const handleSubmit = () => {
    const positionData = {
      ticker,
      quantity: parseFloat(quantity),
      entryPrice: parseFloat(entryPrice),
      notes,
    };
    console.log("Position added:", positionData);
    // Add your submit logic here
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setTicker("");
    setQuantity("");
    setEntryPrice("");
    setNotes("");
    onClose();
  };

  const isFormValid = ticker && quantity && entryPrice;

  const dialogStyles = {
    backgroundColor: darkMode ? "#192633" : "#ffffff",
    borderColor: darkMode ? "#324d67" : "#e5e7eb",
    textPrimary: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#92adc9" : "#6b7280",
    inputBg: darkMode ? "#101922" : "#f9fafb",
    inputBorder: darkMode ? "#324d67" : "#d1d5db",
    footerBg: darkMode ? "rgba(0, 0, 0, 0.2)" : "#f9fafb",
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: dialogStyles.backgroundColor,
          border: `1px solid ${dialogStyles.borderColor}`,
          borderRadius: "12px",
          boxShadow: darkMode
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          maxWidth: "640px",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(8px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          borderBottom: `1px solid ${darkMode ? "rgba(50, 77, 103, 0.5)" : "rgba(229, 231, 235, 0.5)"}`,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: dialogStyles.textPrimary,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Add Position
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: dialogStyles.textSecondary,
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Define a new US equity position for AlgoPivot intelligence tracking.
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            color: dialogStyles.textSecondary,
            "&:hover": {
              color: dialogStyles.textPrimary,
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Ticker Field */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: dialogStyles.textPrimary,
                mb: 1,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Ticker
            </Typography>
            <TextField
              select
              fullWidth
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Search Ticker (e.g., AAPL, MSFT)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: dialogStyles.textSecondary, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: dialogStyles.inputBg,
                  borderRadius: "8px",
                  fontFamily: "'Manrope', sans-serif",
                  "& fieldset": {
                    borderColor: dialogStyles.inputBorder,
                  },
                  "&:hover fieldset": {
                    borderColor: "#137fec",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#137fec",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: dialogStyles.textPrimary,
                  fontSize: "1rem",
                  py: 1.75,
                },
              }}
            >
              <MenuItem value="" disabled>
                Search Ticker (e.g., AAPL, MSFT)
              </MenuItem>
              {tickers.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Quantity and Entry Price Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            {/* Quantity Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: dialogStyles.textPrimary,
                  mb: 1,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Quantity
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                inputProps={{ min: 0, step: 1 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: dialogStyles.inputBg,
                    borderRadius: "8px",
                    fontFamily: "'Manrope', sans-serif",
                    "& fieldset": {
                      borderColor: dialogStyles.inputBorder,
                    },
                    "&:hover fieldset": {
                      borderColor: "#137fec",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#137fec",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: dialogStyles.textPrimary,
                    fontSize: "1rem",
                    py: 1.75,
                  },
                }}
              />
            </Box>

            {/* Entry Price Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: dialogStyles.textPrimary,
                  mb: 1,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                Entry Price
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{
                          color: dialogStyles.textSecondary,
                          fontWeight: 500,
                          fontSize: "1rem",
                        }}
                      >
                        $
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: dialogStyles.inputBg,
                    borderRadius: "8px",
                    fontFamily: "'Manrope', sans-serif",
                    "& fieldset": {
                      borderColor: dialogStyles.inputBorder,
                    },
                    "&:hover fieldset": {
                      borderColor: "#137fec",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#137fec",
                      borderWidth: "2px",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: dialogStyles.textPrimary,
                    fontSize: "1rem",
                    py: 1.75,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Notes/Strategy Field */}
          <Box>
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: dialogStyles.textPrimary,
                mb: 1,
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              Notes/Strategy
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter trade rationale, conviction level, or hedging strategy..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: dialogStyles.inputBg,
                  borderRadius: "8px",
                  fontFamily: "'Manrope', sans-serif",
                  "& fieldset": {
                    borderColor: dialogStyles.inputBorder,
                  },
                  "&:hover fieldset": {
                    borderColor: "#137fec",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#137fec",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputBase-input": {
                  color: dialogStyles.textPrimary,
                  fontSize: "1rem",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          backgroundColor: dialogStyles.footerBg,
          borderTop: `1px solid ${darkMode ? "rgba(50, 77, 103, 0.5)" : "rgba(229, 231, 235, 0.5)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            minWidth: "100px",
            px: 2.5,
            py: 1.25,
            fontSize: "0.875rem",
            fontWeight: 700,
            textTransform: "none",
            color: dialogStyles.textSecondary,
            fontFamily: "'Manrope', sans-serif",
            "&:hover": {
              color: dialogStyles.textPrimary,
              backgroundColor: darkMode
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          variant="contained"
          startIcon={<Add />}
          sx={{
            minWidth: "140px",
            px: 3,
            py: 1.25,
            fontSize: "0.875rem",
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: "#137fec",
            color: "#ffffff",
            fontFamily: "'Manrope', sans-serif",
            boxShadow: "0 4px 14px 0 rgba(19, 127, 236, 0.2)",
            "&:hover": {
              backgroundColor: "#0d6ecd",
              boxShadow: "0 6px 20px 0 rgba(19, 127, 236, 0.3)",
            },
            "&:active": {
              transform: "scale(0.98)",
            },
            "&:disabled": {
              backgroundColor: dialogStyles.textSecondary,
              color: darkMode ? "#111827" : "#ffffff",
            },
          }}
        >
          Add Position
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddPositionDialog;
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import { Close, FilterAltOff } from "@mui/icons-material";

const FiltersDialog = ({
  open,
  onClose,
  filters,
  onApply,
  darkMode,
  availableTickers,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const themeColors = {
    bg: darkMode ? "#0B0E11" : "#ffffff",
    paper: darkMode ? "#111a22" : "#ffffff",
    border: darkMode ? "#324d67" : "#e5e7eb",
    text: darkMode ? "#ffffff" : "#111827",
    textSecondary: darkMode ? "#92adc9" : "#6b7280",
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      marketCapMin: null,
      marketCapMax: null,
      impactLevel: "all",
      tickers: [],
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  const handleClose = () => {
    setLocalFilters(filters); // Reset to original filters
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeColors.paper,
          borderRadius: "12px",
          border: `1px solid ${themeColors.border}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${themeColors.border}`,
          pb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: themeColors.text,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          Filter Events
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <Close sx={{ color: themeColors.textSecondary }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Market Cap Filter */}
        <Box sx={{ mb: 3,mt:3 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: themeColors.text,
              mb: 1.5,
              textTransform: "capitalize",
              letterSpacing: "0.5px",
            }}
          >
            Market Capitalization (in Billions)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Min"
              type="number"
              value={localFilters.marketCapMin || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  marketCapMin: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              size="small"
              fullWidth
              InputProps={{
                sx: {
                  color: themeColors.text,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeColors.border,
                  },
                },
              }}
              InputLabelProps={{
                sx: { color: themeColors.textSecondary },
              }}
            />
            <Typography sx={{ color: themeColors.textSecondary }}>to</Typography>
            <TextField
              label="Max"
              type="number"
              value={localFilters.marketCapMax || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  marketCapMax: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              size="small"
              fullWidth
              InputProps={{
                sx: {
                  color: themeColors.text,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeColors.border,
                  },
                },
              }}
              InputLabelProps={{
                sx: { color: themeColors.textSecondary },
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: themeColors.textSecondary,
              mt: 0.5,
              fontStyle: "italic",
            }}
          >
            Leave empty for no limit
          </Typography>
        </Box>
        {/* Ticker Filter */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: themeColors.text,
              mb: 1.5,
              textTransform: "capitalize",
              letterSpacing: "0.5px",
            }}
          >
            Specific Tickers
          </Typography>
          <Autocomplete
            multiple
            options={availableTickers}
            value={localFilters.tickers}
            onChange={(e, newValue) =>
              setLocalFilters({ ...localFilters, tickers: newValue })
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option}
                  label={option}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: "rgba(19, 127, 236, 0.1)",
                    color: "#137fec",
                    fontWeight: 600,
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select tickers..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  sx: {
                    color: themeColors.text,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: themeColors.border,
                    },
                  },
                }}
              />
            )}
          />
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: themeColors.textSecondary,
              mt: 0.5,
              fontStyle: "italic",
            }}
          >
            Leave empty to show all tickers
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${themeColors.border}`,
          px: 3,
          py: 2,
          gap: 1,
        }}
      >
        <Button
          startIcon={<FilterAltOff />}
          onClick={handleReset}
          sx={{
            color: themeColors.textSecondary,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Reset
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={handleClose}
          sx={{
            color: themeColors.textSecondary,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            backgroundColor: "#137fec",
            color: "#ffffff",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#0d6ecd",
            },
          }}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FiltersDialog;
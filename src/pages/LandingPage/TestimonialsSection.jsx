import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Finally a platform that treats retail traders with institutional-grade tools.",
      name: "H. Matsumoto",
      role: "Quantitative Analyst",
    },
    {
      quote: "The calendar-to-execution workflow has cut my prep time by 70%.",
      name: "Sarah Jenkins",
      role: "Day Trader",
    },
    {
      quote: "Security was my main concern. AlgoPivot's read-only mode is exactly what I needed.",
      name: "David Chen",
      role: "Risk Manager",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 12, md: 24 },
        bgcolor: "#0a0a0c",
      }}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          px: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              sx={{
                p: 4,
                borderRadius: "16px",
                bgcolor: "rgba(22, 22, 24, 0.5)",
                border: "1px solid #233648",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#161618",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: 500,
                  fontStyle: "italic",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                "{testimonial.quote}"
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#334155",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                    }}
                  >
                    {testimonial.role}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TestimonialsSection;
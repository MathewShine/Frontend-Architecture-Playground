import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Analytics, BarChart, ShowChart } from '@mui/icons-material';

const BottomCards = ({ darkMode }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* P&L Simulation Card */}
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: { xs: 1.5, md: 2 } }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: '0.625rem', md: '0.688rem' },
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                P&L Simulation
              </Typography>
              <Analytics sx={{ color: 'primary.main', fontSize: { xs: 20, md: 24 } }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontVariantNumeric: 'tabular-nums', fontSize: { xs: '1.75rem', md: '2.125rem' } }}>
              $325,400
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: { xs: 2, md: 3 } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', md: '0.813rem' } }}>
                Projected EOD
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0bda5b', fontSize: { xs: '0.75rem', md: '0.813rem' } }}>
                +1.2%
              </Typography>
            </Box>
            <Box sx={{ height: { xs: 80, md: 96 } }}>
              <svg width="100%" height="100%" viewBox="0 0 478 150" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#137fec" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                  fill="url(#g)"
                />
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#137fec"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Placeholder Cards */}
      {[
        { icon: BarChart, text: 'Add Sector Exposure' },
        { icon: ShowChart, text: 'Add Risk Heatmap' },
      ].map((item, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box
            sx={{
              height: '100%',
              minHeight: { xs: 200, md: 240 },
              border: 2,
              borderStyle: 'dashed',
              borderColor: 'divider',
              borderRadius: { xs: 1.5, md: 2 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: { xs: 3, md: 4 },
              cursor: 'pointer',
              bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                '& .icon-box': {
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box
              className="icon-box"
              sx={{
                width: 40,
                height: 40,
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                transition: 'transform 0.2s',
              }}
            >
              <item.icon sx={{ color: 'text.secondary' }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center', fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
              {item.text}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', md: '0.813rem' } }}>
              Intelligence widget
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default BottomCards;
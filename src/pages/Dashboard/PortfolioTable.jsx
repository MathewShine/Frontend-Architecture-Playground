import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const portfolioData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    side: 'LONG',
    size: 1250,
    entryPrice: 172.45,
    lastPrice: 189.12,
    pnl: 9.66,
    marketValue: 236400,
    riskScore: 25,
    isPositive: true,
    dayChange: 2.34,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    side: 'SHORT',
    size: 400,
    entryPrice: 245.10,
    lastPrice: 212.80,
    pnl: 13.18,
    marketValue: 85120,
    riskScore: 68,
    isPositive: true,
    dayChange: -5.67,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    side: 'LONG',
    size: 850,
    entryPrice: 415.60,
    lastPrice: 408.25,
    pnl: -1.77,
    marketValue: 347012,
    riskScore: 15,
    isPositive: false,
    dayChange: -1.12,
  },
];

const PortfolioTable = ({ darkMode }) => {
  const getRiskColor = (score) => {
    if (score < 30) return '#137fec';
    if (score < 50) return '#0bda5b';
    if (score < 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box sx={{ position: 'relative', mb: { xs: 3, md: 4 } }}>
      {/* Active Positions Heading - Top RIGHT Corner */}
      <Box
      sx={{
  position: 'absolute',
  top: -12,
  right: 24,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  px: 2,
  py: 0.5,
  borderRadius: '9999px',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  zIndex: 1,
}}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            bgcolor: '#0bda5b',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            color: 'text.primary',
            textTransform: 'capitalize',
            letterSpacing: '0.05em',
          }}
        >
          Active Positions
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: { xs: 1.5, md: 2 },
          overflow: 'auto',
        }}
      >
        <Table 
          sx={{ 
            minWidth: { xs: 900, md: 'auto' },
            tableLayout: 'fixed',
            width: '100%'
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: darkMode ? '#192633' : 'rgba(0,0,0,0.02)' }}>
              <TableCell sx={{ width: '11%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Symbol
              </TableCell>
              <TableCell sx={{ width: '9%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Side
              </TableCell>
              <TableCell sx={{ width: '9%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Size
              </TableCell>
              <TableCell sx={{ width: '11%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Entry Price
              </TableCell>
              <TableCell align="right" sx={{ width: '11%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Last Price
              </TableCell>
              <TableCell sx={{ width: '11%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Day Change
              </TableCell>
              <TableCell sx={{ width: '11%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                P&L (%)
              </TableCell>
              <TableCell sx={{ width: '13%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Market Value
              </TableCell>
              <TableCell sx={{ width: '14%', fontSize: { xs: '0.625rem', md: '0.688rem' }, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', py: { xs: 1.5, md: 2 }, px: { xs: 2, md: 2.5 }, whiteSpace: 'nowrap' }}>
                Risk Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolioData.map((row) => (
              <TableRow
                key={row.symbol}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' },
                }}
              >
                <TableCell sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 2, md: 2.5 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: '0.875rem', md: '0.875rem' } }}>
                    {row.symbol}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: { xs: '0.688rem', md: '0.75rem' }, color: 'text.secondary' }}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ px: { xs: 2, md: 2.5 } }}>
                  <Chip
                    label={row.side}
                    size="small"
                    sx={{
                      bgcolor: row.side === 'LONG' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: row.side === 'LONG' ? '#10b981' : '#ef4444',
                      fontSize: { xs: '0.625rem', md: '0.688rem' },
                      fontWeight: 700,
                      height: 24,
                      borderRadius: '9999px',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, px: { xs: 2, md: 2.5 }, fontSize: { xs: '0.813rem', md: '0.875rem' } }}>
                  {row.size.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    color: darkMode ? '#92adc9' : 'text.secondary',
                    px: { xs: 2, md: 2.5 },
                    fontSize: { xs: '0.813rem', md: '0.875rem' },
                  }}
                >
                  ${row.entryPrice.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 700,
                    px: { xs: 2, md: 2.5 },
                    fontSize: { xs: '0.813rem', md: '0.875rem' },
                  }}
                >
                  ${row.lastPrice.toFixed(2)}
                </TableCell>
                <TableCell sx={{ px: { xs: 2, md: 2.5 } }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: row.dayChange >= 0 ? '#0bda5b' : '#ef4444',
                      fontSize: { xs: '0.813rem', md: '0.875rem' },
                    }}
                  >
                    {row.dayChange >= 0 ? '+' : ''}
                    {row.dayChange.toFixed(2)}%
                  </Typography>
                </TableCell>
                <TableCell sx={{ px: { xs: 2, md: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    {row.isPositive ? <TrendingUp sx={{ fontSize: 16, color: '#0bda5b' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                        color: row.isPositive ? '#0bda5b' : '#ef4444',
                        fontSize: { xs: '0.813rem', md: '0.875rem' },
                      }}
                    >
                      {row.isPositive ? '+' : ''}
                      {row.pnl.toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, px: { xs: 2, md: 2.5 }, fontSize: { xs: '0.813rem', md: '0.875rem' } }}>
                  ${row.marketValue.toLocaleString()}
                </TableCell>
                <TableCell sx={{ px: { xs: 2, md: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: { xs: 48, md: 64 },
                        height: 4,
                        bgcolor: darkMode ? '#324d67' : '#e2e8f0',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${row.riskScore}%`,
                          bgcolor: getRiskColor(row.riskScore),
                          borderRadius: '9999px',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: { xs: '0.75rem', md: '0.813rem' } }}>
                      {row.riskScore}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PortfolioTable;
import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const MobileDrawer = ({ open, onClose, menuItems, darkMode, selectedTab }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280, bgcolor: 'background.paper', height: '100%' }}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item} disablePadding>
              <ListItemButton selected={index === selectedTab}>
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontWeight: index === selectedTab ? 700 : 500,
                    color: index === selectedTab ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
              variant="caption"
              sx={{
                fontSize: '0.688rem',
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
              }}
            >
              NYSE: OPEN
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            14:22:45 EST
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
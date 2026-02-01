Earnings Calendar Module
Time-based, information-dense UI for tracking corporate earnings events. Week/month views with real-time API integration and institutional-grade data presentation.
What I Built
Full-featured earnings calendar with dual view modes (weekly/monthly), live API data fetching, expandable earnings history tables, and responsive design matching Bloomberg Terminal standards.
Technical Decisions
API Integration Pattern

Month-based API calls with 1-indexed months (month=1 for January)
Sequential loading for week spans (handles cross-month weeks)
Client-side event filtering and sorting (useMemo optimization)

State Management
javascript// Date selection logic: Today for current week, Sunday for other weeks
const isDateInCurrentWeek = (weekStart) => {
  // Smart default selection based on navigation context
};
```

**Dark/Light Theme System**
- Centralized theme objects in `calendarStyles.js`
- Color functions: `getThemeStyles(darkMode)`, `getEventColors(type, darkMode)`
- No hardcoded colors in components - all theme-aware

**Component Architecture**
```
CalendarGrid → CalendarCell (presentation)
EarningsTable → PreviousQuartersTable (accordion pattern)
MarketCalendarDialog (container - manages all state)
Good Practices I Followed

Separation of Concerns: API logic (earningsApi.js), utilities (calendarUtils.js), styles (calendarStyles.js) all separate
Data Transformation at Boundary: API response transformed once, components receive clean data
Responsive Typography: fontSize: { xs: '0.625rem', md: '0.75rem' } - mobile-first scaling
Fixed Table Layouts: tableLayout: 'fixed' prevents column jumping during updates
Null Safety: All data access has fallbacks (event.market_cap || "—")
Date Formatting Standards: YYYY-MM-DD for keys, localized display formats
CSV Export: Client-side generation, proper escaping, descriptive filenames
Accordion Pattern: Expandable rows with Collapse component for historical data
Loading States: Skeleton states, error boundaries, empty state messaging
Theme Consistency: All colors reference theme objects, zero inline hex codes

Why These Choices
Week vs Month View Logic: Week view shows company count per day, month view shows scrollable list - optimizes for screen real estate based on time scope.
1-Based Month Indexing: Backend expects month=jan format, converted from JavaScript's 0-based months. Explicit transformation prevents off-by-one errors.
Client-Side Filtering: Events are date-keyed strings. Array.filter on date prefix is O(n) but fast for <1000 events. No backend pagination needed.
Fixed Widths: Financial UIs need stable columns. Percentage-based widths ensure alignment across breakpoints.
Tech Stack
React 18 • Material-UI 5 • Date calculations in vanilla JS • REST API integration • Responsive grid system
Dashboard Module – Production-Ready Trading Interface

This module demonstrates how I architect mission-critical financial interfaces with enterprise-grade reliability patterns. The dashboard serves as the primary control center for portfolio management, implementing a health verification system that prevents users from accessing trading features when backend services are degraded.
What This Does
Real-time portfolio monitoring interface with automated system health checks, risk analytics, and position management. Built to institutional trading platform standards (Bloomberg Terminal, Interactive Brokers).

Key Features:

Sequential API health verification before granting dashboard access
Redux-persisted session state (health checks survive route changes)
Real-time position tracking with risk scoring algorithm
Responsive institutional-grade UI with dark/light themes

API Integration Architecture
The Problem
Users accessing a trading dashboard with degraded backend services leads to failed trades, stale data, and user frustration. Need a fail-safe verification system.
The Solution: Sequential Health Check Pattern
javascript// Two-stage verification before dashboard access
Stage 1: Backend API Health      (/api/health)
Stage 2: Database Connectivity    (/api/ready)

// Why sequential, not parallel?
// Database check only runs if API is healthy - prevents false positives
Implementation:
javascript// api.jsx - Clean separation of concerns
export const checkHealthAPI = async () => {
  const response = await fetch(API_ENDPOINTS.HEALTH);
  const data = await response.json();
  
  return response.ok && data.status === "Success"
    ? { success: true, message: data.message }
    : { success: false, message: "Backend health check failed" };
};

// Dashboard.jsx - Redux integration
const performHealthCheck = async () => {
  dispatch(startHealthCheck());
  
  const healthResult = await checkHealthAPI();
  if (!healthResult.success) {
    dispatch(healthCheckFailure("Service health check failed"));
    return; // Fail-fast pattern
  }
  
  const readyResult = await checkReadyAPI();
  readyResult.success 
    ? dispatch(healthCheckSuccess())
    : dispatch(healthCheckFailure("Database connectivity failed"));
};
Why This Pattern?

Fail-Fast Architecture: Don't waste time checking database if API is down
Redux Persistence: Health status survives page refresh - no redundant checks
Clear Error States: Users know exactly what's broken (API vs Database)
Session Efficiency: Verification runs once per login, not per route change

Good Practices Demonstrated
1. State Management Strategy
javascript// GOOD: Redux for session-critical data
const { isVerified } = useSelector(state => state.healthCheck);

// GOOD: Local state for UI interactions
const [positionDialogOpen, setPositionDialogOpen] = useState(false);
Why? Hybrid approach - don't over-engineer with Redux for everything, don't under-engineer with Context for critical data.
2. API Configuration Security
javascript// apiConstants.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || "";
// Actual URLs hidden in .env file (not committed to repo)
```

**Why?** Never hardcode API endpoints in source control. Environment variables = CI/CD ready.

### 3. Component Separation
```
Dashboard.jsx          → Container (theme, state, layout)
APIHealthCheckDialog   → Health check UI (single responsibility)
PortfolioTable         → Data display (presentational component)
api.jsx               → API logic (no UI coupling)
Why? Clean separation means I can swap out the health check UI without touching API logic, or change API implementation without touching components.
4. Error Handling Patterns
javascripttry {
  const result = await checkHealthAPI();
  if (!result.success) {
    // API returned error response
    dispatch(healthCheckFailure(result.message));
    return;
  }
} catch (error) {
  // Network-level failure (timeout, DNS, etc)
  dispatch(healthCheckFailure("Unable to connect to backend"));
}
Why? Two-level error handling: application errors vs network errors. Users get specific feedback.
5. Performance Optimization
javascriptuseEffect(() => {
  // Only run if not already verified
  if (!isVerified && !isChecking) {
    performHealthCheck();
  }
}, []); // Empty deps = runs once on mount
Why? Redux stores isVerified - when user navigates Dashboard → Earnings → Dashboard, health check doesn't re-run. Saves API calls and loading time.
6. Institutional UI Standards
javascript// Fixed table layout - columns never shift during updates
sx={{ tableLayout: 'fixed', width: '100%' }}

// Explicit column widths
<TableCell sx={{ width: '11%', whiteSpace: 'nowrap' }}>

// Tabular number formatting
sx={{ fontVariantNumeric: 'tabular-nums' }}
Why? Financial professionals need stable layouts. Column widths shifting during real-time updates is unacceptable in trading UIs. Tabular nums ensure decimal points align.
7. Responsive Strategy
javascript// Mobile: Enable horizontal scroll (don't hide columns)
sx={{ minWidth: { xs: 900, md: 'auto' } }}

// Traders need ALL data, even on phones
Why? Financial data is high-density by nature. Hiding columns on mobile defeats the purpose - traders will just zoom in. Better to enable smooth horizontal scroll.
Architecture Decisions
Why Redux Toolkit (Not Context API)?
Context re-renders all consumers on every state change. Health check status needs to persist across routes without causing unnecessary re-renders. Redux solves this.
Why Material-UI (Not Tailwind)?
Trading UIs need complex tables, consistent spacing, professional themes. MUI provides these out-of-box. Tailwind would require building table components from scratch.
Why Sequential Health Checks (Not Parallel)?
javascript// BAD: Parallel checks
Promise.all([checkHealth(), checkDB()]) 
// ❌ Database might succeed even if API is down (false positive)

// GOOD: Sequential checks  
if (await checkHealth()) await checkDB()
// ✅ DB only checked if API is healthy
Code Quality Standards
javascript// ✅ Descriptive boolean prefixes
const [isLoading, setIsLoading] = useState(false);

// ✅ Mobile-first responsive sizing
sx={{ fontSize: { xs: '0.625rem', md: '0.688rem' } }}

// ✅ Theme-aware colors (not hardcoded)
color: darkMode ? '#92adc9' : 'text.secondary'

// ✅ Async/await (not promise chains)
const result = await checkHealthAPI();
What I Learned

When to use Redux vs local state (session-critical vs UI-specific)
Sequential API patterns for dependent health checks
Financial UI standards (fixed layouts, tabular numbers, data density)
Fail-fast error handling (don't waste time on subsequent checks if first fails)
Performance optimization through state persistence
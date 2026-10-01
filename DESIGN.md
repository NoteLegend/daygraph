# Daygraph — design system

## 1. Atmosphere
An intimate personal dashboard: charcoal, soft silver type, spacious control surfaces and a quiet field of flowing light. React Bits inspires the living background and tactile interactions. Keep the approved habit and expense dashboard structure. No marketing landing page.

## 2. Palette
Canvas #101212; sidebar #141717; raised surface #1B1F1F; border #303737. Primary text #ECEFE9, secondary text #A6B0AA. Single accent: desaturated mint #B8D5BE. Muted amber #D8BE8C indicates outstanding balances; rose #D6A5A1 only for destructive actions. Charts use mint tints, slate, gray and amber with written labels. No pure black, neon glow or purple gradients.

## 3. Typography
Geist Variable for the interface, Geist Mono Variable for chart values, dates and compact data. Main headings 36–44px, body 16px, labels 14px, metadata at least 12px. Wide headings with careful negative tracking. Numbers use tabular spacing.

## 4. Components
Fine borders, restrained 16–24px radii, translucent charcoal chart panels. Metric strip separated with fine rules rather than repetitive equal cards. SpotlightCard light follows pointer inside panels. Mint filled primary action, StarBorder outlined secondary action, rounded checkbox with spring completion. Clear labels and accessible keyboard focus. Modal sheets retain the same palette and readable form controls.

## 5. Grid and responsive layout
Desktop: 232px persistent navigation and fluid main content, max-width 1480px. Wide overview/chart panel plus narrower category radar, followed by non-negotiables and activity. Approved dashboard layout takes precedence over the generic prohibition on charts/cards. Tablet collapses navigation; mobile uses a horizontally scrollable navigation rail, single-column panels, accessible transaction rows and scrollable habit grid. Never hide core functionality.

## 6. Motion
One low-opacity Aurora WebGL layer behind the shell. React Bits BlurText headings, CountUp statistics, ShinyText brand, Magnet primary action, StarBorder outline, ClickSpark click feedback, FadeContent/AnimatedContent entrances and SpotlightCard hover. Framer Motion (motion/react) powers page transitions, modal springs, chart changes, checked-state transitions and list reordering. Default springs stiffness 100/damping 20; stagger 50ms. Favor transform/opacity, avoid constant chart pulsing. Reduced motion disables background and ornamental animation and shortens transitions. No motion blocks typing or interaction.

## 7. Bans and product boundaries
No fake links, no dead buttons, no stock images, no hero, no decorative notifications. No exaggerated neon, heavy drop shadows, pure black or oversized gradients. Habits and expenses remain separate modules inside one shell. User-specific records persist server-side. Split repayments are never counted as spending; the spending charts count only the user's share of a shared bill. Clearly label the initial sample data and provide a real start-empty action.

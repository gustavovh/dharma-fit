# profeandres

Expo / React Native mobile MVP for a gym management app. Three roles in one app:
**Usuario** (cliente), **Entrenador**, **Administrador**, switchable via the role-switcher modal.

## Stack
- Expo Router (file-based routing) with Stack + Tabs
- React Native + react-native-safe-area-context
- AsyncStorage for persistence (seeded mock data on first run)
- @expo/vector-icons (Feather, MaterialCommunityIcons) — no emojis
- expo-blur for iOS tab bars
- expo-font (Inter family) loaded in `app/_layout.tsx`

## Design System
- Dark-mode first; palette in `constants/colors.ts` exposes `light` + `dark` (currently identical dark values) and `radius: 16`.
- Primary gold `#D4AF37`, accent lime `#B8FF3C`, background `#0A0A0B`.
- `hooks/useColors.ts` returns the active palette merged with `radius`.
- All UI strings in Spanish; inspired by Nike Training Club / Whoop / FitBod.

## Structure
- `app/_layout.tsx` — RoleProvider + initStorage; registers all Stack screens and the `role-switcher` modal.
- `app/index.tsx` — redirects to `(user)` / `(trainer)` / `(admin)` based on saved role.
- `app/(user)/` — tabs: home, routine, progress, attendance, profile.
- `app/(trainer)/` — tabs: home, clients, create-routine, measurements, profile.
- `app/(admin)/` — tabs: dashboard, users, memberships, payments, more.
- Pushed routes: `payments`, `notifications`, `notes`, `admin-attendance`, `admin-reports`, `admin-profile`, `client-detail/[id]`, `exercise-detail/[id]`.
- `components/` — shared primitives (Card, Button, Tag, Skeleton, Calendar, QRPlaceholder, RoleHeader, ExerciseCard, ClientListItem, NotificationItem, PaymentRow, PlanCard, TopTabs, etc.).
- `contexts/RoleContext.tsx` — persists active role in AsyncStorage key `saga_role`.
- `lib/storage.ts` — seeds and reads mock data.

## Conventions
- Web safe-area: `topPad = Platform.OS === "web" ? 67 : insets.top`, `bottomPad = web ? 34 : insets.bottom`, tab bar height 84 on web.
- Tab layouts use `Tabs` (not NativeTabs) with BlurView on iOS, solid bg on web/Android, gold active tint.
- Hardcoded IDs for the demo: `TRAINER_ID = "t1"`, `CURRENT_USER_ID = "u1"`.
- TypeScript strict; `pnpm exec tsc --noEmit` runs clean.

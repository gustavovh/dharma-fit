const darkPalette = {
  text: "#F5F7FB",
  tint: "#18F2B2",

  background: "#040811",
  backgroundSecondary: "#08111E",
  foreground: "#F8FBFF",

  card: "rgba(10, 17, 30, 0.92)",
  cardSecondary: "rgba(17, 27, 45, 0.88)",
  cardForeground: "#F8FBFF",

  primary: "#18F2B2",
  primaryForeground: "#04110D",

  secondary: "#0D1728",
  secondaryForeground: "#D8E5FF",

  muted: "#121D2F",
  mutedForeground: "#8D9AB3",

  accent: "#22C7FF",
  accentForeground: "#05111A",

  destructive: "#FF5F7A",
  destructiveForeground: "#FFFFFF",

  border: "rgba(132, 167, 255, 0.14)",
  input: "#0B1422",
  ringTrack: "#1B2940",
  shadow: "#22C7FF",
  success: "#18F2B2",
  warning: "#FDBA4D",
  overlay: "rgba(4, 8, 17, 0.76)",
  gradientBackground: ["#02050B", "#07111D", "#02060C"] as [string, string, string],
  gradientCard: ["rgba(18, 29, 48, 0.96)", "rgba(8, 15, 26, 0.92)"] as [string, string],
  gradientHero: ["rgba(34, 199, 255, 0.22)", "rgba(24, 242, 178, 0.16)", "rgba(5, 10, 19, 0.96)"] as [string, string, string],
  gradientAccent: ["#22C7FF", "#18F2B2"] as [string, string],
  glow: "rgba(24, 242, 178, 0.28)",
  glowSecondary: "rgba(34, 199, 255, 0.22)",
};

const colors = {
  light: darkPalette,
  dark: darkPalette,
  radius: 18,
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  typography: {
    title: 30,
    heading: 22,
    subheading: 16,
    body: 14,
    caption: 12,
  },
};

export default colors;

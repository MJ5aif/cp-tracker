// Color palette for different users - distinct colors that work in both light and dark themes
// Modern gradient-inspired colors with good contrast
export const USER_COLORS = [
  { bg: "#6366f1", bgLight: "#e0e7ff", name: "indigo" },     // User 1 - Indigo (primary brand)
  { bg: "#8b5cf6", bgLight: "#ede9fe", name: "violet" },     // User 2 - Violet
  { bg: "#ec4899", bgLight: "#fce7f3", name: "pink" },       // User 3 - Pink
  { bg: "#f97316", bgLight: "#ffedd5", name: "orange" },     // User 4 - Orange
  { bg: "#14b8a6", bgLight: "#ccfbf1", name: "teal" },       // User 5 - Teal
  { bg: "#3b82f6", bgLight: "#dbeafe", name: "blue" },       // User 6 - Blue
  { bg: "#f59e0b", bgLight: "#fef3c7", name: "amber" },      // User 7 - Amber
  { bg: "#06b6d4", bgLight: "#cffafe", name: "cyan" },       // User 8 - Cyan
  { bg: "#84cc16", bgLight: "#ecfccb", name: "lime" },       // User 9 - Lime
  { bg: "#a855f7", bgLight: "#f3e8ff", name: "purple" },     // User 10 - Purple
];

// Get color for a user based on their index
export function getUserColor(userIndex: number, isDark: boolean): string {
  const colorIndex = userIndex % USER_COLORS.length;
  return isDark ? USER_COLORS[colorIndex].bg : USER_COLORS[colorIndex].bgLight;
}

// Get color name for a user
export function getUserColorName(userIndex: number): string {
  const colorIndex = userIndex % USER_COLORS.length;
  return USER_COLORS[colorIndex].name;
}

// Create a map of handle -> color index
export function createUserColorMap(handles: string[]): Map<string, number> {
  const colorMap = new Map<string, number>();
  handles.forEach((handle, index) => {
    colorMap.set(handle.toLowerCase(), index);
  });
  return colorMap;
}

// Get CSS style for user background
export function getUserBgStyle(userIndex: number, isDark: boolean): React.CSSProperties {
  return {
    backgroundColor: getUserColor(userIndex, isDark),
  };
}

// Mixed color for when multiple users solved the same problem
export const MIXED_SOLVED_COLOR = {
  bg: "#475569",        // Slate for dark mode
  bgLight: "#e2e8f0",   // Light slate for light mode
};

export function getMixedSolvedColor(isDark: boolean): string {
  return isDark ? MIXED_SOLVED_COLOR.bg : MIXED_SOLVED_COLOR.bgLight;
}

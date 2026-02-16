// Color palette for different users - distinct colors that work in both light and dark themes
export const USER_COLORS = [
  { bg: "#0d6efd", bgLight: "#cfe2ff", name: "blue" },       // User 1 - Blue
  { bg: "#6f42c1", bgLight: "#e2d9f3", name: "purple" },     // User 2 - Purple
  { bg: "#fd7e14", bgLight: "#ffe5d0", name: "orange" },     // User 3 - Orange
  { bg: "#d63384", bgLight: "#f7d6e6", name: "pink" },       // User 4 - Pink
  { bg: "#20c997", bgLight: "#d2f4ea", name: "teal" },       // User 5 - Teal
  { bg: "#dc3545", bgLight: "#f8d7da", name: "red" },        // User 6 - Red
  { bg: "#0dcaf0", bgLight: "#cff4fc", name: "cyan" },       // User 7 - Cyan
  { bg: "#ffc107", bgLight: "#fff3cd", name: "yellow" },     // User 8 - Yellow
  { bg: "#6610f2", bgLight: "#e0cffc", name: "indigo" },     // User 9 - Indigo
  { bg: "#198754", bgLight: "#d1e7dd", name: "emerald" },    // User 10 - Emerald
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
  bg: "#6c757d",        // Gray for dark mode
  bgLight: "#e2e3e5",   // Light gray for light mode
};

export function getMixedSolvedColor(isDark: boolean): string {
  return isDark ? MIXED_SOLVED_COLOR.bg : MIXED_SOLVED_COLOR.bgLight;
}

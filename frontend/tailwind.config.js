import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // You can extend your theme with custom styles here
    },
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#778085", // Primary color
          secondary: "#d1e4f3", // Secondary color

          // Customizations
          accent: "#f9c74f", // Accent color (e.g., buttons, highlights)
          neutral: "#f5f5f5", // Neutral color (e.g., backgrounds)
          "base-100": "#ffffff", // Base color (e.g., base background)
          "base-200": "#f0f0f0", // Slightly darker base background
          "base-300": "#e0e0e0", // Even darker base background
          info: "#39a0ed", // Information color
          success: "#38b000", // Success color
          warning: "#f77f00", // Warning color
          error: "#d90429", // Error color
          
          // Additional customizations for text and background
          "text-primary": "#333333", // Primary text color
          "text-secondary": "#666666", // Secondary text color
          "text-muted": "#999999", // Muted text color
          "card-background": "#ffffff", // Card background color
          "card-shadow": "rgba(0, 0, 0, 0.1)", // Card shadow color
        },
      },
    ],
  },
};

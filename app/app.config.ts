module.exports = {
  name: "Cafe Vesuvius",
  slug: "cafe-vesuvius",
  version: "1.0.0",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
    "expo-font",
    "expo-secure-store",
    ["expo-dev-launcher", { launchMode: "most-recent" }],
  ],
  experiments: {
    typedRoutes: true,
  },
  newArchEnabled: true,
  // use the variable if it's defined, otherwise use the fallback
  EXPO_PUBLIC_API_UR:
    process.env.EXPO_PUBLIC_API_UR || "https://10.130.54.94/api",
};

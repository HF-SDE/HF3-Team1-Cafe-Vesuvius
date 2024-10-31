/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#D18E61';
const tintColorDark = '#9e5b2e';

export const Colors = {
  light: {
    text: '#090808',
    background: '#FCFCFB',
    tint: tintColorLight,
    icon: '#D5AF95',
    tabIconDefault: '#D5AF95',
    tabIconSelected: tintColorLight,
    primary: '#6d4a37',  
    secondary: '#D5AF95', 
    accent: '#d18e61'
  },
  dark: {
    text: '#f8f7f7',
    background: '#030302',
    tint: tintColorDark,
    icon: '#6a442a',
    tabIconDefault: '#6a442a',
    tabIconSelected: tintColorDark,
    primary: '#c8a592',  
    secondary: '#6a442a', 
    accent: '#9e5b2e'
  },
};

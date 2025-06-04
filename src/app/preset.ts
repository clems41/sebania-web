import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f1f9f1',
      100: '#e3f3e3',
      200: '#d4dce5',
      300: '#aadaac',
      400: '#7fc782',
      500: '#4CAF50',
      600: '#449c47',
      700: '#38803a',
      800: '#2c632d',
      900: '#1f4720',
      950: '#132b13'
    },
    surface: {
      0: '#ffffff',
      50: '#f5f5f5',
      100: '#ebebeb',
      200: '#d6d6d6',
      300: '#c2c2c2',
      400: '#a3a3a3',
      500: '#7a7a7a',
      600: '#666666',
      700: '#424242',
      800: '#333333',
      900: '#1f1f1f',
      950: '#141414'
    },
  },
});

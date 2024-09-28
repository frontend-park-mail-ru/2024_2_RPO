import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'nonblock-statement-body-position': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      eqeqeq: 'error',
    },
  },
];

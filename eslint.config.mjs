import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{ts,tsx}'] },
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

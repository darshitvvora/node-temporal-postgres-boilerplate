// @ts-check
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    // Enable stylistic formatting rules
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },

    // TypeScript and Vue are disabled by default, customize as needed
    typescript: false,
    vue: false,

    // Disable jsonc and yaml rules if you don't need them
    jsonc: false,
    yaml: false,

    // `.eslintignore` is no longer supported in ESLint 9 flat config, use ignores instead
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/build',
      '**/coverage',
      '**/.nyc_output',
      '**/logs',
      '**/public',
      '**/.tmp',
      '**/.cache',
      '**/temporal.db',
      '**/*.min.js',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
    ],
  },
  {
    // Custom rules for your project
    rules: {
      // Adjust these based on your preferences
      'no-console': 'off', // Allow console.log in Node.js projects
      'antfu/if-newline': 'off', // Less strict about if-statement formatting
      'node/prefer-global/process': 'off', // Allow process usage
      'perfectionist/sort-imports': 'error', // Keep imports sorted
      'unused-imports/no-unused-vars': 'warn', // Warn on unused vars instead of error

      // Replace buddy.js magic number detection
      'no-magic-numbers': ['warn', {
        ignore: [0, 1, -1], // Common numbers are fine
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
      }],
    },
  },
  {
    // Test file specific overrides
    files: ['tests/**/*.js', 'tests/**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
        chai: 'readonly',
        sinon: 'readonly',
        faker: 'readonly',
        app: 'readonly',
      },
    },
    rules: {
      'no-magic-numbers': 'off', // Allow magic numbers in tests
      'no-unused-vars': 'off', // Allow unused vars in tests
      'unused-imports/no-unused-vars': 'off', // Allow unused vars in tests
    },
  },
);

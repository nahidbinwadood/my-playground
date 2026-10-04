import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Every modal goes through components/modal/common-modal.tsx so the fixed
  // header / scrolling body contract holds everywhere. Reaching for the raw
  // primitive is how that contract got broken before, so it is a lint error.
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    // the component showcase demos the raw Dialog primitive on purpose
    ignores: [
      'components/modal/**',
      'components/ui/**',
      'app/(homepage)/components/_components/demos/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/ui/dialog',
              importNames: ['DialogContent'],
              message:
                'Use CommonModal from @/components/modal/common-modal instead of DialogContent.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;

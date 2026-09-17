import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public/keycloakify-dev-resources']), //dist, node_modules gibi üretilmiş/vendor kod asla lint edilmez. public/keycloakify-dev-resources ise keycloakify tarafından üretilmiş ve değiştirilmeyecek kaynaklar içerdiği için lint edilmez. 
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          allowExportNames: [
            'checkoutPageMeta',
            'launchPageMeta',
            'registerPageMeta',
            'cerezPageMeta',
            'gizlilikPageMeta',
            'kullanimSartlariPageMeta',
            'kvkkPageMeta',
            'mesafeliSatisPageMeta',
            // Radix `Select` re-exports (select.tsx): `Root`/`Value` are
            // already components, but re-exporting an aliased import isn't
            // recognized as a component definition by this rule's heuristic.
            'Select',
            'SelectValue',
          ],
        },
      ],
    },
  },
  {
    files: ['src/main.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])

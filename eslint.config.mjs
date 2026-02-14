import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
	...nextVitals,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		'declarations.d.ts',
		// Husky and tooling (v10 config lookup lints from file dir; avoid parsing non-source)
		'.husky/**',
		'node_modules/**'
	])
]);

export default eslintConfig;

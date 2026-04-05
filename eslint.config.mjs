import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import boundaries from 'eslint-plugin-boundaries';

/** Feature-Sliced Design: only lower layers may be imported (no upward/cross leaks). */
const fsdElements = [
	{ type: 'app', pattern: 'src/app/**/*', mode: 'full' },
	{ type: 'pages', pattern: 'src/pages/**/*', mode: 'full' },
	{ type: 'widgets', pattern: 'src/widgets/**/*', mode: 'full' },
	{ type: 'features', pattern: 'src/features/**/*', mode: 'full' },
	{ type: 'entities', pattern: 'src/entities/**/*', mode: 'full' },
	{ type: 'shared', pattern: 'src/shared/**/*', mode: 'full' }
];

const fsdDependencyRules = [
	{
		from: { type: 'shared' },
		disallow: { to: { type: ['app', 'pages', 'widgets', 'features', 'entities'] } },
		message:
			'FSD: `shared` must not import domain layers (app/pages/widgets/features/entities). Move code or depend only on `shared`.'
	},
	{
		from: { type: 'entities' },
		disallow: { to: { type: ['app', 'pages', 'widgets', 'features'] } },
		message: 'FSD: `entities` must not import upper layers (features/widgets/pages/app).'
	},
	{
		from: { type: 'features' },
		disallow: { to: { type: ['app', 'pages', 'widgets'] } },
		message: 'FSD: `features` must not import `widgets`, `pages`, or `app` — compose them from above.'
	},
	{
		from: { type: 'widgets' },
		disallow: { to: { type: ['app', 'pages'] } },
		message: 'FSD: `widgets` must not import `pages` or `app`.'
	},
	{
		from: { type: 'app' },
		disallow: { to: { type: ['pages', 'widgets'] } },
		message: 'FSD: `app` must not import `pages` or `widgets`.'
	}
];

const eslintConfig = defineConfig([
	...nextVitals,
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		'declarations.d.ts',
		'.husky/**',
		'node_modules/**'
	]),
	{
		files: ['src/**/*.{ts,tsx}'],
		plugins: { boundaries },
		settings: {
			'boundaries/elements': fsdElements,
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json'
				}
			}
		},
		rules: {
			'boundaries/dependencies': [
				'error',
				{
					default: 'allow',
					rules: fsdDependencyRules,
					message:
						'FSD boundary: {{from.type}} is not allowed to depend on {{to.type}} (import: {{dependency.source}}).'
				}
			]
		}
	}
]);

export default eslintConfig;

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import boundaries from 'eslint-plugin-boundaries';

/** Feature-Sliced Design: only lower layers may be imported (no upward/cross leaks). */
const fsdElements = [
	{ type: 'app', pattern: 'src/app/**/*', mode: 'full' },
	{ type: 'pages', pattern: 'src/pages/**/*', mode: 'full' },
	{
		type: 'features',
		pattern: 'src/features/*',
		capture: ['featureSlice']
	},
	{
		type: 'entities',
		pattern: 'src/entities/*',
		capture: ['entitySlice']
	},
	{ type: 'shared', pattern: 'src/shared/**/*', mode: 'full' }
];

const fsdDependencyRules = [
	{
		from: { type: 'shared' },
		disallow: { to: { type: ['app', 'pages', 'features', 'entities'] } },
		message:
			'FSD: `shared` must not import domain layers (app/pages/features/entities). Move code or depend only on `shared`.'
	},
	{
		from: { type: 'entities' },
		disallow: { to: { type: ['app', 'pages', 'features'] } },
		message: 'FSD: `entities` must not import upper layers (features/pages/app).'
	},
	{
		from: { type: 'entities' },
		disallow: {
			to: {
				type: 'entities',
				captured: { entitySlice: '!{{ from.captured.entitySlice }}' }
			},
			dependency: { kind: 'value' }
		},
		message:
			'FSD: an entity slice must not value-import another entity slice (use `import type { ... }`, or colocate shared types in `shared`).'
	},
	{
		from: { type: 'features' },
		disallow: { to: { type: ['app', 'pages'] } },
		message: 'FSD: `features` must not import `pages` or `app` — compose them from above.'
	},
	{
		from: { type: 'features' },
		disallow: {
			to: {
				type: 'features',
				captured: { featureSlice: '!{{ from.captured.featureSlice }}' }
			},
			dependency: { kind: 'value' }
		},
		message:
			'FSD: a feature slice must not value-import another feature slice (use `import type { ... }`, `shared`, or compose in pages).'
	},
	{
		from: { type: ['app', 'pages', 'features', 'entities', 'shared'] },
		disallow: {
			to: {
				type: ['features', 'entities'],
				internalPath: '!index.ts'
			}
		},
		message: 'FSD: import a feature or entity from its index.ts. Deep imports stay inside that slice.'
	},
	{
		from: { type: 'app' },
		disallow: { to: { type: 'pages' } },
		message: 'FSD: `app` must not import `pages`.'
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
			'boundaries/legacy-templates': false,
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
	},
	{
		files: ['src/entities/*/index.ts'],
		rules: {
			'no-restricted-syntax': [
				'error',
				{
					selector:
						'ExportNamedDeclaration ExportSpecifier[exported.name=/^[a-z].*Api$/], ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name=/^[a-z].*Api$/]',
					message:
						'Do not export a public camelCase *Api client. Export the PascalCase class and its token.'
				}
			]
		}
	}
]);

export default eslintConfig;

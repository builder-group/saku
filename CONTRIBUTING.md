# Contributing to Saku

We are open and grateful for any contribution made by the community. If you're interested in contributing to Saku, this document might make the process for you easier.

The [Open Source Guides](https://opensource.guide/) website has a collection of resources for individuals,
communities, and companies who want to learn how to run and contribute to an open-source project.
Contributors and people new to open source will find the following guides especially useful:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Building Welcoming Communities](https://opensource.guide/building-community/)

## 👊 [Code of Conduct](https://code.fb.com/codeofconduct)

Please read [the full text](https://code.fb.com/codeofconduct), so that you are able to understand what interpersonal actions will and will not be tolerated.

## 🌟 Style Guide

For comprehensive development guidelines, please refer to our detailed rule files in the `.cursor/rules/` directory:

- **[Core Style Guide](.cursor/rules/style-guide.mdc)** - Core coding standards and style guidelines
- **[Next.js Guidelines](.cursor/rules/nextjs.mdc)** - Frontend development with Next.js
- **[Hono Guidelines](.cursor/rules/hono.mdc)** - Backend API development with Hono
- **[Vitest Guidelines](.cursor/rules/vitest.mdc)** - Testing patterns and best practices
- **[Drizzle Guidelines](.cursor/rules/drizzle.mdc)** - Database development with Drizzle ORM
- **[Shopify UI Guidelines](.cursor/rules/shopify-ui.mdc)** - Shopify-specific UI development

### `package.json` structure

The structure of the `package.json` file in this project should adhere to a specific format, as illustrated by the example structure below. This structure is based on the [npm documentation for creating a `package.json` file](https://docs.npmjs.com/creating-a-package-json-file).

```json
{
	"name": "@repo/template",
	"version": "0.0.1",
	"private": true, // Or false if package should be published
	"description": "Description of the package or app",
	"keywords": [],
	"homepage": "https://saku.so/?source=github",
	"bugs": {
		"url": "https://github.com/builder-group/saku/issues"
	},
	"repository": {
		"type": "git",
		"url": "https://github.com/builder-group/saku.git"
	},
	"license": "AGPL-3.0-or-later",
	"author": "@bennobuilder",
	"main": "./dist/cjs/index.js",
	"module": "./dist/esm/index.js",
	"source": "./src/index.ts",
	"types": "./dist/types/index.d.ts",
	"files": ["dist", "README.md"],
	"scripts": {
		"build": "shx rm -rf dist && rollup -c rollup.config.js",
		"build:prod": "export NODE_ENV=production && pnpm build",
		"clean": "shx rm -rf dist && shx rm -rf .turbo && shx rm -rf node_modules",
		"install:clean": "pnpm run clean && pnpm install",
		"lint": "eslint . --fix",
		"start:dev": "tsc -w",
		"test": "vitest run",
		"update:latest": "pnpm update --latest"
	},
	"dependencies": {
		// Project dependencies here
	},
	"peerDependencies": {
		// Project peerDependencies here
	},
	"devDependencies": {
		// Project devDependencies here
	}
}
```

For specific packages, additional fields should be included as shown below. Note that the fields `source`, `main`, `module`, `types`, and `files` are usually required in packages:

```json
{
	// ..
	// "scripts": ..,
	"source": "./src/index.ts", // Entry file (source code)
	"main": "./dist/cjs/index.js", // Entry point (CommonJS)
	"module": "./dist/esm/index.js", // Entry point (ES Module)
	"types": "./dist/types/index.d.ts", // Type definitions
	// ..
	// "devDependencies": {},
	"files": [
		// List of files to be included in your package
	]
}
```

### 📂 File & Folder Naming Conventions

- Use **lowercase kebab-case** for folders and files (`some-folder/`, `some-file.ts`)
- Use **singular names for categories** (`component/`, `layout/`, `config/`)
- Use **plural names for collections** (`hooks/`, `utils/`, `tests/`, `assets/`)
- **React components**: `PascalCase` -> `Button.tsx`, `UserProfile.tsx`
- **Class files**: `PascalCase` -> `User.ts`, `DatabaseConnection.ts`
- **Function files**: `snake-case` -> `get-users.ts`, `fetch-data.ts`
- Keep names **clear, descriptive, and consistent**—avoid unnecessary abbreviations

## 🚀 Deployment & Stages

### Stages

Our project supports multiple deployment stages to ensure proper development and release workflows:

#### Local Stage (`local`)

- **Purpose**: Local development on your machine
- **Environment**: Development environment with hot-reload and debugging capabilities
- **Access**: Only accessible on your local machine (typically `localhost:3000` or similar)
- **Database**: Local database instance or development database
- **Configuration**: Uses local environment variables and development configs
- **Usage**: For feature development, testing, and debugging

#### Production Stage (`prod`)

- **Purpose**: Live production environment serving real users
- **Environment**: Optimized production build with performance optimizations
- **Access**: Publicly accessible via production domain
- **Database**: Production database with real data
- **Configuration**: Uses production environment variables and secure configs
- **Usage**: Serves the live application to end users

> **Note**: Additional stages (dev, qsa, etc.) may be added as the project evolves to support more complex deployment workflows.

## 📄 License

By contributing to Saku, you agree that your contributions will be licensed under the license defined in [`LICENSE.md`](./LICENSE.md).

## 💡 Resources / References

- [Docusaurus `CONTRIBUTING.md`](https://github.com/facebook/docusaurus/blob/master/CONTRIBUTING.md)

# Shop Frontend

E-commerce frontend application for auto parts and car dismantling services, built with Next.js. Layers are `app`, `pages`, `features`, `entities`, and `shared`. Cross-slice dependencies go through an InversifyJS IoC container. Entities map HTTP DTOs into models, and those models are what other slices use.

## 🚀 Tech Stack

-   **Framework:** Next.js 16 (with Turbopack)
-   **Language:** TypeScript 5.9
-   **UI Library:** Material-UI (MUI) v7
-   **State Management:** Reatom
-   **Data Fetching:** TanStack Query (React Query) v5
-   **Styling:** SASS, Emotion (CSS-in-JS)
-   **HTTP Client:** Axios with retry logic
-   **DI:** InversifyJS (IoC container, constructor injection)
-   **Icons:** Material-UI Icons
-   **Carousel:** Embla Carousel
-   **Notifications:** Notistack
-   **Other:** React Markdown, React Player, Rooks hooks

## 📁 Project Structure

```
src/
├── app/                 # Startup and providers
│   └── providers/
├── pages/               # Next.js routes. Compose features only
├── features/            # Product scenarios
│   └── cart/
│       ├── ports/       # Interfaces other slices may depend on
│       ├── ui/
│       └── index.ts     # Public API: UI and port types, not implementations
├── entities/            # Domain objects
│   └── product/
│       ├── dto/         # HTTP payload, private to the entity
│       ├── model/       # Domain shape other slices use
│       ├── ports/
│       └── index.ts     # Public API: model and port types, not the DTO or API client
└── shared/              # Technical UI, HTTP client, utils. No product rules
```

There is no `widgets` layer. A screen block (header, catalog, product page) is a feature. An entity keeps the HTTP DTO private and exports the model.

`widgets/` is still on disk. New code does not add to it. Fold a widget into `features/<name>` when you touch it.

## 🏗️ Architecture Principles

### Layer import rules

```
app → pages, features, entities, shared
pages → features, entities, shared
features → entities, shared, and other features only through the IoC container
entities → shared, and other entities only through the IoC container
shared → shared
```

Nobody imports `app` except the Next.js entry (`pages/_app.tsx`), which renders the app root.

A feature or entity does not value-import another slice. It depends on a port (an interface). `app/di/app.container.tsx` writes every `container.bind` on one container. A feature narrows that container with `inject`. The only values that cross the boundary are entity models.

An entity does not import a feature. `shared` does not import `app`, `pages`, `features`, or `entities`.

### IoC, DTOs, models, ports

`app/di/app.container.tsx` creates one [InversifyJS](https://inversify.io/) container, writes every binding there, and passes it to `DiProvider` from `pages/_app.tsx`. A feature exports `inject` from `createModuleInjector`, limited to that feature's tokens. Slice state is Reatom atoms. Features do not call `new` on another feature's class and do not import its atoms or API client.

```typescript
// app/di/app.container.tsx
const container = new Container();
container.bind(ARTICLE_API).to(ArticleApi);
container.bind(ArticleService).toSelf();

// features/articlesList/articlesList.di.ts
export const inject = createModuleInjector<ArticlesListToken, ArticlesListBindings>();
```

`pages/_app.tsx` renders `AppDiProvider` around the tree. A page calls `inject(ArticleService)`. That function accepts only the tokens bound for that feature. `@inject(token)` works under the app provider. A component that only reads its own store does not get a port.

Rules for the three pieces:

-   **DTO** — HTTP payload. Stays inside the entity. No methods, no Reatom atoms, no Axios types.
-   **Model** — domain shape. Aliases the DTO while the shapes match (`export type Brand = BrandDto`). This is what ports return and what other slices import.
-   **Port** — interface other slices depend on. Lives on the feature or entity that owns the behavior.
-   **Binding** — `app` adds every container. The feature narrows tokens with `createModuleInjector`. `@inject` reads the app container.

Full rules: [docs/architecture.md](docs/architecture.md).

## 🛠️ Getting Started

### Prerequisites

-   Node.js 22.x
-   npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 📦 Key Features

-   **Product Catalog:** Browse spare parts, wheels, tires, and cabins
-   **Shopping Cart:** Add/remove items, manage quantities
-   **Favorites:** Save favorite products
-   **User Authentication:** Login, registration, password reset
-   **Search:** Advanced search with filters (brand, model, generation, etc.)
-   **Product Details:** Detailed product pages with images and specifications
-   **Responsive Design:** Mobile-first responsive layout
-   **SEO Optimized:** Server-side rendering with SEO support

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API
BACKEND_URL=your_backend_url
BACKEND_LOCAL_URLS=["http://localhost:1337"]

# Image domains
REMOTE_PATTERNS=[{"protocol":"https","hostname":"your-domain.com"}]

# Other configurations
NODE_APP_INSTANCE=0
```

### TypeScript

The project uses TypeScript with strict mode enabled. Path aliases are configured via `baseUrl` in `tsconfig.json`, allowing absolute imports:

```typescript
import { Button } from 'shared/ui/btn.component';
import { CartButton } from 'features/cart';
import type { Cart } from 'entities/cart';
```

## 📚 Development Guidelines

1. **Use absolute imports** — `baseUrl` in `tsconfig.json`
2. **Lowercase file names, role after a dot** — `btn.component.tsx`, `cart.service.ts`, `cart.store.ts`, `product.dto.ts`, `article.model.ts`. A model file is `name.model.ts`, not `nameModel.ts`
3. **Import a feature or entity only from its `index.ts`** — not from `ui/`, `dto/`, `model/`, or `ports/`
4. **Cross a slice with a port and a model** — the entity maps the DTO and exports the implementation class. The feature or page that calls the port binds it
5. **Do not add `widgets/`** — put the screen block in `features/`, put the DTO and model on `entities/<name>`
6. **Keep `shared` technical** — no product rules, no feature imports

## 🐳 Docker

The project includes a Dockerfile for containerized deployment:

```bash
docker build -t shop-frontend .
docker run -p 3000:3000 shop-frontend
```

## 📖 Learn More

-   [Architecture](docs/architecture.md)
-   [Next.js Documentation](https://nextjs.org/docs)
-   [InversifyJS](https://inversify.io/)
-   [Material-UI Documentation](https://mui.com/)
-   [Reatom](https://reatom.dev/)
-   [TanStack Query Documentation](https://tanstack.com/query)

## 📝 License

This project is private and proprietary.

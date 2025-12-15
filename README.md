# Shop Frontend

E-commerce frontend application for auto parts and car dismantling services, built with Next.js and following Feature-Sliced Design (FSD) architecture.

## 🚀 Tech Stack

-   **Framework:** Next.js 16 (with Turbopack)
-   **Language:** TypeScript 5.9
-   **UI Library:** Material-UI (MUI) v7
-   **State Management:** MobX 6
-   **Data Fetching:** TanStack Query (React Query) v5
-   **Styling:** SASS, Emotion (CSS-in-JS)
-   **HTTP Client:** Axios with retry logic
-   **Icons:** Material-UI Icons
-   **Carousel:** Embla Carousel
-   **Notifications:** Notistack
-   **Other:** React Markdown, React Player, Rooks hooks

## 📁 Project Structure

This project follows [Feature-Sliced Design (FSD)](https://feature-sliced.design/) methodology:

```
shop/
├── app/              # Application initialization and providers
│   ├── providers/    # Global providers (Store, Theme, API, Query)
│   └── ...
├── pages/            # Next.js pages (routing layer)
│   ├── api/          # API routes
│   └── ...
├── widgets/          # Composite UI blocks
│   ├── header/       # Header widget
│   ├── footer/       # Footer widget
│   ├── catalog/      # Catalog widget
│   ├── product/      # Product page widget
│   └── main/         # Main page widgets
├── features/         # User interactions and business features
│   ├── cart/         # Shopping cart operations
│   ├── favorites/    # Favorites management
│   ├── user/         # Authentication and user management
│   ├── buy/          # Purchase flow
│   └── ...
├── entities/         # Business entities
│   ├── product/      # Product entity
│   ├── cart/         # Cart entity
│   ├── user/         # User entity
│   ├── brand/        # Brand entity
│   └── ...
└── shared/           # Reusable infrastructure
    ├── ui/           # Reusable UI components
    ├── api/           # API configuration
    ├── utils/         # Utility functions
    ├── hooks/         # Shared hooks
    ├── services/      # Services
    └── icons/         # Icon components
```

## 🏗️ Architecture Principles

### Layer Import Rules

Layers can only import from layers **below** them:

```
pages → widgets → features → entities → shared
```

**Allowed:**

-   ✅ `pages` → `widgets`, `features`, `entities`, `shared`
-   ✅ `widgets` → `features`, `entities`, `shared`
-   ✅ `features` → `entities`, `shared`
-   ✅ `entities` → `shared`, types from other `entities` (types only)
-   ✅ `shared` → only other `shared` modules

**Forbidden:**

-   ❌ `entities` cannot import from `features` or `widgets`
-   ❌ `entities` cannot import non-type exports from other `entities` (only types allowed)
-   ❌ `features` cannot import from `widgets` or `pages`
-   ❌ `shared` cannot import from any other layer

### Slice Structure

Each slice follows this structure:

```
sliceName/
├── ui/              # UI components
├── model/           # Business logic, stores
├── api/             # API calls
├── hooks/           # Custom hooks
├── config/          # Configuration
├── utils/           # Slice-specific utilities
├── types.ts         # TypeScript types
├── constants.ts     # Constants
└── index.ts         # Public API (exports)
```

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
import { Button } from 'shared/ui';
import { Product } from 'entities/product';
import { CartButton } from 'features/cart';
```

## 📚 Development Guidelines

1. **Use absolute imports** - Configured via `baseUrl` in `tsconfig.json`
2. **Maintain public API** - Only export what's needed from `index.ts` files
3. **Follow layer hierarchy** - Never import from higher layers
4. **Keep slices independent** - Slices should not depend on each other's internals
5. **Use shared layer** - Put reusable code in `shared/`, not duplicated across slices

## 🐳 Docker

The project includes a Dockerfile for containerized deployment:

```bash
docker build -t shop-frontend .
docker run -p 3000:3000 shop-frontend
```

## 📖 Learn More

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Feature-Sliced Design](https://feature-sliced.design/)
-   [Material-UI Documentation](https://mui.com/)
-   [MobX Documentation](https://mobx.js.org/)
-   [TanStack Query Documentation](https://tanstack.com/query)

## 📝 License

This project is private and proprietary.

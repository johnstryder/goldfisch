# Tezzemplate

A modern full-stack template with React, PocketBase, Hono, and Docker. Perfect for rapid prototyping and production apps.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Hono (Node.js web framework) + TypeScript
- **Database**: PocketBase (SQLite with REST API)
- **Cache/Sessions**: DragonflyDB (Redis-compatible)
- **Analytics**: PostHog
- **Email**: SendGrid
- **Authentication**: PocketBase + Google OAuth 2.0
- **Deployment**: Docker + Docker Compose + Coolify
- **Package Manager**: Bun

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- [Docker](https://docker.com/) and Docker Compose
- Git
- [PostHog](https://posthog.com/) account (for analytics)
- [SendGrid](https://sendgrid.com/) account (for emails)
- [Google OAuth](https://console.developers.google.com/) credentials (for Google sign-in)

### Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd tezzemplate

   # Install backend dependencies
   cd backend && bun install

   # Install frontend dependencies
   cd ../frontend && bun install
   ```

2. **Environment setup:**
    ```bash
    cp env.example .env
    # Edit .env with your configuration
    ```
   
   **Required Environment Variables:**
   - `POSTHOG_API_KEY` - Your PostHog project API key
   - `SENDGRID_API_KEY` - Your SendGrid API key
   - `POCKETBASE_ENCRYPTION_KEY` - Encryption key for PocketBase
   
   **Optional Environment Variables:**
   - `DRAGONFLY_URL` - DragonflyDB URL (defaults to redis://localhost:6379)
   - `POSTHOG_HOST` - PostHog host URL (defaults to https://app.posthog.com)
   - `SENDGRID_FROM_EMAIL` - Default from email address
   - `SENDGRID_FROM_NAME` - Default from name

3. **Start development servers:**
   ```bash
   # Terminal 1: Start PocketBase + Backend + Frontend
   docker-compose up

   # Terminal 2: Start frontend dev server (optional, for hot reload)
   cd frontend && bun run dev
   ```

4. **Access your app:**
    - Frontend: http://localhost:3000
    - PocketBase Admin: http://localhost:8090/_/
    - Backend API: http://localhost:8000
    - DragonflyDB: redis://localhost:6379

## Project Structure

```
tezzemplate/
├── backend/                 # Hono API server
│   ├── src/
│   │   └── index.ts        # Main server file
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React app
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Global styles
│   │   └── lib/utils.ts    # Utility functions
│   ├── Dockerfile
│   ├── nginx.conf          # Production nginx config
│   └── package.json
├── docker-compose.yml       # Development environment
├── env.example             # Environment variables template
└── README.md
```

## Integrated Services

### 🎯 PostHog Analytics
PostHog is pre-configured for both frontend and backend analytics:

**Frontend Usage:**
```typescript
import { usePostHog } from 'posthog-js/react'

function MyComponent() {
  const posthog = usePostHog()
  
  const handleClick = () => {
    posthog.capture('button_clicked', { button: 'signup' })
  }
}
```

**Backend Usage:**
```typescript
import { trackEvent, identifyUser } from './lib/posthog'

// Track events
trackEvent('user_registered', { method: 'google_oauth' })

// Identify users
identifyUser('user_123', { email: 'user@example.com' })
```

### 📧 SendGrid Email Service
Pre-configured email service with template support:

```typescript
import { sendTemplateEmail, sendEmailViaSendgrid } from './services/email.service'

// Send template email
await sendTemplateEmail({
  to: 'user@example.com',
  template: 'welcome',
  data: { userName: 'John' }
})

// Send custom email
await sendEmailViaSendgrid({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<p>Custom HTML content</p>'
})
```

### 🔐 Google OAuth 2.0 Authentication
Complete Google OAuth flow implemented:

**Frontend Integration:**
```typescript
import { useAuth } from './contexts/AuthContext'

function LoginComponent() {
  const { signInWithGoogle, user, signOut } = useAuth()
  
  return (
    <div>
      {user ? (
        <div>Welcome, {user.name}! <button onClick={signOut}>Sign Out</button></div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  )
}
```

### 🚀 DragonflyDB (Redis) Integration
Redis-compatible caching and session storage:

```typescript
import { redisClient, createRedisStore } from './lib/redis'

// Direct Redis usage
await redisClient.set('key', 'value')
const value = await redisClient.get('key')

// Session store
const store = createRedisStore()
```

## PocketBase Setup

1. Access admin panel at http://localhost:8090/_/
2. Create your first admin account
3. Create collections via the web UI or API
4. Configure Google OAuth in Settings → Auth Providers
5. Add your Google OAuth 2.0 Client ID and Secret
6. The backend includes a sample "items" collection API

## API Routes

### Backend (Hono)
- `GET /health` - Health check
- `GET /api/hello` - Test endpoint
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `ALL /pb/*` - Proxy to PocketBase API

### PocketBase
- Full REST API available at `/pb/`
- Admin panel at `/_/`
- File uploads, auth, realtime subscriptions

## Development Commands

### Backend
```bash
cd backend
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run typecheck    # TypeScript check
```

### Frontend
```bash
cd frontend
bun run dev          # Start Vite dev server
bun run build        # Build for production
bun run preview      # Preview production build
bun run typecheck    # TypeScript check
```

### Docker
```bash
docker-compose up              # Start all services
docker-compose up -d           # Start in background
docker-compose down            # Stop all services
docker-compose logs backend    # View backend logs
```

## Production Deployment

### With Coolify

1. Connect your Git repository to Coolify
2. Create a new service with Docker Compose
3. Set environment variables in Coolify dashboard
4. Deploy!

### Manual Docker Deployment

```bash
# Build and run production containers
docker-compose -f docker-compose.yml up --build -d
```

## Adding shadcn/ui Components

```bash
cd frontend
# Initialize shadcn/ui (if not done)
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `8000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `POCKETBASE_URL` | PocketBase instance URL | `http://localhost:8090` |
| `POCKETBASE_ENCRYPTION_KEY` | PocketBase encryption key | Required |
| `DRAGONFLY_URL` | DragonflyDB connection URL | `redis://localhost:6379` |
| `POSTHOG_API_KEY` | PostHog project API key | Optional |
| `POSTHOG_HOST` | PostHog host URL | `https://app.posthog.com` |
| `SENDGRID_API_KEY` | SendGrid API key | Optional |
| `SENDGRID_FROM_EMAIL` | Default from email address | `noreply@example.com` |
| `SENDGRID_FROM_NAME` | Default from name | `Tezzemplate` |
| `VITE_POCKETBASE_URL` | Frontend PocketBase URL | `http://localhost:8090` |
| `VITE_PUBLIC_POSTHOG_KEY` | Frontend PostHog key | Optional |
| `VITE_PUBLIC_POSTHOG_HOST` | Frontend PostHog host | `https://app.posthog.com` |

## Features

- ✅ Modern React 18 with TypeScript
- ✅ Fast Hono backend with TypeScript
- ✅ PocketBase for database + auth + file storage
- ✅ DragonflyDB for caching and session management
- ✅ PostHog analytics integration (frontend + backend)
- ✅ SendGrid email service integration
- ✅ Google OAuth 2.0 authentication (ready to use)
- ✅ Tailwind CSS for styling
- ✅ shadcn/ui component library ready
- ✅ Docker containerization with multi-service setup
- ✅ Development hot reload
- ✅ Production-ready nginx config
- ✅ Coolify deployment support
- ✅ Bun package manager support

## License

MIT
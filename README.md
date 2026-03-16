# ⚡ Executive Command Center (ECC)

> Chairman → CEO → C-Suite Directive Governance Platform

A mobile-first, role-based directive governance system for executive leadership. Issues directives from the Chairman level, cascades through C-Suite, tracks execution with full audit trails.

---

## 🚀 Quick Start (Local Dev — 3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Login Credentials

| Role      | Email                  | Password |
|-----------|------------------------|----------|
| Chairman  | chairman@ecc.com       | demo     |
| CEO       | ceo@ecc.com            | demo     |
| CFO       | cfo@ecc.com            | demo     |
| COO       | coo@ecc.com            | demo     |
| CSO       | cso@ecc.com            | demo     |
| CLO       | clo@ecc.com            | demo     |

---

## 📁 Project Structure

```
executive-command-center/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout, metadata, PWA tags
│   │   ├── page.jsx            # Entry point → ECCApp
│   │   └── globals.css         # Global styles, scrollbar, animations
│   ├── components/
│   │   ├── ECCApp.jsx          # 🎯 Main application (all screens)
│   │   └── ui/
│   │       └── Atoms.jsx       # Shared UI atoms (Avatar, Badge, Card…)
│   └── lib/
│       ├── data.js             # Seed data, RBAC config, constants
│       ├── utils.js            # Helper functions (dates, IDs…)
│       └── theme.js            # Design tokens / colour palette
├── public/
│   ├── manifest.json           # PWA manifest (installable)
│   └── favicon.svg             # App icon
├── .env.example                # Environment variable template
├── next.config.js              # Next.js configuration
└── package.json
```

---

## 🏗️ Deploy to Vercel (Recommended — Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to project or create new
# - Framework: Next.js (auto-detected)
# - Set environment variables from .env.example in Vercel dashboard
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) → New Project → Import.

---

## 🐳 Deploy with Docker

```dockerfile
# Build
docker build -t ecc-app .

# Run
docker run -p 3000:3000 ecc-app
```

Add a `Dockerfile` at project root:

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ☁️ Deploy to AWS (EC2 / ECS)

```bash
# Build production bundle
npm run build

# Start production server
npm start
# Runs on port 3000 — put behind nginx or ALB
```

**Recommended AWS stack:**
- CloudFront → ALB → ECS Fargate (this app)
- RDS PostgreSQL (replace seed data with real DB)
- ElastiCache Redis (for sessions)
- S3 + CloudFront (for attachments)
- SES (for email notifications)

---

## 🔧 Connecting a Real Database

The current version uses **in-memory state** (seed data). For production:

1. Add PostgreSQL connection in `.env.local`:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/ecc_db
   ```

2. Run the schema from the blueprint SQL (see `docs/schema.sql`)

3. Replace `SEED_*` imports in `src/lib/data.js` with API calls to your backend

4. Add API routes in `src/app/api/` following the blueprint spec

---

## 📱 Install as Mobile App (PWA)

The app is PWA-ready. To install:

- **iOS Safari**: Tap Share → "Add to Home Screen"
- **Android Chrome**: Menu → "Add to Home Screen"  
- **Desktop Chrome**: Address bar install icon

---

## 🔑 RBAC Summary

| Role      | View All | Create | Manage Users | Audit Log |
|-----------|----------|--------|--------------|-----------|
| Chairman  | ✅       | ✅     | ✅ (full)    | ✅        |
| CEO       | ✅       | ✅     | ❌           | ✅        |
| CFO/COO…  | Dept only| ❌     | ❌           | ❌        |
| Director  | Dept only| ❌     | ❌           | ❌        |

**Chairman user management powers:**
- Add users (all roles/departments)
- Edit user name, email, phone, role, department
- Suspend / Reinstate accounts
- Reset passwords
- Permanently delete users (with typed confirmation)

---

## 📦 Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Frontend    | Next.js 14 + React 18   |
| Styling     | Inline CSS + CSS modules |
| Auth        | JWT (wired for backend) |
| Database    | In-memory → PostgreSQL  |
| Deployment  | Vercel / Docker / AWS   |
| PWA         | Web App Manifest        |

---

## 🗺️ Roadmap

- [ ] PostgreSQL backend + Prisma ORM
- [ ] JWT authentication with refresh tokens  
- [ ] Email notifications (AWS SES)
- [ ] File attachment upload (S3)
- [ ] AI directive summarization (Claude API)
- [ ] Predictive deadline risk scoring
- [ ] Multi-organisation tenancy (SaaS)

---

*Executive Command Center — Built for governance excellence.*

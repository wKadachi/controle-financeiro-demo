# Personal Finance Control Dashboard (Full Stack Demo)

Full-stack personal finance management application built with **React, Vite, Tailwind CSS, Recharts**, and a **Node.js + Express** backend, featuring PIN-protected access with brute-force rate limiting, monthly cash-flow tracking, credit card & installment management, financial health KPIs, and optional Telegram Bot / Open Finance integrations.

> **Demo Notice:** This public repository uses **100% synthetic demo data** (`finances_history.json`) and environment-variable configuration for portfolio demonstration. No personal financial data or credentials are included.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend:** Node.js, Express, `express-rate-limit`, CORS
- **Security:** Server-side PIN verification (`ADMIN_PIN` env var, default demo PIN: `1234`), strict brute-force rate limiter on `/api/auth/verify-pin`, and general API rate limiting

## Key Features

- **Executive Overview:** Monthly income, planned vs. paid expenses, projected balance, and category breakdown charts.
- **Bills & Calendar Strip:** Interactive bill tracking with payment status toggles and due-date calendar view.
- **Credit Cards & Installments:** Dedicated views for card limits, consolidated statements, and multi-month installment plans.
- **Goals & Net Worth:** Financial goals tracker and patrimonial overview.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Build the frontend
npm run build

# 3. Start the Express server (serves API + built frontend)
npm start
```

For development mode (Vite HMR + Express API):

```bash
npm run dev
```

### Environment Variables (Optional)

| Variable | Description | Demo Default |
|---|---|---|
| `ADMIN_PIN` | Dashboard unlock PIN | `1234` |
| `ADMIN_EMAIL` | Authorized user email | `demo@example.com` |
| `TELEGRAM_CHAT_ID` | Optional Telegram Bot chat ID | `0000000000` |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID | `""` |

---

Built by **Luis Henriques Figueiredo** — [LinkedIn](https://www.linkedin.com/in/luis-henriques-0823b1207/)

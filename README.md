# 💎 Smart Finance Tracker (Node.js Enterprise Edition)

> Shaxsiy moliya va sun'iy intellekt (AI) asosidagi moliyaviy tahlil hamda byudjetlashtirish tizimi.

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-v5.22-indigo.svg)](https://prisma.io)
[![Vitest](https://img.shields.io/badge/Vitest-v4.1-yellow.svg)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)

---

## 🚀 Texnologiyalar Steki

- **Backend Framework:** Node.js (ESM) + Express.js
- **ORM & Database:** Prisma ORM + MySQL 8.0
- **View Engine & Frontend:** EJS + Express Layouts + Tailwind CSS + Alpine.js
- **AI Integration:** OpenAI API SDK (gpt-4o-mini)
- **Validation & Security:** Zod + Helmet + CSRF-Protection + Express-Rate-Limit + Bcryptjs
- **Logging:** Pino Structured Logger (`pino-http`)
- **Testing & Quality:** Vitest + Supertest + ESLint + Prettier
- **DevOps Containerization:** Multi-stage Dockerfile + Docker Compose + GitHub Actions CI

---

## 📌 Muhit O'zgaruvchilari (Environment Variables)

`.env` faylini shakllantirish uchun `.env.example` shablonidan nusxa oling:

| O'zgaruvchi Nom | Standart Qiymat | Tavsifi |
| :--- | :--- | :--- |
| `PORT` | `3000` | Server tinglaydigan port |
| `APP_ENV` | `local` | Ish muhiti (`local`, `production`) |
| `DATABASE_URL` | `mysql://root:password@localhost:3306/smart_finance_db` | MySQL DB ulanish qatori |
| `SESSION_SECRET` | *(Majburiy)* | Express-session uchun maxfiy token (fail-fast) |
| `SERVICES_AI_SECRET` | *(Ixtiyoriy)* | OpenAI API kaliti (AI maslahatchi uchun) |
| `SERVICES_AI_MODEL` | `gpt-4o-mini` | OpenAI modeli |

---

## ⚙️ Mahalliy O'rnatish va Ishga Tushirish (Quickstart)

```bash
# 1. Omborni klonlang va papkaga o'ting
git clone https://github.com/user/smart-finance-tracker.git
cd smart-finance-tracker

# 2. Bog'liqliklarni o'rnating
npm install

# 3. .env faylini yarating
cp .env.example .env

# 4. Prisma DB schema va Seed ma'lumotlarini yuklang
npx prisma db push
npm run db:seed

# 5. Development serverini ishga tushiring
npm run dev
```

---

## 🐳 Docker Orqali Ishga Tushirish

```bash
# Docker Compose orqali App va MySQL konteynerlarini ishga tushirish
docker-compose up --build -d

# Health check holatini tekshirish
curl http://localhost:3000/health
```

---

## 🧪 Testlarni Ishga Tushirish

```bash
# Unit testlarni yurgazish
npm run test

# Test coverage hisobotini olish
npm run test:coverage
```

---

## 📖 API Hujjatlari (REST API v1)

Tizim `/api/v1` ostida to'liq REST API taqdim etadi. Hujjatlarni brauzer orqali ko'rish uchun:
- Web Hujjatlar Sahifasi: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

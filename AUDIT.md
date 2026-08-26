# Smart Finance Tracker — Audit va Texnik Tahlil Hisoboti (AUDIT.md)

Yaratilgan sana: 2026-08-26
Loyiha: Node.js (ESM) + Express + EJS + Prisma (MySQL)

---

## 📋 Umumiylik va Loyiha Tulilishi

Smart Finance Tracker loyihasining kod ombori (repository) chuqur skanerlandi va tahlil qilindi. 
Loyihada asosiy arxitekturaviy poydevor qo'yilgan bo'lsa-da, xavfsizlik, kod sifati, testlash va production tayyorgarligi bo'yicha muhim muammolar va zaifliklar aniqlandi.

Quyida barcha muammolar ustuvorlik darajasi bo'yicha **Critical**, **High**, **Medium**, va **Low** toifalariga ajratilib ko'rsatilgan.

---

## 🔴 1. CRITICAL (Zudlik bilan bartaraf etilishi shart bo'lgan xavflar)

### 1.1 `.env` fayli va maxfiy kalitlar repoda ochiq qolgan
- **Tavsifi:** `.env` fayli versiyalar boshqaruvi (Git) ichida qolib ketgan. Ichida `SESSION_SECRET="smart_finance_tracker_secret_key_2026"` va `DATABASE_URL="mysql://root:@mysql-8.0:3306/smart"` maxfiy ma'lumotlari saqlanmoqda.
- **Xavfi:** Server va ma'lumotlar bazasiga ruxsatsiz kirish, sessiyalar qalbakilashtirilishi (session forgery).
- **Joylashuvi:** `/.env`

### 1.2 Session Secret uchun standart (fallback) qiymat mavjudligi
- **Tavsifi:** `src/app.js` faylida `SESSION_SECRET` bo'lmagan taqdirda default qiymat (`smart_finance_secret_key`) ishlatiladi. Muhit o'zgaruvchisi tayyor bo'lmasa, dastur to'xtamaydi (fail-fast yo'q).
- **Xavfi:** Ishlab chiqarish muhitida standart sessiya kaliti ishlatilib ketishi mumkin.
- **Joylashuvi:** `src/app.js:33`

### 1.3 Input Validatsiyasining To'liq Yo'qligi
- **Tavsifi:** Web va REST API endpointlarida foydalanuvchi yuborgan ma'lumotlar (`req.body`, `req.params`, `req.query`) schema validatsiyasisiz (`zod` yoki `express-validator`) to'g'ridan-to'g'ri qayta ishlanmoqda va ma'lumotlar bazasiga uzatilmoqda.
- **Xavfi:** Noto'g me'yoriy ma'lumotlar kiritilishi, kutilmagan type casting xatolari va tizim ishdan chiqishi.
- **Joylashuvi:** `src/controllers/apiController.js`, `src/controllers/transactionController.js`, `src/controllers/authController.js` va boshqalar.

---

## 🟠 2. HIGH (Yuqori darajali xavflar va arxitektura muammolari)

### 2.1 CSRF (Cross-Site Request Forgery) Himoyasi Yo'qligi
- **Tavsifi:** Web interfeysdagi formalar submit qilinganda CSRF tokenlari tekshirilmaydi.
- **Xavfi:** Foydalanuvchi seansini uchinchi tomon saytlaridan soxtalashtirilgan so'rovlar orqali suiiste'mol qilish.
- **Joylashuvi:** `src/app.js`, `src/routes/webRoutes.js` va barcha EJS formalari.

### 2.2 Rate Limiting (So'rovlar sonini cheklash) Yo'qligi
- **Tavsifi:** Autentifikatsiya (`/login`, `/register`, `/api/v1/auth/*`) hamda resurs talab qiluvchi AI endpointlarida rate limiter mavjud emas.
- **Xavfi:** Brute-force parollarni topish va DoS (Denial of Service) hujumlari.
- **Joylashuvi:** `src/routes/apiRoutes.js`, `src/routes/webRoutes.js`

### 2.3 `apiController.js` Monolit Fayl (758 qator)
- **Tavsifi:** Autentifikatsiya, profil, dashboard, tranzaksiyalar, kategoriyalar, byudjetlar, hisobotlar, eksport va admin API funksiyalari bitta controller fayliga yig'ib tashlangan.
- **Xavfi:** Kodni qo'llab-quvvatlash juda qiyinlashgan, takrorlanishlar ko'paygan, testlash va refactoring murakkablashgan.
- **Joylashuvi:** `src/controllers/apiController.js`

### 2.4 Xavfsizlik HTTP Header'lari (Helmet) va Sanitize Yo'qligi
- **Tavsifi:** HTTP sarlavhalari xavfsizligini ta'minlovchi `helmet` middleware loyihada ishlatilmagan.
- **Xavfi:** XSS, Clickjacking, MIME-sniffing kabi klassik veb-hujumlar.
- **Joylashuvi:** `src/app.js`

### 2.5 Test Infratuzilmasining Umuman Yo'qligi
- **Tavsifi:** Loyihada unit, integration yoki e2e testlar umuman mavjud emas (Jest/Vitest, Supertest o'rnatilmagan).
- **Xavfi:** Refactoring o'tkazishda regressiya xatoliklarini payqay olmaslik.
- **Joylashuvi:** Rezonansli test papkalari yo'q.

---

## 🟡 3. MEDIUM (O'rta darajali texnik qarzdorlik va kod sifati)

### 3.1 Markazlashtirilgan Error Handling Middleware Yo'qligi
- **Tavsifi:** Har bir controller funksiyasida `try/catch` takrorlanadi va xatoliklar `console.error` bilan konsolga chiqariladi. `AppError` klassi va markaziy `errorHandler` yaratilmagan.
- **Xavfi:** Inconsistent error responses, loglar tartibsizligi.
- **Joylashuvi:** `src/controllers/*`

### 3.2 Biznes Logikaning Controller'lar Ichiga Aralashib Ketgani
- **Tavsifi:** Dashboard ko'rsatkichlarini hisoblash, tranzaksiya filtrlari va eksport mantiqlari to'g'ridan-to'g'ri controller fayllarida yozilgan; `src/services/` qatlami to'liq ishlatilmagan.
- **Joylashuvi:** `src/controllers/apiController.js`, `src/controllers/transactionController.js`

### 3.3 Konsol Logger (Pino/Winston) Ishlatilmagani
- **Tavsifi:** Tizimdagi loglar oddiy `console.log` va `console.error` orqali chiqariladi. Production muhitida loglarni darajalar (info, warn, error) bo'yicha ajratish va faylga/servisga yo'naltirish imkoni yo'q.

### 3.4 Prisma Migratsiya Oqimining Notug'riligi
- **Tavsifi:** `package.json` faylida `prisma db push` ishlatilmoqda. Production uchun `prisma migrate dev` yoki `prisma migrate deploy` tavsiya etiladi.

---

## 🔵 4. LOW (Kichik takomillashtirishlar va UX/DevOps)

### 4.1 Production Dockerfile va docker-compose Yo'qligi
- Loyihani konteynerlashtirish (app + MySQL) uchun `Dockerfile` va `docker-compose.yml` tayyorlanmagan.

### 4.2 Health-Check Endpoint Yo'qligi
- Serverning ishlash holatini (health checks) kuzatib borish uchun `/health` endpointi yo'q.

### 4.3 EJS Shablonlarda UI/UX va Client Validation Tartibsizligi
- Formada xatoliklar (inline validation feedback) va bo'sh holatlar (empty states) yaxshilanishi talab etiladi.

---

## 🎯 Keyingi Qadamlar Rejasi (Bosqichlar Ketma-ketligi)

1. **0-BOSQICH:** Ushu AUDIT.md hisobotini tasdiqlash.
2. **1-BOSQICH (Security Hardening):** Environment tozalash, Session secret fail-fast, Bcrypt audit, Auth & IDOR check, Zod input validation, Rate limiting, Helmet va CSRF.
3. **2-BOSQICH (Refactoring & Architecture):** Controller-Service-Repository ajratish (`apiController.js` ni bo'lish), Centralized Error Handler, Config module, Pino logging, Prisma optimizatsiyasi.
4. **3-BOSQICH (Testing):** Vitest + Supertest o'rnatish, Unit & Integration testlar yozish (coverage > 70%).
5. **4-BOSQICH (Frontend / UX):** Inline validation, responsive dizayn va chart vizualizatsiyasi.
6. **5-BOSQICH (DevOps):** Multi-stage Dockerfile, docker-compose, CI/CD va /health endpoint.
7. **6-BOSQICH (AI Enhancements):** OpenAI streaming, rate limit va prompt pII sanitization.

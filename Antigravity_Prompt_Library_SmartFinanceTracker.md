# Smart Finance Tracker — Antigravity Prompt Library

Loyiha profili (Antigravity avtomatik ko'radi, lekin bilib qo'yish uchun):
- Stack: Node.js (ESM) + Express + EJS (express-ejs-layouts) + Prisma ORM + MySQL
- Session-based auth, admin panel, AI-assistant (OpenAI SDK), REST API (`/api/v1`)
- Controllers: admin, aiAssistant, api (757 qator!), auth, budget, category, dashboard, profile, report, transaction
- `node_modules` va `.env` reponing ichida — bularni birinchi navbatda tozalash kerak

---

## 0-BOSQICH — Loyihaga kirishdan oldin (bir marta ishga tushiring)

```
Sen tajribali Senior Full-Stack Engineer va Code Reviewer sifatida ishla.
Menda "Smart Finance Tracker" nomli Node.js + Express + EJS + Prisma (MySQL)
loyihasi bor. Birinchi navbatda quyidagilarni bajar:

1. Butun repo tuzilishini (node_modules'dan tashqari) chuqur skanerla:
   src/controllers, src/routes, src/middlewares, src/services, views/, prisma/schema.prisma
2. Har bir controller va route faylini o'qib, quyidagilarni aniqlab, markdown
   hisobot (AUDIT.md) shaklida yoz:
   - Xavfsizlik muammolari (parol hash, SQL/NoSQL injection, session secret,
     CSRF, input validatsiya yo'qligi, .env repo ichida qolgani va h.k.)
   - Kod sifati muammolari (juda katta controller fayllar — masalan
     apiController.js 757 qator, takrorlanuvchi kod, error handling yo'qligi)
   - Arxitektura muammolari (biznes logika controller ichida, service layer
     to'liq ishlatilmagani, validation qatlami yo'qligi)
   - Frontend/UX muammolari (EJS shablonlarda tartibsizlik, responsive emasligi)
   - DevOps/production tayyorgarligi (Dockerfile yo'qligi, .gitignore to'liqligi,
     test yo'qligi, CI/CD yo'qligi, logging yo'qligi)
3. Hech qanday kodni hozircha o'zgartirma — faqat AUDIT.md faylini yarat va
   muammolarni ustuvorlik darajasi bo'yicha (Critical / High / Medium / Low)
   tartiblab ber.
```

---

## 1-BOSQICH — Xavfsizlik (Critical, birinchi bajariladigan)

```
AUDIT.md dagi "Critical" xavfsizlik muammolarini birma-bir tuzat:

1. .env faylini repodan chiqarib tashla, .gitignore ga qo'sh, va
   .env.example faylini yangilab, barcha kerakli o'zgaruvchilarni
   (DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY, PORT va h.k.) izoh bilan yoz.
2. express-session secret'ni koddan olib tashla — u faqat process.env dan
   kelsin, agar mavjud bo'lmasa app ishga tushmasin (fail-fast), default
   qiymat qoldirma.
3. Barcha parollarni bcryptjs bilan to'g'ri hash/verify qilinayotganini
   tekshir; xato bo'lsa tuzat.
4. Barcha route'larda authMiddleware va adminMiddleware to'g'ri
   qo'llanilganini tekshir — ayniqsa /api/v1 ostidagi barcha endpointlarni.
5. Har bir controllerdagi foydalanuvchi inputini (req.body, req.params,
   req.query) validatsiya qilish uchun `zod` yoki `express-validator`
   kutubxonasini kirit va har bir POST/PUT endpoint uchun schema yoz.
6. Rate limiting qo'sh (`express-rate-limit`) — ayniqsa /auth va /api/v1
   endpointlariga.
7. Xavfsizlik header'lari uchun `helmet` kutubxonasini qo'sh.
8. CSRF himoyasini (`csurf` yoki zamonaviy alternativa) forma
   submit qiladigan barcha web route'larga qo'sh.
9. Prisma so'rovlarida "userId" filtri bo'lmasdan boshqa foydalanuvchi
   ma'lumotlariga kirish mumkinmi (IDOR) — buni tekshir va tuzat
   (masalan /api/v1/transactions/:id kabi endpointlarda egalik tekshiruvi).

Har bir tuzatishdan keyin qisqacha izoh yoz: nima uchun xavfli edi va
qanday tuzatilgan.
```

---

## 2-BOSQICH — Arxitektura va kod sifati

```
Loyihani quyidagi professional Node.js arxitekturasiga moslashtir:

1. `apiController.js` (757 qator) kabi katta fayllarni resurs bo'yicha
   bo'lib chiq: har bir resurs uchun alohida controller + service + repository
   qatlami (masalan transactions/, budgets/, categories/, reports/).
2. Barcha biznes logikani (hisob-kitoblar, agregatsiyalar, AI chaqiruvlari)
   controller'lardan `src/services/` ichiga ko'chir — controller faqat
   request/response va status kodlarni boshqarsin.
3. Markazlashgan xatoliklarni boshqarish (error handling) middleware yarat
   (`src/middlewares/errorHandler.js`), custom AppError klassi bilan, va
   barcha controllerlarni try/catch o'rniga `asyncHandler` wrapper orqali o'ra.
4. Konsistent API javob formatini joriy qil:
   { success: boolean, data?: any, error?: { code, message } }
5. `src/config/` papkasi yarat — env o'zgaruvchilarni bitta joyda validatsiya
   qilib eksport qiluvchi (masalan `zod` bilan) config modul yoz.
6. Logging uchun `pino` yoki `winston` kirit, console.log larni logger bilan
   almashtir, production/development uchun log darajasini sozla.
7. Prisma so'rovlarida N+1 muammolarni tekshir, kerak bo'lsa `include`/`select`
   optimallashtir.
8. ESLint + Prettier konfiguratsiyasini qo'sh va butun kodni formatlab chiq.

Har bir bosqichdan keyin loyiha ishlab turishini (npm run dev) tekshirib bor.
```

---

## 3-BOSQICH — Testlash

```
Loyihaga test infratuzilmasini qo'sh:

1. `vitest` yoki `jest` ni dev dependency sifatida qo'sh.
2. src/services/ ichidagi har bir funksiya uchun unit testlar yoz
   (financialCalculationService.js, aiFinanceService.js ustuvor).
3. Prisma uchun test database (SQLite yoki alohida MySQL schema) sozla,
   `supertest` bilan asosiy API endpointlar uchun integratsion testlar yoz
   (auth, transactions CRUD, budgets CRUD).
4. `package.json` ga "test" va "test:coverage" scriptlarini qo'sh.
5. Kamida asosiy oqimlar uchun 70%+ test coverage maqsad qil.
```

---

## 4-BOSQICH — Frontend/UX professional darajaga ko'tarish

```
views/ papkasidagi EJS shablonlarni ko'rib chiq va quyidagilarni bajar:

1. Barcha sahifalarda konsistent dizayn tizimi (rang palitrasi, tipografika,
   spacing) qo'llanilishini tekshir — Tailwind CSS orqali design token
   yondashuvidan foydalan.
2. Har bir forma uchun client-side validatsiya + server xatolarini chiroyli
   ko'rsatish (inline error messages) qo'sh.
3. Dashboard, reports, budgets sahifalarida grafik/chart kutubxonasi
   (Chart.js yoki ApexCharts) orqali vizualizatsiyalarni yaxshila yoki qo'sh.
4. Mobil ekranlar uchun to'liq responsive qil (sidebar/topbar hamda
   jadvallarni tekshir).
5. Loading state, bo'sh holat (empty state) va xatolik holatlari (error state)
   uchun UI komponentlar qo'sh.
6. Dark/Light mode qo'llab-quvvatlashni ko'rib chiq (agar loyiha talab qilsa).
```

---

## 5-BOSQICH — DevOps va joylashtirishga (deploy) tayyorlash

```
Loyihani production'ga joylashtirishga tayyorla:

1. Ko'p bosqichli (multi-stage) Dockerfile va docker-compose.yml
   (app + MySQL) yarat.
2. GitHub Actions bilan CI pipeline yoz: lint -> test -> build.
3. `prisma migrate` asosidagi migratsiya oqimini `db push` o'rniga
   production uchun tavsiya qil va sozla.
4. Health-check endpoint (`/health`) qo'sh.
5. README.md ni to'liq yangila: loyiha tavsifi, texnologiyalar, o'rnatish
   qadamlari, muhit o'zgaruvchilari jadvali, API hujjatlariga havola.
6. `.env.example` ni yangilab, barcha kerakli o'zgaruvchilarni ko'rsat.
```

---

## 6-BOSQICH — AI-Assistant modulini kuchaytirish

```
src/services/aiFinanceService.js va src/controllers/aiAssistantController.js
ni ko'rib chiq:

1. OpenAI chaqiruvlarida xatoliklarni to'g'ri ushlab, foydalanuvchiga
   tushunarli xabar qaytarilishini ta'minla.
2. So'rovlarga token/rate limitini qo'sh (suiiste'moldan himoya).
3. Foydalanuvchi moliyaviy ma'lumotlarini promptga yuborishdan oldin
   shaxsiy ma'lumotlarni minimallashtirish (faqat kerakli agregatsiyalarni
   yuborish) tamoyilini qo'lla.
4. Javoblarni streaming qilib UI'da ko'rsatish imkoniyatini qo'sh (agar hozir yo'q bo'lsa).
```

---

### Foydalanish tartibi
1. Har bir bosqichni **alohida** Antigravity chatida yoki bitta sessiyada
   ketma-ket bering — 0-bosqichdan boshlang (audit), keyin 1 → 6 gacha.
2. Har bir bosqichdan keyin loyihani ishga tushirib (`npm run dev`) tekshiring.
3. Katta o'zgarishlardan oldin git branch oching (`git checkout -b feature/security-hardening`
   kabi), shunda har bosqichni alohida commit/PR qilib borish mumkin.

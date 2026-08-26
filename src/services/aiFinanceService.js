import { FinancialCalculationService } from './financialCalculationService.js';
import OpenAI from 'openai';
import { logger } from '../config/logger.js';

export class AiFinanceService {
  /**
   * Sanitizes and aggregates user financial data to minimize PII (Personally Identifiable Information) exposure.
   */
  static prepareSanitizedMetrics(userName, currentIncome, currentExpense, prevIncome, prevExpense, netBalance, breakdown, budgetStatus) {
    const anonymizedName = userName ? userName.split(' ')[0] : 'Foydalanuvchi';

    const sanitizedCategories = (breakdown.categories || []).map((cat) => ({
      category_name: cat.category_name,
      percentage: cat.percentage,
      amount: cat.amount,
    }));

    return {
      user_label: anonymizedName,
      current_income: currentIncome,
      current_expense: currentExpense,
      prev_income: prevIncome,
      prev_expense: prevExpense,
      net_balance: netBalance,
      categories: sanitizedCategories,
      budget_status: {
        overall_budgeted: budgetStatus.overall?.budgeted || 0,
        overall_spent: budgetStatus.overall?.spent || 0,
        overall_percentage: budgetStatus.overall?.percentage || 0,
      },
    };
  }

  static async analyzeFinancialHealth(user, days = 60) {
    const apiKey = process.env.SERVICES_AI_SECRET;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = prevDate.getMonth() + 1;
    const prevYear = prevDate.getFullYear();

    const [currentIncome, currentExpense, prevIncome, prevExpense, breakdown, budgetStatus, netBalance] =
      await Promise.all([
        FinancialCalculationService.getTotalIncome(user.id, currentMonth, currentYear),
        FinancialCalculationService.getTotalExpense(user.id, currentMonth, currentYear),
        FinancialCalculationService.getTotalIncome(user.id, prevMonth, prevYear),
        FinancialCalculationService.getTotalExpense(user.id, prevMonth, prevYear),
        FinancialCalculationService.getCategoryBreakdown(user.id, currentMonth, currentYear),
        FinancialCalculationService.getBudgetStatus(user.id, currentMonth, currentYear),
        FinancialCalculationService.getBalance(user.id),
      ]);

    const sanitized = this.prepareSanitizedMetrics(
      user.name,
      currentIncome,
      currentExpense,
      prevIncome,
      prevExpense,
      netBalance,
      breakdown,
      budgetStatus
    );

    if (apiKey && apiKey.trim() !== '') {
      try {
        const openai = new OpenAI({ apiKey });
        const prompt = `Siz tajribali moliyaviy maslahatchisiz. Quyidagi anonimlashtirilgan foydalanuvchi ma'lumotlarini tahlil qiling va O'ZBEK tilida Markdown formatida xulosa beriting.
Foydalanuvchi: ${sanitized.user_label}
Joriy oy daromadi: ${sanitized.current_income} UZS
Joriy oy xarajati: ${sanitized.current_expense} UZS
O'tgan oy daromadi: ${sanitized.prev_income} UZS
O'tgan oy xarajati: ${sanitized.prev_expense} UZS
Jami sof balans: ${sanitized.net_balance} UZS
Xarajatlar kategoriyasi: ${JSON.stringify(sanitized.categories)}
Byudjet holati: ${JSON.stringify(sanitized.budget_status)}

Javobingiz JSON obyekt formatida bo'lsin:
{
  "financial_score": 85,
  "anomalies": ["Anomaliya 1", "Anomaliya 2"],
  "savings_tip": "Asosiy tejash maslahati",
  "markdown_report": "# Moliyaviy Tahlil Hisoboti\\n..."
}`;

        const response = await openai.chat.completions.create({
          model: process.env.SERVICES_AI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Siz moliyaviy tahlilchi va AI maslahatchisiz. Javobingiz faqat valid JSON formatida bo\'lishi kerak.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const data = JSON.parse(content);
          return {
            financial_score: data.financial_score || 80,
            anomalies: data.anomalies || [],
            savings_tip: data.savings_tip || "Tejash bo'yicha maslahat tayyorlanmoqda.",
            markdown_report: data.markdown_report,
          };
        }
      } catch (e) {
        logger.warn({ err: e.message }, "OpenAI API call failed, falling back to heuristic engine");
      }
    }

    // Rule-Based Heuristic Fallback Analysis
    return this.generateHeuristicAnalysis(
      user.name,
      currentIncome,
      currentExpense,
      prevIncome,
      prevExpense,
      netBalance,
      breakdown,
      budgetStatus
    );
  }

  /**
   * Streams financial analysis completion using Server-Sent Events (SSE)
   */
  static async streamFinancialAnalysis(user, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const apiKey = process.env.SERVICES_AI_SECRET;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [currentIncome, currentExpense, breakdown, budgetStatus, netBalance] = await Promise.all([
      FinancialCalculationService.getTotalIncome(user.id, currentMonth, currentYear),
      FinancialCalculationService.getTotalExpense(user.id, currentMonth, currentYear),
      FinancialCalculationService.getCategoryBreakdown(user.id, currentMonth, currentYear),
      FinancialCalculationService.getBudgetStatus(user.id, currentMonth, currentYear),
      FinancialCalculationService.getBalance(user.id),
    ]);

    const sanitized = this.prepareSanitizedMetrics(
      user.name,
      currentIncome,
      currentExpense,
      0,
      0,
      netBalance,
      breakdown,
      budgetStatus
    );

    if (!apiKey || apiKey.trim() === '') {
      const heuristic = this.generateHeuristicAnalysis(
        user.name,
        currentIncome,
        currentExpense,
        0,
        0,
        netBalance,
        breakdown,
        budgetStatus
      );

      res.write(`data: ${JSON.stringify({ content: heuristic.markdown_report, done: true })}\n\n`);
      res.end();
      return;
    }

    try {
      const openai = new OpenAI({ apiKey });
      const prompt = `Siz tajribali moliyaviy maslahatchisiz. ${sanitized.user_label} ning joriy oy daromadi: ${sanitized.current_income} UZS, xarajati: ${sanitized.current_expense} UZS, balansi: ${sanitized.net_balance} UZS. Tahlil va tavsiyalarni o'zbek tilida Markdown formatida taqdim eting.`;

      const stream = await openai.chat.completions.create({
        model: process.env.SERVICES_AI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Siz professional AI moliyaviy maslahatchisiz.' },
          { role: 'user', content: prompt }
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          res.write(`data: ${JSON.stringify({ content: text, done: false })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      logger.error({ err: error.message }, "Streaming OpenAI error");
      res.write(`data: ${JSON.stringify({ error: "AI javobini olishda xatolik yuz berdi.", done: true })}\n\n`);
      res.end();
    }
  }

  static generateHeuristicAnalysis(
    userName,
    currentIncome,
    currentExpense,
    prevIncome,
    prevExpense,
    netBalance,
    breakdown,
    budgetStatus
  ) {
    let score = 75;
    const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpense) / currentIncome) * 100 : 0;

    if (savingsRate >= 30) score += 15;
    else if (savingsRate >= 15) score += 8;
    else if (savingsRate < 0) score -= 20;

    if (budgetStatus.overall.status === 'critical') score -= 15;
    else if (budgetStatus.overall.status === 'warning') score -= 5;
    else score += 10;

    score = Math.max(10, Math.min(100, Math.round(score)));

    const anomalies = [];
    if (currentExpense > currentIncome && currentIncome > 0) {
      anomalies.push(`Joriy oydagi xarajatlaringiz daromadingizdan ${(currentExpense - currentIncome).toLocaleString('uz-UZ')} so'mga ko'p!`);
    }

    if (prevExpense > 0 && currentExpense > prevExpense * 1.25) {
      const diff = Math.round(((currentExpense - prevExpense) / prevExpense) * 100);
      anomalies.push(`O'tgan oyga nisbatan umumiy xarajatlar ${diff}% ga oshgan.`);
    }

    const topCategory = breakdown.categories[0];
    if (topCategory && topCategory.percentage >= 35) {
      anomalies.push(`'${topCategory.category_name}' kategoriyasi umumiy xarajatlarning ${topCategory.percentage}% qismini tashkil etmoqda.`);
    }

    for (const catBudget of budgetStatus.categories) {
      if (catBudget.status === 'critical') {
        anomalies.push(`'${catBudget.category_name}' kategoriyasida byudjet ${catBudget.percentage}% sarflanib, limitdan oshib ketdi.`);
      }
    }

    if (anomalies.length === 0) {
      anomalies.push("Moliya oqimingiz barqaror holatda. Hech qanday keskin anomaliya aniqlanmadi.");
    }

    let savingsTip = "";
    if (topCategory) {
      const potentialSavings = Math.round(topCategory.amount * 0.15).toLocaleString('uz-UZ');
      savingsTip = `'${topCategory.category_name}' kategoriyasidagi xarajatlarni 15% ga qisqartirish orqali har oy kelgusida ${potentialSavings} so'm tejab qolishingiz mumkin.`;
    } else {
      savingsTip = "Har bir daromadingizning kamida 10-15% qismini oylik zaxira jamg'armasiga yo'naltirishni tavsiya etamiz.";
    }

    const topCatName = topCategory?.category_name || 'Mavjud emas';
    const topCatAmount = topCategory ? topCategory.amount.toLocaleString('uz-UZ') : '0';

    const report = `### 📊 Moliyaviy Salomatlik Tahlili

**Hurmatli ${userName},** Sizning so'nggi moliyaviy faoliyatingiz tahlil qilindi. Umumiy moliyaviy ballingiz: **${score}/100**.

--- 

#### 📈 Asosiy Ko'rsatkichlar

- **Joriy oy daromadi:** \`${currentIncome.toLocaleString('uz-UZ')} UZS\` 
- **Joriy oy xarajati:** \`${currentExpense.toLocaleString('uz-UZ')} UZS\` 
- **Tejash ko'rsatkichi:** \`${savingsRate.toFixed(1)}%\` 
- **Jami Sof Balans:** \`${netBalance.toLocaleString('uz-UZ')} UZS\` 

#### 🚨 Aniqlangan Holatlar va Anomaliyalar

${anomalies.map((a) => `- ⚠️ ${a}`).join('\n')}

#### 💡 Ekspert Maslahati

${savingsTip}

#### 🎯 Xulosa va Reja

Eng yirik xarajat sohasi — **${topCatName}** (${topCatAmount} UZS). Byudjetingizni nazorat qilish va kutilmagan xarajatlarning oldini olish uchun kategoriya limitlariga amal qilishni tavsiya etamiz.`;

    return {
      financial_score: score,
      anomalies,
      savings_tip: savingsTip,
      markdown_report: report,
    };
  }
}

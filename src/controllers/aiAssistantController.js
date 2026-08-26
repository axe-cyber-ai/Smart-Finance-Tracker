import { AiFinanceService } from '../services/aiFinanceService.js';
import { marked } from 'marked';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  const user = req.session.user;
  let analysis = req.session.aiAnalysis || null;

  const forceAnalyze = req.query.analyze === '1' || req.query.analyze === 'true' || req.query.force === '1';

  if (forceAnalyze || (!analysis && req.query.analyze)) {
    const rawAnalysis = await AiFinanceService.analyzeFinancialHealth(user, 60);
    if (rawAnalysis) {
      analysis = {
        ...rawAnalysis,
        html_report: rawAnalysis.markdown_report ? marked.parse(rawAnalysis.markdown_report) : '',
      };
      req.session.aiAnalysis = analysis;
    }
  } else if (analysis && analysis.markdown_report && !analysis.html_report) {
    analysis.html_report = marked.parse(analysis.markdown_report);
  }

  res.render('ai-assistant/index', {
    title: 'Smart Finance AI',
    analysis,
  });
});

export const streamAnalysis = asyncHandler(async (req, res) => {
  const user = req.session.user;
  await AiFinanceService.streamFinancialAnalysis(user, res);
});

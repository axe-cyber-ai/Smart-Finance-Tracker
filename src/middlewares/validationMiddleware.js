import { z } from 'zod';

/**
 * Express middleware generator to validate request body, params, or query against Zod schemas.
 * Supports both JSON API responses and HTML/EJS Web responses.
 */
export const validate = ({ body, params, query }, options = { isApi: true }) => {
  return (req, res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }
      if (params) {
        req.params = params.parse(req.params);
      }
      if (query) {
        req.query = query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        if (options.isApi) {
          return res.status(400).json({
            success: false,
            message: "Kiritilgan ma'lumotlar validatsiyadan o'tmadi.",
            errors: formattedErrors,
            timestamp: new Date().toISOString(),
          });
        } else {
          const firstErrorMsg = formattedErrors[0]?.message || "Noto'g'ri ma'lumot kiritildi.";
          req.session.error = firstErrorMsg;
          return res.redirect('back');
        }
      }
      next(error);
    }
  };
};

/* ====================================================== */
/* ZOD VALIDATION SCHEMAS                                 */
/* ====================================================== */

export const authSchemas = {
  login: z.object({
    email: z.string().min(1, "Email yoki login kiritilishi shart"),
    password: z.string().min(1, "Parol kiritilishi shart"),
  }),
  register: z.object({
    name: z.string().trim().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
    email: z.string().trim().min(3, "Email yoki login kamida 3 ta belgi bo'lishi kerak"),
    password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    password_confirmation: z.string().optional(),
  }),
};

export const profileSchemas = {
  update: z.object({
    name: z.string().trim().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
    email: z.string().trim().min(3, "Email manzil kiritilishi kerak"),
    currentPassword: z.string().optional(),
    current_password: z.string().optional(),
    newPassword: z.string().min(6, "Yangi parol kamida 6 ta belgi bo'lishi kerak").optional(),
    password: z.string().min(6, "Yangi parol kamida 6 ta belgi bo'lishi kerak").optional(),
    password_confirmation: z.string().optional(),
  }),
  updatePassword: z.object({
    currentPassword: z.string().min(1, "Hozirgi parol kiritilishi shart"),
    newPassword: z.string().min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  }),
};

export const transactionSchemas = {
  create: z.object({
    categoryId: z.coerce.number({ invalid_type_error: "Kategoriya ID raqam bo'lishi shart" }).positive(),
    type: z.enum(['income', 'expense'], { errorMap: () => ({ message: "Tur faqat 'income' yoki 'expense' bo'lishi mumkin" }) }),
    amount: z.coerce.number({ invalid_type_error: "Summa musbat raqam bo'lishi shart" }).positive("Summa 0 dan katta bo'lishi lozim"),
    description: z.string().trim().max(500, "Izoh 500 ta belgidan oshmasligi kerak").optional().nullable(),
    transactionDate: z.string().or(z.date()).optional(),
  }),
  update: z.object({
    categoryId: z.coerce.number().positive().optional(),
    type: z.enum(['income', 'expense']).optional(),
    amount: z.coerce.number().positive().optional(),
    description: z.string().trim().max(500).optional().nullable(),
    transactionDate: z.string().or(z.date()).optional(),
  }),
  idParam: z.object({
    id: z.coerce.number({ invalid_type_error: "ID musbat raqam bo'lishi kerak" }).positive(),
  }),
};

export const categorySchemas = {
  create: z.object({
    name: z.string().trim().min(2, "Kategoriya nomi kamida 2 ta belgi bo'lishi kerak"),
    type: z.enum(['income', 'expense'], { errorMap: () => ({ message: "Tur 'income' yoki 'expense' bo'lishi lozim" }) }),
    icon: z.string().optional().default('tag'),
    color: z.string().optional().default('#6B7280'),
  }),
  update: z.object({
    name: z.string().trim().min(2).optional(),
    type: z.enum(['income', 'expense']).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  }),
  idParam: z.object({
    id: z.coerce.number().positive(),
  }),
};

export const budgetSchemas = {
  create: z.object({
    categoryId: z.coerce.number().positive().nullable().optional(),
    amount: z.coerce.number().positive("Byudjet summasi 0 dan katta bo'lishi lozim"),
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
  }),
  update: z.object({
    categoryId: z.coerce.number().positive().nullable().optional(),
    amount: z.coerce.number().positive().optional(),
    month: z.coerce.number().min(1).max(12).optional(),
    year: z.coerce.number().min(2000).max(2100).optional(),
  }),
  idParam: z.object({
    id: z.coerce.number().positive(),
  }),
};

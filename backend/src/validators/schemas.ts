import Joi from 'joi';

export const registerSchema = Joi.object({ 
    name: Joi.string().trim().min(2).max(80).required(), 
    email: Joi.string().email().required(), 
    password: Joi.string().min(8).max(100).required() 
});

export const loginSchema = Joi.object({ 
    email: Joi.string().email().required(), password: Joi.string().required() 
});

export const expenseSchema = Joi.object({ 
    amount: Joi.number().positive().precision(2).required(), 
    category: Joi.string().trim().min(1).max(60).required(), 
    description: Joi.string().trim().max(255).allow('').default(''), 
    spentAt: Joi.date().iso().required() 
});

export const idSchema = Joi.object({ 
    id: Joi.number().integer().positive().required() 
});

export const paginationSchema = Joi.object({ 
    page: Joi.number().integer().min(1).default(1), 
    limit: Joi.number().integer().min(1).max(100).default(10), 
    search: Joi.string().trim().max(100).allow(''), 
    category: Joi.string().trim().max(60).allow(''), 
    from: Joi.date().iso(), 
    to: Joi.date().iso() 
});

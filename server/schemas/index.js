const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Using preprocess so we can handle string representations of numbers
const menuItemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  price: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d+)?$/).transform(Number)]),
  category: z.enum(['Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts']),
  description: z.string().optional().nullable(),
  image: z.string().url('Invalid image URL'),
  availability: z.boolean().default(true).optional()
});

module.exports = { registerSchema, loginSchema, menuItemSchema };

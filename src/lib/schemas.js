import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Phone number is required').optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Using preprocess so we can handle string representations of numbers
export const menuItemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  price: z.union([z.number().positive(), z.string().regex(/^\d+(\.\d+)?$/).transform(Number)]),
  category: z.enum(['Burgers', 'Pizza', 'Wraps', 'Fries', 'Drinks', 'Desserts', 'Chicken', 'Salads', 'Combos']), // Expanded to be safe
  description: z.string().optional().nullable(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  availability: z.boolean().default(true).optional()
});

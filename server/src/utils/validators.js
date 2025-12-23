import { body, query, param } from 'express-validator';

export const createInquiryRules = [
  body('phone').isString().isLength({ min: 5 }).trim(),
  body('message').isString().trim(),
];

export const idParam = [param('id').isMongoId()];

export const listQueryRules = [
  query('status').optional().isIn(['new', 'replied', 'released']),
  query('q').optional().isString().trim(),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

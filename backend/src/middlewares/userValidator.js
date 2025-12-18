const { body, validationResult } = require('express-validator');

const createUserValidation = [
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('invalid email'),
  body('phone').optional().isString(),
  body('company').optional().isString(),
  body('address').optional().isObject(),
  body('address.city').optional().isString(),
  body('address.zipcode').optional().isString(),
  body('address.geo').optional().isObject(),
  body('address.geo.lat').optional().isString(),
  body('address.geo.lng').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

module.exports = { createUserValidation};

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { register, login, logout, getMe } = require('./auth.controller');
const validate = require('../../middleware/validate');
const { protect } = require('../../middleware/auth');

const registerSchema = Joi.object({
  orgName: Joi.string().required(),
  orgSlug: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;

const Joi = require("joi");

const email = Joi.string().email().required();
const id = Joi.string().hex().length(24);

const leadSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().max(50).allow("", null),
  email,
  phone: Joi.string().trim().max(30).allow("", null),
  company: Joi.string().trim().max(120).allow("", null),
  source: Joi.string().valid("Website", "Referral", "Social Media", "Advertisement", "Cold Call", "Other"),
  status: Joi.string().valid("New", "Contacted", "Qualified", "Unqualified", "Converted"),
  notes: Joi.string().max(1000).allow("", null),
  assignedTo: id.allow("", null)
});

const contactSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().max(50).allow("", null),
  email,
  phone: Joi.string().trim().max(30).allow("", null),
  company: Joi.string().trim().max(120).allow("", null),
  jobTitle: Joi.string().trim().max(100).allow("", null),
  notes: Joi.string().max(1000).allow("", null),
  assignedTo: id.allow("", null)
});

const dealSchema = Joi.object({
  title: Joi.string().trim().min(2).max(150).required(),
  contact: id.required(),
  company: Joi.string().trim().max(120).allow("", null),
  value: Joi.number().min(0).required(),
  stage: Joi.string().valid("New", "In Progress", "Won", "Lost"),
  expectedCloseDate: Joi.date().allow("", null),
  probability: Joi.number().min(0).max(100),
  notes: Joi.string().max(1500).allow("", null),
  assignedTo: id.allow("", null)
});

function validate(schema, data) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    const err = new Error(message);
    err.status = 400;
    throw err;
  }

  return value;
}

module.exports = {
  leadSchema,
  contactSchema,
  dealSchema,
  validate
};

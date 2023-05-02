const Joi = require('@hapi/joi')

const middlewareValidation = (schema, property) => {
  return (request, response, next) => {
    const { error } = schema.validate(request.body, { abortEarly: false })
    if (error == null) {
      next()
    } else {
      const { details } = error
      response.status(403).json({ success: false, message: details })
    }
  }
}

const schemas = {

  user: Joi.object().keys({

    firstName: Joi.string().trim().required().min(3).max(50).regex(/[$()<>!@#%^&*]/, { invert: true }).regex(/(?=.*[0-9])/, { invert: true }),
    lastName: Joi.string().trim().required().min(3).max(50).regex(/[$()<>!@#%^&*]/, { invert: true }).regex(/(?=.*[0-9])/, { invert: true }),
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/),
   
  })
 
  
    .unknown(true)
}

module.exports = { middlewareValidation, schemas }
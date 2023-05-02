const express = require('express')
const userControllers = require('../controller/user.js')
const { schemas, middlewareValidation } = require('../middelware/helper.js')

const router = express.Router()

router.post('/addUser', middlewareValidation(schemas.user), userControllers.SignUp)
router.post('/userLogin', userControllers.Login)


router.post('/deleteUser/:id', userControllers.delete)

module.exports = router
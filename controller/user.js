const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_TOKEN_SECRET = 'NOTESAPITOKEN'
const config = require('../db')
const mysql = require('mysql2/promise')


exports.SignUp = async (req, res) => {
  const connection = await mysql.createConnection(config)

  const { firstName, lastName, email, password } = req.body

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  const sqlSearch = 'SELECT * FROM user WHERE email = ?'
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length !== 0) {
    res.status(409).json({ status: '409 conflict', message: 'user already exist' })
  } else {
    connection.execute(`INSERT INTO user (firstName,lastName,email,password
         ) VALUES
      (?,?,?,?)`, [(firstName || null),
        (lastName || null),
      (email || null),
      (hashedPassword || null),
    ])

    res.status(201).json({ status: '201 created', message: 'user created successfully' })
  }
}

exports.Login = async (req, res) => {
  const connection = await mysql.createConnection(config)
  const { email, password } = req.body

  const sqlSearch = 'SELECT * FROM user WHERE email = ?'
  const matchemail = await connection.execute(sqlSearch, [email])

  if (matchemail[0].length === 0) {
    res.status(404).json({ status: '404 Not Found', message: 'user does not exist' })
  } else {
    const hashedPassword = matchemail[0][0].password
    const jwtToken = generateToken(matchemail[0][0].id)
    if (await bcrypt.compare(password, hashedPassword)) {
      const result = await connection.execute(`SELECT * FROM user WHERE email = "${email}"`)
      if (result !== 0) {
        
        const result2=await connection.execute(`UPDATE user SET token = "${jwtToken}" WHERE email = "${email}";`)
        const result3 = await connection.execute(`SELECT * FROM user WHERE email = "${email}"`)
        res.status(200).json({ status: '200 ok', success: 'login successfully', data: result3[0] })
      } else {
        res.status(500).json({ status: '500 Internal Server Error', message: 'Something goes to wrong. Please try again' })
      }
    } else {
      res.status(401).json({ status: 'The HTTP 401 Unauthorized response ', message: 'password incorrect' })
    }
  }
}

function generateToken (id) {
  return jwt.sign(id, JWT_TOKEN_SECRET)
}

exports.delete = async (req, res) => {
    const id = req.params.id
    const connection = await mysql.createConnection(config)
  
    const result2 = await connection.execute(`SELECT * FROM user WHERE id="${id}"`)
  
    if (result2[0].length === 0) {
      res.status(404).json({ status: '404 not found', message: 'User Id not found' })
    } else {
      await connection.execute(`DELETE FROM user WHERE id="${id}"`)
      res.status(200).json({ staus: '200 ok ', message: 'user delete successfully' })
    }
  }
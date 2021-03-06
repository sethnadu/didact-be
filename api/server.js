const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const authRouter = require('../auth/authRouter')
const facebookAuth = require('../auth/facebookAuth')
const googleAuth = require('../auth/googleAuth')
const coursesRouter = require('../courses/coursesRouter')
const tagsRouter = require('../tags/tagsRouter')
const udemyCoursesRouter = require('../courses/udemyCoursesRouter')
const learningPathsRouter = require('../learning-paths/learningPathsRouter')

const server = express()

const restricted = require('../utils/restricted')

server.use(cors())
server.use(helmet())
server.use(express.json())

server.use('/api/auth', authRouter)
server.use('/api/auth/facebook', facebookAuth)
server.use('/api/auth/google', googleAuth)
server.use('/api/courses', restricted, coursesRouter)
server.use('/api/tags', restricted, tagsRouter)
server.use('/api/docs', express.static('./docs'))
server.use('/api/udemy', restricted, udemyCoursesRouter)
server.use('/api/learning-paths', restricted, learningPathsRouter)

server.get('/', (req, res) =>
{
    res.send("server is running")
})
module.exports = server
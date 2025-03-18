const { join } = require('node:path')
const express = require('express')
const userRouter = require('./routes/user.routes')
const pageRoutes = require('./routes/page.routes')
const urlRoutes = require('./routes/url.routes')

const app = express()

// Body'dan ma'lumotni ajratib olish
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// View engine'ni sozlash
app.set('view engine', 'ejs')
app.set('views', join(process.cwd(), 'src', 'views'))

// Statik fayl berib yuborish
app.use('/public', express.static(join(process.cwd(), 'src', 'public')))

// Custom route'larni sozlash
app.use('/', pageRoutes)
app.use('/api/users', userRouter)
app.use('/api/urls', urlRoutes)

// Xato endpoint'larni ushlab qolish
app.all('/*', (req, res) => {
	res.status(404).send({
		message: `Given URL: ${req.url} is not found`,
	})
})

module.exports = app

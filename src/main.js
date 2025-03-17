require('dotenv').config()
const express = require('express')
const userRouter = require('./routes/user.routes')
// const pageRoutes = require("./routes/page.routes");
// const urlRoutes = require("./routes/url.routes");
const createTables = require('./model/db')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

createTables()
	.then(data => console.log(data))
	.catch(err => {
		console.log(err.message)
		process.exit(1)
	})

app.use("/", pageRoutes);
app.use('/api/users', userRouter)
app.use("/api/urls", urlRoutes);

app.all('/*', (req, res) => {
	res.status(404).send({
		message: `Given URL: ${req.url} is not found`,
	})
})

const port = process.env.PORT || 5000

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

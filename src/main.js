const app = require('./app')
const { APP_PORT } = require('./config/app.config')
const createTables = require('./model/db')

createTables()
	.then(data => console.log(data))
	.catch(err => {
		console.log(err.message)
		process.exit(1)
	})

app.listen(APP_PORT, () => {
	console.log(`Server listening on port ${APP_PORT}`)
})

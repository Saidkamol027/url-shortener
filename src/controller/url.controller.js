const { nanoid } = require('nanoid')
const pool = require('../config/db.config')

exports.getAllUrls = async (_, res) => {
	try {
		const urls = await pool.query('SELECT * FROM urls')
		res.status(200).json({ message: 'Fayldagi ma’lumotlar', data: urls.rows })
	} catch (error) {
		res.status(500).json({ message: 'Xatolik yuz berdi', error })
	}
}

exports.generateUrl = async (req, res) => {
	try {
		const { originalUrl, userId } = req.body
		const urls = await pool.query('SELECT * FROM urls')

		const foundedUrl = urls.rows.find(url => url.originalUrl == originalUrl)

		if (foundedUrl) {
			return res.status(409).send({
				message: `Bu URL: ${originalUrl} allaqachon foydalanilgan`,
			})
		}

		let code = nanoid(8)

		await pool.query(
			'INSERT INTO urls (originalUrl, code, userId, createdAt, viewersCount) VALUES ($1, $2, $3, $4, $5)',
			[originalUrl, code, userId, new Date(), 0]
		)

		res.send({
			message: 'ok',
			shortUrl: process.env.SERVER_BASE_URL + 'route/' + code,
		})
	} catch (error) {
		res.status(500).json({ message: 'Xatolik yuz berdi', error })
	}
}

exports.deleteUrl = async (req, res) => {
	try {
		const { id } = req.params
		const url = await pool.query('DELETE FROM urls WHERE id = $1 RETURNING *', [
			id,
		])

		if (url.rows.length === 0) {
			return res.status(404).json({ message: "Bunday 'id'lik url yo'q" })
		}

		res.status(200).json({ message: "Url o'chirib tashlandi", deleteUrl: url })
	} catch (error) {
		res.status(500).json({ error: 'Server bilan hatolik' })
	}
}

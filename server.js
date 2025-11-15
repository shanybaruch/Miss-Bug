import express from 'express'
import path from 'path'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.set('query parser', 'extended')

app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, description, severity, createdAt } = req.body
    const bug = { _id, title, description, severity, createdAt }

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.post('/api/bug', (req, res) => {
    const { title, description, severity, createdAt } = req.body
    const bug = { title, description, severity, createdAt }

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug', (req, res) => {
    console.log(req.query)
const filterBy = {
		txt: req.query.txt || '',
		minSeverity: +req.query.minSeverity || 0,
		paginationOn: req.query.paginationOn === 'true',
		pageIdx: +req.query.pageIdx || 0,
	}
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/:bugId', (req, res) => {
	const { bugId } = req.params
	const { visitBugIds = [] } = req.cookies

	if (!visitBugIds.includes(bugId)) visitBugIds.push(bugId)
	if (visitBugIds.length > 3) return res.status(429).send('Wait for a bit')

	res.cookie('visitBugIds', visitBugIds, { maxAge: 1000 * 10 })
    
	bugService.getById(bugId)
		.then(bug => res.send(bug))
		.catch(err => {
			loggerService.error('Cannot get bug', err)
			res.status(400).send('Cannot get bug')
		})
})

app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3030, () => loggerService.info('Server ready at port 3030'))
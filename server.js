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
    const { title, description, severity, labels, _id } = req.body

    if (!_id || !title || severity === undefined) return res.status(400).send('Missing required fields')
    const bug = {
        _id,
        title,
        description,
        severity: +severity,
        labels: labels || [],
    }

    bugService.save(bug)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug', (req, res) => {
    const bug = {
        title: req.body.title,
        description: req.body.description || '',
        severity: +req.body.severity,
        labels: req.body.labels || [],
    }

    if (!bug.title || bug.severity === undefined) return res.status(400).send('Cannot add bug')

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug', (req, res) => {
    const queryOptions = parseQueryParams(req.query)

	bugService.query(queryOptions)
		.then(bugs => {
			res.send(bugs)
		})
		.catch(err => {
			loggerService.error('Cannot get bugs', err)
			res.status(400).send('Cannot get bugs')
		})
})

function parseQueryParams(queryParams) {
    const filterBy = {
        txt: queryParams.txt || '',
        minSeverity: +queryParams.minSeverity || 0,
        labels: queryParams.labels || [],
    }

    const sortBy = {
        sortField: queryParams.sortField || '',
        sortDir: +queryParams.sortDir || 1,
    }
    
    const pagination = {
        pageIdx: queryParams.pageIdx !== undefined ? +queryParams.pageIdx || 0 : queryParams.pageIdx,
        pageSize: +queryParams.pageSize || 3,
    }

    return { filterBy, sortBy, pagination }
}

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
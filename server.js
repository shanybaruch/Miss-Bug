import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()


app.get('/api/bug/save', (req, res) => {
    const { id: _id, title, description, severity, createdAt } = req.query
    const bug = { _id, title, description, severity: +severity, createdAt: +createdAt }

    bugService.save(bug)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(() => res.send(bugs))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

app.get('/', (req, res) => res.send('Hello'))

app.listen(3030, () => loggerService.info('Server ready at port 3030'))
import express from 'express'
import { makeId } from './services/util.service.js'

const app = express()

let bugs = [
    {
        _id: "a101",
        title: "Cannot save a new bug",
        description: "problem when clicking Save",
        severity: 3,
        createdAt: 1542107359454,
    },
    {
        _id: "a102",
        title: "Cannot remove this bug",
        description: "problem when clicking remove",
        severity: 3,
        createdAt: 1542107359454,
    },
]

app.get('/api/bug', (req, res) => {
    res.send(bugs)
})

app.get('/api/bug/save', (req, res) => {
    const { id: _id, title, description } = req.query
    const bug = { _id, title, description }

    if (bug._id) {
        const idx = bugs.findIndex(bug => bug._id === _id)
        bugs[idx] = bug
    } else {
        bug._id = makeId()
        bugs.push(bug)
    }
    res.send(bugs)
})

app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.id
    const bug = bugs.find(bug => bug._id === bugId)
    res.send(bug)
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.id

    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    res.send('Removed')
})

app.get('/', (req, res) => res.send('Hello'))

app.listen(3030, () => console.log('Server ready at port 3030'))
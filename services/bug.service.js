import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const bugs = readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugs()
}

function save(bug) {
    if (bug._id) {
        const idx = bugs.findIndex(b => b._id === bug._id)
        bugs[idx] = bug
    } else {
        bug._id = makeId()
        bugs.push(bug)
    }
    return _saveBugs()
        .then(() => bug)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}
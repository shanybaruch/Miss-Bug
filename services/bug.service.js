import { makeId, readJsonFile, writeJsonFile } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const bugs = readJsonFile('./data/bug.json')
const PAGE_SIZE = 4

function query({ filterBy = {}, sortBy = {}, pagination = {} } = {}) {
    var bugsToReturn = [...bugs]
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn =
            bugsToReturn.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToReturn =
            bugsToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (Array.isArray(filterBy.labels) && filterBy.labels.length > 0) {
        bugsToReturn =
            bugsToReturn.filter(bug =>
                filterBy.labels.some(label => bug.labels && bug.labels.includes(label)))
    }

    if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
        const { sortField } = sortBy

        bugsToReturn.sort((bug1, bug2) =>
            (bug1[sortField] - bug2[sortField]) * sortBy.sortDir)
    } else if (sortBy.sortField === 'title') {
        bugsToReturn.sort((bug1, bug2) =>
            (bug1.title.localeCompare(bug2.title)) * sortBy.sortDir)
    }

    if (pagination.pageIdx !== undefined) {
        const { pageIdx, pageSize } = pagination

        const startIdx = pageIdx * pageSize
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + pageSize)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug id not found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Bug not found')

    if (!loggedinUser.isAdmin &&
        bugs[idx].owner._id !== loggedinUser._id) {
        return Promise.reject(`Not your bug`)
    }
    bugs.splice(idx, 1)
    return _saveBugs()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(b => b._id === bug._id)
        const bugToUpdate = bugs[bugIdx]

        if (!loggedinUser.isAdmin &&
            bugToUpdate.owner._id !== loggedinUser._id) {
            return Promise.reject(`Not your bug`)
        }
        bugs[bugIdx] = { ...bugToUpdate, ...bug }
    } else {
        bug._id = makeId()
        bug.createdAt = Date.now()
        // console.log('loggedinUser:', loggedinUser)
        bug.owner = loggedinUser
        bugs.push(bug)
    }
    return _saveBugs()
        .then(() => bug)
}

function _saveBugs() {
    return writeJsonFile('./data/bug.json', bugs)
}
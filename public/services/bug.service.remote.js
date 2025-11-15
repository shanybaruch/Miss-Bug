import { utilService } from './util.service.js'

const BASE_URL = '/api/bug'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getLabels
}

function query(queryOptions) {
    return axios.get(BASE_URL, { params: queryOptions })
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + '/' + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + '/' + bugId)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + '/' + bug._id, bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(BASE_URL)
    if (bugs && bugs.length > 0) return

    bugs = [
        {
            title: "Infinite Loop Detected",
            severity: 4,
            _id: "1NF1N1T3"
        },
        {
            title: "Keyboard Not Found",
            severity: 3,
            _id: "K3YB0RD"
        },
        {
            title: "404 Coffee Not Found",
            severity: 2,
            _id: "C0FF33"
        },
        {
            title: "Unexpected Response",
            severity: 1,
            _id: "G0053"
        }
    ]
    utilService.saveToStorage(BASE_URL, bugs)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, labels: [], sortField: '', sortDir: 1 }
}

function getLabels() {
    return [
        'back', 'front', 'critical', 'fixed', 'in progress', 'stuck'
    ]
}
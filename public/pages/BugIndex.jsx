const { useState, useEffect, useRef } = React

import { bugService } from '../services/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { debounce } from '../services/util.service.js'

const PAGE_SIZE = 4

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const debouncedOnSetFilterBy = useRef(debounce(onSetFilterBy, 500)).current

    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + +Date.now().toString().slice(-3)),
            severity: +prompt('Bug severity?', 3)
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const title = prompt('New title?', bug.title)        
        const bugToSave = { ...bug, severity, title }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }

    function onTogglePagination() {
        setFilterBy(prevFilter => {
            return {
                ...prevFilter,
                pageIdx: (prevFilter.pageIdx === undefined) ? 0 : undefined
            }
        })
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedOnSetFilterBy} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>

        <section>
            <button onClick={onTogglePagination}>
                {filterBy.pageIdx === undefined ? 'On Pagination' : 'Off Pagination'}
            </button>
            {filterBy.pageIdx !== undefined &&
                <React.Fragment>
                    <button disabled={filterBy.pageIdx === 0} onClick={() => onChangePage(-1)}>-</button>
                    <span>{filterBy.pageIdx + 1}</span>
                    <button disabled={bugs === null || bugs.length < PAGE_SIZE} onClick={() => onChangePage(1)}>+</button>
                </React.Fragment>
            }
        </section>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />
    </section>
}

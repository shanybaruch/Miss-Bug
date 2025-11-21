const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        loadBug()
    }, [bugId])

    function loadBug() {
        bugService.get(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }

    return (
        <div className="bug-details">
            {!bug && <p className="loading">Loading....</p>}
            {bug &&
                <div>
                    <h3 className='title'>{bug.title}</h3>
                    <p className='severity'>Severity: <span>{bug.severity}</span></p>
                    <p className='description'>Description: <span>{bug.description || 'none'}</span></p>
                    <p className='createdat'>Created at: <span>{bug.createdAt}</span></p>
                    <p className='labels'>Labels: <span>{bug.labels}</span></p>
                    <p className='owner'>Owner: <span>{bug.owner.fullname}</span></p>
                    {/* <hr /> */}
                    <section className='pagination'>
                        <button ><Link to={`/bug/${bug.prevBugId}`}>←</Link></button>
                        <button ><Link to={`/bug/${bug.nextBugId}`}>→</Link></button>
                    </section>
                </div>
            }
            <button className='btn-back'><Link to="/bug">Back</Link></button>
        </div>
    )
}
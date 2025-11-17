const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => setBug(bug))
            .catch(err => showErrorMsg(`Cannot load bug`, err))
    }, [])

    return <div className="bug-details">
        {/* <h3>Bug Details</h3> */}
        {!bug && <p className="loading">Loading....</p>}
        {
            bug && 
            <div>
                <h3 className='title'>{bug.title}</h3>
                <p className='severity'>Severity: <span>{bug.severity}</span></p>
                <p className='description'>Description: <span>{bug.description || 'none'}</span></p>
                <p className='createdat'>Created at: <span>{bug.createdAt}</span></p>
                <p className='labels'>Labels: <span>{bug.labels}</span></p>
                <p className='owner'>Owner: <span>{bug.owner.fullname}</span></p>
            </div>
        }
        <hr />
        <Link to="/bug">Back to List</Link>
    </div>

}
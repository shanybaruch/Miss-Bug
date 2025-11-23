const { Link } = ReactRouterDOM

import { authService } from "../services/auth.service.js";
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    function isAuthorized(bug) {
        const user = authService.getLoggedinUser()
        if (!user) return false
        return user.isAdmin || (bug.owner && user._id === bug.owner._id)
    }

    if (!bugs) return <div>Loading...</div>
    return (
        <section className="bug-list">
            <ul className="list">
                {bugs.map(bug => (
                    <li key={bug._id}>
                        <BugPreview bug={bug} />
                        <section className="actions">
                            <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                            {isAuthorized(bug) &&
                                <React.Fragment>
                                    <button onClick={() => onEditBug(bug)}>Edit</button>
                                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                                </React.Fragment>
                            }
                        </section>
                    </li>
                ))}
            </ul>
            <p className="bugs-total">{bugs.length} bugs total</p>
        </section >
    )
}

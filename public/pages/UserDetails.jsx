const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { bugService } from "../services/bug.service.remote.js"
import { userService } from "../services/user.service.js"

export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()
    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        loadUser()
        loadBugs()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(userFromService => {
                setUser(userFromService)
            }).catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function loadBugs() {
        bugService.query()
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function getBugs() {
        console.log(bugs);
        if (!bugs) return []

        return bugs.filter(bug => {
            return bug.owner && user._id === bug.owner._id
        })
    }

    function onBack() {
        navigate('/')
    }
    if (!user) return <div>Loading...</div>

    return (
        <section className="user-details">
            <h1 className="title">{user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <p>My Bugs <span>{getBugs().length}</span> total</p>
            <ul className="user-bug-list">
                {getBugs().map(bug => (
                    <li key={bug._id} onClick={() => navigate(`/bug/${bug._id}`)}>{bug.title}</li>
                ))}
            </ul>
            <button onClick={onBack} >Back</button>
        </section>
    )
}
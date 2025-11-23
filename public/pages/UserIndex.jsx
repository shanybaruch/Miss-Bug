const { useState, useEffect } = React
const { useNavigate, Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.remote.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from "../services/user.service.js"

export function UserIndex() {

    const [users, setUsers] = useState(null)
    const navigate = useNavigate()
    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        loadUsers()
        loadBugs()
    }, [])

    function loadUsers() {
        userService.query()
            .then(usersArray => {
                if (Array.isArray(usersArray)) {
                    setUsers(usersArray)
                } else {
                    console.log('ERROR: Server returned non-array:', usersArray)
                    setUsers([])
                }
            }).catch(err => {
                console.log('err:', err)
            })
    }

    function getUsers() {
        if (!users) return []
        return users
    }

    function loadBugs() {
        bugService.query()
            .then(setBugs)
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const usersToUpdate = users.filter(user => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user`, err))
    }

    function onBack() {
        navigate(-1)
    }

    if (!users) return <div>Loading users...</div>
    return (
        <section className="user-index">
            <h1 className="title">User management</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>ID</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {getUsers().map(user => (
                        <tr
                            key={user._id}
                            onClick={() => navigate(`/user/${user._id}`)}
                            className="user-row"
                        >
                            <td>{user.fullname}</td>
                            <td>{user._id}</td>
                            <td>
                                <button onClick={(ev) => ev.stopPropagation()}><Link to={`/user/${user._id}`}>Details</Link></button>
                                <button onClick={(ev) => {
                                    ev.stopPropagation()
                                    const userBugs = bugs ? bugs.filter(bug => bug.owner._id === user._id) : []
                                    if (userBugs.length === 0) {
                                        onRemoveUser(user._id)
                                    } else {
                                        showErrorMsg(`Cannot removed ${user.fullname}. his have ${userBugs.length} open bugs.`)
                                    }
                                }}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onBack} >Back</button>
        </section>
    )
}
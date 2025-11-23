const { useState, useEffect } = React
const { useNavigate, Link } = ReactRouterDOM

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from "../services/user.service.js"

export function UserIndex() {

    const [users, setUsers] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        loadUsers()
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
                                    onRemoveUser(user._id)
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
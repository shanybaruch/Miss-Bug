import { authService } from '../services/auth.service.js'

const { Link, NavLink, useNavigate } = ReactRouterDOM

export function AppHeader({ loggedinUser, setLoggedinUser }) {

    const navigate = useNavigate()

    function onLogout() {
        authService.logout()
            .then(() => {
                setLoggedinUser(null)
            })
            .catch(err => {
                console.log(err)
                showErrorMsg(`Couldn't logout`)
            })
    }

    function onBack() {
        navigate(-1)
    }

    return (
        <header className="app-header main-content single-row">
            <h1 className='title'>Miss Bug</h1>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/bug">Bugs</NavLink>
                <NavLink to="/about">About</NavLink>
                {
                    !loggedinUser
                        ? <NavLink to="/auth" >Login</NavLink>
                        : <div className="user">
                            <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
                            <button className='btn-logout' onClick={onLogout}>Logout</button>
                        </div>
                }
            </nav>
        </header>
    )
}
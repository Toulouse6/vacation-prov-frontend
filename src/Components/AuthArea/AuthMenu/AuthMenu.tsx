import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { AppState } from "../../../Redux/AppState";
import { authService } from "../../../Services/AuthService";
import "./AuthMenu.css";
import { notify } from "../../../Utils/Notify";

function AuthMenu(): JSX.Element {

    // Fetch user data from redux store:
    const user = useSelector<AppState, UserModel>(appState => appState.user);

    const navigate = useNavigate();


    // Function to handle logout
    function logMeOut(): void {
        notify.success(`Bye bye ${user.firstName}...`);
        authService.logout();
        navigate("/home");

        // Reload the window to clear session state:
        window.location.reload();
    }

    // Conditional rendering based on user presence:
    if (user) {
        return (
            <div className="AuthMenu">
                <span>Hello {user.firstName} {user.lastName} | </span>
                <NavLink to="/home" onClick={logMeOut}>Logout</NavLink>
            </div>
        );
    }

    return (
        <div className="AuthMenu">
            <span>👤 Hello Guest</span>
            <NavLink to="/login">Login</NavLink>
            <span>|</span>
            <NavLink to="/register">Register</NavLink>
        </div>
    );
}

export default AuthMenu;

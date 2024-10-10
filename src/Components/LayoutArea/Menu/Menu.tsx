import { NavLink } from "react-router-dom";
import "./Menu.css";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";

function Menu(): JSX.Element {

    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>

            <NavLink to="/vacations">Vacations</NavLink>

            <AuthMenu />

        </div>
    );
}

export default Menu;
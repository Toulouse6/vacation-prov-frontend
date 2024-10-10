import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import "./TotalVacations.css";

function TotalVacations(): JSX.Element {

    // useSelector to get vacation count from Redux state:
    const count = useSelector((appState: AppState) => appState.vacations.length);

    if (!count) return null;
    return (
        <div className="TotalVacations">
            <span>Total Vacations: {count}</span>
        </div>
    );

}

export default TotalVacations;

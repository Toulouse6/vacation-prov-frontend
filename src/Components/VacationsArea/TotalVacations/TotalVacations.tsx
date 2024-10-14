import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import "./TotalVacations.css";

function TotalVacations(): JSX.Element {
 
    const [totalCount, setTotalCount] = useState<number>(0);

    // useSelector to get vacation count from Redux state:
    const reduxCount = useSelector((appState: AppState) => appState.vacations.length);

    // Effect to update total count based on local storage and Redux state
    useEffect(() => {
        // Get vacations from local storage
        const storedVacations = localStorage.getItem('vacations');
        const localCount = storedVacations ? JSON.parse(storedVacations).length : 0;

        // Update total count
        setTotalCount(localCount || reduxCount);
    }, [reduxCount]);

    if (totalCount === 0) return null; // Return null if no vacations

    return (
        <div className="TotalVacations">
            <span>Total Vacations: {totalCount}</span>
        </div>
    );
}

export default TotalVacations;

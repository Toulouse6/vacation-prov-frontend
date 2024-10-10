import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import "./VacationCards.css";
import { vacationsService } from "../../../Services/VacationsService";
import { notify } from "../../../Utils/Notify";

// Define props' types:
type VacationCardProps = {
    vacation: VacationModel;
};


function AdminVacationCard(props: VacationCardProps): JSX.Element {

    const navigate = useNavigate();

    async function deleteMe() {
        try {
            const sure = window.confirm("Are you sure?");
            if (!sure) return;
    
            // Get the ID of the vacation to be deleted:
            const vacationId = props.vacation.id;
            await vacationsService.deleteVacation(vacationId);
            notify.success("Vacation has been deleted.");
            navigate('/home');

        } catch (err: any) {
            notify.error(`Failed to delete vacation: ${err.message}`);
        }
    }


    return (

        <div className={`VacationCard`}>

            <div>
                {/* Vacation image */}
                <img src={props.vacation.imageUrl} alt={props.vacation.destination} />
            </div>

            {/* Admin buttons */}
            <div className="btn-group btn-group-sm" id="AdminBtn">
                <button onClick={() => navigate(`/vacations/edit/${props.vacation.id}`)} className="btn btn-outline-secondary">
                    Edit
                </button>
                <button onClick={deleteMe} className="btn btn-outline-secondary">
                    Delete
                </button>
            </div>

            <div>
                {/* Vacation destination */}
                <h2>{props.vacation.destination}</h2>

                {/* Vacation date - show as string */}
                <div className="Date">
                    {new Date(props.vacation.startDate).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                    })} - {new Date(props.vacation.endDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
                {/* Vacation description */}
                <p>{props.vacation.description}</p>
                <br />
                {/* Vacation price - rounded up */}
                <h4>${Number(props.vacation.price).toFixed(0)}</h4>

            </div>
        </div>

    );

}

export default AdminVacationCard;

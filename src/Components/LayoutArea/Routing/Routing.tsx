import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../HomeArea/Home/Home";
import Page404 from "../page404/page404";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import VacationsList from "../../VacationsArea/VacationsList/VacationsList";
import Register from "../../AuthArea/Register/Register";
import Login from "../../AuthArea/Login/Login";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import VacationsReports from "../../ReportsArea/Reports/VacationsReports";


function Routing(): JSX.Element {

    return (
        <div className="Routing">
            <Routes>

                {/* Home */}
                <Route path="/home" element={<Home />} />

                {/* Vacations */}
                <Route path="/vacations" element={<VacationsList />} />
                <Route path="/vacations/active" element={<VacationsList />} />
                <Route path="/vacations/upcoming" element={<VacationsList />} />
                <Route path="/vacations/favorites" element={<VacationsList />} />
                <Route path="/likes/:userId/:vacationId" element={<VacationsList />} />

                {/* Reports Page */}
                <Route path="/likes/reports" element={<VacationsReports />} />

                {/* Add Vacation */}
                <Route path="/vacations/add" element={<AddVacation />} />

                {/* Edit Vacation */}
                <Route path="/vacations/edit/:id" element={<EditVacation />} />

                {/* Register */}
                <Route path="/register" element={<Register />} />

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Page not found route */}
                <Route path="*" element={<Page404 />} />

            </Routes>
        </div>
    );
}

export default Routing;

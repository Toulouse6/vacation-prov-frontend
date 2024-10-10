import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { NavLink, Navigate } from "react-router-dom";
import useTitle from "../../../Utils/UseTitle";
import Spinner from "../../SharedArea/Spinner/Spinner";
import { notify } from "../../../Utils/Notify";
import VacationModel from "../../../Models/VacationModel";
import VacationCard from "../VacationCards/VacationCard";
import AdminVacationCard from "../VacationCards/AdminVacationCard";
import { vacationsService } from "../../../Services/VacationsService";
import TotalVacations from "../TotalVacations/TotalVacations";
import "./VacationsList.css";
import { likesService } from "../../../Services/LikesService";

function VacationsList(): JSX.Element {

    // State hooks to manage vacations data, likes & pagination:
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [likes, setLikes] = useState([]);

    // Hook to page title:
    useTitle("Featured Vacations");

    // Redux store selector to access user data:
    const user = useSelector((state: any) => state.user);

    // Checking user roles:
    const isAdmin = user?.roleId === 1;
    const isUser = user?.roleId === 2;

    // Pagination state:
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 9;
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;

    // useMemo
    const displayedVacations = useMemo(() =>
        vacations.slice(indexOfFirstCard, indexOfLastCard), [indexOfFirstCard, indexOfLastCard, vacations]);

    const totalPages = useMemo(() => Math.ceil(vacations.length / cardsPerPage), [vacations]);

    // State for managing filter selection:
    const [filter, setFilter] = useState<'all' | 'favorites' | 'upcoming' | 'active'>('all');


    // Fetching likes for logged-in user:
    const fetchLikes = useCallback(async () => {
        try {
            if (user && user.id) {
                const userLikes = await likesService.getUserLikes(user.id);
                setLikes(userLikes);
            }
        } catch (error: any) {
            notify.error(error.message);
        }
    }, [user]);

    // Effect to fetch likes data:
    useEffect(() => {
        if (user && user.id) {
            fetchLikes();
        }
    }, [user?.id]);


    // Effect to fetch vacations based on the selected filter
    useEffect(() => {
        const fetchVacations = async () => {
            try {
                let data: VacationModel[] = [];
                switch (filter) {
                    case 'favorites':
                        if (user && user.id) {
                            data = await vacationsService.getFavoriteVacations(user.id);
                        }
                        break;
                    case 'upcoming':
                        data = await vacationsService.getUpcomingVacations();
                        break;
                    case 'active':
                        data = await vacationsService.getActiveVacations();
                        break;
                    default:
                        data = await vacationsService.getAllVacations();
                }

                // Sorting the fetched vacations by start date:
                const sortedData = data.slice().sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                console.log(`Data for filter ${filter}:`, sortedData);
                setVacations(sortedData);

            } catch (error: any) {
                notify.error(error.message);
            }
        };

        if (user && user.id) {
            fetchVacations();
        }
    }, [filter, user]);


    // Handling filter selection changes
    const handleFilterToggle = (selectedFilter: 'favorites' | 'upcoming' | 'active') => {
        setFilter(prevFilter => prevFilter === selectedFilter ? 'all' : selectedFilter);
        setCurrentPage(1);
    };

    // Function for handling pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Redirect to login page if user not found:
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (

        <div className="VacationsList">

            <h1>Featured Vacations</h1>
            <TotalVacations />

            {/* Render admin vacation cards */}
            {isAdmin && (
                <div>
                    {/* Admin Loading Spinner */}
                    {vacations.length === 0 ? (
                        <>
                            <h4>No vacations to show...</h4>
                            <Spinner />
                        </>
                    ) : (
                        <div>
                            {/* Admin links */}
                            <div className="AdminLinks">
                                <NavLink className="AddBtn" to="/vacations/add">Add Destination</NavLink>
                                <NavLink className="ReportsBtn" to="/likes/reports">View Reports</NavLink>
                            </div>
                            {/* Admin Cards container */}
                            <div className="CardsContainer">
                                {displayedVacations.map(vacation => (
                                    <AdminVacationCard key={vacation.id} vacation={vacation} />
                                ))}
                            </div>
                            {/* Admin Pagination */}
                            {vacations.length !== 0 && (
                                <div className="Pagination">
                                    {currentPage > 1 && (
                                        <button className="PaginationBtn" onClick={() => paginate(currentPage - 1)}>
                                            ⇠ Previous
                                        </button>
                                    )}
                                    {currentPage < totalPages && (
                                        <button className="PaginationBtn" onClick={() => paginate(currentPage + 1)}>
                                            Next ⇢
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {/* Render user vacation cards */}
            {isUser && (
                <div>
                    {/* User Vacations filter */}
                    <div className="btn-group btn-group-md" role="group" id="FilterBtnGroup">
                        <button className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`} onClick={() => handleFilterToggle('favorites')}>
                            Favorites
                        </button>
                        <button className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => handleFilterToggle('upcoming')}>
                            Upcoming
                        </button>
                        <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => handleFilterToggle('active')}>
                            Active
                        </button>
                    </div>
                    {/* User Loading Spinner */}
                    {displayedVacations.length === 0 ? (
                        <>
                            <h4>No vacations to show...</h4>
                            <Spinner />
                        </>
                    ) : (
                        <div>
                            {/* Searching for like data of vacation.id */}
                            {displayedVacations.map(vacation => {
                                const likeData = likes.find(like => like.vacationId === vacation.id);
                                const likeCount = likeData ? likeData.count : 0;

                                {/* User Cards container */ }
                                return (
                                    <VacationCard
                                        key={vacation.id}
                                        vacation={vacation}
                                        user={user}
                                        onLikesUpdated={fetchLikes}
                                        likeCount={likeCount}
                                    />
                                );
                            })}
                            {/* Admin Pagination */}
                            <div className="Pagination">
                                {currentPage > 1 && (
                                    <button className="PaginationBtn" onClick={() => paginate(currentPage - 1)}>
                                        ⇠ Previous
                                    </button>
                                )}
                                {currentPage < totalPages && (
                                    <button className="PaginationBtn" onClick={() => paginate(currentPage + 1)}>
                                        Next ⇢
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );


};

export default VacationsList;
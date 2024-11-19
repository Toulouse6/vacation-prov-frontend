import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { NavLink, Navigate, useLocation } from "react-router-dom";
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

    // State hooks
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [likes, setLikes] = useState([]);
    const location = useLocation(); 
    
    useTitle("Featured Vacations");

    // Redux store selector to access user data:
    const user = useSelector((state: any) => state.user);

    // Check user roles:
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

    // Reset filters when navigating to /vacations
    useEffect(() => {
        if (location.pathname === '/vacations') {
            setFilter('all');
        }
    }, [location.pathname]);

    // Fetch vacations after registration
    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const data = await vacationsService.getAllVacations();
                console.log("Fetched Vacations Data:", data); // Log fetched data
                setVacations(data);
            } catch (error) {
                console.error("Error fetching vacations:", error);
            }
        };

        if (user) {
            fetchVacations();
        }
    }, [user]);

    // Fetching likes for logged-in users:
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

    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);



    // Fetch vacations based on filter
    useEffect(() => {
        const fetchVacations = async () => {
            try {
                let data: VacationModel[] = [];
                console.log("Fetching vacations for user ID:", user?.id); // Log user ID
                console.log("Current filter:", filter); // Log current filter

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

                // Ensure vacation structure
                if (Array.isArray(data)) {
                    setVacations(data);
                } else {
                    console.error("Unexpected data structure:", data);
                }
            } catch (error: any) {
                notify.error(error.message);
            }
        };

        if (user && user.id) {
            fetchVacations();
        }
    }, [filter, user]);


    // Handling filter selection
    const handleFilterToggle = (selectedFilter: 'favorites' | 'upcoming' | 'active') => {
        setFilter(prevFilter => prevFilter === selectedFilter ? 'all' : selectedFilter);
        setCurrentPage(1);
    };

    // Pagination
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Redirect to login page if user not found:
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (

        <div className="VacationsList">

            <h1>Featured Vacations</h1>
            <TotalVacations />

            {/* Admin vacation cards */}
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
                                {displayedVacations.map((vacation) => (
                                    vacation?.id && (
                                        <AdminVacationCard key={vacation.id} vacation={vacation} />
                                    )
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
            {/* User vacation cards */}
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

                            {displayedVacations.map((vacation) => {
                                if (!vacation?.id) return null; // Check if vacation & id exist

                                const likeData = likes.find(like => like.vacationId === vacation.id);
                                const likeCount = likeData ? likeData.count : 0;

                                return (
                                    <VacationCard
                                        key={vacation.id}
                                        vacation={vacation}
                                        user={user}
                                        onLikesUpdated={fetchLikes}
                                        likeCount={likeCount}
                                    />
                                );
                            })};
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
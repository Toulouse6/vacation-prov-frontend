import { useState } from "react";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { likesService } from "../../../Services/LikesService";
import "./VacationCards.css";

// Define props' types:
type VacationCardProps = {
    vacation: VacationModel;
    user: UserModel;

    // Callback to update likes state in parent component:
    onLikesUpdated: () => void;
    // Initial like count:
    likeCount: number;
};


function VacationCard({ vacation, user, onLikesUpdated, likeCount }: VacationCardProps): JSX.Element {

    // Keys storing likes data in localStorage:
    const likeStorageKey = `liked_${vacation.id}_${user.id}`;
    const countStorageKey = `likeCount_${vacation.id}`;

    // State for managing like status
    const [liked, setLiked] = useState(() => {
        const storedLike = localStorage.getItem(likeStorageKey);

        // Parse stored like status:
        try {
            return storedLike ? JSON.parse(storedLike) : false;
        } catch {
            return false;
        }
    });

    // State managing loading status:
    const [loading, setLoading] = useState(false);

    // State managing local like count:
    const [localLikeCount, setLocalLikeCount] = useState(() => {

        // Retrieve stored like count from localStorage using key:
        const storedCount = localStorage.getItem(countStorageKey);
        // parse received value to integer base 10
        const count = parseInt(storedCount, 10);
        return !isNaN(count) ? count : likeCount;
    });


    // Like toggle:
    const handleLikeToggle = async () => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true); // Set loading state

        try {
            const newLike = !liked; // Toggle the like status
            await likesService.toggleLike(user.id, vacation.id);
            setLiked(newLike);

            // Update like count:
            const updatedCount = newLike ? localLikeCount + 1 : Math.max(localLikeCount - 1, 0);
            setLocalLikeCount(updatedCount);
            localStorage.setItem(likeStorageKey, JSON.stringify(newLike)); // Store new like status
            localStorage.setItem(countStorageKey, updatedCount.toString()); // Store new count

            onLikesUpdated(); // Callback update likes in parent component
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);  // Reset loading state
        }
    };


    return (

        <div className={`VacationCard ${liked ? 'liked' : ''}`}>
            <div>
                {/* Vacation image */}
                <img src={vacation.imageUrl} alt={vacation.destination} />
            </div>

            <div className="LikeBox">
                <button
                    type="button"
                    className={`like-btn ${liked ? 'active' : ''}`}
                    onClick={handleLikeToggle}
                    disabled={loading}>
                    {loading ? 'Loading...' : liked ? 'Liked' : 'Like'}
                </button>
            </div>

            {/* Displays current like count */}
            <span>{localLikeCount} likes</span>

            {/* Vacation destination */}
            <h2>{vacation.destination}</h2>

            {/* Vacation date - show as string */}
            <div className="Date">
                {new Date(vacation.startDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                })} - {new Date(vacation.endDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
            {/* Vacation description */}
            <p>{vacation.description}</p>
            <br />
            {/* Vacation price - rounded up */}
            <h4>${Number(vacation.price).toFixed(0)}</h4>

        </div>
    );

}

export default VacationCard;

import { useState } from "react";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { likesService } from "../../../Services/LikesService";
import "./VacationCards.css";

// props types:
type VacationCardProps = {
    vacation: VacationModel;
    user: UserModel;

    onLikesUpdated: () => void;
    likeCount: number;
};

function VacationCard({ vacation, user, onLikesUpdated, likeCount }: VacationCardProps): JSX.Element {

    const likeStorageKey = `liked_${vacation.id}_${user.id}`;
    const countStorageKey = `likeCount_${vacation.id}`;

    const [liked, setLiked] = useState(() => {
        const storedLike = localStorage.getItem(likeStorageKey);
        return storedLike ? JSON.parse(storedLike) : false;
    });

    const [loading, setLoading] = useState(false);

    // State managing local like count:
    const [localLikeCount, setLocalLikeCount] = useState(() => {
        const storedCount = localStorage.getItem(countStorageKey);
        return storedCount ? parseInt(storedCount, 10) : likeCount;
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
            localStorage.setItem(likeStorageKey, JSON.stringify(newLike)); 
            localStorage.setItem(countStorageKey, updatedCount.toString());  

            onLikesUpdated();
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`VacationCard ${liked ? 'liked' : ''}`}>
            <div>
                <img
                    src={vacation.imageUrl}
                    alt={vacation.destination}
                />
            </div>

            <div className="LikeBox">
                <button
                    type="button"
                    className={`like-btn ${liked ? 'active' : ''}`}
                    onClick={handleLikeToggle}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : liked ? 'Liked' : 'Like'}
                </button>
            </div>

            <span>{localLikeCount} likes</span>

            <h2>{vacation.destination}</h2>

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

            <p>{vacation.description}</p>
            <br />

            <h4>${Number(vacation.price).toFixed(0)}</h4>
        </div>
    );
}

export default VacationCard;

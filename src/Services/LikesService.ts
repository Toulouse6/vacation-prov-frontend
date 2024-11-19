import LikesModel from "../Models/LikesModel";
import { vacationsService } from "./VacationsService";

class LikesService {
    // Toggle like
    public async toggleLike(userId: number, vacationId: number): Promise<void> {
        try {
            // Fetch current likes from local storage
            const likes = this.getLikesFromLocalStorage();
            const likeExists = likes.some((like) => like.user_id === userId && like.vacation_id === vacationId);

            if (likeExists) {
                this.removeLike(userId, vacationId);
            } else {
                this.addLike(userId, vacationId);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    }

    // Get likes from local storage
    private getLikesFromLocalStorage(): { user_id: number; vacation_id: number }[] {
        const storedLikes = localStorage.getItem("likes");
        return storedLikes ? JSON.parse(storedLikes) : [];
    }

    // Add like
    public addLike(userId: number, vacationId: number): void {
        const likes = this.getLikesFromLocalStorage();
        likes.push({ user_id: userId, vacation_id: vacationId });
        localStorage.setItem("likes", JSON.stringify(likes));
    }

    // Remove like
    public removeLike(userId: number, vacationId: number): void {
        const likes = this.getLikesFromLocalStorage();
        const updatedLikes = likes.filter(like => !(like.user_id === userId && like.vacation_id === vacationId));
        localStorage.setItem("likes", JSON.stringify(updatedLikes));
    }

    // Get user likes
    public async getUserLikes(userId: number): Promise<LikesModel[]> {
        const likes = this.getLikesFromLocalStorage();
        return likes
            .filter(like => like.user_id === userId)
            .map(like => new LikesModel(like.user_id, like.vacation_id));
    }

    public async getVacationsWithLikes(): Promise<any[]> {
        const likes = this.getLikesFromLocalStorage();
        const report = likes.reduce((acc: { [key: number]: number }, like) => {
            acc[like.vacation_id] = (acc[like.vacation_id] || 0) + 1;  
            return acc;
        }, {});
    
        // Fetch all vacations to match IDs
        const vacations = await vacationsService.getAllVacations();  
        return Object.entries(report).map(([vacationId, likeCount]) => {
            const vacation = vacations.find(v => v.id === Number(vacationId));
            return {
                destination: vacation ? vacation.destination : 'Unknown',
                likesCount: likeCount,
            };
        });
    }
    

    // Get favorite vacations for a user
    public async getFavoriteVacations(userId: number): Promise<number[]> {
        const likes = this.getLikesFromLocalStorage();
        const favoriteVacationIds = likes
            .filter(like => like.user_id === userId)
            .map(like => like.vacation_id);

        return favoriteVacationIds;
    }
}

export const likesService = new LikesService();

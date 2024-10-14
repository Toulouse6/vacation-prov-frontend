import LikesModel from "../Models/LikesModel";

class LikesService {

    // Toggle like
    public async toggleLike(userId: number, vacationId: number): Promise<void> {
        try {
            // Fetch the likes from the local JSON file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);
            let likes: { user_id: number, vacation_id: number }[] = await response.json();

            // Check if the like already exists
            const likeExists = likes.some(like => like.user_id === userId && like.vacation_id === vacationId);

            // If the like exists, remove it; otherwise, add it
            if (likeExists) {
                this.removeLike(userId, vacationId);
            } else {
                this.addLike(userId, vacationId);
            }

        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }

    // Add like
    public async addLike(userId: number, vacationId: number): Promise<void> {
        try {
            // Fetch the likes from the local JSON file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);
            const likes: { user_id: number, vacation_id: number }[] = await response.json();

            // Simulate adding the new like
            likes.push({ user_id: userId, vacation_id: vacationId });

            // Save the updated likes to local storage (for simulation purposes)
            localStorage.setItem("likes", JSON.stringify(likes));

        } catch (error) {
            console.error('Error adding like:', error);
        }
    }

    // Remove like
    public async removeLike(userId: number, vacationId: number): Promise<void> {
        try {
            // Fetch the likes from the local JSON file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);
            let likes: { user_id: number, vacation_id: number }[] = await response.json();

            // Filter out the like that matches the userId and vacationId
            likes = likes.filter(like => like.user_id !== userId || like.vacation_id !== vacationId);

            // Save the updated likes to local storage (for simulation purposes)
            localStorage.setItem("likes", JSON.stringify(likes));

        } catch (error) {
            console.error('Error removing like:', error);
        }
    }

    // Get user likes:
    public async getUserLikes(userId: number): Promise<LikesModel[]> {
        try {
            // Fetch the likes from the local JSON file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);
            const likes: { user_id: number, vacation_id: number }[] = await response.json();

            // Map snake_case to camelCase for LikesModel
            return likes
                .filter(like => like.user_id === userId)
                .map(like => new LikesModel(like.user_id, like.vacation_id));

        } catch (error) {
            console.error("Error fetching user likes:", error);
            throw error;
        }
    }

    // Get likes report:
    public async getVacationsWithLikes(): Promise<any[]> {
        try {
            // Fetch the likes from the local JSON file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);
            let likes: { user_id: number, vacation_id: number }[] = await response.json();

            // Group vacations by their like count (for report)
            const report = likes.reduce((acc: { [key: number]: number }, like) => {
                if (!acc[like.vacation_id]) {
                    acc[like.vacation_id] = 1;
                } else {
                    acc[like.vacation_id]++;
                }
                return acc;
            }, {});

            return Object.entries(report).map(([vacationId, likeCount]) => ({
                vacationId: Number(vacationId),
                likeCount
            }));

        } catch (error) {
            console.error('Error fetching likes report:', error);
            throw new Error('Failed to fetch likes report');
        }
    }

}

export const likesService = new LikesService();

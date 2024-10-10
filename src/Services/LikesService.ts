import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import LikesModel from "../Models/LikesModel";

class LikesService {

    // Toggle like
    public async toggleLike(userId: number, vacationId: number): Promise<void> {
        try {
            // Check if the like exists by GET request to likesUrl endpoint:
            const response = await axios.get(`${appConfig.likesUrl}/exists/${userId}/${vacationId}`);
            const likeExists = response.data.exists;

            // If the like exists, remove it; otherwise, add like:
            if (likeExists) {
                await this.removeLike(userId, vacationId);
            } else {
                await this.addLike(userId, vacationId);
            }
        }
        catch (error) {
            console.error('Error toggling like:', error);
        }
    }


    // Add like
    public async addLike(userId: number, vacationId: number): Promise<void> {

        // Send axios POST request to like specific vacation by a specific user:
        await axios.post(`${appConfig.likesUrl}/${userId}/${vacationId}`);
    }

    // Remove like
    public async removeLike(userId: number, vacationId: number): Promise<void> {

        // Send axios DELETE request to remove like for specific vacation by a specific user:
        await axios.delete(`${appConfig.likesUrl}/${userId}/${vacationId}`);
    }

    // Get user likes:
    public async getUserLikes(userId: number): Promise<LikesModel[]> {

        // Fetch likes for a specific user:
        const response = await axios.get(`${appConfig.likesUrl}/user/${userId}`);
        return response.data;
    }

    // Get likes report:
    public async getVacationsWithLikes(): Promise<any[]> {
        try {
            // Fetch specific likes for a report:
            const response = await axios.get(`${appConfig.likesUrl}/reports`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching likes reports:', error);
            throw new Error('Failed to fetch likes reports');
        }
    }


}

export const likesService = new LikesService();

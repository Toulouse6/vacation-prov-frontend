import VacationModel from "../Models/VacationModel";
import { appStore } from "../Redux/Store";
import { vacationActionCreators } from "../Redux/VacationSlice";

class VacationsService {

    // Validate & parse dates
    private parseValidDate(dateString: string): Date | null {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Get all vacations:
    public async getAllVacations(): Promise<VacationModel[]> {
        try {
            let vacations = appStore.getState().vacations;

            if (vacations.length > 0) return vacations;

            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            vacations = await response.json();

            // Ensure that dates are properly parsed and handle invalid date values
            vacations = vacations.map((vacation: VacationModel) => ({
                ...vacation,
                startDate: this.parseValidDate(vacation.startDate),
                endDate: this.parseValidDate(vacation.endDate),
            }));

            const action = vacationActionCreators.initAll(vacations);
            appStore.dispatch(action);
            return vacations;

        } catch (error) {
            console.error("Error fetching all vacations:", error);
            throw error;
        }
    }

    // Get one vacation:
    public async getOneVacation(id: number): Promise<VacationModel> {
        try {
            let vacations = appStore.getState().vacations;
            let vacation = vacations.find((v) => v.id === id);

            if (vacation) return vacation;

            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            vacations = await response.json();
            vacation = vacations.find((v) => v.id === id);

            if (vacation) {
                vacation.startDate = new Date(vacation.startDate);
                vacation.endDate = new Date(vacation.endDate);
            }

            return vacation;

        } catch (error) {
            console.error("Error fetching one vacation:", error);
            throw error;
        }
    }

    // Upcoming Vacations:
    public async getUpcomingVacations(): Promise<VacationModel[]> {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            const vacations = await response.json();

            return vacations.filter((vacation: VacationModel) => {
                const startDate = new Date(vacation.startDate);
                return startDate > new Date();
            });

        } catch (error) {
            console.error("Error fetching upcoming vacations:", error);
            throw error;
        }
    }

    // Active Vacations:
    public async getActiveVacations(): Promise<VacationModel[]> {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            const vacations = await response.json();
            const today = new Date();

            return vacations.filter((vacation: VacationModel) => {
                const startDate = new Date(vacation.startDate);
                const endDate = new Date(vacation.endDate);
                return startDate <= today && endDate >= today;
            });

        } catch (error) {
            console.error("Error fetching active vacations:", error);
            throw error;
        }
    }

    // Favorite Vacations:
    public async getFavoriteVacations(userId: number): Promise<VacationModel[]> {
        try {
            // Fetch the likes.json file
            const likesResponse = await fetch(`${process.env.PUBLIC_URL}/data/likes.json`);

            // Check if the response is OK
            if (!likesResponse.ok) {
                throw new Error(`Failed to fetch likes: ${likesResponse.statusText}`);
            }

            const likes = await likesResponse.json();

            // Fetch the vacations.json file
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);

            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`Failed to fetch vacations: ${response.statusText}`);
            }

            const vacations = await response.json();

            // Filter likes to match the current user
            const favoriteVacationIds = likes
                .filter((like: any) => like.user_id === userId)
                .map((like: any) => like.vacation_id);

            // Filter vacations by matching IDs from likes
            return vacations.filter((vacation: VacationModel) => favoriteVacationIds.includes(vacation.id));

        } catch (error) {
            console.error("Error fetching favorite vacations:", error);
            throw error;
        }
    }


    // Add Vacation:
    public async addVacation(vacation: VacationModel): Promise<void> {
        try {
            const action = vacationActionCreators.addOne(vacation);
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error adding vacation:", error);
            throw error;
        }
    }

    // Edit Vacation:
    public async editVacation(vacation: VacationModel): Promise<void> {
        try {
            const action = vacationActionCreators.updateOne(vacation);
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error updating vacation:", error);
            throw error;
        }
    }

    // Delete Vacation:
    public async deleteVacation(id: number): Promise<void> {
        try {
            const action = vacationActionCreators.deleteOne(id);
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error deleting vacation:", error);
            throw error;
        }
    }
}

export const vacationsService = new VacationsService();

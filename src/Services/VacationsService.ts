import VacationModel from "../Models/VacationModel";
import { appStore } from "../Redux/Store";
import { vacationActionCreators } from "../Redux/VacationSlice";
import { likesService } from "./LikesService";

class VacationsService {

    // Validate & parse dates
    private parseValidDate(dateString: string): Date | null {
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Get all vacations from local storage:
    private getAllVacationsFromLocalStorage(): VacationModel[] {
        const storedVacations = localStorage.getItem('vacations');
        return storedVacations ? JSON.parse(storedVacations) : [];
    }


    // Get all vacations:
    public async getAllVacations(): Promise<VacationModel[]> {
        // This method can now check local storage first
        const localVacations = this.getAllVacationsFromLocalStorage();
        if (localVacations.length > 0) return localVacations;

        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            let vacations = await response.json();

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
            const vacations = await this.getAllVacations(); // Fetch all vacations once
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
            const vacations = await this.getAllVacations(); // Fetch all vacations once
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
            // Get favorite vacation IDs from LikesService
            const favoriteVacationIds = await likesService.getFavoriteVacations(userId);

            // Fetch all vacations
            const vacationsResponse = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            if (!vacationsResponse.ok) throw new Error(`Failed to fetch vacations: ${vacationsResponse.statusText}`);
            const vacations: VacationModel[] = await vacationsResponse.json(); // Ensure correct type

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

            // Save to local storage
            const currentVacations = this.getAllVacationsFromLocalStorage(); // Retrieve current vacations
            currentVacations.push(vacation); // Add the new vacation
            localStorage.setItem('vacations', JSON.stringify(currentVacations)); // Save updated vacations to local storage

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

            // Update local storage
            const currentVacations = this.getAllVacationsFromLocalStorage();
            const updatedVacations = currentVacations.map(v => v.id === vacation.id ? vacation : v);
            localStorage.setItem('vacations', JSON.stringify(updatedVacations)); // Save updated vacations to local storage

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

            // Update local storage
            const currentVacations = this.getAllVacationsFromLocalStorage();
            const updatedVacations = currentVacations.filter(v => v.id !== id); // Remove the deleted vacation
            localStorage.setItem('vacations', JSON.stringify(updatedVacations)); // Save updated vacations to local storage

        } catch (error) {
            console.error("Error deleting vacation:", error);
            throw error;
        }
    }

}

export const vacationsService = new VacationsService();

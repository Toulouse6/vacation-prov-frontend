import VacationModel from "../Models/VacationModel";
import { appStore } from "../Redux/Store";
import { vacationActionCreators } from "../Redux/VacationSlice";
import { likesService } from "./LikesService";
import vacations from "../vacations";

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

    // Save all vacations to local storage:
    private saveVacationsToLocalStorage(vacations: VacationModel[]) {
        localStorage.setItem('vacations', JSON.stringify(vacations));
    }

    // Get all vacations:
    public async getAllVacations(): Promise<VacationModel[]> {
        const localVacations = this.getAllVacationsFromLocalStorage();
        console.log("Local Vacations: ", localVacations); // Log local vacations

        if (localVacations.length > 0) {
            return localVacations;
        }

        // Use the imported static data
        const vacationsData: VacationModel[] = vacations.map((vacation) => ({
            ...vacation,
            startDate: this.parseValidDate(vacation.startDate) || vacation.startDate,
            endDate: this.parseValidDate(vacation.endDate) || vacation.endDate,
        }));

        const action = vacationActionCreators.initAll(vacationsData);
        appStore.dispatch(action);
        this.saveVacationsToLocalStorage(vacationsData); // Save to local storage
        return vacationsData;
    }

    // Get one vacation:
    public async getOneVacation(id: number): Promise<VacationModel | undefined> {
        const vacations = this.getAllVacationsFromLocalStorage();
        const vacation = vacations.find((v) => v.id === id);
        return vacation || undefined; // Return found vacation or undefined
    }

    // Upcoming Vacations:
    public async getUpcomingVacations(): Promise<VacationModel[]> {
        const vacations = await this.getAllVacations();
        return vacations.filter((vacation) => {
            const startDate = new Date(vacation.startDate);
            return startDate > new Date();
        });
    }

    // Active Vacations:
    public async getActiveVacations(): Promise<VacationModel[]> {
        const vacations = await this.getAllVacations();
        const today = new Date();
        return vacations.filter((vacation) => {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
            return startDate <= today && endDate >= today;
        });
    }

    // Favorite Vacations:
    public async getFavoriteVacations(userId: number): Promise<VacationModel[]> {
        try {
            const favoriteVacationIds = await likesService.getFavoriteVacations(userId);
            const vacations = await this.getAllVacations();
            return vacations.filter((vacation) => favoriteVacationIds.includes(vacation.id));
        } catch (error) {
            console.error("Error fetching favorite vacations:", error);
            throw error;
        }
    }

    // Add Vacation:
    public async addVacation(vacation: VacationModel): Promise<void> {
        try {
            // Add vacation to Redux store
            const action = vacationActionCreators.addOne(vacation);
            appStore.dispatch(action);

            // Retrieve current vacations
            const currentVacations = this.getAllVacationsFromLocalStorage();

            // Add the new vacation
            currentVacations.push(vacation);
            this.saveVacationsToLocalStorage(currentVacations);

        } catch (error) {
            console.error("Error adding vacation:", error);

            // Rollback if fails
            appStore.dispatch(vacationActionCreators.deleteOne(vacation.id));
            throw error;
        }
    }

    // Edit Vacation:
    public async editVacation(vacation: VacationModel): Promise<void> {
        try {
            // Update vacation in Redux store
            const action = vacationActionCreators.updateOne(vacation);
            appStore.dispatch(action);

            const currentVacations = this.getAllVacationsFromLocalStorage();

            // Update vacation
            const updatedVacations = currentVacations.map(v => (v.id === vacation.id ? vacation : v));
            this.saveVacationsToLocalStorage(updatedVacations);

        } catch (error) {
            console.error("Error updating vacation:", error);

            // Rollback if fails
            const previousVacation = this.getAllVacationsFromLocalStorage().find(v => v.id === vacation.id);
            if (previousVacation) {
                appStore.dispatch(vacationActionCreators.updateOne(previousVacation));
            }
            throw error;
        }
    }


    // Delete Vacation:
    public async deleteVacation(id: number): Promise<void> {
        try {
            const action = vacationActionCreators.deleteOne(id);
            appStore.dispatch(action);

            const currentVacations = this.getAllVacationsFromLocalStorage();
            const updatedVacations = currentVacations.filter(v => v.id !== id);
            this.saveVacationsToLocalStorage(updatedVacations);
        } catch (error) {
            console.error("Error deleting vacation:", error);
            throw error;
        }
    }
}

export const vacationsService = new VacationsService();

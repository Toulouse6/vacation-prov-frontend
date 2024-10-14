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
    
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            let vacations = await response.json();
            console.log("Fetched Vacations: ", vacations); // Log fetched vacations
    
            vacations = vacations.map((vacation: VacationModel) => ({
                ...vacation,
                startDate: this.parseValidDate(vacation.startDate),
                endDate: this.parseValidDate(vacation.endDate),
            }));
    
            const action = vacationActionCreators.initAll(vacations);
            appStore.dispatch(action);
            this.saveVacationsToLocalStorage(vacations); // Save to local storage
            return vacations;
    
        } catch (error) {
            console.error("Error fetching all vacations:", error);
            throw error;
        }
    }    
    

    // Get one vacation:
    public async getOneVacation(id: number): Promise<VacationModel | undefined> {
        try {
            // First check in local storage
            const vacations = this.getAllVacationsFromLocalStorage();
            const vacation = vacations.find((v) => v.id === id);

            if (vacation) return vacation;

            // If not found, fetch from API
            const response = await fetch(`${process.env.PUBLIC_URL}/data/vacations.json`);
            const allVacations: VacationModel[] = await response.json(); 

            const fetchedVacation = allVacations.find((v: VacationModel) => v.id === id);

            if (fetchedVacation) {
                // Parse dates for internal use
                fetchedVacation.startDate = this.parseValidDate(fetchedVacation.startDate)?.toISOString() || fetchedVacation.startDate;
                fetchedVacation.endDate = this.parseValidDate(fetchedVacation.endDate)?.toISOString() || fetchedVacation.endDate;
            }

            return fetchedVacation;

        } catch (error) {
            console.error("Error fetching one vacation:", error);
            throw error;
        }
    }

    // Upcoming Vacations:
    public async getUpcomingVacations(): Promise<VacationModel[]> {
        const vacations = await this.getAllVacations();
        return vacations.filter((vacation: VacationModel) => {
            const startDate = new Date(vacation.startDate);
            return startDate > new Date();
        });
    }

    // Active Vacations:
    public async getActiveVacations(): Promise<VacationModel[]> {
        const vacations = await this.getAllVacations();
        const today = new Date();
        return vacations.filter((vacation: VacationModel) => {
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

            const currentVacations = this.getAllVacationsFromLocalStorage();
            currentVacations.push(vacation);
            this.saveVacationsToLocalStorage(currentVacations); 

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

            const currentVacations = this.getAllVacationsFromLocalStorage();
            const updatedVacations = currentVacations.map(v => v.id === vacation.id ? vacation : v);
            this.saveVacationsToLocalStorage(updatedVacations);  

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

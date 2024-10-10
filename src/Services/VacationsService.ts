import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { appStore } from "../Redux/Store";
import { appConfig } from "../Utils/AppConfig";
import { vacationActionCreators } from "../Redux/VacationSlice";


class VacationsService {

    // Get all vacations:
    public async getAllVacations(): Promise<VacationModel[]> {
        try {

            // Get vacations from the app store state:
            let vacations = appStore.getState().vacations;

            // Checks for vacations in the appStore state:
            if (vacations.length > 0) return vacations;

            const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
            vacations = response.data;

            // Initialize all vacations in the appStore state:
            const action = vacationActionCreators.initAll(vacations);

            // Dispatch the created action to update the appStore state
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

            // Find specified vacation.id array:
            let vacation = vacations.find((v) => v.id === id);

            if (vacation) return vacation;

            // Fetch specific vacation.id from vacationsUrl endpoint:
            const response = await axios.get<VacationModel>(`${appConfig.vacationsUrl}/${id}`);
            vacation = response.data;
            return vacation;

        } catch (error) {
            console.error("Error fetching one vacation:", error);
            throw error;
        }
    }


    // Upcoming Vacations:
    public async getUpcomingVacations(): Promise<VacationModel[]> {
        try {
            // Fetch upcoming vacations from upcomingUrl endpoint:
            const response = await axios.get<VacationModel[]>(appConfig.upcomingUrl);
            return response.data;

        } catch (error) {
            console.error("Error fetching upcoming vacations:", error);
            throw error;
        }
    }


    // Active Vacations:
    public async getActiveVacations(): Promise<VacationModel[]> {
        try {
            // Fetch active vacations from upcomingUrl endpoint:
            const response = await axios.get<VacationModel[]>(appConfig.activeUrl);
            return response.data;

        } catch (error) {
            console.error("Error fetching active vacations:", error);
            throw error;
        }
    }


    // Get Favorite Vacations:
    public async getFavoriteVacations(userId: number): Promise<VacationModel[]> {

        // Fetch favorite vacations for specific userId from favoritesUrl endpoint:
        const url = `${appConfig.favoritesUrl}/${userId}`;
        const response = await axios.get<VacationModel[]>(url);
        return response.data;
    }


    // Add vacation:
    public async addVacation(vacation: VacationModel): Promise<void> {
        try {
            // POST request to add a new vacation to vacationsUrl containing custom options:
            const response = await axios.post<VacationModel>(
                appConfig.vacationsUrl,
                vacation,
                appConfig.axiosOptions
            );
            const addedVacation = response.data;

            // Uses vacationActionCreators to add a new vacation to appStore state:
            const action = vacationActionCreators.addOne(addedVacation);

            // Update state:
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error adding vacation:", error);
            throw error;
        }
    }


    // Edit vacation:
    public async editVacation(vacation: VacationModel): Promise<void> {
        try {
            // PUT request to edit a vacation by id containing custom options:
            const response = await axios.put<VacationModel>(
                `${appConfig.vacationsUrl}/${vacation.id}`,
                vacation,
                appConfig.axiosOptions
            );
            const updatedVacation = response.data;

            // Uses vacationActionCreators to edit a specific vacation in appStore state:
            const action = vacationActionCreators.updateOne(updatedVacation);
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error updating vacation:", error);
            throw error;
        }
    }


    // Delete vacation:
    public async deleteVacation(id: number): Promise<void> {
        try {
            // DELETE request to remove a specific vacation by id:
            await axios.delete(`${appConfig.vacationsUrl}/${id}`);

            // Edit a specific vacation in appStore state:
            const action = vacationActionCreators.deleteOne(id);
            appStore.dispatch(action);

        } catch (error) {
            console.error("Error deleting vacation:", error);
            throw error;
        }
    }


}

export const vacationsService = new VacationsService();

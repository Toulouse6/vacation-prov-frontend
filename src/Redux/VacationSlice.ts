import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import VacationModel from "../Models/VacationModel";


// Reducer for adding all vacations to the slice: 
function initAll(currentState: VacationModel[], action: PayloadAction<VacationModel[]>): VacationModel[] {
    // action.payload = all vacations fetched from backend:
    const allVacations = action.payload;
    const newState = allVacations;
    return newState;
}


// Reducer for adding one vacations to the slice:  
function addOne(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {

    // action.payload = one vacation fetched from backend:
    const vacationToAdd = action.payload;
    const newState = [...currentState, vacationToAdd];
    return newState;
}


// Reducer for updating one vacations in the slice:  
function updateOne(currentState: VacationModel[], action: PayloadAction<VacationModel>): VacationModel[] {

    const vacationToUpdate = action.payload;
    const newState = [...currentState];

    // Find index of the vacation in the state array matches vacation.id:
    const index = newState.findIndex(v => v.id === vacationToUpdate.id);

    // If vacation was found, update vacation state using splice:
    if (index >= 0) {
        newState.splice(index, 1, vacationToUpdate); 
    }
    return newState;
}


// Reducer for deleting one vacation from the slice:  
function deleteOne(currentState: VacationModel[], action: PayloadAction<number>): VacationModel[] {
    const idToDelete = action.payload;
    console.log('Current state before deletion:', currentState); // Log before
    const newState = [...currentState];

    const index = newState.findIndex(v => v.id === idToDelete);

    if (index >= 0) newState.splice(index, 1);
    return newState;
}


// Create the vacations slice - containing & managing the vacations array: 
const vacationsSlice = createSlice({
    name: "vacations", // Unique name
    initialState: [],
    reducers: { initAll, addOne, updateOne, deleteOne }
}


);

export const vacationActionCreators = vacationsSlice.actions;
export const vacationReducersContainer = vacationsSlice.reducer;

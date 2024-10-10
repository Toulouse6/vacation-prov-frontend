import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LikesModel from "../Models/LikesModel";


const initialState: LikesModel[] = [];

const likesSlice = createSlice({

    name: 'likes',  // Unique name
    initialState,
    reducers: {

        // Reducer for adding one like to slice:
        addOne: (state, action: PayloadAction<LikesModel>) => {

            // action.payload = single like to add:
            const likeToAdd = action.payload;

            // Check if like is already exists to prevent duplicates for same user:
            const exists = state.some(like => like.userId === likeToAdd.userId
                && like.vacationId === likeToAdd.vacationId);

            if (!exists) {
                // Push like to slice:
                state.push(likeToAdd);
            }
        },

        // Reducer for removing one like from slice:
        deleteOne: (state, action: PayloadAction<LikesModel>) => {

            // action.payload = both userId & vacationId:
            const { userId, vacationId } = action.payload;

            // Find index of the like in the state array matches both userId & vacationId:
            const index = state.findIndex(like => like.vacationId === vacationId
                && like.userId === userId);

            // If Like was found, remove like from state using splice:
            if (index >= 0) {
                state.splice(index, 1);
            }
        }
    }
}


);

export const likeActionCreators = likesSlice.actions;
export const likeReducer = likesSlice.reducer;

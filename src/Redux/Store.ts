import { configureStore } from "@reduxjs/toolkit";
import { authReducersContainer } from "./AuthSlice";
import { vacationReducersContainer } from "./VacationSlice";
import { likeReducer } from "./LikeSlice";

export const appStore = configureStore({

   // Each managing different aspects of the application's state:
    reducer: {
        vacations: vacationReducersContainer,
        likes: likeReducer,
        user: authReducersContainer
    }

});


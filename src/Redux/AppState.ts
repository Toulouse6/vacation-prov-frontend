import LikesModel from "../Models/LikesModel";
import UserModel from "../Models/UserModel";
import VacationModel from "../Models/VacationModel";

// Application global state: 
export type AppState = {

    vacations: VacationModel[];
    likes: LikesModel[];

    // Second slice data - user sate:
    user: UserModel;

};

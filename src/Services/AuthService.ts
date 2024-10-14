import UserModel from "../Models/UserModel";
import CredentialsModel from "../Models/CredentialsModel";
import { appStore } from "../Redux/Store";
import { authActionCreators } from "../Redux/AuthSlice";

class AuthService {
 
    public constructor() {
        // Get token from session storage:
        const token = sessionStorage.getItem("token");

        if (token) {
            // Simulate extracting the user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem("user") as string) as UserModel;

            // Update global state:
            appStore.dispatch(authActionCreators.login(loggedInUser));
        }
    }

    // Simulate registering a new user:
    public async register(newUser: UserModel): Promise<void> {
    
        const users = [
            { id: 1, firstName: "Ollie", lastName: "Davenport", email: "meetollie@gmail.com", password: "1234", roleId: 1, isAuthenticated: true, token: "dummy-token" },
            { id: 1, firstName: "Tal", lastName: "Argaman", email: "tal.argamanbib@gmail.com", password: "argaman", roleId: 2, isAuthenticated: true, token: "dummy-token" },
            { id: 2, firstName: "Itay", lastName: "Aharoni", email: "itay.aharoni@gmail.com", password: "aharoni", roleId: 2, isAuthenticated: true, token: "dummy-token" }
        ];

        // Check if the user already exists:
        const existingUser = users.find((user) => user.email === newUser.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        // Simulate adding new user 
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));  

        // Simulate token generation and save to session storage
        const token = "dummy-token";
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(newUser));

        // Update global state:
        appStore.dispatch(authActionCreators.register(newUser));
    }

    // Simulate logging in an existing user:
    public async login(credentials: CredentialsModel): Promise<void> {
        // Mock users data (for testing purposes):
        const users: UserModel[] = [
            { id: 1, firstName: "Ollie", lastName: "Davenport", email: "meetollie@gmail.com", password: "1234", roleId: 1, isAuthenticated: true, token: "dummy-token" },
            { id: 1, firstName: "Tal", lastName: "Argaman", email: "tal.argamanbib@gmail.com", password: "argaman", roleId: 2, isAuthenticated: true, token: "dummy-token" },
            { id: 2, firstName: "Itay", lastName: "Aharoni", email: "itay.aharoni@gmail.com", password: "aharoni", roleId: 2, isAuthenticated: true, token: "dummy-token" }
        ];

        // Find the user by email and password
        const user = users.find(
            (u: UserModel) => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Simulate token generation and store in session storage
        const token = user.token;  
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        // Update global state:
        appStore.dispatch(authActionCreators.login(user as UserModel)); 
    }


    // Logout:
    public logout(): void {
        appStore.dispatch(authActionCreators.logout());
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }
}

export const authService = new AuthService();

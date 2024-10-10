import axios from "axios";

class Interceptors {

    public listen(): void {

        // Create interceptor for request:
        axios.interceptors.request.use(request => {

            // Add token to Authorization header: 
            // Add space after "Bearer " (!)
            request.headers.Authorization = "Bearer " + sessionStorage.getItem("token");
            return request;
        });
    }

}

export const interceptors = new Interceptors();

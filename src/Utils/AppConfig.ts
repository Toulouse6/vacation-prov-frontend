class AppConfig {

    //  Backend URLs:
    public readonly vacationsUrl = "http://localhost:4000/api/vacations";
    public readonly addUrl = "http://localhost:4000/api/vacations";
    public readonly editUrl = "http://localhost:4000/api/vacations/:id";

    public readonly upcomingUrl = "http://localhost:4000/api/vacations/upcoming";
    public readonly activeUrl = "http://localhost:4000/api/vacations/active";
    public readonly favoritesUrl = "http://localhost:4000/api/vacations/favorites";
    public readonly likesUrl = "http://localhost:4000/api/likes";
    public readonly likesCountUrl = "http://localhost:4000/api/likes/count";

    public readonly registerUrl = "http://localhost:4000/api/register";
    public readonly loginUrl = "http://localhost:4000/api/login";


    // Axios options:
    public readonly axiosOptions = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };

}

export const appConfig = new AppConfig();

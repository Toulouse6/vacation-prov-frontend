import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import { appStore } from "../../../Redux/Store";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "./Login.css";
import useTitle from "../../../Utils/UseTitle";

function Login(): JSX.Element {

    // useForm hook with type CredentialsModel to extract register, handleSubmit & err:
    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();

    const navigate = useNavigate();

    // Hook to page title:
    useTitle("| Login");

    async function send(credentials: CredentialsModel) {
        try {
            // Attempt to log in with provided credentials:
            await authService.login(credentials);

            // Retrieve the user's first name from the global state
            const firstName = appStore.getState().user.firstName;
            notify.success(`Welcome back ${firstName}!`);
            navigate("/vacations");

        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                notify.error("Invalid email or password.");
            } else {
                notify.error("Error logging in.");
            }
        }
    }

    return (
        <div className="Login">

            <h1>Access Your Account with
                <br />Secure Sign-in</h1>

            {/* Form submission to use handleSubmit to invoke 'send' */}
            <form onSubmit={handleSubmit(send)}>

                <label>Email:</label>
                <input className="form-control" type="email" {...register("email", {
                    required: "Insert your email.",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address."
                    }
                })}
                />

                {/* Display errors related to the each field */}
                {errors.email && <p className="error">{String(errors.email.message)}</p>}

                <label>Password:</label>
                <input className="form-control" type="password" {...register("password",
                    { required: "Password is required." })} />

                {errors.password && <p className="error">{String(errors.password.message)}</p>}

                <button className="btn btn-outline-secondary">Login</button>

                <p>Yet to own an account?
                    <br /><Link to='/register'>Register here.</Link></p>
            </form>

        </div>
    );

}

export default Login;

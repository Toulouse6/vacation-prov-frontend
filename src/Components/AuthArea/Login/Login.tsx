import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "./Login.css";
import useTitle from "../../../Utils/UseTitle";

function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();
    const navigate = useNavigate();
    useTitle("| Login");

    async function send(credentials: CredentialsModel) {
        try {

            await authService.login(credentials);

            // Retrieve the logged-in user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem("user") as string);

            if (loggedInUser) {
                notify.success(`Welcome back ${loggedInUser.firstName}!`);
                navigate("/vacations");
            } else {
                throw new Error("User not found in session storage.");
            }

        } catch (err: any) {
            notify.error(err.message || "Error logging in.");
        }
    }

    return (
        <div className="Login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit(send)}>
                <label>Email:</label>
                <input
                    className="form-control"
                    type="email"
                    defaultValue="tal.argamanbib@gmail.com" // Initial email
                    {...register("email", {
                        required: "Insert your email.",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email address."
                        }
                    })}
                />
                {errors.email && <p className="error">{String(errors.email.message)}</p>}

                <label>Password:</label>
                <input
                    className="form-control"
                    type="password"
                    defaultValue="argaman" // Initial password
                    {...register("password", {
                        required: "Password is required."
                    })}
                />
                {errors.password && <p className="error">{String(errors.password.message)}</p>}

                <button className="btn btn-outline-secondary">Login</button>
                <p>Admin Credentials:<br /> meetollie@gmail.com | 1234</p>
            </form>
        </div>

    );
}

export default Login;

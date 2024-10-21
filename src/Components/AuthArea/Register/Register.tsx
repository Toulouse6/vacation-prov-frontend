import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authService } from "../../../Services/AuthService";
import { notify } from "../../../Utils/Notify";
import "./Register.css";
import useTitle from "../../../Utils/UseTitle";
import { vacationsService } from "../../../Services/VacationsService";
import { useDispatch } from "react-redux";
import { vacationActionCreators } from "../../../Redux/VacationSlice";

function Register(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<UserModel>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useTitle("| Register");

    async function send(user: UserModel) {
        try {
            await authService.register(user);
            notify.success(`Welcome ${user.firstName} ${user.lastName}!`);

            // Fetch all vacations after registration
            const vacations = await vacationsService.getAllVacations();

            // Dispatch the fetched vacations to the Redux store
            dispatch(vacationActionCreators.initAll(vacations));

            // Navigate to vacations page
            navigate("/vacations");
        } catch (err: any) {
            notify.error(err.message || "Error during registration.");
        }
    }

    return (
        <div className="Register">
            <h1>Register</h1>
            <form onSubmit={handleSubmit(send)}>
                <label>First name:</label>
                <input className="form-control" type="text" {...register("firstName", {
                    required: "First name is required.",
                    minLength: { value: 2, message: "First name requires a minimum of 2 characters." },
                    maxLength: { value: 50, message: "First name should not exceed 50 characters." }
                })} />
                {errors.firstName && <p className="error">{String(errors.firstName.message)}</p>}

                <label>Last name:</label>
                <input className="form-control" type="text" {...register("lastName", {
                    required: "Last name is required.",
                    minLength: { value: 2, message: "Last name requires a minimum of 2 characters." },
                    maxLength: { value: 50, message: "Last name should not exceed 50 characters." }
                })} />
                {errors.lastName && <p className="error">{String(errors.lastName.message)}</p>}

                <label>Email:</label>
                <input className="form-control" type="email" {...register("email", {
                    required: "Insert your email.",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Invalid email address."
                    }
                })} />
                {errors.email && <p className="error">{String(errors.email.message)}</p>}

                <label>Password:</label>
                <input className="form-control" type="password" {...register("password", {
                    required: "Password is required."
                })} />
                {errors.password && <p className="error">{String(errors.password.message)}</p>}

                <button className="btn btn-outline-secondary">Register</button>
            </form>
        </div>
    );
}

export default Register;

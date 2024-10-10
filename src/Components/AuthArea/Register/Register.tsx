import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authService } from "../../../Services/AuthService";
import "./Register.css";
import { notify } from "../../../Utils/Notify";
import useTitle from "../../../Utils/UseTitle";

function Register(): JSX.Element {

    const { register, handleSubmit, formState: { errors } } = useForm<UserModel>();

    const navigate = useNavigate();

    // Hook to page title:
    useTitle("| Register");

    async function send(user: UserModel) {
        try {
            // Attempt to register the user
            await authService.register(user);
            const fullName = user.firstName + " " + user.lastName;
            notify.success("Welcome " + fullName);
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">

            <h1>Adventure Awaits!
                <br />Start Your Journey</h1>

            {/* Form submission to use handleSubmit to invoke 'send' */}
            <form onSubmit={handleSubmit(send)}>

                <label>First name:</label>
                <input className="form-control" type="text" {...register("firstName",
                    {
                        required: "First name is required.",
                        minLength: { value: 2, message: "First name requires a minimum of 2 characters." },
                        maxLength: { value: 50, message: "First name should not exceed 50 characters." }
                    })} />

                {/* Display errors related to the each field */}
                {errors.firstName && <p className="error">{String(errors.firstName.message)}</p>}

                <label>Last name:</label>
                <input className="form-control" type="text" {...register("lastName",
                    {
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
                })}
                />
                {errors.email && <p className="error">{String(errors.email.message)}</p>}

                <label>Password:</label>
                <input className="form-control" type="password" {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 4, message: "Password requires a minimum of 4 characters." }
                })} />
                {errors.password && <p className="error">{String(errors.password.message)}</p>}

                <button className="btn btn-outline-secondary">Register</button>

            </form>

        </div>
    );

}

export default Register;

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import VacationModel from "../../../Models/VacationModel";
import { vacationsService } from "../../../Services/VacationsService";
import "./AddVacation.css";
import { useState } from "react";
import useTitle from "../../../Utils/UseTitle";

// Generate a unique ID
const generateUniqueId = () => Math.floor(Math.random() * 1000000);

function AddVacation(): JSX.Element {

    // Hook page title:
    useTitle("Vacation Provocation | Add");

    // Setup useForm validation
    const { register, handleSubmit, watch, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState<string | undefined>();

    // Watch startDate
    const startDate = watch("startDate");

    // 'T' to use only date:
    const currentDate = new Date().toISOString().split('T')[0];

    async function send(vacation: VacationModel) {
        try {
            // Assign unique ID
            vacation.id = generateUniqueId(); 

            // Handle the image file
            const imageFile = (vacation.image as unknown as FileList)[0];  
            if (imageFile) {
                vacation.image = imageFile;  
            }

            // Call the service to add a new vacation:
            await vacationsService.addVacation(vacation);
            notify.success("Vacation has been added.");
            navigate("/vacations");
        } catch (err: any) {
            notify.error(`Failed to update vacation: ${err.message}`);
        }
    }

    return (
        <div className="AddVacation">

            <h1>Add Destination</h1>
            <NavLink className="GoBack" to="/vacations">⇠ Go back</NavLink>

            <form onSubmit={handleSubmit(send)}>

                <label htmlFor="destination">Destination:</label>
                <input type="text" id="destination" className="form-control" {...register("destination",
                    {
                        required: "Destination is required.",
                        minLength: { value: 2, message: "Destination requires a minimum of 2 characters." },
                        maxLength: { value: 50, message: "Destination should not exceed 50 characters." }
                    })} />
   
                {errors.destination && <p className="error">{String(errors.destination.message)}</p>}

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" className="form-control" {...register("description",
                    {
                        required: "Description is required.",
                        minLength: { value: 10, message: "Description requires a minimum of 10 characters." },
                        maxLength: { value: 200, message: "Description should not exceed 200 characters." }
                    })} />
                {errors.description && <p className="error">{String(errors.description.message)}</p>}

                <label htmlFor="startDate">Starts On:</label>
                <input type="date" id="startDate" className="form-control" {...register("startDate", {
                    required: "Start date is required.",
                    validate: value => value >= currentDate || "Start date cannot be in the past."
                })} />
                {errors.startDate && <p className="error">{errors.startDate.message}</p>}

                <label htmlFor="endDate">Ends On:</label>
                <input type="date" id="endDate" className="form-control" {...register("endDate", {
                    required: "End date is required.",
                    validate: endDate => endDate >= startDate || "End date must be later than the start date."
                })} />
                {errors.endDate && <p className="error">{errors.endDate.message}</p>}

                <label htmlFor="price">Price:</label>
                <input type="number" id="price" className="form-control" step="0.01" {...register("price",
                    {
                        required: "Price is required.",
                        min: { value: 0, message: "Price must be a positive value." },
                        max: { value: 10000, message: "Price must be under $10,000." }
                    })} />
                {errors.price && <p className="error">{String(errors.price.message)}</p>}

                <label>Image: </label>
                {imageUrl && (
                    <img src={imageUrl} alt="Current Vacation" className="current-image" />
                )}

                <input className="form-control" type="file" accept="image/*" {...register("image", {
                    required: "Image is required.",
                    onChange: (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            setImageUrl(URL.createObjectURL(file)); // Set the image URL for preview
                        }
                    }
                })} />
                {errors.image && <p className="error">{String(errors.image.message)}</p>}

                <button className="btn btn-outline-secondary">Add Vacation</button>

            </form>

        </div>
    );
}

export default AddVacation;

import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import VacationModel from "../../../Models/VacationModel";
import { vacationsService } from "../../../Services/VacationsService";
import "./AddVacation.css";
import { useState, useEffect } from "react";
import useTitle from "../../../Utils/UseTitle";

// Generate a unique ID
const generateUniqueId = () => Math.floor(Math.random() * 1000000);

function AddVacation(): JSX.Element {
    useTitle("Vacation Provocation | Add");
    const { register, handleSubmit, watch, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState<string | undefined>();

    const startDate = watch("startDate");
    const currentDate = new Date().toISOString().split('T')[0];

    // Cleanup blob URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [imageUrl]);

    const checkLocalStorageSpace = () => {
        try {
            localStorage.setItem("__test__", "test");
            localStorage.removeItem("__test__");
            return true;
        } catch (e) {
            return false;
        }
    };

    async function send(vacation: VacationModel) {
        try {
          vacation.id = generateUniqueId();
      
          if (vacation.image instanceof FileList) {
            const imageFile = vacation.image[0];
            if (imageFile) {
              // Generate and save the image URL to localStorage
              const localImageUrl = URL.createObjectURL(imageFile);
              vacation.imageUrl = localImageUrl;
              localStorage.setItem(`vacation_image_${vacation.id}`, localImageUrl); // Save image to localStorage
            }
          }
      
          await vacationsService.addVacation(vacation);
          notify.success("Vacation has been added.");
          navigate("/vacations");
        } catch (err: any) {
          notify.error(`Failed to add vacation: ${err.message}`);
        }
      }

    return (
        <div className="AddVacation">
            <h1>Add Destination</h1>
            <NavLink className="GoBack" to="/vacations">⇠ Go back</NavLink>

            <form onSubmit={handleSubmit(send)}>
                <label htmlFor="destination">Destination:</label>
                <input type="text" id="destination" className="form-control" {...register("destination", {
                    required: "Destination is required.",
                    minLength: { value: 2, message: "Minimum 2 characters required." },
                    maxLength: { value: 50, message: "Maximum 50 characters allowed." }
                })} />
                {errors.destination && <p className="error">{String(errors.destination.message)}</p>}

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" className="form-control" {...register("description", {
                    required: "Description is required.",
                    minLength: { value: 10, message: "Minimum 10 characters required." },
                    maxLength: { value: 200, message: "Maximum 200 characters allowed." }
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
                <input type="number" id="price" className="form-control" step="0.01" {...register("price", {
                    required: "Price is required.",
                    min: { value: 0, message: "Price must be positive." },
                    max: { value: 10000, message: "Max price is $10,000." }
                })} />
                {errors.price && <p className="error">{String(errors.price.message)}</p>}

                <label>Image: </label>
                {imageUrl && <img src={imageUrl} alt="Current Vacation" className="current-image" />}
                <input className="form-control" type="file" accept="image/png, image/jpeg" {...register("image", {
                    required: "Image is required.",
                    validate: {
                        fileType: (value) => {
                            const file = value[0];
                            return file && ["image/png", "image/jpeg"].includes(file.type) || "Only PNG or JPEG files are allowed.";
                        },
                    },
                    onChange: (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const localUrl = URL.createObjectURL(file);
                            setImageUrl(localUrl);
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

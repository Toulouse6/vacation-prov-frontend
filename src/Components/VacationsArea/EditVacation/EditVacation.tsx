import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import "./EditVacation.css";
import { notify } from "../../../Utils/Notify";
import VacationModel from "../../../Models/VacationModel";
import { vacationsService } from "../../../Services/VacationsService";
import dayjs from 'dayjs';
import useTitle from "../../../Utils/UseTitle";

function EditVacation(): JSX.Element {

    // Hook to page title:
    useTitle("Vacation Provocation | Edit");

    // Setup form handling with react-hook-form:
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();


    // State variables for image URL and loading status:
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch vacation details & set form values:
    useEffect(() => {

        if (params.id) {
            // Fetch vacation details from the server:
            vacationsService.getOneVacation(+params.id)
                .then(vacation => {
                    setValue('id', vacation.id);
                    setValue('destination', vacation.destination);
                    setValue('description', vacation.description);
                    setValue('startDate', dayjs(vacation.startDate).format('YYYY-MM-DD'));
                    setValue('endDate', dayjs(vacation.endDate).format('YYYY-MM-DD'));
                    setValue('price', vacation.price);
                    setImageUrl(vacation.imageUrl);
                })
                .catch(err => notify.error(err.message));
        }
    }, [params.id, setValue, setImageUrl]);  // Dependencies for the effect.


    // This keeps track of the 'startDate' field:
    const startDate = watch("startDate");


    const send = async (vacation: VacationModel) => {

        try {
            setLoading(true);

            // Assign first image file to vacation.image:
            vacation.image = (vacation.image as unknown as FileList)[0];
            vacation.id = +params.id;
            await vacationsService.editVacation(vacation);
            notify.success('Vacation has been updated.');
            navigate('/vacations');

        } catch (error: any) {
            notify.error(`Failed to update vacation: ${error.message}`);

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="EditVacation">

            <h1>Edit Destination {params.id}</h1>
            <NavLink className="GoBack" to="/vacations">⇠ Go back</NavLink>

            {/* Form submission to use handleSubmit to invoke 'send' */}
            <form onSubmit={handleSubmit(send)}>

                <label htmlFor="destination">Destination:</label>
                <input type="text" id="destination" className="form-control" {...register("destination",
                    {
                        required: "Destination is required.",
                        minLength: { value: 2, message: "Destination requires a minimum of 2 characters." },
                        maxLength: { value: 50, message: "Destination should not exceed 50 characters." }
                    })} />
                {/* Display errors related to the each field */}
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
                <input type="date" id="startDate" className="form-control" {...register("startDate",
                    { required: "Start date is required." })}
                />

                <label htmlFor="endDate">Ends On:</label>
                <input type="date" id="endDate" className="form-control" {...register("endDate", {
                    required: "End date is required.",

                    validate: endDate => endDate >= startDate || "End date must be later than the start date."
                })}
                />
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
                <input className="form-control" type="file" {...register("image")} />

                <button className="btn btn-outline-secondary" disabled={loading}>
                    {loading ? "Updating..." : "Update Vacation"}
                </button>

            </form>

        </div>
    );

}

export default EditVacation;

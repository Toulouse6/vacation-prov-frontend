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
    useTitle("Vacation Provocation | Edit");
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const startDate = watch("startDate");

    useEffect(() => {
        if (params.id) {
            vacationsService.getOneVacation(+params.id)
                .then((vacation: VacationModel | undefined) => {
                    if (vacation) {
                        setValue('id', vacation.id);
                        setValue('destination', vacation.destination);
                        setValue('description', vacation.description);
                        setValue('startDate', dayjs(vacation.startDate).format('YYYY-MM-DD'));
                        setValue('endDate', dayjs(vacation.endDate).format('YYYY-MM-DD'));
                        setValue('price', vacation.price);
                        setImageUrl(vacation.imageUrl);
                    } else {
                        notify.error("Vacation not found");
                    }
                })
                .catch((err: Error) => notify.error(err.message));
        }
    }, [params.id, setValue]);

    const send = async (vacation: VacationModel) => {
        try {
            setLoading(true);
            const imageFile = (vacation.image as unknown as FileList)[0];
            if (imageFile) {
                vacation.image = imageFile;
                vacation.imageUrl = URL.createObjectURL(imageFile);
            }
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
                <input type="date" id="startDate" className="form-control" {...register("startDate", { required: "Start date is required." })} />

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
                <input className="form-control" type="file" {...register("image")} />

                <button className="btn btn-outline-secondary" disabled={loading}>
                    {loading ? "Updating..." : "Update Vacation"}
                </button>
            </form>
        </div>
    );
}

export default EditVacation;

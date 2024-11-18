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

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert file to Base64

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error); // Reject on error
        });


    // Fetch vacation details & set form values:
    useEffect(() => {
        if (params.id) {
            vacationsService.getOneVacation(+params.id)
                .then((vacation: VacationModel | undefined) => {
                    if (vacation) {
                        console.log("Vacation retrieved:", vacation); // Debug vacation data

                        setValue('id', vacation.id);
                        setValue('destination', vacation.destination);
                        setValue('description', vacation.description);
                        setValue('startDate', dayjs(vacation.startDate).format('YYYY-MM-DD'));
                        setValue('endDate', dayjs(vacation.endDate).format('YYYY-MM-DD'));
                        setValue('price', vacation.price);

                        // Load image from localStorage or existing image URL
                        const savedImageUrl = localStorage.getItem(`vacation_image_${vacation.id}`);
                        setImageUrl(savedImageUrl || vacation.imageUrl);
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

            if (vacation.image instanceof FileList) {
                const imageFile = vacation.image[0];
                if (imageFile) {
                    console.log("Uploaded file:", imageFile); // Debug uploaded file

                    const base64Image = await fileToBase64(imageFile);
                    console.log("Base64 Image:", base64Image); // Debug Base64 image

                    vacation.imageUrl = base64Image;
                    localStorage.setItem(`vacation_image_${vacation.id}`, base64Image); // Save to localStorage
                } else {
                    console.error("No file selected"); // Debug missing file
                }
            } else {
                console.error("Invalid FileList"); // Debug invalid FileList
            }

            console.log("Final Vacation data:", vacation); // Debug final vacation data

            vacation.id = +params.id;
            await vacationsService.editVacation(vacation);
            notify.success('Vacation has been updated.');
            navigate('/vacations');
        } catch (error: any) {
            console.error("Error updating vacation:", error); // Debug errors
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
                <input
                    type="text"
                    id="destination"
                    className="form-control"
                    {...register("destination", {
                        required: "Destination is required.",
                        minLength: { value: 2, message: "Destination requires a minimum of 2 characters." },
                        maxLength: { value: 50, message: "Destination should not exceed 50 characters." },
                    })}
                />

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


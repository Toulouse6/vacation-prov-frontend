import { Notyf } from "notyf";

class Notify {
    // Notyf object from notyf library: 
    private notyf = new Notyf({
        duration: 4000,
        position: { x: "center", y: "top" }
    });

    // Show success message: 
    public success(message: string): void {
        this.notyf.success(message);
    }

    // Show error message: 
    public error(err: any): void {
        const message = this.extractMessage(err);
        this.notyf.error(message);
    }

    // Extract the error message from some error object: 
    private extractMessage(err: any): string {
        if (typeof err === "string") return err;
        if (typeof err.response?.data === "string") return err.response.data; // Axios
        if (typeof err.message === "string") return err.message;
        return "An error occurred. Please try again.";
    }


}

export const notify = new Notify();
import { useState } from "react";
import "./UserData.css";

function UserData(): JSX.Element {

    // useState to hold each user data initialized as "":

    const [data, setData] = useState<string>("");

    function getData(): void {
        const userValue = "" + prompt("Enter your data: ");
        setData(userValue);
    }

    return (
        <div className="UserData">

            {/* trigger getData function on click */}
            <button onClick={getData}>Get Data</button>
            <span>User data: {data}</span>
        </div>
    );
}

export default UserData;

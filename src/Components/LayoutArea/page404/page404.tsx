import "./page404.css";
import useTitle from "../../../Utils/UseTitle";

function Page404(): JSX.Element {

    // Hook to set the page title
    useTitle("Vacation Provocation | Page Not Found");

    return (
        <div className="page404">
            <h1>The page you are looking for
                <br />doesn't exist</h1>

            {/* Use absolute paths for images */}
            <img className="bird404" src="/Assets/Images/bird1.gif" alt="Bird Home" />
            <img className="island" src="/Assets/Images/island-1.png" alt="Not Found" />
        </div>
    );
}

export default Page404;

import "./page404.css";
import NotFoundIsland from "../../../Assets/Images/island-1.png";
import birdGif from "../../../Assets/Images/bird1.gif";
import useTitle from "../../../Utils/UseTitle";

function Page404(): JSX.Element {

    // Hook to page title:
    useTitle("Vacation Provocation | Page Not Found");

    return (
        <div className="page404">
            <h1>The page you are looking for
                <br />doesn't exist</h1>

            <img className="bird404" src={birdGif} alt="bird home" />

            <img className="island" src={NotFoundIsland} alt="Not Found" />

        </div>
    );
}

export default Page404;

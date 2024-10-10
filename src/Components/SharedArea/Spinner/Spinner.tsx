import "./Spinner.css";
import birdGif from "../../../Assets/Images/bird1.gif";

function Spinner(): JSX.Element {

    return (
        <div className="Spinner">

            {/* spinner Gif*/}
            <img src={birdGif} alt="bird spinner" />
        </div>
    );
}

export default Spinner;

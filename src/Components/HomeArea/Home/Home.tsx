import "./Home.css";
import birdGif from "../../../Assets/Images/bird1.gif";
import useTitle from "../../../Utils/UseTitle";

function Home(): JSX.Element {

     // Hook to page title:
     useTitle("Vacation Provocation | Home");
     
    return (

        <div className="Home">

            {/*Home page bird gif*/}
            <img className="birdHome" src={birdGif} alt="bird home" />

            <h1>VACATION PROVOCATION</h1>

            <p><b>Ready to provoke your next adventure?</b>
                <br />
                Unleash the wanderlust within and find your ideal vacation with Vacation Provocation.
                Explore curated destinations, unique experiences, and personalized itineraries.
            </p>

        </div>
    );
}

export default Home;

import Copyrights from "../Copyrights/Copyrights";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";
import videoSource from "../../../Assets/Videos/clouds-footage.mp4";

function Layout(): JSX.Element {

    return (
        <div className="Layout">
            <header>
                <Menu />
            </header>
            <main>
                <Routing />
            </main>
            <footer>
                <Copyrights />
            </footer>

            <div className="VideoBackground">
                <video autoPlay loop muted>
                    <source src={videoSource} type="video/mp4" />
                </video>
            </div>

        </div>
    );
}

export default Layout;

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import { appStore } from './Redux/Store';
import { interceptors } from './Utils/Interceptors';
import './index.css';
import reportWebVitals from './reportWebVitals';

interceptors.listen();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    // HashRouter to handle GitHub Pages routing:
    <HashRouter>
        <Provider store={appStore}>
            <Layout />
        </Provider>
    </HashRouter>
);

reportWebVitals();

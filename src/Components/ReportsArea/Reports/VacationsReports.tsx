import { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { likesService } from '../../../Services/LikesService';
import './VacationsReports.css';
import { NavLink } from 'react-router-dom';
import useTitle from '../../../Utils/UseTitle';

// Import CanvasJSChart from CanvasJSReact for rendering charts
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Define a type for the data points
interface DataPoint {
    label: string;
    y: number;
}

const VacationsReports = () => {

    // Hook to page title:
    useTitle("Vacation Provocation | Reports");


    // State to store the data points for the chart
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

    // useEffect to fetch server data:
    useEffect(() => {

        // Map the API data to DataPoint objects
        likesService.getVacationsWithLikes()
            .then(data => {
                console.log("API Response:", data);
                const points = data.map((item) => ({
                    label: item.destination,
                    y: item.likesCount
                }));

                // Update the state with the processed data points                console.log("Processed DataPoints:", points);
                setDataPoints(points);
            })
            .catch(error => {
                console.error('Error fetching vacations with likes:', error);
            });
    }, []); // [] means the effect runs only once


    // Chart options & css
    const options = {

        animationEnabled: true,
        theme: "light",
        axisY: {
            title: "Likes Count",
            exportEnabled: true,
            labelFontSize: 12,
            labelFontColor: "rgb(59, 59, 59)"
        },
        axisX: {
            title: "Destinations",
            scaleBreaks: {
                autoCalculate: true,
                lineColor: "white"
            },
            labelFontSize: 12,
            labelFontColor: "rgb(59, 59, 59)",
            labelWrap: true,
            labelInterval: 1
        },
        data: [{
            type: "column",
            color: "rgb(121, 144, 155)",
            dataPoints: dataPoints.filter(item => item.y > 0)
        }]
    };


    // Convert data to CSV
    const convertToCSV = (data: DataPoint[]): string => {
        const csvRows = ["Destination,Likes"];
        data.forEach((item: DataPoint) => {
            csvRows.push(`${item.label},${item.y}`);
        });
        return csvRows.join("\n");
    };

    // Function to trigger download
    const downloadCSV = () => {

        const csvData = convertToCSV(dataPoints);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'vacations-report.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="VacationsReports">

            <h1>Engagement Report</h1>
            <NavLink className="GoBack" to="/vacations">⇠ Go back</NavLink>

            <div className="likesChart">
                <CanvasJSChart options={options} />
            </div>

            <br />
            <button onClick={downloadCSV} className="btn btn-outline-secondary">Download CSV</button>

        </div>
    );
};

export default VacationsReports;
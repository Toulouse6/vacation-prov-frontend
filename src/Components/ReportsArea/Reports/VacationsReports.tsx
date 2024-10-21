import { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { likesService } from '../../../Services/LikesService';
import './VacationsReports.css';
import { NavLink } from 'react-router-dom';
import useTitle from '../../../Utils/UseTitle';

// CanvasJSReact charts:
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Data points
interface DataPoint {
    label: string;
    y: number;
}

const VacationsReports = () => {

    // Hook page title:
    useTitle("Vacation Provocation | Reports");

    // State to store the data points for the chart
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

    // Fetch server data:
    useEffect(() => {
        likesService.getVacationsWithLikes()
            .then((data: { destination: string; likesCount: number }[]) => {
                console.log("API Response:", data);
                const points = data.map((item) => ({
                    label: item.destination,
                    y: item.likesCount
                }));

                console.log("Mapped Data Points:", points);  
                setDataPoints(points);
            })
            .catch((error: Error) => {
                console.error('Error fetching vacations with likes:', error);
            });
    }, []);

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

    // Download CSV
    const downloadCSV = () => {
        const csvData = convertToCSV(dataPoints);
        if (!csvData) {
            console.error("CSV data is empty");
            return;
        }

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        console.log("Blob URL:", url);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'vacations-report.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);
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

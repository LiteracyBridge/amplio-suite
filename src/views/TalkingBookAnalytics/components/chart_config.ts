import type { ChartConfiguration, ChartConfigurationCustomTypesPerDataset } from "chart.js";

/**
 * Structure of the stats response received from the backend.
 * Note that the field varies based on the request type.
 */
export interface DataItem {
    tbs: number;
    TB: string;
    Agent: string;
    "Deployment #": string;
    Region: string;
    District: string;
    Community: string;
    Message: string;
    Language: string;
    Format: string;
    Variant: string;
    Playlist: string;
    Position: string;
    Duration: number;
    "Total Starts": string;
    "Total 1/4 Plays": string;
    "Total 1/2 Plays": string;
    "Total 3/4 Plays": string;
    "Total Completions": number;
    "Total Seconds Played": number;
    "Total Plays": string;
}

export const baseChartConfig = {
    indexAxis: "y",
    elements: {
        bar: {
            borderWidth: 2,
            categoryPercentage: 1.0,
        },
    },
    responsive: true,
    scrollbar: { enabled: true },
    maintainAspectRatio: true,
    scales: {
        y: {
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
    },
    plugins: {
        legend: {
            position: "bottom",
            display: true,
        },
        title: {
            display: true,
            text: "Message Completions per TB",
        },
        datalabels: {
            display: true,
            anchor: "end", // Position of the labels (start, end, center, etc.)
            align: "end", // Alignment of the labels (start, end, center, etc.)
            // color: 'blue', // Color of the labels
            font: {
                weight: "bold",
            },
            formatter: (value: any, _context: any) => {
                return value;
            },
        },
    },
}

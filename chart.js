const DATA_COUNT = 6;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
    labels.push(i.toString());
}
let wpmData = [0, 20, 20, 60, 60, 80];
let rawData = [50, 10, 16, 70, 50, 20];

const [PRIMARY_COLOR, SECONDARY_COLOR, DANGER_COLOR] = ['#e6db74', '#a6e22e', '#f92672'];
const data = {
    labels: labels,
    datasets: [
        {
            label: 'WPM',
            data: wpmData,
            borderColor: SECONDARY_COLOR,
            pointBackgroundColor: SECONDARY_COLOR,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            yAxisID: 'y',
        },
        {
            label: 'Raw',
            data: rawData,
            borderColor: PRIMARY_COLOR,
            pointBackgroundColor: PRIMARY_COLOR,
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            yAxisID: 'y',
        },
        {
            label: 'Errors',
            data: [5, 1, 1, 7, 5, 2],
            borderColor: DANGER_COLOR,
            pointBackgroundColor: DANGER_COLOR,
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            showLine: false,
            pointStyle: 'crossRot',
            yAxisID: 'y1',
            pointRadius: 5,
            pointBorderWidth: 2,
        },
    ]
};


const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                ticks: {
                    color: PRIMARY_COLOR,
                    font: {
                        weight: 'bold',
                    },
                },
                grid: {
                    color: '#1d1d18',
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Words per minute',
                    color: PRIMARY_COLOR,
                    font: {
                        weight: 'bold',
                    }
                },
                suggestedMin: 0,
                ticks: {
                    color: PRIMARY_COLOR,
                    font: {
                        weight: 'bold',
                    }
                },
                grid: {
                    color: '#1d1d18',
                },
            },
            y1: {
                type: 'linear',
                position: 'right',
                display: true,
                title: {
                    display: true,
                    text: 'Errors',
                    color: PRIMARY_COLOR,
                    font: {
                        weight: 'bold',
                    }
                },
                suggestedMin: 0,
                ticks: {
                    stepSize: 1,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: PRIMARY_COLOR,
                    font: {
                        weight: 'bold',
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
            }
        }
    }
};


// Get the 2D context of the canvas and create the chart
const ctx = document.getElementById('myChart').getContext('2d');

new Chart(ctx, config);



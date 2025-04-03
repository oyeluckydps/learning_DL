/**
 * charts.js - Neural Network Output Charts
 *
 * This script manages the charts that visualize the neural network outputs
 * at various stages (pre and post activation for each layer).
 *
 * We use Chart.js to create interactive and responsive charts.
 */

// Store chart objects globally so we can update them
let outputChart = null;
let hidden1PreChart = null;
let hidden1PostChart = null;
let hidden2PreChart = null;
let hidden2PostChart = null;

// Chart.js configuration for consistent styling
const chartColors = {
    node0: 'rgba(255, 99, 132, 0.7)',
    node1: 'rgba(54, 162, 235, 0.7)',
    node2: 'rgba(255, 206, 86, 0.7)',
    output: 'rgba(75, 192, 192, 0.7)',
    gridLines: 'rgba(200, 200, 200, 0.3)',
    axisLabels: '#666'
};

// Common chart configuration options
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 300
    },
    interaction: {
        mode: 'nearest',
        intersect: false
    },
    plugins: {
        legend: {
            position: 'top',
            labels: {
                boxWidth: 12,
                padding: 10
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 10,
            cornerRadius: 3
        }
    },
    scales: {
        x: {
            grid: {
                color: chartColors.gridLines
            },
            title: {
                display: true,
                text: 'Input Value (x)',
                color: chartColors.axisLabels
            },
            ticks: {
                callback: function(value) {
                    return parseFloat(value).toFixed(2); // Format x-axis ticks to 2 decimal places
                }
            }
        },
        y: {
            grid: {
                color: chartColors.gridLines
            },
            title: {
                display: true,
                text: 'Output Value',
                color: chartColors.axisLabels
            },
            ticks: {
                callback: function(value) {
                    return parseFloat(value).toFixed(2); // Format y-axis ticks to 2 decimal places
                }
            }
        }
    }
};

/**
 * Initializes all charts without data
 */
function initializeCharts() {
    // Final Output Chart
    const outputCtx = document.getElementById('output-chart').getContext('2d');
    outputChart = new Chart(outputCtx, {
        type: 'line',
        data: {
            labels: [], // Will be set when data is available
            datasets: [{
                label: 'Network Output',
                data: [], // Will be set when data is available
                backgroundColor: chartColors.output,
                borderColor: chartColors.output,
                borderWidth: 3, // Increased line thickness
                pointRadius: 0,
                tension: 0.3
            }]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    display: true,
                    text: 'Neural Network Output (y)'
                }
            }
        }
    });

    // Hidden Layer 1 (Pre-Activation) Chart
    const hidden1PreCtx = document.getElementById('hidden1-pre-chart').getContext('2d');
    hidden1PreChart = new Chart(hidden1PreCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Node 1',
                    data: [],
                    backgroundColor: chartColors.node0,
                    borderColor: chartColors.node0,
                    borderWidth: 3, // Increased line thickness
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 2',
                    data: [],
                    backgroundColor: chartColors.node1,
                    borderColor: chartColors.node1,
                    borderWidth: 3, // Increased line thickness
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 3',
                    data: [],
                    backgroundColor: chartColors.node2,
                    borderColor: chartColors.node2,
                    borderWidth: 3, // Increased line thickness
                    pointRadius: 0,
                    tension: 0.3
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    display: true,
                    text: 'Hidden Layer 1 (Before ReLU)'
                }
            }
        }
    });

    // Hidden Layer 1 (Post-Activation) Chart
    const hidden1PostCtx = document.getElementById('hidden1-post-chart').getContext('2d');
    hidden1PostChart = new Chart(hidden1PostCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Node 1',
                    data: [],
                    backgroundColor: chartColors.node0,
                    borderColor: chartColors.node0,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 2',
                    data: [],
                    backgroundColor: chartColors.node1,
                    borderColor: chartColors.node1,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 3',
                    data: [],
                    backgroundColor: chartColors.node2,
                    borderColor: chartColors.node2,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    display: true,
                    text: 'Hidden Layer 1 (After ReLU Activation)'
                }
            }
        }
    });

    // Hidden Layer 2 (Pre-Activation) Chart
    const hidden2PreCtx = document.getElementById('hidden2-pre-chart').getContext('2d');
    hidden2PreChart = new Chart(hidden2PreCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Node 1',
                    data: [],
                    backgroundColor: chartColors.node0,
                    borderColor: chartColors.node0,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 2',
                    data: [],
                    backgroundColor: chartColors.node1,
                    borderColor: chartColors.node1,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 3',
                    data: [],
                    backgroundColor: chartColors.node2,
                    borderColor: chartColors.node2,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    display: true,
                    text: 'Hidden Layer 2 (Before ReLU)'
                }
            }
        }
    });

    // Hidden Layer 2 (Post-Activation) Chart
    const hidden2PostCtx = document.getElementById('hidden2-post-chart').getContext('2d');
    hidden2PostChart = new Chart(hidden2PostCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Node 1',
                    data: [],
                    backgroundColor: chartColors.node0,
                    borderColor: chartColors.node0,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 2',
                    data: [],
                    backgroundColor: chartColors.node1,
                    borderColor: chartColors.node1,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                },
                {
                    label: 'Node 3',
                    data: [],
                    backgroundColor: chartColors.node2,
                    borderColor: chartColors.node2,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    display: true,
                    text: 'Hidden Layer 2 (After ReLU Activation)'
                }
            }
        }
    });

    console.log('Charts initialized');
}

/**
 * Updates all charts with new network computation results
 *
 * @param {Object} results - The network computation results from the server
 */
function updateCharts(results) {
    if (!results) {
        console.error('No results data available');
        return;
    }

    const xValues = results.x_values;

    // Update output chart
    outputChart.data.labels = xValues;
    // Format output values to 2 decimal places as requested
    outputChart.data.datasets[0].data = results.outputs.map(val => parseFloat(val.toFixed(2)));
    outputChart.update();

    // Update hidden layer 1 (pre-activation) chart
    hidden1PreChart.data.labels = xValues;
    for (let i = 0; i < 3; i++) {
        // Format values to 2 decimal places
        hidden1PreChart.data.datasets[i].data = xValues.map((_, idx) =>
            parseFloat(results.hidden1_pre[idx][i].toFixed(2)));
    }
    hidden1PreChart.update();

    // Update hidden layer 1 (post-activation) chart
    hidden1PostChart.data.labels = xValues;
    for (let i = 0; i < 3; i++) {
        // Format values to 2 decimal places
        hidden1PostChart.data.datasets[i].data = xValues.map((_, idx) =>
            parseFloat(results.hidden1_post[idx][i].toFixed(2)));
    }
    hidden1PostChart.update();

    // Update hidden layer 2 (pre-activation) chart
    hidden2PreChart.data.labels = xValues;
    for (let i = 0; i < 3; i++) {
        // Format values to 2 decimal places
        hidden2PreChart.data.datasets[i].data = xValues.map((_, idx) =>
            parseFloat(results.hidden2_pre[idx][i].toFixed(2)));
    }
    hidden2PreChart.update();

    // Update hidden layer 2 (post-activation) chart
    hidden2PostChart.data.labels = xValues;
    for (let i = 0; i < 3; i++) {
        // Format values to 2 decimal places
        hidden2PostChart.data.datasets[i].data = xValues.map((_, idx) =>
            parseFloat(results.hidden2_post[idx][i].toFixed(2)));
    }
    hidden2PostChart.update();

    console.log('Charts updated with new data');
}
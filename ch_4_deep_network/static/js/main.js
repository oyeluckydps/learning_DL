/**
 * main.js - The entry point for the Neural Network Explorer
 *
 * This script initializes the application and coordinates between the different
 * components (network visualization, controls, and charts).
 */

// Global state to store the current weights and biases
let currentWeights = JSON.parse(JSON.stringify(initialWeights));
let currentBiases = JSON.parse(JSON.stringify(initialBiases));

// Global state to store network computation results
let networkResults = null;

// Global state to store the current input value
let currentInputValue = 1.0;

// Wait for the DOM to be loaded before initializing the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Neural Network Explorer Initializing...');

    // Initialize the neural network visualization
    initializeNetworkVisualization();

    // Initialize the control sliders
    initializeControls();

    // Initialize the output charts (without data initially)
    initializeCharts();

    // Initialize input slider
    initializeInputSlider();

    // Compute initial network output and update visualizations
    computeAndUpdateVisualizations();

    console.log('Neural Network Explorer Initialized');
});

/**
 * Computes the network output with current weights and biases
 * and updates all visualizations.
 */
function computeAndUpdateVisualizations() {
    // Show loading indicators if needed
    // ...

    // Get current weights and biases
    const data = {
        weights: currentWeights,
        biases: currentBiases
    };

    // Send data to server to compute network outputs using ReLU activation
    fetch('/compute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(results => {
        // Store the results globally
        networkResults = results;

        // Update the network visualization based on current weights
        updateNetworkVisualization(currentWeights, currentBiases);

        // Update all charts with new data
        updateCharts(results);

        // Update output display
        updateOutputDisplay();

        console.log('Network computation and visualization updated');
    })
    .catch(error => {
        console.error('Error computing network results:', error);
    });
}

/**
 * Updates the weights and biases when a slider value changes.
 * Called by the control sliders when their values change.
 */
function updateNetworkParameters(paramType, layerIndex, nodeIndex, connectionIndex, value) {
    if (paramType === 'weight') {
        // Update the weight in our global state
        currentWeights[`w${layerIndex}`][nodeIndex][connectionIndex] = parseFloat(value);
    } else if (paramType === 'bias') {
        // Update the bias in our global state
        currentBiases[`b${layerIndex}`][nodeIndex] = parseFloat(value);
    }

    // Compute new network output and update visualizations
    computeAndUpdateVisualizations();
}

/**
 * Resets all weights and biases to their initial values
 */
function resetNetwork() {
    // Copy initial values to current state
    currentWeights = JSON.parse(JSON.stringify(initialWeights));
    currentBiases = JSON.parse(JSON.stringify(initialBiases));

    // Update all sliders to reflect reset values
    updateControlsDisplay();

    // Compute new output and update visualizations
    computeAndUpdateVisualizations();

    console.log('Network reset to initial values');
}

/**
 * Initializes the input value slider
 */
function initializeInputSlider() {
    const inputSlider = document.getElementById('input-value-slider');
    const inputDisplay = document.getElementById('input-value-display');

    // Set initial value
    inputSlider.value = currentInputValue;
    inputDisplay.textContent = currentInputValue.toFixed(2);

    // Add event listener for changes
    inputSlider.addEventListener('input', function() {
        currentInputValue = parseFloat(this.value);
        inputDisplay.textContent = currentInputValue.toFixed(2);

        // Update output display based on current input
        updateOutputDisplay();
    });
}

/**
 * Updates the output display based on current input value
 */
function updateOutputDisplay() {
    // If we have network results, find the closest input value and display corresponding output
    if (networkResults) {
        const xValues = networkResults.x_values;
        const outputs = networkResults.outputs;

        // Find closest x value to current input
        let closestIndex = 0;
        let minDiff = Math.abs(xValues[0] - currentInputValue);

        for (let i = 1; i < xValues.length; i++) {
            const diff = Math.abs(xValues[i] - currentInputValue);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }

        // Update output display
        const outputDisplay = document.getElementById('output-value-display');
        outputDisplay.textContent = outputs[closestIndex].toFixed(2);
    }
}

/**
 * Randomizes all weights and biases
 */
function randomizeNetwork() {
    // Randomize weights
    for (let layer = 1; layer <= 3; layer++) {
        const wKey = `w${layer}`;
        for (let i = 0; i < currentWeights[wKey].length; i++) {
            if (Array.isArray(currentWeights[wKey][i])) {
                for (let j = 0; j < currentWeights[wKey][i].length; j++) {
                    currentWeights[wKey][i][j] = (Math.random() * 4 - 2); // Random between -2 and 2
                }
            } else {
                currentWeights[wKey][i] = (Math.random() * 4 - 2);
            }
        }
    }

    // Randomize biases
    for (let layer = 1; layer <= 3; layer++) {
        const bKey = `b${layer}`;
        for (let i = 0; i < currentBiases[bKey].length; i++) {
            currentBiases[bKey][i] = (Math.random() * 4 - 2); // Random between -2 and 2
        }
    }

    // Update all sliders to reflect new values
    updateControlsDisplay();

    // Compute new output and update visualizations
    computeAndUpdateVisualizations();

    console.log('Network randomized with new values');
}
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

// Wait for the DOM to be loaded before initializing the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Neural Network Explorer Initializing...');

    // Initialize the neural network visualization
    initializeNetworkVisualization();

    // Initialize the control sliders
    initializeControls();

    // Initialize the output charts (without data initially)
    initializeCharts();

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

    // Send data to server to compute network outputs
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
/**
 * controls.js - Neural Network Controls
 *
 * This script manages the interactive sliders for adjusting weights and biases
 * of the neural network. It creates sliders dynamically based on the network
 * structure and handles updates when slider values change.
 */

/**
 * Initialize all control sliders for weights and biases
 */
function initializeControls() {
    // Create weight sliders
    createWeightSliders();

    // Create bias sliders
    createBiasSliders();

    // Add reset and randomize buttons
    addControlButtons();

    console.log('Controls initialized');
}

/**
 * Create all weight sliders for the network
 */
function createWeightSliders() {
    // Layer 1 weights (Input -> Hidden Layer 1)
    const w1Container = document.getElementById('w1-sliders');
    for (let j = 0; j < currentWeights.w1[0].length; j++) {
        createSlider(
            w1Container,
            `w1_0_${j}`,
            `Input → H1.${j+1}`,
            currentWeights.w1[0][j],
            -5, 5, 0.1,
            (value) => updateNetworkParameters('weight', 1, 0, j, value)
        );
    }

    // Layer 2 weights (Hidden Layer 1 -> Hidden Layer 2)
    const w2Container = document.getElementById('w2-sliders');
    for (let i = 0; i < currentWeights.w2.length; i++) {
        for (let j = 0; j < currentWeights.w2[i].length; j++) {
            createSlider(
                w2Container,
                `w2_${i}_${j}`,
                `H1.${i+1} → H2.${j+1}`,
                currentWeights.w2[i][j],
                -5, 5, 0.1,
                (value) => updateNetworkParameters('weight', 2, i, j, value)
            );
        }
    }

    // Layer 3 weights (Hidden Layer 2 -> Output)
    const w3Container = document.getElementById('w3-sliders');
    for (let i = 0; i < currentWeights.w3.length; i++) {
        createSlider(
            w3Container,
            `w3_${i}_0`,
            `H2.${i+1} → Output`,
            currentWeights.w3[i][0],
            -5, 5, 0.1,
            (value) => updateNetworkParameters('weight', 3, i, 0, value)
        );
    }
}

/**
 * Create all bias sliders for the network
 */
function createBiasSliders() {
    // Layer 1 biases (Hidden Layer 1)
    const b1Container = document.getElementById('b1-sliders');
    for (let i = 0; i < currentBiases.b1.length; i++) {
        createSlider(
            b1Container,
            `b1_${i}`,
            `Hidden 1.${i+1}`,
            currentBiases.b1[i],
            -5, 5, 0.1,
            (value) => updateNetworkParameters('bias', 1, i, null, value)
        );
    }

    // Layer 2 biases (Hidden Layer 2)
    const b2Container = document.getElementById('b2-sliders');
    for (let i = 0; i < currentBiases.b2.length; i++) {
        createSlider(
            b2Container,
            `b2_${i}`,
            `Hidden 2.${i+1}`,
            currentBiases.b2[i],
            -5, 5, 0.1,
            (value) => updateNetworkParameters('bias', 2, i, null, value)
        );
    }

    // Output bias
    const b3Container = document.getElementById('b3-sliders');
    createSlider(
        b3Container,
        'b3_0',
        'Output',
        currentBiases.b3[0],
        -5, 5, 0.1,
        (value) => updateNetworkParameters('bias', 3, 0, null, value)
    );
}

/**
 * Helper function to create a single slider
 *
 * @param {HTMLElement} container - The container to add the slider to
 * @param {string} id - Unique ID for the slider
 * @param {string} label - Label text
 * @param {number} initialValue - Initial value of the slider
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step increment
 * @param {Function} onChangeCallback - Function to call when value changes
 */
function createSlider(container, id, label, initialValue, min, max, step, onChangeCallback) {
    // Create container for this slider
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    // Create label
    const sliderLabel = document.createElement('span');
    sliderLabel.className = 'slider-label';
    sliderLabel.textContent = label;

    // Create slider input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = initialValue;

    // Create value display
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = initialValue.toFixed(2);

    // Add event listener
    slider.addEventListener('input', function() {
        valueDisplay.textContent = parseFloat(this.value).toFixed(2);
        onChangeCallback(this.value);
    });

    // Assemble and add to container
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    container.appendChild(sliderContainer);
}

/**
 * Add reset and randomize buttons to controls
 */
function addControlButtons() {
    // Create button container that spans both columns
    const controlsContainer = document.querySelector('.controls-container');
    const buttonContainer = document.createElement('div');
    buttonContainer.style.gridColumn = '1 / span 2';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '20px';

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'Reset Network';
    resetButton.addEventListener('click', resetNetwork);

    // Create randomize button
    const randomButton = document.createElement('button');
    randomButton.className = 'random-button';
    randomButton.textContent = 'Randomize Weights & Biases';
    randomButton.addEventListener('click', randomizeNetwork);

    // Add buttons to container
    buttonContainer.appendChild(resetButton);
    buttonContainer.appendChild(randomButton);
    controlsContainer.appendChild(buttonContainer);
}

/**
 * Update all control sliders to reflect current weight and bias values
 * Called when resetting or randomizing the network
 */
function updateControlsDisplay() {
    // Update weight sliders
    // Layer 1
    for (let j = 0; j < currentWeights.w1[0].length; j++) {
        const slider = document.getElementById(`w1_0_${j}`);
        const valueDisplay = slider.nextElementSibling;
        slider.value = currentWeights.w1[0][j];
        valueDisplay.textContent = currentWeights.w1[0][j].toFixed(2);
    }

    // Layer 2
    for (let i = 0; i < currentWeights.w2.length; i++) {
        for (let j = 0; j < currentWeights.w2[i].length; j++) {
            const slider = document.getElementById(`w2_${i}_${j}`);
            const valueDisplay = slider.nextElementSibling;
            slider.value = currentWeights.w2[i][j];
            valueDisplay.textContent = currentWeights.w2[i][j].toFixed(2);
        }
    }

    // Layer 3
    for (let i = 0; i < currentWeights.w3.length; i++) {
        const slider = document.getElementById(`w3_${i}_0`);
        const valueDisplay = slider.nextElementSibling;
        slider.value = currentWeights.w3[i][0];
        valueDisplay.textContent = currentWeights.w3[i][0].toFixed(2);
    }

    // Update bias sliders
    // Layer 1
    for (let i = 0; i < currentBiases.b1.length; i++) {
        const slider = document.getElementById(`b1_${i}`);
        const valueDisplay = slider.nextElementSibling;
        slider.value = currentBiases.b1[i];
        valueDisplay.textContent = currentBiases.b1[i].toFixed(2);
    }

    // Layer 2
    for (let i = 0; i < currentBiases.b2.length; i++) {
        const slider = document.getElementById(`b2_${i}`);
        const valueDisplay = slider.nextElementSibling;
        slider.value = currentBiases.b2[i];
        valueDisplay.textContent = currentBiases.b2[i].toFixed(2);
    }

    // Output bias
    const outputBiasSlider = document.getElementById('b3_0');
    const valueDisplay = outputBiasSlider.nextElementSibling;
    outputBiasSlider.value = currentBiases.b3[0];
    valueDisplay.textContent = currentBiases.b3[0].toFixed(2);
}
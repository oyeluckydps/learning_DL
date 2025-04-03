/**
 * network.js - Neural Network Visualization
 *
 * This script handles the visual representation of the neural network structure,
 * including nodes, connections, and the ReLU activation functions.
 *
 * We use D3.js for creating an interactive SVG visualization that updates
 * dynamically when network parameters change.
 */

// SVG dimensions and layout configuration
const networkConfig = {
    width: 800,
    height: 250,
    nodeRadius: 20,
    layerSpacing: 160,
    nodeSpacing: 60,
    margin: {
        top: 30,
        right: 40,
        bottom: 30,
        left: 40
    }
};

// Store SVG element globally
let networkSvg;

/**
 * Initializes the neural network visualization
 */
function initializeNetworkVisualization() {
    const container = document.getElementById('nn-container');

    // Calculate responsive width based on container
    const containerWidth = container.clientWidth;
    networkConfig.width = Math.min(containerWidth, networkConfig.width);

    // Create SVG element
    networkSvg = d3.select('#nn-container')
        .append('svg')
        .attr('width', networkConfig.width)
        .attr('height', networkConfig.height)
        .attr('viewBox', `0 0 ${networkConfig.width} ${networkConfig.height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create initial empty visualization (will be populated by updateNetworkVisualization)
    updateNetworkVisualization(currentWeights, currentBiases);

    // Add tooltip element for weight values
    d3.select('#nn-container')
        .append('div')
        .attr('class', 'weight-tooltip')
        .style('display', 'none');

    console.log('Network visualization initialized');
}

/**
 * Updates the neural network visualization with current weights and biases
 */
function updateNetworkVisualization(weights, biases) {
    // Clear previous visualization
    networkSvg.selectAll('*').remove();

    // Define network structure (number of nodes in each layer)
    const layers = [1, 3, 3, 1]; // Input, Hidden 1, Hidden 2, Output

    // Create an array of nodes with their positions
    const nodes = [];

    // Calculate x positions for each layer
    const layerX = [];
    for (let i = 0; i < layers.length; i++) {
        layerX[i] = networkConfig.margin.left + networkConfig.layerSpacing * i;
    }

    // Add layer labels
    const layerLabels = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];

    // Draw layer labels
    networkSvg.selectAll('.layer-label')
        .data(layerLabels)
        .enter()
        .append('text')
        .attr('class', 'layer-label')
        .attr('x', (d, i) => layerX[i])
        .attr('y', networkConfig.margin.top - 10)
        .text(d => d);

    // Add ReLU activation labels for hidden layers
    const reluLabels = ['', 'ReLU', 'ReLU', ''];
    networkSvg.selectAll('.relu-label')
        .data(reluLabels.filter(d => d !== ''))
        .enter()
        .append('text')
        .attr('class', 'relu-label')
        .attr('x', (d, i) => layerX[i + 1])
        .attr('y', networkConfig.margin.top + 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#f39c12')
        .text(d => d);

    // Create node objects with positions
    let nodeId = 0;
    for (let layer = 0; layer < layers.length; layer++) {
        const numNodes = layers[layer];
        const layerHeight = (numNodes - 1) * networkConfig.nodeSpacing;
        const startY = (networkConfig.height - layerHeight) / 2;

        for (let node = 0; node < numNodes; node++) {
            nodes.push({
                id: nodeId++,
                x: layerX[layer],
                y: startY + node * networkConfig.nodeSpacing,
                layer,
                index: node,
                nodeClass: layer === 0 ? 'input-node' :
                           layer === layers.length - 1 ? 'output-node' : 'hidden-node'
            });
        }
    }

    // Draw connections between nodes
    const connections = [];
    // Layer 1 connections (Input -> Hidden 1)
    for (let j = 0; j < layers[1]; j++) {
        connections.push({
            source: nodes[0],
            target: nodes[1 + j],
            weight: weights.w1[0][j],
            layerIndex: 1
        });
    }

    // Layer 2 connections (Hidden 1 -> Hidden 2)
    for (let i = 0; i < layers[1]; i++) {
        for (let j = 0; j < layers[2]; j++) {
            connections.push({
                source: nodes[1 + i],
                target: nodes[1 + layers[1] + j],
                weight: weights.w2[i][j],
                layerIndex: 2
            });
        }
    }

    // Layer 3 connections (Hidden 2 -> Output)
    for (let i = 0; i < layers[2]; i++) {
        connections.push({
            source: nodes[1 + layers[1] + i],
            target: nodes[nodes.length - 1],
            weight: weights.w3[i][0],
            layerIndex: 3
        });
    }

    // Draw connections
    networkSvg.selectAll('.connection')
        .data(connections)
        .enter()
        .append('line')
        .attr('class', d => {
            // Determine class based on weight
            let weightClass = d.weight >= 0 ? 'positive-weight' : 'negative-weight';
            // Determine magnitude class (1-5 scale)
            const magnitude = Math.min(5, Math.ceil(Math.abs(d.weight) * 2.5));
            return `connection ${weightClass} weight-magnitude-${magnitude}`;
        })
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .on('mouseover', function(event, d) {
            // Show weight value on hover
            const tooltip = d3.select('.weight-tooltip');
            tooltip.html(`Weight: ${d.weight.toFixed(2)}`) // Changed to 2 decimal places
                .style('display', 'block')
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 30}px`);
        })
        .on('mouseout', function() {
            d3.select('.weight-tooltip').style('display', 'none');
        });

    // Add weight labels on the connections
    networkSvg.selectAll('.weight-label')
        .data(connections)
        .enter()
        .append('text')
        .attr('class', 'weight-label')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 5)
        .text(d => d.weight.toFixed(2))
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', d => d.weight >= 0 ? '#3498db' : '#e74c3c');

    // Removed ReLU activation indicators (arcs) as requested

    // Draw nodes
    networkSvg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', d => `node ${d.nodeClass}`)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', networkConfig.nodeRadius)
        .on('mouseover', function(event, d) {
            // Show node info on hover
            // For input and output, just show the node type
            let tooltipText = "";

            if (d.layer === 0) {
                tooltipText = "Input Node";
                // For input node, we could show the current input value if available
                tooltipText += "<br>Input: x";
            } else if (d.layer === layers.length - 1) {
                tooltipText = "Output Node";
                // Show bias if output node
                tooltipText += `<br>Bias: ${biases.b3[0].toFixed(2)}`;
                // Show output value if available
                tooltipText += "<br>Output: y";
            } else {
                // For hidden nodes, show bias value
                const biasKey = `b${d.layer}`;
                tooltipText = `Hidden Node (${d.layer},${d.index})`;
                tooltipText += `<br>Bias: ${biases[biasKey][d.index].toFixed(2)}`;
            }

            const tooltip = d3.select('.weight-tooltip');
            tooltip.html(tooltipText)
                .style('display', 'block')
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 30}px`);
        })
        .on('mouseout', function() {
            d3.select('.weight-tooltip').style('display', 'none');
        });

    // Add node labels
    networkSvg.selectAll('.node-label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'node-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y + 5) // Center text vertically
        .text(d => {
            // Simple labels (could be more descriptive if needed)
            if (d.layer === 0) return "x";
            if (d.layer === layers.length - 1) return "y";
            return d.index + 1;
        });

    // Add bias labels
    networkSvg.selectAll('.bias-label')
        .data(nodes.filter(d => d.layer > 0)) // Only for hidden and output nodes
        .enter()
        .append('text')
        .attr('class', 'bias-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y + networkConfig.nodeRadius + 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#7f8c8d')
        .text(d => {
            const biasKey = `b${d.layer}`;
            const biasValue = biases[biasKey][d.index];
            return `b: ${biasValue.toFixed(2)}`;
        });

    console.log('Network visualization updated');
}
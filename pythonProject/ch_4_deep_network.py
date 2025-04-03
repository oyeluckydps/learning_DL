import numpy as np
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_url_path='/static')

# Initial network parameters
# Structure: 1 input -> 3 nodes in hidden layer 1 -> 3 nodes in hidden layer 2 -> 1 output
# We'll initialize with random weights and biases
initial_weights = {
    'w1': np.random.uniform(-1, 1, (1, 3)).tolist(),  # Input layer to hidden layer 1
    'w2': np.random.uniform(-1, 1, (3, 3)).tolist(),  # Hidden layer 1 to hidden layer 2
    'w3': np.random.uniform(-1, 1, (3, 1)).tolist()  # Hidden layer 2 to output layer
}

initial_biases = {
    'b1': np.random.uniform(-1, 1, 3).tolist(),  # Biases for hidden layer 1
    'b2': np.random.uniform(-1, 1, 3).tolist(),  # Biases for hidden layer 2
    'b3': np.random.uniform(-1, 1, 1).tolist()  # Bias for output layer
}


# ReLU activation function
def relu(x):
    return np.maximum(0, x)


@app.route('/')
def index():
    """Render the main page of the application"""
    return render_template('index.html',
                           weights=initial_weights,
                           biases=initial_biases)


@app.route('/compute', methods=['POST'])
def compute():
    """Compute the output of the neural network for a range of inputs"""
    # Get weights and biases from the request
    data = request.json
    weights = data.get('weights', initial_weights)
    biases = data.get('biases', initial_biases)

    # Convert to numpy arrays for computation
    w1 = np.array(weights['w1'])
    w2 = np.array(weights['w2'])
    w3 = np.array(weights['w3'])
    b1 = np.array(biases['b1'])
    b2 = np.array(biases['b2'])
    b3 = np.array(biases['b3'])

    # Generate input values for plotting
    x_values = np.linspace(-5, 5, 100).reshape(-1, 1)

    # Forward propagation
    results = {}

    # Calculate all intermediate values and final output
    hidden1_pre = []
    hidden1_post = []
    hidden2_pre = []
    hidden2_post = []
    outputs = []

    for x in x_values:
        # Hidden layer 1 (pre-activation)
        z1 = np.dot(x, w1) + b1
        hidden1_pre.append(z1.tolist())

        # Hidden layer 1 (post-activation)
        a1 = relu(z1)
        hidden1_post.append(a1.tolist())

        # Hidden layer 2 (pre-activation)
        z2 = np.dot(a1, w2) + b2
        hidden2_pre.append(z2.tolist())

        # Hidden layer 2 (post-activation)
        a2 = relu(z2)
        hidden2_post.append(a2.tolist())

        # Output layer
        y = np.dot(a2, w3) + b3
        outputs.append(y[0])

    results = {
        'x_values': x_values.flatten().tolist(),
        'hidden1_pre': hidden1_pre,
        'hidden1_post': hidden1_post,
        'hidden2_pre': hidden2_pre,
        'hidden2_post': hidden2_post,
        'outputs': outputs
    }

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
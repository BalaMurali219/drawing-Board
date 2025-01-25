document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('drawingBoard');
    const ctx = canvas.getContext('2d');
    const brushSizeInput = document.getElementById('brushSize');
    const colorPicker = document.getElementById('colorPicker');
    const clearButton = document.getElementById('clearButton');
    const undoButton = document.getElementById('undoButton');
    const downloadButton = document.getElementById('downloadButton');

    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;

    let drawing = false, brushSize = +brushSizeInput.value, brushColor = colorPicker.value;
    let history = []; // History array to store canvas states

    // Save the current state of the canvas to history
    const saveState = () => {
        history.push(canvas.toDataURL()); // Save current canvas state to history
        if (history.length > 10) history.shift(); // Limit history to 10 states
    };

    // Draw function that updates the canvas as you move the mouse
    const draw = (e) => {
        if (!drawing) return;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };

    // Undo the last action by restoring the most recent canvas state
    const undo = () => {
        if (history.length <= 1) return; // Don't undo the initial empty state
        history.pop(); // Remove the last state
        const img = new Image();
        img.src = history[history.length - 1]; // Get the previous state from history
        img.onload = () => ctx.drawImage(img, 0, 0); // Draw the previous state back onto the canvas
    };

    // Clear the board and reset history
    const clearBoard = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        history = []; // Clear history to reset drawing state
    };

    // Event listeners for drawing on the canvas
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        saveState(); // Save state when drawing starts
    });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => {
        drawing = false;
        saveState(); // Save state after drawing is done
    });
    canvas.addEventListener('mouseout', () => {
        drawing = false;
        saveState(); // Save state if mouse leaves the canvas while drawing
    });

    // Event listeners for controls
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = +e.target.value;
    });
    colorPicker.addEventListener('input', (e) => {
        brushColor = e.target.value;
    });

    // Clear the board and reset history
    clearButton.addEventListener('click', clearBoard);

    // Undo the last drawing action
    undoButton.addEventListener('click', undo);

    // Download Drawing Button Functionality
    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png'; // Set the file name
        link.href = canvas.toDataURL('image/png'); // Convert the canvas to a PNG image
        link.click(); // Trigger the download
    });
});

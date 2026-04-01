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

    let drawing = false;
    let brushSize = +brushSizeInput.value;
    let brushColor = colorPicker.value;

    let history = [];

    // ✅ Save state
    const saveState = () => {
        history.push(canvas.toDataURL());
    };

    // ✅ INITIAL STATE (VERY IMPORTANT)
    saveState();

    const draw = (e) => {
        if (!drawing) return;

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = brushColor;

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };

    // ✅ UNDO FIXED
    const undo = () => {
        if (history.length <= 1) return;

        history.pop();

        const img = new Image();
        img.src = history[history.length - 1];

        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    const clearBoard = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        history = [];
        saveState(); // reset blank state
    };

    // 🎯 EVENTS
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        saveState(); // ✅ save ONLY once
    });

    canvas.addEventListener('mouseout', () => {
        drawing = false;
    });

    brushSizeInput.addEventListener('input', (e) => {
        brushSize = +e.target.value;
    });

    colorPicker.addEventListener('input', (e) => {
        brushColor = e.target.value;
    });

    clearButton.addEventListener('click', clearBoard);
    undoButton.addEventListener('click', undo);

    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

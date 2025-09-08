const canvas = document.getElementById('knn-canvas');
const ctx = canvas.getContext('2d');
const kInput = document.getElementById('k-value');
const classifyBtn = document.getElementById('classify-btn');

const POINT_RADIUS = 7;
const NUM_POINTS = 30;
let points = [];
let newPoint = null;
let neighbors = [];

function randomColor() {
    return Math.random() < 0.5 ? 'red' : 'blue';
}

function randomPoints(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push({
            x: Math.random() * (canvas.width - 2 * POINT_RADIUS) + POINT_RADIUS,
            y: Math.random() * (canvas.height - 2 * POINT_RADIUS) + POINT_RADIUS,
            color: randomColor()
        });
    }
    return arr;
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
    }
    if (newPoint) {
        ctx.beginPath();
        ctx.arc(newPoint.x, newPoint.y, POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = newPoint.color || 'gray';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();
        // Draw dotted lines to neighbors
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#888';
        for (const n of neighbors) {
            ctx.beginPath();
            ctx.moveTo(newPoint.x, newPoint.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
    }
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function findNeighbors(point, k) {
    return points
        .map(p => ({...p, dist: distance(point, p)}))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, k);
}

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    newPoint = { x, y };
    neighbors = findNeighbors(newPoint, parseInt(kInput.value, 10));
    drawPoints();
});

classifyBtn.addEventListener('click', () => {
    if (!newPoint || neighbors.length === 0) return;
    const reds = neighbors.filter(n => n.color === 'red').length;
    const blues = neighbors.filter(n => n.color === 'blue').length;
    newPoint.color = reds > blues ? 'red' : 'blue';
    points.push(newPoint);
    newPoint = null;
    neighbors = [];
    drawPoints();
});

kInput.addEventListener('change', () => {
    if (newPoint) {
        neighbors = findNeighbors(newPoint, parseInt(kInput.value, 10));
        drawPoints();
    }
});

points = randomPoints(NUM_POINTS);
drawPoints();

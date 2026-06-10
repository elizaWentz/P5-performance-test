function setup() {
    createCanvas(1920, 1080);
    randomSeed(42);
    background('#f0ede8');
    noLoop();

    let points = [
        { x: 0, y: 0 }, { x: 960, y: 0 }, { x: 1920, y: 0 },
        { x: 0, y: 540 }, { x: 960, y: 540 }, { x: 1920, y: 540 },
        { x: 0, y: 1080 }, { x: 960, y: 1080 }, { x: 1920, y: 1080 },
        { x: 480, y: 270 }, { x: 1440, y: 270 }, { x: 480, y: 810 },
        { x: 1440, y: 810 }, { x: 240, y: 135 }, { x: 1680, y: 135 },
        { x: 240, y: 945 }, { x: 1680, y: 945 }, { x: 0, y: 270 },
        { x: 1920, y: 270 }, { x: 0, y: 810 }, { x: 1920, y: 810 },
        { x: 960, y: 135 }, { x: 960, y: 945 }, { x: 240, y: 540 },
        { x: 1680, y: 540 }, { x: 480, y: 0 }, { x: 1440, y: 0 },
        { x: 480, y: 1080 }, { x: 1440, y: 1080 }, { x: 720, y: 405 },
        { x: 1200, y: 405 }, { x: 720, y: 675 }, { x: 1200, y: 675 },
        { x: 240, y: 270 }, { x: 1680, y: 270 }, { x: 240, y: 810 },
        { x: 1680, y: 810 }, { x: 480, y: 135 }, { x: 1440, y: 135 },
        { x: 480, y: 945 }, { x: 1440, y: 945 }
    ];

    stroke('#f0ede8');
    strokeWeight(3);
    fill('#cc3311');

    for (let i = 0; i < points.length; i++) {
        let neighbors = findNearestNeighbors(points, i, 3);
        for (let j = 0; j < neighbors.length; j++) {
            for (let k = j + 1; k < neighbors.length; k++) {
                let p1 = points[i];
                let p2 = points[neighbors[j]];
                let p3 = points[neighbors[k]];
                triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            }
        }
    }
}

function findNearestNeighbors(points, index, count) {
    let distances = [];
    for (let i = 0; i < points.length; i++) {
        if (i !== index) {
            let d = dist(points[index].x, points[index].y, points[i].x, points[i].y);
            distances.push({ index: i, distance: d });
        }
    }
    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, count).map(d => d.index);
}

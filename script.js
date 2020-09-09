let height = 15, width = 30;
let boxes; // hold reference to checkboxes
let speed = 1000; // speed of changing to next generation
let intervalID;

function initialise() {
    boxes = [];
    for (let i = 0; i < height; i++) {
        let col = [];
        for (let j = 0; j < width; j++) {
            let box = document.createElement('input');
            box.type = "checkbox";
            col.push(box);
        }
        boxes.push(col);
    }
    gridToBoxes(randomGrid());
    createNode();
}

function gridToBoxes(grid) {
    grid.forEach((row, i) => {
        row.forEach((col, j) => {
            boxes[i][j].checked = col;
        });
    });
}

function randomGrid() {
    let grid = [];
    for (let i = 0; i < height; i++) {
        let col = [];
        for (let j = 0; j < width; j++) {
            col.push(Math.random() < 0.3);
        }
        grid.push(col);
    }
    return grid;
}

function boxesToGrid() {
    return boxes.map((row) => {
        return row.map((box) => box.checked)
    });
}

function createNode() {
    let table = document.querySelector("table");
    table.textContent = '';
    boxes.forEach(row => {
        let tr = document.createElement("tr");
        row.forEach(col => {
            let td = document.createElement("td");
            td.appendChild(col);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

function countNeighbors(grid, r, c) {
    let count = 0;
    for (i = Math.max(0, r - 1); i <= Math.min(r + 1, height - 1); i++) {
        for (j = Math.max(0, c - 1); j <= Math.min(c + 1, width - 1); j++) {
            if (i == r && j == c) continue;
            if (grid[i][j] == true) {
                count++;
            }
        }
    }
    return count;
}

function nextGen(grid) {
    // Any live cell with fewer than two or more than three live neighbors dies.
    // Any live cell with two or three live neighbors lives on to the next generation.
    // Any dead cell with exactly three live neighbors becomes a live cell.
    let newGrid = grid.map(arr => arr.slice());
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let neighbors = countNeighbors(grid, i, j);
            if (grid[i][j] == false && neighbors == 3) {
                newGrid[i][j] = true;
            } else if (grid[i][j] == true && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = false;
            } else if (grid[i][j] == true && (neighbors == 2 || neighbors == 3)) {
                newGrid[i][j] = true;
            }
        }
    }
    return newGrid;
}

function updateView() {
    let newGrid = nextGen(boxesToGrid());
    gridToBoxes(newGrid);
    createNode();
}

let button = document.querySelector("button");
button.addEventListener("click", () => {
    updateView()
});

initialise();
intervalID = setInterval(updateView, speed);

let autoPlay = document.querySelector("#auto");
autoPlay.addEventListener("change", () => {
    if (autoPlay.checked) {
        intervalID = setInterval(updateView, speed);
    } else {
        clearInterval(intervalID);
    }
});

let slider = document.querySelector("#slider");
slider.addEventListener("change", () => {
    speed = 2000 - slider.value * 500;
    clearInterval(intervalID);
    intervalID = setInterval(updateView, speed);
});

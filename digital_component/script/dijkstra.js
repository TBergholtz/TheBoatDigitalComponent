function findEdges(aRow, aCol) {
    const neighbors = [];
    if (aRow > 0) {
        neighbors.push({ row: aRow - 1, col: aCol });
    }
    if (aCol > 0) {
        neighbors.push({ row: aRow, col: aCol - 1 });
    }
    if (aRow < ROWS - 1) {
        neighbors.push({ row: aRow + 1, col: aCol });
    }
    if (aCol < COLUMNS - 1) {
        neighbors.push({ row: aRow, col: aCol + 1 });
    }
    return neighbors;
}

function createGraph() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const cell = gameBoard[i][j].tile;
            const edges = findEdges(i, j);
            for (let k = 0; k < edges.length; k++) {
                const cellNeighbor = gameBoard[edges[k].row][edges[k].col].tile;
                gameGraph.addDirectedEdge(cell, cellNeighbor, 1);
            }
        }
    }
}
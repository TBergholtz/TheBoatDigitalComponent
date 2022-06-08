function isCorner(aRow, aCol) {
    const returnValue =
        ((aRow === 0) || (aRow === ROWS - 1)) &&
        ((aCol === 0) || (aCol === COLUMNS - 1));
    return returnValue;
}

function isCenter(aRow, aCol) {
    const returnValue =
        (aRow === (ROWS - 1) / 2) &&
        (aCol === (COLUMNS - 1) / 2);
    return returnValue;
}

function genGameTiles(aTYPE, aCount, aCorner) {
    tileOk = false;
    let row, col, count = 0;
    do {
        row = Math.floor(Math.random() * ROWS);
        col = Math.floor(Math.random() * COLUMNS);
        if (!isCenter(row, col)) {
            tileOk = gameBoard[row][col].value == TYPES.WATER.value;
            if (aCorner && tileOk) {
                tileOk = isCorner(row, col);
            } else if (!aCorner && tileOk) {
                tileOk = !isCorner(row, col);
            }
            if (tileOk) {
                gameBoard[row][col] = Object.create(aTYPE);
                count++;
            }
        }
    } while (count < aCount);
}
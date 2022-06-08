function TTile(aRow, aCol) {
    const ETileState = { Up: 0, Down: 1, Open: 2, Visited: 3, Scouted: 4 };
    const row = aRow;
    const col = aCol;
    const boardType = gameBoard[row][col];
    const spi = SPRITESHEET.TILES;
    const pos = new TPoint(aCol * spi.w, row * spi.h);
    const sprite = new TSprite(imgSheet, spi, pos);
    let state = ETileState.Up;
    this.name = "r" + row + "c" + col;
    this.isIsland = boardType.value == TYPES.ISLAND.value || boardType.value == TYPES.CORNER_X.value || boardType.value == TYPES.CORNER_Y.value;
    const center = new TPoint(pos.x + (spi.w / 2), pos.y + (spi.h / 2));

    const BOUNDS = {
        LEFT: pos.x + 5,
        TOP: pos.y + 5,
        RIGHT: pos.x + SPRITESHEET.TILES.w - 5,
        BOTTOM: pos.y + SPRITESHEET.TILES.h - 5
    };
    if (isCenter(row, col)) {
        state = ETileState.Open;
    }
    this.draw = function () {
        sprite.setIndex(boardType.spIndex);
        if (state === ETileState.Up) {
            sprite.setIndex(5);
            if (isCorner(row, col)) {
                sprite.setIndex(6);
            }
            sprite.draw();
        } else if (state === ETileState.Down) {
            sprite.setIndex(7);
            sprite.draw();
        } else if (state === ETileState.Scouted) {
            sprite.draw();
        } else if (state === ETileState.Visited) {
            sprite.draw();
            const oldFillStyle = ctx.fillStyle;
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(center.x, center.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = oldFillStyle;
            ctx.globalAlpha = 1;
        } else if (state === ETileState.Open) {
            sprite.draw();
            const oldFillStyle = ctx.fillStyle;
            ctx.fillStyle = "red";
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(center.x, center.y, 15, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = oldFillStyle;
            ctx.globalAlpha = 1;
        }

    }
    this.isMouseOver = function () {
        if (gameState === EGameState.Playing) {
            if (gameOver) {
                return false;
            }
            return !((mousePos.x < BOUNDS.LEFT) || (mousePos.y < BOUNDS.TOP) || (mousePos.x > BOUNDS.RIGHT) || (mousePos.y > BOUNDS.BOTTOM));
        }
    };
    this.setDown = function () {
        if (state === ETileState.Up) {
            state = ETileState.Down;
            this.draw();
        }
    };
    this.setUp = function (aCancel = false) {
        if (state !== ETileState.Down) {
            return;
        }
        if (aCancel) {
            state = ETileState.Up;
            this.draw();
        } else {
            state = ETileState.Up;
            this.draw();
        }
    };
    this.open = function () {
        state = ETileState.Open;
        this.draw();
    };
    this.isOpen = function () {
        return state === ETileState.Open || ETileState.Visited;
    };
    this.openAll = function () {
        state = ETileState.Open;
        this.draw();
    };
    this.openNearestIsland = function () {
        const tile = gameBoard[row][col].tile
        const tileIsland = gameGraph.dijkstra(tile);
        tileIsland.scout();
    };
    this.scout = function () {
        if (state === ETileState.Up) {
            state = ETileState.Scouted;
            this.draw();
        }
    }
    this.visit = function (aPrevTile) {
        aPrevTile.leave();
        state = ETileState.Open;
        this.draw();
    }
    this.leave = function () {
        state = ETileState.Visited;
        this.draw();
    }
}

function cvsMouseMove(aEvent) {
    // Mouse move over canvas
    let button = null;
    setMousePos(aEvent);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (gameBoard[row][col].tile) {
                if (gameBoard[row][col].tile.isMouseOver()) {
                    button = gameBoard[row][col].tile;
                }
            }
        }
    }
    if (!button) {
        if (startButton.isMouseOver()) {
            button = startButton;
        } else if (nextButton.isMouseOver()) {
            button = nextButton;
        } else if (openButton.isMouseOver()) {
            button = openButton;
        } else if (stormButton.isMouseOver()) {
            button = stormButton;
        } else if (compassButton.isMouseOver()) {
            button = compassButton;
        } else if (researchButton.isMouseOver()) {
            button = researchButton;
        }
        if (gameState === EGameState.Researching) {
            if (card1Btn.isMouseOver()) {
                button = card1Btn;
            } else if (card2Btn.isMouseOver()) {
                button = card2Btn;
            }
        }
        if (currentButton !== button && currentButton) {
            currentButton.setUp(true);
        }
    }
    currentButton = button;
    if (currentButton) {
        cvs.style.cursor = "pointer";
    } else {
        cvs.style.cursor = "";
    }
}

function cvsMouseDown(aEvent) {
    currentMouseButton = aEvent.buttons;
    if (currentButton) {
        if (currentMouseButton === MOUSEBTN.Left) {
            currentButton.setDown();
        }
    }
}

function cvsMouseUp() {
    if (currentButton) {
        if (currentMouseButton === MOUSEBTN.Left) {
            startButton.setUp();
            nextButton.setUp();
            openButton.setUp();
            stormButton.setUp();
            compassButton.setUp();
            researchButton.setUp();
            currentButton.setUp();
            if (currentButton === startButton) {
                location.reload();
                return;
            } else if (currentButton === nextButton) {
                drawNextDay();
            } else if (currentButton === openButton) {
                //openMap();
                activeTile.openNearestIsland();
            } else if (currentButton === stormButton) {
                drawStormResult(direction);
            } else if (currentButton === compassButton) {
                compass();
            } else if (currentButton === researchButton) {
                research();
            } else if (currentButton === card1Btn) {
                discard(0);
            } else if (currentButton === card2Btn) {
                discard(1);
            } else {
                currentButton.visit(activeTile);
                activeTile = currentButton;
            }
            currentButton = null;
            //checkGameOver();
        } else if (currentMouseButton === MOUSEBTN.Right) {
            if (typeof currentButton === 'object') {
                if (currentButton.constructor.name === TTile.name) {
                    currentButton.scout();
                }
            }
        }
    }
    currentMouseButton = MOUSEBTN.None;
}

function setMousePos(aEvent) {
    const bounds = cvs.getBoundingClientRect();
    mousePos.x = aEvent.clientX - bounds.left;
    mousePos.y = aEvent.clientY - bounds.top;
}


function drawScenario() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            gameBoard[row][col].tile.draw();
        }
    }

    nextButton.draw();
    startButton.draw();
    stormButton.draw();
    openButton.draw();
    compassButton.draw();
    researchButton.draw();
    storm.draw();
}

function reDrawMap() {
    ctx.clearRect(0, 0, cvs.width / 2, 599);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            gameBoard[row][col].tile.draw();
        }
    }
}

function drawCardSpots() {
    //Nightcards
    ctx.fillStyle = '#855fa1';
    ctx.fillRect(625, 45, 240, 350);
    ctx.stroke();

    //Weather forecast
    ctx.fillStyle = '#7d4a58';
    ctx.fillRect(900, 45, 240, 350);
    ctx.stroke();

    drawText();
}

function drawText() {
    ctx.font = "25px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Nightcard", 630, 70);
    ctx.fillText("Weather Forecast", 905, 70);
}

function drawNightcard(aDeck, aPosX, aPosY, aBool) {
    let isResearching = aBool;
    let deck = aDeck;
    nightcard = deck[Math.floor(Math.random() * deck.length)];
    let posX = aPosX;
    let posY = aPosY;

    ctx.font = "15px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText(nightcard.cardname, posX, posY);

    let x = posX;
    let y = posY + 30;
    let lineheight = 15;
    let lines = nightcard.text.split('\br');

    for (let i = 0; i < lines.length; i++)
        ctx.fillText(lines[i], x, y + (i * lineheight));

    if ((isResearching === false) && (nightcard.cardname === "Storm Changes")) {
        drawWeatherForecast(calcForecastDir());
    }
    return nightcard;
}

function drawWeatherForecast(aDir) {
    ctx.font = "15px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("The storm are most likely to move:", 905, 100);

    direction = aDir;
    let arrow = new TArrow(direction);
    arrow.draw();
}

function drawStormResult(aDir) {
    ctx.clearRect(600, 400, cvs.width / 2, 170);
    direction = aDir;
    let dice = null;
    direction = aDir;
    switch (direction) {
        case 0:
            dice = { 0: 0.6, 1: 0.0, 2: 0.133, 3: 0.133, 4: 0.133 };
            break;
        case 1:
            dice = { 0: 0.0, 1: 0.6, 2: 0.133, 3: 0.133, 4: 0.133 };
            break;
        case 2:
            dice = { 0: 0.133, 1: 0.133, 2: 0.6, 3: 0.0, 4: 0.133 };
            break;
        case 3:
            dice = { 0: 0.133, 1: 0.133, 2: 0.0, 3: 0.6, 4: 0.133 };
            break;
    }

    let result = calcStormMoveDir(dice);
    storm.draw(result);
    previousStorm = result;
    stormMoved = true;
}

function drawDayText(aDay) {
    ctx.font = "35px Arial";
    let day = aDay;
    let dayText = "Day " + day;
    ctx.fillStyle = 'black';
    ctx.fillText(dayText, 630, 30);
}

function drawResearchedCard(){
    ctx.fillStyle = '#855fa1';
    ctx.fillRect(25, 45, 240, 350);
    ctx.fillRect(325, 45, 240, 350);
    ctx.font = "25px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("Nightcard", 30, 70);
    ctx.fillText("Nightcard", 330, 70);
}

function drawNextDay() {
    if (stormMoved) {
        ctx.clearRect(600, 0, cvs.width / 2, cvs.height - 120);
        drawCardSpots();
        if (RESEARCHED.length > 0) {
            drawNightcard(RESEARCHED, 630, 100, false);
        } else {
            drawNightcard(NIGHTCARDS, 630, 100, false);
        }
        drawWeatherForecast(direction);
        storm.draw(previousStorm);
        dayCount++;
        drawDayText(dayCount);
        stormMoved = false;
        RESEARCHED = [];
    } else {
        alert("You need to Move Storm before you can end the day");
    }
}
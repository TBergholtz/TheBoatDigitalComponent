const NIGHTCARDS = [
    {
        "cardname": "Calm Night",
        "text": "The crew feel rested. \brCarry on!"
    },
    {
        "cardname": "Pirates in sight!",
        "text": "Keep moving to avoid being boarded. \br\br- If pirates are on players tile at end \brof day, they steal all the Island-food. \br\br- At the start of each day the pirates \brwill keep chasing if they are on an \bradjacent tile. If not, they give up."
    },
    {
        "cardname": "Raided",
        "text": "You were raided by hungry seagulls \br-1,  choose resource type"
    },
    {
        "cardname": "Shallow water!",
        "text": "-Place shallow water tokens on any \brundiscovered tile adjacent to the \brboat. \br\br-Scout a tile to remove the token. \brThen you may cross"
    },
    {
        "cardname": "Goods from the GODS.",
        "text": "A barrel of food is floating beside the \brboat. \br\brEach player gains +2 of each \brresource"
    },
    {
        "cardname": "Storm Changes",
        "text": "Pay attention to the \brWeather Forecast, \br\brLook out for possible change in \brstorm movement direction.\br\brMove the Storm Piece in the \brstorm movement direction."
    }
];

const EGameState = { Playing: 1, Researching: 2 };

let RESEARCHED = [];

const SPRITESHEET = {
    TILES: { x: 0, y: 0, w: 85, h: 85, count: 8, speed: 0, alpha: 1 },
    ARROWS: { x: 85, y: 170, w: 85, h: 85, count: 4, speed: 0, alpha: 1 },
    MAPSTORM: { x: 425, y: 170, w: 85, h: 85, count: 1, speed: 0, alpha: 1 },
    STORMS: { x: 0, y: 255, w: 170, h: 170, count: 6, speed: 0, alpha: 1 },
    STARTBUTTON: { x: 0, y: 92, w: 182, h: 72, count: 2, speed: 0, alpha: 1 },
    NEXTBUTTON: { x: 358, y: 92, w: 175, h: 72, count: 2, speed: 0, alpha: 1 },
    OPENBUTTON: { x: 706, y: 92, w: 175, h: 72, count: 2, speed: 0, alpha: 1 },
    STORMBUTTON: { x: 1053, y: 92, w: 175, h: 72, count: 2, speed: 0, alpha: 1 },
    COMPASSBUTTON: { x: 1403, y: 92, w: 175, h: 72, count: 2, speed: 0, alpha: 1 },
    RESEARCHBUTTON: { x: 1053, y: 20, w: 175, h: 72, count: 2, speed: 0, alpha: 1 },
    DISCARDBUTTON: { x: 1403, y: 20, w: 175, h: 72, count: 2, speed: 0, alpha: 1 }
};

const MOUSEBTN = { None: 0, Left: 1, Right: 2, Middle: 3 };
let currentMouseButton = MOUSEBTN.None;

const Position = new TPoint(0, 0);
const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");
const imgSheet = new Image();
const mousePos = Object.create(Position);

const gameGraph = new TGraph();


const NeighbourRange = {
    rows: { from: 0, to: 0 },
    cols: { from: 0, to: 0 }
};

let gameState = EGameState.Playing;

let currentButton = null;
let startButton = null;
let nextButton = null;
let stormButton = null;
let openButton = null;
let compassButton = null;
let researchButton = null;
let card1Btn = null;
let card2Btn = null;

let storm = null;
let stormMoved = false;
let gameOver = false;
let dayCount = 1;
let nightcard = null;
let direction = null;
let previousStorm = 4;
let activeTile = null;


//KLASSER------------------------------------------------------------------------



//LAGE MAP-----------------------------------------------------------------------------------
//to regler: Vann altid har lavest verdi , hjørnene må settes før noe annet gjøres til map

const TOTAL_NUMBER_FISH_TILES = 7;
const TOTAL_NUMBER_ISLAND_TILES = 7;
const TOTAL_NUMBER_THUNDER_TILES = 6;
const ROWS = 7;
const COLUMNS = 7;
const MAP_SIZE = ROWS * COLUMNS;
const TYPES = {
    WATER: { value: 0, spIndex: 8, tile: null },
    FISH: { value: 10, spIndex: 0, tile: null },
    ISLAND: { value: 20, spIndex: 1, tile: null },
    THUNDER: { value: 25, spIndex: 4, tile: null },
    CORNER_HARBOUR: { value: 30, spIndex: 3, tile: null },
    CORNER_SHIPWRECK: { value: 31, spIndex: 2, tile: null },
    CORNER_X: { value: 32, spIndex: 1, tile: null },
    CORNER_Y: { value: 33, spIndex: 1, tile: null }
};

const gameBoard = [];

// For å finne alle typer tiles som finnes i objektet "TYPES"
const typesKeys = Object.keys(TYPES);



function initGame(){
    document.addEventListener('contextmenu', aEvent => aEvent.preventDefault());  


    for (let row = 0; row < ROWS; row++) {
        const row = [];
        for (let col = 0; col < COLUMNS; col++) {
            const cell = Object.create(TYPES.WATER);
            row.push(cell);
        }
        gameBoard.push(row);
    }

    typesKeys.forEach(loadTypes);


    imgSheet.addEventListener("load", loadGame);
    imgSheet.src = "sprites.png";
}

function loadGame() {
    console.log("loaded");
    newScenario();
    cvs.addEventListener("mousemove", cvsMouseMove);
    cvs.addEventListener("mousedown", cvsMouseDown);
    cvs.addEventListener("mouseup", cvsMouseUp);
}

function loadTypes(aIndex) {
    const TYPE = TYPES[aIndex];
    let count = 1, corner = true;
    switch (TYPE) {
        case TYPES.FISH:
            corner = false;
            count = TOTAL_NUMBER_FISH_TILES;
            break;
        case TYPES.ISLAND:
            corner = false;
            count = TOTAL_NUMBER_ISLAND_TILES;
            break;
        case TYPES.THUNDER:
            corner = false;
            count = TOTAL_NUMBER_THUNDER_TILES;
            break;
        case TYPES.CORNER_HARBOUR:
            corner = true;
            count = 1;
            break;
            break;
    }
    if (TYPE !== TYPES.WATER) {
        genGameTiles(TYPE, count, corner);
    }
}

function calcForecastDir() {
    let randomDirection = Math.floor(Math.random() * 4);
    return randomDirection;
}

function calcStormMoveDir(prob) {
    let i, sum = 0, r = Math.random();
    for (i in prob) {
        sum += prob[i];
        if (r <= sum) return i;
    }
}

function newScenario() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            const tile = new TTile(row, col);
            gameBoard[row][col].tile = tile;
            gameGraph.addNode(tile);
            if (isCenter(row, col)) {
                activeTile = gameBoard[row][col].tile;
            }
        }
    }
    createGraph();
    startButton = new TButtons(SPRITESHEET.STARTBUTTON, 0, 600);
    stormButton = new TButtons(SPRITESHEET.STORMBUTTON, 185, 600);
    nextButton = new TButtons(SPRITESHEET.NEXTBUTTON, 370, 600);
    openButton = new TButtons(SPRITESHEET.OPENBUTTON, 555, 600);
    compassButton = new TButtons(SPRITESHEET.COMPASSBUTTON, 740, 600);
    researchButton = new TButtons(SPRITESHEET.RESEARCHBUTTON, 925, 600);
    storm = new TStorm();
    drawScenario();
    drawCardSpots();
    drawDayText(dayCount);
    drawWeatherForecast(calcForecastDir());

}

function openMap() {
    if (confirm("WARNING:This will unlock the whole map") === true) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                gameBoard[row][col].tile.openAll();
            }
        }
    } else {
        return;
    }
}

function compass() {
    if (confirm("Should only be used by Navigator Level 2")) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLUMNS; col++) {
                if (gameBoard[row][col].value === 31) {
                    gameBoard[row][col].tile.scout();
                }
            }
        }
    } else {
        return;
    }
}

function research() {
    if (confirm("Should only be used by General Level 1")) {
        gameState = EGameState.Researching;

        //Nightcards
        drawResearchedCard();
        let card1 = drawNightcard(NIGHTCARDS, 30, 100, true);
        let card2 = drawNightcard(NIGHTCARDS, 330, 100, true);
        card1Btn = new TButtons(SPRITESHEET.DISCARDBUTTON, 60, 275);
        card2Btn = new TButtons(SPRITESHEET.DISCARDBUTTON, 360, 275);
        card1Btn.draw();
        card2Btn.draw();

        RESEARCHED.push(card1);
        RESEARCHED.push(card2);
    }
}

function discard(aIndex) {
    let index = aIndex;
    gameState = EGameState.Playing;
    RESEARCHED.splice(index, 1);
    reDrawMap();
}
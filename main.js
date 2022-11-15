const $canvas = document.querySelector('#canvas');
const WIDTH = 1750;
const HEIGHT = 250;
$canvas.setAttribute('width', WIDTH);
$canvas.setAttribute('height', HEIGHT);

const context = $canvas.getContext('2d');

const $noteA = document.querySelector('.note-a');
const $noteASharp = document.querySelector('.note-a-sharp');
const $noteB = document.querySelector('.note-b');
const $noteC = document.querySelector('.note-c');
const $noteCSharp = document.querySelector('.note-c-sharp');
const $noteD = document.querySelector('.note-d');
const $noteDSharp = document.querySelector('.note-d-sharp');
const $noteE = document.querySelector('.note-e');
const $noteF = document.querySelector('.note-f');
const $noteFSharp = document.querySelector('.note-f-sharp');
const $noteG = document.querySelector('.note-g');
const $noteGSharp = document.querySelector('.note-g-sharp');

const fretboardColor = '#574b3f';
const stringColor = '#cccccc';
const dotColor = '#f2f2f2';
const nutColor = '#927d68';
const fretColor = '#888888';
const markerColor = '#ff0000';

const nFrets = 24;
const nStrings = 6;

const nutWidth = 25;
const fretWidth = 5;
const fretboardWidth = WIDTH - nutWidth;
const stringWidth = 3;
const stringsPadding = 15;
const dotRadius = 8;
const markerSize = 11;

const dotsAt = [
    2, 4, 6, 8, 14, 16, 18, 20
];
const doubleDotsAt = [
    11, 23
];

let noteIndexes = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
];
let tuningIndexes = [
    7, 0, 5, 10, 2, 7
];

let noteButtons = [
    $noteA,
    $noteASharp,
    $noteB,
    $noteC,
    $noteCSharp,
    $noteD,
    $noteDSharp,
    $noteE,
    $noteF,
    $noteFSharp,
    $noteG,
    $noteGSharp
];

function getFretLocations() {

    let locations = [];
    let distance = 0;

    for (let i = 0; i < nFrets; i++) {

        const location = WIDTH - distance;
        const scalingFactor = location / 17.817;
        distance = distance + scalingFactor;

        locations.push(distance);
    }

    for (let i = 0; i < nFrets; i++) {
        locations[i] *= fretboardWidth / locations[nFrets - 1];
    }

    return locations;
}

let fretLocations = getFretLocations();

let distanceBetweenFrets = [];
let lastDistance = 0;
for (let i = 0; i < nFrets; i++) {
    distanceBetweenFrets.push(fretLocations[i] - lastDistance);
    lastDistance = fretLocations[i];
}

let randomString = 0;
let randomFret = 1;
let randomNote = 'A';

function getNoteForFretAndString(fret, string) {

    string = (nStrings - 1) - string;

    return (tuningIndexes[string] + fret + 1) % 12;
}

function makeRandomNote() {
    randomFret = Math.floor(Math.random() * nFrets);
    randomString = Math.floor(Math.random() * nStrings);
    randomNote = getNoteForFretAndString(randomFret, randomString);
}
makeRandomNote();

function draw() {

    // Draw fretboard.
    context.fillStyle = fretboardColor;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw nut.
    context.fillStyle = nutColor;
    context.fillRect(0, 0, nutWidth, HEIGHT);

    // Draw frets.
    context.fillStyle = fretColor;
    for (let i = 0; i < nFrets; i++) {
        context.fillRect(fretLocations[i] - fretWidth / 2, 0, fretWidth, HEIGHT);
    }

    // Draw dots.
    context.fillStyle = dotColor;
    for (let i = 0; i < nFrets; i++) {
        if (!dotsAt.includes(i)) {
            continue;
        }
        context.beginPath();
        context.arc(fretLocations[i] - distanceBetweenFrets[i] / 2, HEIGHT / 2, dotRadius, 0, 2 * Math.PI);
        context.fill();
    }

    // Draw double dots.
    context.fillStyle = dotColor;
    for (let i = 0; i < nFrets; i++) {
        if (!doubleDotsAt.includes(i)) {
            continue;
        }
        context.beginPath();
        context.arc(fretLocations[i] - distanceBetweenFrets[i] / 2, HEIGHT / 3, dotRadius, 0, 2 * Math.PI);
        context.arc(fretLocations[i] - distanceBetweenFrets[i] / 2, HEIGHT - HEIGHT / 3, dotRadius, 0, 2 * Math.PI);
        context.fill();
    }

    // Draw strings.
    context.fillStyle = stringColor;
    const stringSpacing = (HEIGHT - stringsPadding * 2) / (nStrings - 1);
    for (let i = 0; i < nStrings; i++) {
        context.fillRect(0, stringsPadding + i * stringSpacing - stringWidth / 2, WIDTH, stringWidth);
    }

    // Draw marker.
    context.fillStyle = markerColor;
    context.beginPath();
    context.arc(fretLocations[randomFret] - distanceBetweenFrets[randomFret] / 2, stringsPadding + randomString * stringSpacing - stringWidth / 2, markerSize, 0, 2 * Math.PI);
    context.fill();

    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

const wrongClass = 'wrong';

function noteButtonsOnClick(event) {
    const buttonIndex = noteButtons.indexOf(event.target);
    if (buttonIndex == randomNote) {
        for (let i = 0; i < noteButtons.length; i++) {
            noteButtons[i].classList.remove(wrongClass);
        }
        makeRandomNote();
    } else {
        event.target.classList.add(wrongClass);
    }
}

for (let i = 0; i < noteButtons.length; i++) {
    noteButtons[i].addEventListener('click', noteButtonsOnClick);
}

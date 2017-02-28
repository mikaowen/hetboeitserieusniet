function setup() {
	let cnv = createCanvas(screenSizeX, screenSizeY);
	cnv.canvas.style.left = (window.innerWidth-screenSizeX)/2;
  cnv.canvas.style.top = (window.innerHeight-screenSizeY)/2;
  fill(color(255, 255, 255));
	textFont("Comic Sans MS");
  frameRate(fps);
	let distance = ((screenSizeX - (6 * hitCircleSize)) / 7) + hitCircleSize / 2.5; //Not perfectly centered but I don't give a fuck
	for (let i = 0; i < 6; i++) {
		lines[i] = distance;
		distance += ((screenSizeX - (6 * hitCircleSize)) / 7) * 2;
	}
}

function draw() {
	clear();
	rect(0, 0, screenSizeX, screenSizeY);
	spawnDelay += 1 / fps;
	document.getElementById("score").innerHTML = `Score: ${score} / ` + difficulty.score[level-1];
	document.getElementById("hits").innerHTML = `Hits: ${hits}`;
	document.getElementById("misses").innerHTML = `Misses: ${misses}`;
	document.getElementById("perBar").style.height = Math.min(hp, 100) + "%";

	textSize(hitCircleTextSize);
	for (let i = 0; i < 6; i++) {
		line(lines[i], winLine, lines[i], 0);
		setColorByLine(i);
		ellipse(lines[i], winLine, hitCircleSize, hitCircleSize);
		fill(0, 0, 0);
		text(brexitLetters[i], lines[i] - (hitCircleTextSize / 4), winLine + (hitCircleTextSize / 3));
		fill(255, 255, 255);
	}

	if (spawnDelay >= difficulty.delay[level-1]) {
    spawnDelay = 0;
    createEntity(Math.floor(Math.random() * 6));
  }

	textSize(circleTextSize);
	for (entity in entities) {
		entity = entities[entity];
		entity.y += difficulty.v[level-1];
		setColorByLine(entity.line);
		ellipse(entity.x, entity.y, circleSize, circleSize);
		fill(0, 0, 0)
		text(brexitLetters[entity.line], lines[entity.line] - (circleTextSize / 4), entity.y + (circleTextSize /3));

		if (entity.y >= winLine + hitCircleSize / 4) {
			miss(entity.line);
			kill(entity.uuid);
		}
	}
	fill(255, 255, 255);

	for (key in scoreText) {
		textObject = scoreText[key];
		textObject.time -= 1 / fps;
		if (textObject.time <= 0) {
			delete scoreText[key];
		} else {
			setColorByName(textObject.color);
			text(textObject.text, textObject.x, textObject.y);
			fill(255, 255, 255);
		}
	}

	if (score >= difficulty.score[level-1]) {
		levelup();
	}

	if (hp <= 0) {
		lose();
	}
}

function levelup() {
	level++;
	uuids = [];
	entities = {};
	scoreText = [];
	score = 0;
	hits = 0;
	misses = 0;
	hp = 100;
	letters[level-2].style.color = letters[level-2].dataset.color;
	letters[level-2].style.visibility = "visible";
	if (level >= 7) {
		win();
	}
}

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function win() {
	for (let i = 0; i < letters.length; i++) {
    letters[i].style.visibility = "hidden";
  }
  document.getElementById("hits").style.visibility = "hidden";
  document.getElementById("score").style.visibility = "hidden";
  document.getElementById("misses").style.visibility = "hidden";
  document.getElementById("perDone").style.visibility = "hidden";
  document.getElementById("defaultCanvas0").style.visibility = "hidden";
  document.getElementsByTagName("HTML")[0].style.background = "url('../images/burning_eu_flag.gif')";
  document.getElementsByTagName("HTML")[0].style.backgroundRepeat = "no-repeat";
  document.getElementsByTagName("HTML")[0].style.backgroundSize = "cover";
  playSound(anthem);
}

function lose() {
	uuids = [];
	entities = {};
	scoreText = [];
	score = 0;
	hits = 0;
	misses = 0;
	hp = 100;
}

//Credit to mikat
function isInCircle(x, y, xcenter, ycenter, r) {
  return (Math.pow(x-xcenter, 2) + Math.pow(y-ycenter, 2)) < Math.pow(r, 2);
}

function checkHit(line) {
	let isHit = false;
	for (entity in entities) {
		entity = entities[entity];
		if (isInCircle(entity.x, entity.y, lines[line], winLine, hitCircleSize / 2)) {
			hit(line);
			kill(entity.uuid);
			return true;
		}
	}
	if (!isHit) {
		miss(line);
		return false;
	}
}

function miss(line) {
	misses++;
	score = Math.max(score-500, 0);
	addScore("-500", "red", lines[line] - (circleSize / 2), winLine + 60, 1.0);
	hp = Math.max(hp - difficulty.hpMiss[level-1], 0);
}

function hit(line) {
	score += 100;
	hits++;
	addScore("+100", "green", lines[line] - (circleSize / 2), winLine + 60, 1.0)
	hp = Math.min(hp + difficulty.hpHit[level-1], 100);
}

function keyPressed() {
	if (key == "B") {
		if (checkHit(0)) {
			return;
		}
	} else if (key == "R") {
		if (checkHit(1)) {
			return;
		}
	} else if (key == "E") {
		if (checkHit(2)) {
			return;
		}
	} else if (key == "X") {
		if (checkHit(3)) {
			return;
		}
	} else if (key == "I") {
		if (checkHit(4)) {
			return;
		}
	} else if (key == "T") {
		if (checkHit(5)) {
			return;
		}
	}
}

function setColorByName(color) {
	if (color == "red") {
		fill(255, 0, 0);
	} else if (color == "green") {
		fill(0, 255, 0);
	} else if (color == "blue") {
		fill(0, 0, 255);
	} else if (color == "black") {
		fill(0, 0, 0);
	} else if (color == "white") {
		fill(255, 255, 255);
	}
}

function setColorByLine(line) {
	fill(colors[line][0], colors[line][1], colors[line][2]);
}

function addScore(text, color, x, y, time) {
	scoreText.push({
		text: text,
		color: color,
		x: x,
		y: y,
		time: time
	});
}

function kill(uuid) {
  uuids.splice(uuids.indexOf(uuid), 1);
  delete entities[uuid];
}

function createEntity(line) {
  let uuid = 0;
  do {
    uuid = Math.floor(Math.random()*1000);
  }
  while (uuids.indexOf(uuid) >= 0 && uuids.length > 0)

  uuids.push(uuid);
  entities[uuid] = {}
  entities[uuid].uuid = uuid;
	entities[uuid].x = lines[line]
	entities[uuid].y = circleSize;
	entities[uuid].line = line;
}

const anthem = new Audio("../audio/anthem.mp3");
const screenSizeX = 800;
const screenSizeY = 600;
const winLine = 500;
const hitCircleSize = 60;
const hitCircleTextSize = 30;
const circleSize = 40;
const circleTextSize = 20;
const fps = 30;
const scoreTextSize = 15;
const brexitLetters = ["b", "r", "e", "x", "i", "t"];
const colors = [
	[255, 255, 255],
	[255, 0, 0],
	[0, 0, 255],
	[255, 255, 255],
	[255, 0, 0],
	[0, 0, 255]
];
let entities = {};
let uuids = [];
let score = 0;
let hits = 0;
let misses = 0;
let level = 1;
let lines = [];
let scoreText = [];
let hp = 100;
const difficulty = {
	v: [
		5.0,
		8.0,
		10.0,
		12.0,
		15.0,
		17.0
	],
	delay: [
		2.0,
		1.5,
		1.3,
		1.0,
		0.7,
		0.5
	],
	time: [
		20,
		40,
		60,
		80,
		100,
		120
	],
	hpMiss: [
		10,
		20,
		30,
		40,
		50,
		60
	],
	hpHit: [
		10,
		8,
		6,
		5,
		4,
		3
	],
	score: [
		1000,
		2000,
		3000,
		4000,
		4500,
		5000
	]
};
let spawnDelay = difficulty.delay[0];
const letters = [
	document.getElementById("b"),
	document.getElementById("r"),
	document.getElementById("e"),
	document.getElementById("x"),
	document.getElementById("i"),
	document.getElementById("t")
];

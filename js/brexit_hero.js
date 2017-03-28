function setup() {
	let cnv = createCanvas(screenSizeX, screenSizeY);
	cnv.canvas.style.left = (window.innerWidth-screenSizeX)/2;
  cnv.canvas.style.top = (window.innerHeight-screenSizeY)/2;
  fill(color(255, 255, 255));
	textFont("Comic Sans MS");
	noLoop();
  frameRate(fps);
	let distance = ((screenSizeX - (6 * hitCircleSize)) / 7) + hitCircleSize / 2.5;
	for (let i = 0; i < 6; i++) {
		lines[i] = distance;
		distance += ((screenSizeX - (6 * hitCircleSize)) / 7) * 2;
	}
}

function draw() {
	clear();
	rect(0, 0, screenSizeX, screenSizeY);
	spawnDelay += 1 / fps;
	time += 1 / fps;
	if (gamemode == "endless") {
		difficultyTimer += 1 / fps;
	}
	document.getElementById("score").innerHTML = `Score: ${score}`;
	document.getElementById("combo").innerHTML = `Combo: ${combo}x`;
	document.getElementById("accuracy").innerHTML = `Accuracy: ${accuracy}%`;
	document.getElementById("perBar").style.height = Math.min(hp, 100) + "%";
	if (gamemode == "campaign") {
		document.getElementById("innerProgressBar").style.height = Math.min(Math.floor((time / difficulty.time[level-1])*100), 100) + "%";
	}

	textSize(hitCircleTextSize);
	for (let i = 0; i < 6; i++) {
		line(lines[i], winLine, lines[i], 0);
		setColorByLine(i);
		ellipse(lines[i], winLine, hitCircleSize, hitCircleSize);
		fill(0, 0, 0);
		text(brexitLetters[i], lines[i] - (hitCircleTextSize / 4), winLine + (hitCircleTextSize / 3));
		fill(255, 255, 255);
	}

	if ((spawnDelay >= difficulty.delay[level-1] && gamemode == "campaign") || (spawnDelay >= difficultyEndless.delay && gamemode == "endless")) {
    spawnDelay = 0;
    createEntity(Math.floor(Math.random() * 6));
  }

	if (gamemode == "endless" && difficultyTimer >= difficultyDelay) {
		difficultyEndless.v = Math.min(difficultyEndless.v + difficultyEndless.amount.v, difficultyEndless.limit.v);
		difficultyEndless.delay = Math.max(difficultyEndless.delay - difficultyEndless.amount.delay, difficultyEndless.limit.delay);
		difficultyTimer = 0;
	}

	textSize(circleTextSize);
	for (entity in entities) {
		entity = entities[entity];

		if (gamemode == "campaign") {
			entity.y += difficulty.v[level-1];
		} else if (gamemode == "endless") {
			entity.y += difficultyEndless.v;
		}
		setColorByLine(entity.line);
		ellipse(entity.x, entity.y, circleSize, circleSize);
		fill(0, 0, 0)
		text(brexitLetters[entity.line], lines[entity.line] - (circleTextSize / 4), entity.y + (circleTextSize /3));

		if (entity.y - (circleSize / 2) >= winLine + hitCircleSize / 2) {
			misses++;
			miss(entity.line);
			kill(entity.uuid);
		}
	}
	fill(255, 255, 255);

	for (objectName in scoreText) {
		textObject = scoreText[objectName];
		textObject.time -= 1 / fps;
		if (textObject.time <= 0) {
			delete scoreText[objectName];
		} else {
			setColorByName(textObject.color);
			text(textObject.text, textObject.x, textObject.y);
			fill(255, 255, 255);
		}
	}

	if (time >= difficulty.time[level-1] && gamemode == "campaign") {
		levelup();
	}

	if (hp <= 0) {
		document.getElementById("perBar").style.height = Math.min(hp, 100) + "%";
		if (gamemode == "endless") {
			promptScore();
		}
		lose();
	}
}

function levelup() {
	if (gamemode == "endless") {
		return;
	}
	level++;
	uuids = [];
	entities = {};
	scoreText = [];
	score = 0;
	hits = 0;
	misses = 0;
	hp = 100;
	time = 0;
	letters[level-2].style.color = letters[level-2].dataset.color;
	letters[level-2].style.visibility = "visible";
	if (level >= 7) {
		win();
	}
}

function playSound(sound, volume) {
	volume = volume || 1.0;
	sound.volume = volume;
	sound.pause();
  sound.currentTime = 0;
  sound.play(volume);
}

function win() {
	if (gamemode == "endless") {
		return;
	}
	for (let i = 0; i < letters.length; i++) {
    letters[i].style.visibility = "hidden";
  }
	let buttons = document.getElementsByClassName("circle-button");
	for (let i = 0; i < buttons.length; i++) {
		button[i].style.visibility = "hidden";
	}
  document.getElementById("score").style.visibility = "hidden";
	document.getElementById("combo").style.visibility = "hidden";
	document.getElementById("accuracy").style.visibility = "hidden";
  document.getElementById("perDone").style.visibility = "hidden"
	document.getElementById("progressBar").style.visibility = "hidden";
  document.getElementById("defaultCanvas0").style.visibility = "hidden";
	document.getElementById("scorePrompt").style.visibility = "hidden";
  document.getElementsByTagName("HTML")[0].style.background = "url('../images/burning_eu_flag.gif')";
  document.getElementsByTagName("HTML")[0].style.backgroundRepeat = "no-repeat";
  document.getElementsByTagName("HTML")[0].style.backgroundSize = "cover";
  playSound(anthem);
}

function start() {
	started = !started;
	paused = !paused;
	if (started) {
		loop();
	} else {
		noLoop();
		lose();
	}
}

function drawBaseScreen() {
	clear();
	rect(0, 0, screenSizeX, screenSizeY);
	textSize(hitCircleTextSize);
	for (let i = 0; i < 6; i++) {
		line(lines[i], winLine, lines[i], 0);
		setColorByLine(i);
		ellipse(lines[i], winLine, hitCircleSize, hitCircleSize);
		fill(0, 0, 0);
		text(brexitLetters[i], lines[i] - (hitCircleTextSize / 4), winLine + (hitCircleTextSize / 3));
		fill(255, 255, 255);
	}
}

function lose() {
	drawBaseScreen();
	if (gamemode == "endless") {
		save.time = time;
		save.combo = maxCombo;
		save.score = score;
		save.accuracy = accuracy;
	}
	uuids = [];
	entities = {};
	scoreText = [];
	score = 0;
	hits = 0;
	misses = 0;
	hp = 100;
	time = 0;
	started = false;
	paused = true;
	noLoop();
	difficultyEndless.delay = difficulty.endless.delay;
	difficultyEndless.v = difficulty.endless.v;
}

//Credit to mikat
function isInCircle(x, y, xcenter, ycenter, r) {
  return (Math.pow(x-xcenter, 2) + Math.pow(y-ycenter, 2)) < Math.pow(r, 2);
}

function checkHit(line) {
	let isHit = false;
	playSound(sounds[Math.floor(Math.random()*sounds.length)], 0.3);
	for (entity in entities) {
		entity = entities[entity];
		if (
		!isInCircle(entity.x, entity.y, lines[line], winLine, hitCircleSize / 2)
		&& isInCircle(entity.x, entity.y, lines[line], winLine, (hitCircleSize / 2) + (circleSize / 2))
		) {
			score50++;
			hit(line, 50);
			kill(entity.uuid);
			return true;
		} else if (
		isInCircle(entity.x, entity.y, lines[line], winLine, hitCircleSize / 2)
		&& !isInCircle(entity.x, entity.y, lines[line], winLine, hitCircleSize / 4)
		) {
			score100++;
			hit(line, 100);
			kill(entity.uuid);
			return true;
		} else if (isInCircle(entity.x, entity.y, lines[line], winLine, hitCircleSize / 2)) {
			score300++;
			hit(line, 300);
			kill(entity.uuid);
			return true;
		}
	}
	if (!isHit) {
		missClicks++;
		miss(line);
		return false;
	}
}

function pause() {
	paused = !paused
	if (paused) {
		noLoop();
	} else {
		loop();
	}
}

function updateAccuracy() {
	if (misses + score50 + score100 + score300 == 0) {
		accuracy = 100;
		return
	}
	accuracy = Math.round((score / ((misses + score50 + score100 + score300) * 300)) * 10000) / 100;
}

function miss(line) {
	if (combo > maxCombo) {
		maxCombo = combo;
	}
	combo = 0;
	addScore("Miss", "red", lines[line] - (circleSize / 2), winLine + 60, 1.0);
	if (gamemode == "campaign") {
		hp = Math.max(hp - difficulty.hpMiss[level-1], 0);
	} else if (gamemode == "endless") {
		hp = Math.max(hp - difficultyEndless.hpMiss, 0);
	}
	updateAccuracy();
}

function hit(line, amount) {
	score += amount;
	combo++;
	addScore(`+${amount}`, "green", lines[line] - (circleSize / 2), winLine + 60, 1.0)
	if (amount == 300) {
		if (gamemode == "campaign") {
			hp = Math.min(hp + difficulty.hpHit[level-1], 100);
		} else if (gamemode == "endless") {
			hp = Math.min(hp + difficultyEndless.hpHit, 100);
		}
	} else {
		if (gamemode == "campaign") {
			hp = Math.max(hp - (difficulty.hpMiss[level-1]*hitFactors[amount]), 0);
		} else if (gamemode == "endless") {
			hp = Math.max(hp - (difficultyEndless.hpMiss*hitFactors[amount]), 0);
		}
	}
	updateAccuracy();
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

function queryLeaderboard(page) {
	if (firebase.auth().currentUser != null) {
		db.ref("scores").orderByChild("ranking").startAt(9 * (page - 1) + 1).endAt(9 * page + 1).limitToFirst(9).once("value").then(function(snapshot) {

			let i = 1;
			if (snapshot.val() != null) {
				snapshot.forEach(function(child) {
					document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardName`).innerHTML = child.val().name;
					document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardScore`).innerHTML = `Score: ${child.val().score}`;
					document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardCombo`).innerHTML = `Max Combo: ${child.val().combo}x`;
					document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardAccuracy`).innerHTML = `Accuracy: ${child.val().accuracy}%`;
					document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardRanking`).innerHTML = `#${child.val().ranking}`;
					let mins = Math.floor(Math.floor(child.val().time) / 60);
					let secs = Math.floor(child.val().time) % 60;
					if (secs < 10) {
						secs = `0${secs}`;
					}
					if (mins < 10) {
						document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardTime`).innerHTML = `Time: 0${mins}:${secs}`;
					} else {
						document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardTime`).innerHTML = `Time: ${mins}:${secs}`;
					}
					db.ref("users/" + child.key + "/image").once("value").then(function(snap) {
						if (snap.val()) {
							document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardImage`).style.backgroundImage = `url(${snap.val()})`;
						}
					})
					i++;
				});
			}
			while (i < 10) {
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardName`).innerHTML = "";
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardScore`).innerHTML = "";
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardCombo`).innerHTML = "";
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardAccuracy`).innerHTML = "";
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardTime`).innerHTML = "";
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardRanking`).innerHTML = `#${(page - 1) * 9 + i}`;
				document.querySelector(`.leaderboardEntry[data-entry='${i}'] .leaderboardImage`).src = "";
				i++;
			}
		});
	} else {
		alert("not signed in!");
		console.log("not signed in!");
		leaderboardVisible = false;
		document.getElementById("leaderboard").style.visibility = "hidden";
	}
}

function queryUserLeaderboard() {
	if (firebase.auth().currentUser != null) {
		let uid = firebase.auth().currentUser.uid;
		db.ref("users/" + uid + "/image").once("value").then(function(snap) {
			if (snap.val()) {
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardImage").style.backgroundImage = `url(${snap.val()})`;
			}
		});
		db.ref("scores/" + uid).once("value").then(function(snapshot) {
			if (snapshot.val()) {
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardName").innerHTML = snapshot.val().name;
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardScore").innerHTML = `Score: ${snapshot.val().score}`;
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardCombo").innerHTML = `Max Combo: ${snapshot.val().combo}x`;
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardAccuracy").innerHTML = `Accuracy: ${snapshot.val().accuracy}%`;
				document.querySelector(`.leaderboardEntry[data-entry='10'] .leaderboardRanking`).innerHTML = `#${snapshot.val().ranking}`;
				let mins = Math.floor(Math.floor(snapshot.val().time) / 60);
				let secs = Math.floor(snapshot.val().time) % 60;
				if (secs < 10) {
					secs = `0${secs}`;
				}
				if (mins < 10) {
					document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardTime").innerHTML = `Time: 0${mins}:${secs}`;
				} else {
					document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardTime").innerHTML = `Time: ${mins}:${secs}`;
				}
			} else {
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardName").innerHTML = firebase.auth().currentUser.providerData[0].displayName;
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardScore").innerHTML = "No score";
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardCombo").innerHTML = "";
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardAccuracy").innerHTML = "";
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardTime").innerHTML = "";
				document.querySelector(".leaderboardEntry[data-entry='10'] .leaderboardRanking").innerHTML = "";
			}
		});
	} else {
		leaderboardVisible = false;
		document.getElementById("leaderboard").style.visibility = "hidden";
	}
}

function submitHighscore() {
	if (started) {
		console.log("There is still a game running.");
		alert("There is still a game running.");
		return;
	}
	if (save.score <= 0) {
		console.log("score has to be atleast 1");
		alert("score has to be atleast 1");
		return;
	}
	if (firebase.auth().currentUser != null) {
		let uid = firebase.auth().currentUser.uid;
		db.ref("scores/" + uid).once("value").then(function(snapshot) {
			db.ref("scores").orderByChild("score").startAt(save.score).limitToFirst(1).once("value").then(function(snap) {
				let ranking = 1;
				if (snap.val()) {
					snap.forEach(function(child) {
						ranking = child.val().ranking + 1;
						if (child.key == uid) {
							ranking = child.val().ranking;
						}
          });
				}
				console.log("Leaderboard position found: #" + ranking);
				db.ref("scores").orderByChild("ranking").once("value").then(function(shot) {
					console.log("updating leaderboard positions");
					shot.forEach(function(child) {
						if (ranking < child.val().ranking && child.key != uid) {
							let rank = child.val().ranking + 1;
							db.ref("scores/" + child.key).update({
								ranking: rank
							});
							console.log("user: " + child.val().name + " has been shifted from #" + (rank - 1) + " to #" + rank);
						}
					});
				});
				if (snapshot.val()) {
					console.log("User entry found, updating the entry...");
					db.ref("scores/" + uid).update({
			      name: firebase.auth().currentUser.providerData[0].displayName,
			      score: save.score,
						combo: save.combo,
						accuracy: save.accuracy,
						time: save.time,
						ranking: ranking
					});
				} else {
					console.log("User entry not found, creating new entry...");
					db.ref("scores/" + uid).set({
						name: firebase.auth().currentUser.providerData[0].displayName,
						score: save.score,
						combo: save.combo,
						accuracy: save.accuracy,
						time: save.time,
						ranking: ranking
					});
				}
			});
			console.log("Score submitted successfully!");
		});
  } else {
		alert("not signed in!");
		console.log("not signed in!");
	}
}

function kill(uuid) {
  uuids.splice(uuids.indexOf(uuid), 1);
  delete entities[uuid];
}

function killAll() {
	for (uuid in entities) {
		kill(uuid);
	}
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

function toggleGamemode() {
	if (gamemode == "campaign") {
		gamemode = "endless";
		document.getElementById("toggleGamemode").style.backgroundColor = "limegreen";
		document.getElementById("progressBar").style.visibility = "hidden";
	} else if (gamemode == "endless") {
		document.getElementById("toggleGamemode").style.backgroundColor = "red";
		document.getElementById("progressBar").style.visibility = "visible";
		gamemode = "campaign";
	}
	lose();
	level = 0;
	for (let i = 0; i < 6; i++) {
		letters[i].style.visibility = "hidden";
	}
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
const difficultyDelay = 5;
const colors = [
	[255, 255, 255],
	[255, 0, 0],
	[0, 0, 255],
	[255, 255, 255],
	[255, 0, 0],
	[0, 0, 255]
];
const sounds = [
	new Audio("../audio/hi_hat.wav"),
	new Audio("../audio/drum.wav")
];
const hitFactors = {
	100: 0.2,
	50: 0.5
}
let db = firebase.database();
let started = false;
let entities = {};
let uuids = [];
let score = 0;
let score300 = 0;
let score100 = 0;
let score50 = 0;
let misses = 0;
let missClicks = 0;
let level = 1;
let lines = [];
let scoreText = [];
let hp = 100;
let time = 0.0;
let combo = 0;
let maxCombo = 0;
let accuracy = 100.00;
let paused = true;
let gamemode = "campaign";
let spawnDelay = 0.0;
let difficultyTimer = 0;
let save = {
	score: 0,
	combo: 0,
	time: 0.0,
	accuracy: 0.00
}
let difficultyEndless = {
	v: 5.0,
	delay: 2.0,
	hpMiss: 25,
	hpHit: 10,
	amount: {
		v: 0.5,
		delay: 0.1
	},
	limit: {
		v: 30.0,
		delay: 0.1
	}
}
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
		35.0,
		60.0,
		80.0,
		100.0,
		120.0,
		150.0
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
	endless: {
		v: 5.0,
		delay: 2.0
	}
};
const letters = [
	document.getElementById("b"),
	document.getElementById("r"),
	document.getElementById("e"),
	document.getElementById("x"),
	document.getElementById("i"),
	document.getElementById("t")
];

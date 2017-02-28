function setup() {
  let cnv = createCanvas(screenSizeX, screenSizeY);
  cnv.canvas.style.left = (window.innerWidth-screenSizeX)/2;
  cnv.canvas.style.top = (window.innerHeight-screenSizeY)/2;
  fill(color(255, 255, 255));
  frameRate(fps);
  imgScope = loadImage("../images/scope.png");
  imgBrexitVoter = loadImage("../images/brexit_voter.png");
  imgEuVoter = loadImage("../images/eu_voter.png");
  imgBackground = loadImage("../images/background_sniper_elite_5.png");
}

function draw() {
  clear();
  rect(0, 0, screenSizeX, screenSizeY);
  line(winLine+circleSize/2, 0, winLine+circleSize/2, screenSizeY);
  image(imgBackground, 0, 0, 800, 600);
  line(winLine+circleSize/2+1, 0, winLine+circleSize/2+1, screenSizeY);
  spawnDelay = spawnDelay + (1/fps);
  if (boltProgress != 0 && boltProgress < boltTime) {
    boltProgress++;
  } else if (boltProgress != 0 && boltProgress >= boltTime) {
    boltProgress = 0;
  }

  if (kills == 0 || kills > 1) {
    document.getElementById("kills").innerHTML = `${kills} Kills`;
  } else if (kills == 1) {
    document.getElementById("kills").innerHTML = `${kills} Kill`;
  }
  document.getElementById("votes").innerHTML = brexitVotes + " / " + difficulty.count[level-1] + " Brexit votes";
  document.getElementById("perBar").style.height = Math.min(Math.floor((brexitVotes / difficulty.count[level-1])*100), 100) + "%";

  for (let entity in entities) {
    entity = entities[entity];
    if (entity.type == "brexit") {
      image(imgBrexitVoter, entity.x - 9, entity.y - 17, 20, 36);
    } else if (entity.type == "eu"){
	  image(imgEuVoter, entity.x - 9, entity.y - 17, 20, 36);
	}

    entity.x += entity.v;
    if (entity.x >= winLine) {
      if (entity.type == "brexit") {
        voteBrexit();
      } else if (entity.type == "eu") {
        lose();
        break;
      }
      kill(entity.uuid);
    }
  }

  if (scoped) {
    image(imgScope, (screenSizeX/2)+mouseX-2890, (screenSizeY/2)+mouseY-2795, 5000, 5000, 0, 0);
  }

  if (spawnDelay >= difficulty.delay[level-1]) {
    spawnDelay = 0;
    brexit = false;
    if (Math.floor(Math.random()*3) == 0) {
      brexit = true;
    }
    createEntity(brexit);
  }

  if (brexitVotes >= difficulty.count[level-1]) {
    levelup();
  }
}

const soundShoot = new Audio("../audio/shoot.wav");
const soundReload = new Audio("../audio/reload.wav");
const soundScope = new Audio("../audio/scope.wav");
const anthem = new Audio("../audio/anthem.mp3");
const screenSizeX = 800;
const screenSizeY = 600;
const winLine = 700;
const circleSize = 20;
const fps = 30;
const boltTime = 30;
let entities = {};
let uuids = [];
let scoped = false;
let level = 1;
let brexitVotes = 0;
let spawnDelay = 3;
let entityCount = 0;
let kills = 0;
let boltProgress = 0;
const letters = [
  document.getElementById("b"),
  document.getElementById("r"),
  document.getElementById("e"),
  document.getElementById("x"),
  document.getElementById("i"),
  document.getElementById("t")
];
const difficulty = {
  v: [
    2.0,
    2.5,
    3.0,
    3.5,
    4.0,
    5.0
  ],
  count: [
    5,
    7,
    10,
    15,
    20,
    25
  ],
  delay: [
    3.0,
    2.5,
    2.0,
    1.5,
    1.3,
    1.0,
  ]
};

//Credit to mikat
function isInCircle(xcenter, ycenter, r) {
  return (Math.pow(mouseX-xcenter, 2) + Math.pow(mouseY-ycenter, 2)) < Math.pow(r, 2);
}

function isInSquare(x, y, x1, y1, x2, y2) {
	return (x >= x1 && x <= x2 && y >= y1 && y <= y2);
}

function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
}

function mouseClicked() {
  if (boltProgress != 0) {
    return;
  }
  scoped = !scoped;
  if (!scoped) {
    for (let entity in entities) {
      entity = entities[entity];
      if (isInSquare(mouseX, mouseY, entity.x-9, entity.y-17, entity.x+9, entity.y + 18)) {
        if (entity.type == "brexit") {
          lose();
          break;
        } else if (entity.type == "eu") {
          kills++;
        }
        kill(entity.uuid);
      }
    }
    playSound(soundShoot);
    setTimeout(function() {
      playSound(soundReload)
    }, 300);
    boltProgress = 1;
  } else if (scoped) {
    playSound(soundScope);
  }
}

function lose() {
  entities = {};
  uuids = [];
  kills = 0;
  brexitVotes = 0;
  boltProgress = 0;
  spawnDelay = 0;
  scoped = false;
}

function win() {
  for (let i = 0; i < letters.length; i++) {
    letters[i].style.visibility = "hidden";
  }
  document.getElementById("votes").style.visibility = "hidden";
  document.getElementById("kills").style.visibility = "hidden";
  document.getElementById("perDone").style.visibility = "hidden";
  document.getElementById("defaultCanvas0").style.visibility = "hidden";
  document.getElementsByTagName("HTML")[0].style.background = "url('../images/burning_eu_flag.gif')";
  document.getElementsByTagName("HTML")[0].style.backgroundRepeat = "no-repeat";
  document.getElementsByTagName("HTML")[0].style.backgroundSize = "cover";
  playSound(anthem);
}

function levelup() {
  level++;
  kills = 0;
  brexitVotes = 0;
  boltProgress = 0;
  spawnDelay = 0;
  scoped = false;
	letters[level-2].style.color = letters[level-2].dataset.color;
	letters[level-2].style.visibility = "visible";
  entities = {};
  uuids = [];
  if (level == 7) {
    win();
    return;
  }
}

function voteBrexit() {
  brexitVotes++;
}

function kill(uuid) {
  uuids.splice(uuids.indexOf(uuid), 1);
  delete entities[uuid];
}

function createEntity(brexit) {
  entityCount++;
  let uuid = 0;
  do {
    uuid = Math.floor(Math.random()*1000);
  }
  while (uuids.indexOf(uuid) >= 0 && uuids.length > 0)

  uuids.push(uuid);
  entities[uuid] = {}
  entities[uuid].uuid = uuid;
  entities[uuid].x = 20;
  entities[uuid].y = Math.max(Math.floor(Math.random()*(screenSizeY-circleSize+10)), circleSize+10);
  let range = Math.floor(Math.random()*(difficulty.v[level-1]/4*10))/10;
  if (Math.floor(Math.random()*2) == 0) {
    range *= -1;
  }
  entities[uuid].v = difficulty.v[level-1] + range;

  if (brexit) {
    entities[uuid].type = "brexit";
  } else {
    entities[uuid].type = "eu";
  }
}

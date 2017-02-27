let progress = 0;
let level = 1;
let voteEuId;
const anthem = new Audio("../audio/anthem.mp3");
anthem.loop = true;
const difficulty = [
	500,
	400,
	300,
	250,
	200,
	150
]
const bar = document.getElementById("perBar");
const letters = [
	document.getElementById("b"),
	document.getElementById("r"),
	document.getElementById("e"),
	document.getElementById("x"),
	document.getElementById("i"),
	document.getElementById("t")
];
const uk = document.getElementById("uk");
const body = document.getElementsByTagName("BODY")[0];
const progressH1 = document.getElementById("progressH1");
const perDone = document.getElementById("perDone");

function voteBrexit() {
	progress += 1;
	if (progress >= 100)
		levelup();
	updateBar();
}

function voteEU() {
	if (progress > 0)
		progress -= 1;
	updateBar();
}

function updateBar() {
    progress = Math.min(progress, 100);
    progressH1.innerHTML = `BREXIT VOTES: ${progress}`;
    bar.style.height = `${progress}%`;
    uk.style.bottom = `${progress}px`;
}

function levelup() {
	progress = 0;
	updateBar();
	level++;
	for (let i = 1; i < level; i++) {
		letters[i-1].style.color = letters[i-1].dataset.color;
		letters[i-1].style.visibility = "visible";
	}
	if (level == 7) {
		win();
		return;
	} else {
		clearInterval(voteEuId);
		voteEuId = setInterval(voteEU, difficulty[level-1]);
	}
}

function win() {
	clearInterval(voteEuId);
	uk.style.visibility = "hidden";
	bar.style.visibility = "hidden";
	progressH1.style.visibility = "hidden";
	perDone.style.visibility = "hidden";
	for (let i = 0; i < letters.length; i++)
		letters[i].style.visibility = "hidden";
		
	body.style.backgroundImage = "url('../images/burning_eu_flag.gif')";
	anthem.play();
}

document.addEventListener("keyup", event => {
	if (event.which == 32)
		voteBrexit();
});

voteEuId = setInterval(voteEU, difficulty[level-1]);
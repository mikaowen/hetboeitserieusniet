const joy = document.getElementsByClassName("joy");
let height = document.body.offsetHeight;
let width = document.body.offsetWidth;
const gif = document.getElementById("gif");
const brexit = [
	document.getElementById("b"),
	document.getElementById("r"),
	document.getElementById("e"),
	document.getElementById("x"),
	document.getElementById("i"),
	document.getElementById("t")
];
let joyRotation = 0;
let letter = 0;

function updateCSS() {
	let height = document.body.offsetHeight;
	let width = document.body.offsetWidth;
	gif.style.left = (width / 2) - (gif.offsetWidth / 2);
}

function nextLetter() {
	letter++;
	if (letter > 5)
		letter = 0;
	brexit[letter].style.visibility = "visible";
	if (letter == 0)
		brexit[5].style.visibility = "hidden";
	else
		brexit[letter-1].style.visibility = "hidden";
}

updateCSS();
setInterval(updateCSS, 500);
setInterval(nextLetter, 250);

let help = false;

function setup() {
	
}

function keyReleased() {
	console.log(keyCode);
  if (keyCode == ESCAPE && help) {
    help = false;
		document.getElementsByClassName("help")[0].style.visibility = "hidden";
  }
}

function toggleInfo() {
	help = !help
	if (help) {
		document.getElementsByClassName("help")[0].style.visibility = "visible";
	} else {
		document.getElementsByClassName("help")[0].style.visibility = "hidden";
	}
}

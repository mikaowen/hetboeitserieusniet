let help = false;

function setup() {

}

function keyReleased() {
  if (keyCode == ESCAPE && help) {
    help = false;
		document.getElementsByClassName("help")[0].style.visibility = "hidden";
  }
}

function toggleInfo() {
	help = !help
	if (help) {
		document.getElementsByClassName("help")[0].style.visibility = "visible";
    if (pause && paused != null && !paused) {
      pause();
    }
	} else {
		document.getElementsByClassName("help")[0].style.visibility = "hidden";
    if (pause && paused != null && paused && started != null && started) {
      pause();
    }
	}
}

let scorePromptVisible = false;
let leaderboardVisible = false;
let highscorePage = 1;
let lastText = "1";

document.onkeydown = checkKey;

function promptScore() {
	scorePromptVisible = !scorePromptVisible
	if (scorePromptVisible) {
		document.getElementById("scorePrompt").style.visibility = "visible";
    document.getElementById("scorePromptScore").innerHTML = `Score: ${score}`;
		document.getElementById("scorePromptAccuracy").innerHTML = `Accuracy: ${accuracy}%`;
		document.getElementById("scorePromptCombo").innerHTML = `Max Combo: ${maxCombo}x`;
	} else {
		document.getElementById("scorePrompt").style.visibility = "hidden";
	}
	checkForHighscore();
}

function promptLeaderboard() {
  leaderboardVisible = !leaderboardVisible;
  if (leaderboardVisible) {
		document.getElementById("leaderboard").style.visibility = "visible";
	} else {
		document.getElementById("leaderboard").style.visibility = "hidden";
	}
}

function checkForHighscore() {
	firebase.database().ref("scores/" + firebase.auth().currentUser.uid + "/score").once("value").then(function(snapshot) {
		if (snapshot.val()) {
			if (save.score > snapshot.val()) {
				submitHighscore();
			}
		} else {
			if (confirm("You don't seem to have a highscore in the database\nDo you want to submit this one?")) {
				submitHighscore();
			}
		}
	});
}

function isNumber(val) {
  return Number(parseFloat(val)) == val;
}

function leaderboardNextPage() {
	if (isNumber(document.getElementById("leaderboardPage").value)) {
		document.getElementById("leaderboardPage").value = Number(document.getElementById("leaderboardPage").value) + 1;
	} else {
		document.getElementById("leaderboardPage").value = 1
	}
}

function leaderboardLastPage() {
	if (isNumber(document.getElementById("leaderboardPage").value)) {
		document.getElementById("leaderboardPage").value = Math.max(Number(document.getElementById("leaderboardPage").value) - 1, 1);
	} else {
		document.getElementById("leaderboardPage").value = 1
	}
}

setInterval(function() {
	if (leaderboardVisible && lastText != document.getElementById("leaderboardPage").value && isNumber(document.getElementById("leaderboardPage").value) && Number(document.getElementById("leaderboardPage").value) > 0) {
		queryUserLeaderboard();
		queryLeaderboard(Number(document.getElementById("leaderboardPage").value));
	}
	lastText = document.getElementById("leaderboardPage").value;
}, 100)

function checkKey(event) {
  event = event || window.event;
  if (event.keyCode == 27) {
		leaderboardVisible = false;
		document.getElementById("leaderboard").style.visibility = "hidden";
	}
}

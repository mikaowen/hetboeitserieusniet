const gif = document.getElementById("gif");
const letters = document.querySelectorAll('#letters *');
let letter = 0;

function updateCSS() {
  let height = document.body.offsetHeight;
  let width = document.body.offsetWidth;
  gif.style.left = (width / 2) - (gif.offsetWidth / 2);
}

function nextLetter() {
  letter++;
  letter%=6
  letters[letter].style.visibility = "visible";
  letters[letter==0?5:letter-1].style.visibility = "hidden";
}

updateCSS();
setInterval(updateCSS, 500);
setInterval(nextLetter, 250);


// CANVAS BLOCK...

const canvas = ele("gameCanvasX");
const ctx = canvas.getContext("2d");

let ending = 50000 + Math.random()*20000;
let gameRunning = false;
let gamePaused = false;
let CW, CH;


function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
}


function checkOrientation() {
  const warning = document.getElementById("rotateWarning");

  if (isMobileDevice() && window.innerWidth < window.innerHeight) {
    warning.style.display = "flex";
    if (gameRunning) gamePaused = true;
  } else {
    warning.style.display = "none";
    if (gameRunning) gamePaused = false;
  }
}


function resiz() {
  canvas.width =  window.innerWidth;
  canvas.height = window.innerHeight;
  CW = canvas.width;
  CH = canvas.height;
  checkOrientation();
}


resiz();





let resizeTimer = null;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resiz();
  }, 100);
});


window.addEventListener("load", resiz);





// SIDEBAR MENU BLOCK...

ele('sideBy').addEventListener("click", () => {
  off('envy');
  ele('gameCanvasX').classList.toggle("blur");
  on('sidebar',1);
  on('dark');
  gamePaused = true;
  if (musicOn) fadeOutMusic();
});


function taskResume() {
  off('dark');
  off('sidebar');
  ele('gameCanvasX').classList.remove("blur");
  on('envy');
  gamePaused = false;
  if (musicOn) fadeInMusic();
  update();
}





//RESUME - PAUSE FUNCTION...

function resumePause() {
  gamePaused = !gamePaused;
  ele("pauser").textContent = gamePaused ? "⏸" : "▶";

  if (gamePaused) {
    if (musicOn) fadeOutMusic();
  } else {
    if (musicOn) fadeInMusic();
    update();
  }
}





// CHECKPOINT BLOCK...

function saveCp() {
  const cpData = {
    rrr: run + Math.floor(reach / 50),
    xp: exp + epo,
    org: requirement,
    gt: gpGot,
  };
  localStorage.setItem('trainGameCheckpoint', JSON.stringify(cpData));
}


function loadCp() {
  reach = 0;
  cameraX = 0;
  epo = 0;
  speedX = 0;
  showAdvance = false;
  monsterSpeed = monsterBase;
  monsterCount = 0;
  mono = 0.9;
  gamePaused = false;
  gameRunning = true;
  crash = false;
  const sData = gett('trainGameCheckpoint');

  if (sData) {
    genX();
    const cpp = JSON.parse(sData);
    run = cpp.rrr;
    exp = cpp.xp;
    requirement = cpp.org;
    gpGot = cpp.gt || 0;
    stat.rtx = false;
  }
}


function existCp() {return gett("trainGameCheckpoint") !== null}


function delCp(ddd) {
  if (ddd === true) {
    if (existCp()) {
      localStorage.removeItem('trainGameCheckpoint');
      showPopup("😎 Checkpoint was removed succesfully...!");
    } else {
      showPopup("😤 No checkpoint exists, so no need for Reset...!");
    }
  } else {
    showPopup("😤...Hmm...Progress!");
  }
  off('reset');
}





// GAME OVER BLOCK...

let q;


function gOver(rg) {
  off('gameCanvasX');
  off('envy');
  const rt = ele('gameReason');

  if (rg === 1) {
    rt.innerHTML = "<h2>GAME OVER : THE TRAIN DONE COLLISION</h2>";
    q = "🔥 Im gonna burst all these obstacles...";
  } else if (rg === 2) {
    rt.innerHTML = "<h2>GAME OVER : MONSTER DESTROYED THE TRAIN</h2>";
    q = "🔥 Damn... This monster";
  } else {
    q = "🔥 What the hell...";
  }

  ele('continueBtn').style.display = existCp() ? 'inline-block' : 'none';
  on('gameOver', 1);
}


function gEnd() {
  off('gameCanvasX');
  off('gameOver');
  off('sidebar');
  ele('gameCanvasX').classList.remove("blur");
  on('endu');
  setTimeout(() => {on('enduBtn')}, 2000);
}


function conCp() {
  off('gameOver');
  startGame();
  setTimeout(() => {showPopup(q)}, 4000);
}

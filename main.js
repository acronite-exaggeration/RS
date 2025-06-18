
// OBSTACLE COLLISION...

function crashOb(xgr) {
  for (let ob of obstacles) {
    const obSX = ob.x - xgr;
    if (
      train.x < obSX + ob.width &&
      train.x + train.width > obSX &&
      train.top === ob.t
    ) {
      crash = true;
      monsta = null;
      fadeOutMusic();
      boom.play();
      gamePaused = true;
      reUpdate(200, 1, obSX - ob.width, ob.y - ob.height, CH/2);
      flash();
      setTimeout(() => {showPopup("😅 OOpsie HOpsie Doo...!")},1500);
    }
  }
}





// MONSTER COLLISION...

function crashMrs(xgr) {
  if (monsta) {
    monsta.x -= monsta.speed;
    const mrSX = monsta.x - xgr;
    if (
      train.x < mrSX + train.height &&
      train.x + train.width > mrSX &&
      train.top === monsta.mt
    ) {
      crash = true;
      fadeOutMusic();
      boom.play();
      gamePaused = true;
      reUpdate(200, 2, mrSX - train.width, monsta.y - train.height, CH/2);
      flash();
      monsta = null;
      setTimeout(() => {showPopup("😅 OOpsie HOpsie Doo...!")},1500);
    } else if (monsta.x < -100 || monsta.x < xgr - 500) {
      monsta = null;
    }
  }
}





// STATION COLLISION...

function crashStat(xgr) {
  if (xgr < stat.x - 200 || stat.rtx) return;

  stat.rtx = true;
  showPopup("😤 Saving the Checkpoint...! 🚉");
  saveCp();
  monsta = null;
  let cs = acc;
  acc = 0;
  kb-=10;

  ci = setInterval(() => {
    if (speedX <= 0) {
      speedX = 0;
      clearInterval(ci);
    } else {
      speedX -= 0.2;
    }
  },25);

  setTimeout(() => {
    ending = 50000 + Math.random()*20000;
    loadCp();
    acc = cs;
    flash();
    setTimeout(() => {showPopup("😎 Checkpoint Saved...! 🚉")},1000);
  },2000);
}





// GAME LOOP BLOCK...

let righto = false;
let lefto = false;
let pressT = false;
let cameraX = 0;
let speedX = 0;
let remind = 0;
let reach = 0;
let sky = 0;
let ski = 20000 + Math.random()*7000;
let kb = 0;
let lastly = 0;
let lasttime = 0;
let timer = 400;

let fps = 0;
let frames = 0;
let lastFpsUpdate = 0;



function update(timestamp) {
  if (gamePaused || !gameRunning || crash) return;

  const topo = CW;
  const hopo = CH;
  const eepo = ending;
  cameraX += speedX;
  const camx = cameraX;

  ctx.clearRect(0, 0, topo, hopo);

  if (change) {
    sky += speedX;
    if (sky > ski) {
      climate();
      ski = 20000 + Math.random() * 7000;
    }
  }

  if (timestamp - lasttime > timer) {
    const pyro = Math.abs(speedX);
    pyro < 3 ? timer = (Math.random() > 0.5 ? 400 : 700) : (pyro < 7 ? timer = 300 : (pyro < 9.5 ? timer = 200 : timer = 100));

    diesel ? genSmoke(camx) : genSpark(pyro);
    lasttime = timestamp;
  }

  if (timestamp - lastly > 400) {
    for (let dot of crystals) dot.radius = 2 + Math.random() * 5;
    kb++;
    lastly = timestamp;

    if (kb > 25) {
      spawnMonster();
      kb = 0;
    }
  }

  if (righto) {
    remind = 0;
    speedX = Math.min(speedX + acc, trainMax);
    if (camx > reach) reach = camx;
  } else if (lefto) {
    remind = 0;
    if (camx > 0) speedX = Math.max(speedX - acc, -trainMax);
    if (camx <= 0 || camx <= reach-1000) {
      speedX = 0;
      showPopup("🔥 Brave People... Never Turn Back!");
    }
  } else {
    remind++;
    if (camx <= 0) speedX = 0;
    if (speedX > 0) speedX = Math.max(0, speedX - fri);
    if (speedX < 0) speedX = Math.min(0, speedX + fri);
  }

  if (remind >= 2000) {
    remind -= 200;
    showPopup("🔥 Its time to move ahead...");
  }

  doArea(camx, topo, eepo, hopo);
  doItems(camx, topo);
  doStat(camx, topo);
  diesel ? doSmoke(camx) : doSparks();
  doTrt();
  doMrs(camx);
  progression(reach, eepo-2000);
  crashMrs(camx);
  crashOb(camx);
  crashStat(camx);

  if (isfps) {
    frames++;

    if (timestamp - lastFpsUpdate > 333) {
      fps = frames*3;
      frames = 0;
      lastFpsUpdate = timestamp;
    }

    ctx.fillStyle = "#fff";
    ctx.font = "25px monospace";
    ctx.fillText(`FPS: ${fps}`, topo-110, 30);
  }

  requestAnimationFrame(update);
}



function reUpdate(allowed, reas, ax, bx, esc) {
  if (allowed > 0) {
    const topo = CW;
    const hopo = CH;
    const eepo = ending;
    const camx = cameraX;
    ctx.clearRect(0, 0, topo, hopo);
    
    doArea(camx, topo, eepo, hopo);
    doItems(camx, topo);
    doStat(camx, topo);
    doExp(ax, bx, esc);
    allowed--;
    requestAnimationFrame(() => reUpdate(allowed, reas, ax, bx, esc));
  } else {
    gOver(reas);
  }
}





// PC CONTROLS BLOCK...

function isKey(e, keys) {
  return keys.includes(e.key) || keys.includes(e.code);
}


window.addEventListener("keydown", (e) => {
  if (gamePaused && !gameRunning) return;

  const isModal = ele('modal').style.display === 'block';

  if (isKey(e, ["Space", "Shift", "s", "S"])) {
    swicher();
    pressT = true;
  }

  if (isKey(e, ["p", "P"])) resumePause();
  if (isKey(e, ["m", "M"])) musicToggle();
  if (isKey(e, ["c", "C"])) collects();

  if (isKey(e, ["ArrowRight", "d", "D"])) {
    righto = true;
    if (isModal) nextInstruction();
  }

  if (isKey(e, ["ArrowLeft", "a", "A"])) {
    lefto = true;
    if (isModal) pastInstruction();
  }
});


window.addEventListener("keyup", (e) => {
  if (isKey(e, ["Space", "Shift", "s", "S"])) pressT = false;
  if (isKey(e, ["ArrowRight", "d", "D"])) righto = false;
  if (isKey(e, ["ArrowLeft", "a", "A"])) lefto = false;
});




// MOBILE CONTROLS BLOCK...

ele("lefter").addEventListener("pointerdown",() => lefto = true);

ele("lefter").addEventListener("pointerup", () => lefto = false);

ele("righter").addEventListener("pointerdown", () => righto = true);

ele("righter").addEventListener("pointerup", () => righto = false);

ele("switcher").addEventListener("click", () => {
  if (!gamePaused && gameRunning) swicher()
});





// FINAL BLOCK...

function startGame() {
  
  const help = [
    "😤 You can always set Train Speed from Settings",
    "😤 Boost your Reflexes by increasing difficulty & speed",
    "😤 You can always set Monster Difficulty from Settings",
    "🔥 Track & Enable game FPS via settings",
    "😤 You have the permissions to reset your progress",
    "🔥 Always learn from your tiny mistakes",
    "😎 Use Toggle-Music and Pause-Resume feature effectively",
    "😎 Collect Graphene using 🤑 button",
    "😎 Increase your XP by practicing ADVANCE",
    "🔥 Greatest challenge to travel without Break",
  ];

  on('dark');
  const i = Math.floor(Math.random() * help.length);
  showPopup(help[i]);
  loadCp();

  setTimeout(() => {
    off('dark');
    on('gameCanvasX');
    on('envy');
    if (musicOn) fadeInMusic();
    update();
    flash();
  },3000);
}


ele("startBtn").addEventListener("click", () => {
  off('menuxBtn');
  startGame();
  setTimeout(() => {showPopup("🔥 Time for the Torgue 🔥")}, 4000);
});
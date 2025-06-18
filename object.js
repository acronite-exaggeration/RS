
// STATION BLOCK...

const statUp = imgload("others/statup.jpg");
const statDown = imgload("others/statdown.jpg");

const stat = {
  x: ending-2000,
  track: Math.floor(Math.random() * 2),
  rtx: false,
};


function doStat(xgr, lll) {
  const statX = stat.x - xgr;

  if (-xgr > -lll * 1.5) {
    ctx.drawImage(statUp, -xgr, 0, 1500, 225);
    ctx.drawImage(statDown, -xgr, 430, 1500, 200);
  }

  if (statX < lll * 1.2) {
    ctx.drawImage(statUp, statX, 0, 1500, 225);
    ctx.drawImage(statDown, statX, 430, 1500, 200);
  }
}





// AREA MAINTAIN BLOCK...

function doArea(xgr, lll, kkk, uuu) {
  const bgw = bgImg.width * (uuu / bgImg.height);
  const init = -xgr/4 % bgw;
  for (let x = init; x < lll; x += bgw) ctx.drawImage(bgImg, x, 0, bgw, uuu);

  ctx.fillStyle = "#201000"; 
  ctx.fillRect(0, 225, lll, 210);

  for (let i = 0; i < kkk; i += 30) {
    const barX = i - xgr;
    if (barX >= -30 && barX <= lll + 30) {
      ctx.fillStyle = "#818A8B";
      ctx.fillRect(barX, 248, 10, 34);
      ctx.fillRect(barX, 378, 10, 34);
    }
  }

  for (let i = 0; i < kkk; i += lll/2) {
    const screenX = i - xgr;
    if (screenX >= -60 && screenX <= lll + 60) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(screenX, 435, 40, 50);
      ctx.fillRect(screenX-10, 485, 60, 50);
      ctx.fillRect(screenX-20, 535, 80, 50);
      ctx.fillRect(screenX-30, 585, 100, 50);
    }
  }
  
  ctx.strokeStyle = "#42220b";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-xgr, 256);
  ctx.lineTo(lll, 256);
  ctx.moveTo(-xgr, 274);
  ctx.lineTo(lll, 274);
  ctx.moveTo(-xgr, 386);
  ctx.lineTo(lll, 386);
  ctx.moveTo(-xgr, 404);
  ctx.lineTo(lll, 404);
  ctx.stroke();
}





// TRAIN BLOCK...

let swich = false;
let sTime = 0;
let startY = 0;
let targetY = 0;
const k = CH/3.416;
const l = CH/2.006;
let trainBob = 0;
let trainDirection = 1;
let crash = false;

let train = {
  x: CW/20,
  width: CW/4.5,
  height: CH/6,
  top: true,
};


function doTrt() {
  if (crash) return;
  trainBob += 0.5 * trainDirection;
  if (trainBob > 5 || trainBob < -5) trainDirection *= -1;

  let baseY;
  if (swich) {
    const elapsed = Date.now() - sTime;
    const t = Math.min(elapsed / 200, 1);
    baseY = startY + (targetY - startY) * t;

    if (t >= 1) swich = false;
  } else {
    baseY = train.top ? k : l;
  }

  if (swich && !crash) {
    for (let i = 0; i < train.width *1.2; i += 12) {
      ctx.fillStyle = "#5dade2";
      ctx.fillRect(train.x - train.width/10 + i , baseY + trainBob, 4, 100);
    }
  }

  ctx.drawImage(trainImg, train.x, baseY + trainBob, train.width, train.height);
}


function swicher() {
  if (swich) return;
  swich = true;
  sTime = Date.now();
  startY = train.top ? k : l;
  targetY = train.top ? l : k;
  train.top = !train.top;
  sound.currentTime = '0';
  sound.play();
}





// ITEMS BLOCK...

const cryCol = ["#00f0ff", "#ff00f0", "#00ff88", "#ffee00", "#ff6600", "#df0000", "#5800df"];
const gpImg = imgload("others/graphene.png");
let gpGot = 0;
let requirement = 100;
let crystals = [];
let obstacles = [];
let gpBlocks = [];


function doItems(xgr, lll) {

  for (let dot of crystals) {
    const screenX = dot.x - xgr;
    if (screenX >= -40 && screenX <= lll + 40) {
      ctx.beginPath();
      ctx.arc(screenX, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
    }
  }


  obstacles.forEach(ob => {
    const screenX = ob.x - xgr;
    if (screenX > -ob.width && screenX < lll) {
      ctx.drawImage(ob.img, screenX, ob.y, ob.width, ob.height);
    }
  });


  gpBlocks.forEach(gp => {
    const blockX = gp.x - xgr;

    if (gp.got && gp.animating) {
      gp.alpha -= 0.03;
      gp.dy -= 1;

      if (gp.alpha <= 0) gp.animating = false;

      ctx.save();
      ctx.globalAlpha = Math.max(gp.alpha, 0);
      ctx.drawImage(gpImg, blockX, gp.y + gp.dy, gp.width, gp.height);
      ctx.restore();
    }
    
    if (!gp.got && blockX > -gp.width && blockX < lll) {
      ctx.drawImage(gpImg, blockX, gp.y, gp.width, gp.height);
    }
  });
}





// GENERATOR BLOCK...

function collects() {
  const past = gpGot;

  gpBlocks.forEach(gp => {
    const box = gp.x - cameraX;
    const isgp = (box >= 0 && box <= CW) && (gp.y >= 0 && gp.y <= CH);

    if (!gp.got && isgp) {
      gp.got = true;
      gp.animating = true;
      gp.alpha = 1;
      gp.dy = 0;
      gpGot++;
    }
  });

  if (past === gpGot) {
    woosh.currentTime = '0';
    woosh.play();
  } else {
    treat.currentTime = '0';
    treat.play();
  }
}


function genX() {
  const var1 = CH/7;
  const var2 = CW * 1.5;
  const var3 = var1 * 7/10;
  const var4 = var1 * 7/16;
  const l2 = ending;
  const l1 = Math.floor(l2/12);
  crystals = [];
  obstacles = [];
  gpBlocks = [];
  
  for (let i = 0; i < l1; i++) {
    crystals.push({ 
      x: Math.random() * l2,
      y: 230 + Math.random() * 200,
      radius: Math.random() * 2 + 1,
      color: cryCol[Math.floor(Math.random() * cryCol.length)],
    });
  }

  for (let i = var2; i < l2; i+= 430 + Math.floor(Math.random() * 300)) {
    const topp = Math.random() < 0.5;
    const robs = obi[Math.floor(Math.random() * obi.length)];
    obstacles.push({
      x: i,
      y: topp ? k + var4 : l + var4,
      width: var1,
      height: var1,
      img: robs,
      t: topp ? true : false,
    });
  }

  for (let i = var2; i < l2; i+= 70 + Math.floor(Math.random() * 500)) {
    gpBlocks.push({
      x: i,
      y: 250 + Math.floor(Math.random() * 105),
      width: var3,
      height: var3,
      got: false,
      animating: false,
      alpha: 1,
      dy: 0,
    });
  }
}


genX();





// MONSTER BLOCK...

const monsterRoar = new Audio("roarx.mp3");
let monsta = null;
let monsterCount = 0;
let monsterSpeed = monsterBase;
let monsterBob = 0;
let monsterDirection = 1;


function spawnMonster() {
  if (!monsta) {
    monsterSpeed = monsterBase + monsterCount;

    if (monsterSpeed >= monsterMax) {
      doAdv();
      monsterSpeed = monsterMax;
      showAdvance = true;
    }

    monsterCount += mup;
    const mons = Math.random() < 0.5;
    const mx = cameraX + CW + 150;
    const my = mons ? k : l;
    const mss = monsterSpeed;
    const msts = mons ? true : false;

    monsta = {
      x: mx,
      y: my,
      speed: mss,
      mt: msts,
    };
    monsterRoar.play();
  }
}


function doMrs(xgr) {
  if (!monsta) return;

  monsterBob += 0.5 * monsterDirection;
  if (monsterBob > 5 || monsterBob < -5) monsterDirection *= -1;

  const size = train.height;
  const screenX = monsta.x - xgr;
  const screenY = monsta.y + monsterBob;

  for (let i = 0; i < size; i += 2) {
    const color = Math.random() * 3;

    const flameColor = color < 1 ? "#ff6502" : (color < 2 ? "#ffe802" : "#000");

    const flameWidth = i < size/2 ? 20 + i/2 + Math.random() * 70 : 50 + (size - i)/2 + Math.random() * 70;

    ctx.fillStyle = flameColor;
    ctx.fillRect(screenX + size / 3, screenY + i, flameWidth, 2);
  }

  ctx.drawImage(monsterImg, screenX, screenY, size, size);
}

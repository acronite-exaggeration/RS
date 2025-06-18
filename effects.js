
// POPUP BLOCK...


function showPopup(msg = "Popup!", dura = 2000) {
  const container = document.getElementById('popupContainer') || (() => {
    const div = document.createElement('div');
    div.id = 'popupContainer';
    div.style.position = 'fixed';
    div.style.top = '20px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.zIndex = '9999999';
    div.style.pointerEvents = 'none';
    document.body.appendChild(div);
    return div;
  })();

  const popup = document.createElement('div');
  popup.className = 'Popup';
  popup.innerText = msg;
  popup.style.opacity = '0';
  
  container.appendChild(popup);

  requestAnimationFrame(() => {
    popup.style.opacity = '1';

    setTimeout(() => {
      popup.style.opacity = '0';
      setTimeout(() => {
        popup.remove();
      }, 1000);
    }, dura);
  });
}





// ADVANCE BLOCK...

let showAdvance = false;
let advanceAF = null;


function doAdv() {
  if (advanceAF) return;
  on('advance');

  function ina() {
    if (showAdvance) {
      gamePaused ? off('advance') : on('advance');
      const visible = Math.floor(Date.now() / 400) % 2 === 0;
      ele('advance').style.opacity = visible ? '1' : '0';
    } else {
      cancelAnimationFrame(advanceAF);
      off('advance');
    }
    advanceAF = requestAnimationFrame(ina);
  }
  ina();
}


function adv() {
  if (showAdvance && gpGot >= requirement) {
    monsterSpeed = monsterBase;
    monsterCount = 0;
    showAdvance = false;
    gpGot -= requirement;
    epo++;
    requirement += 2 + Math.floor(Math.random()*5);
    electricBurst();
    setTimeout(() => {showPopup("🔥 Used ADVANCE ~ XP Boosted!")},1000);
  } else {
    showPopup(`🔥 Minimum ${requirement} Graphene Needed for ADVANCE!`);
  }
}





// ELECTRIC BURST EFFECT...

function electricBurst() {
  const parts = [];
  const x = train.x + train.width/2;
  const y = train.top ? k + train.height/2 : l + train.height/2;

  for (let i = 0; i < 120; i++) {
    const angle = Math.random() * 2 * Math.PI;
    parts.push({
      x,
      y,
      lent: 30 + Math.random() * 100,
      speed: 2 + Math.random() * 3,
      angle,
      alpha: 1.5,
    });
  }

  function animate() {
    ctx.save();
    ctx.lineWidth = 3;

    parts.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.01;
    });

    parts.forEach(p => {
      if (p.alpha > 0) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
          p.x + Math.cos(p.angle) * p.lent,
          p.y + Math.sin(p.angle) * p.lent
        );
        ctx.strokeStyle = `rgba(0, 150, 230, ${p.alpha}`;
        ctx.stroke();
      }
    });

    ctx.restore();
    if (parts.some(p => p.alpha > 0)) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}





// FLASH EFFECT...

function flash(f = 1) {
  let flashOpacity = 0.75;
  let reduction = 0.009;
  const var1 = CW;
  const var2 = CH;

  function flas() {
    if (flashOpacity > 0) {
      ctx.fillStyle = f === 1 ? `rgba(255, 255, 255, ${flashOpacity})`: `rgba(0, 0, 0, ${flashOpacity})`;
      ctx.fillRect(0, 0, var1, var2);
      flashOpacity -= reduction;
      requestAnimationFrame(flas);
    }
  }

  flas();
}





// SMOKE EFFECT...

const smokeParticles = [];


function genSmoke(xgr) {
  smokeParticles.push({
    x: xgr + train.width/2,
    y: train.top ? k : l,
    radius: 10 + Math.random() * 15,
    opacity: 1,
    speedX: Math.random() - 0.5,
    speedY: -Math.random(),
    expand: 0.05,
    color: Math.random() < 0.5 ? "#222" : (Math.random() < 0.5 ? "#444" : "#666"),
  });
}


function doSmoke(xgr) {
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.x += p.speedX;
    p.y += p.speedY;
    p.radius += p.expand;
    p.opacity -= 0.005;

    if (p.opacity <= 0) {
      smokeParticles.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.arc(p.x - xgr, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}





// SPARK EFFECT...

const electricSparks = [];


function genSpark(sps) {
  const sparkX = train.x;
  const sparkY = train.top ? k + 20 : l + 20;
  const sparkEnd = sparkX + 180;
  let ups = 200;

  if (sps > 7) {
    sps < 9 ? ups = 180 : (sps < 12 ? ups = 90 : ups = 60);
  }

  for (let x = sparkX; x <= sparkEnd; x += ups) {
    const segments = [];
    let sx = x;
    let sy = sparkY;

    for (let i = 0; i < 6; i++) {
      const dx = (Math.random() - 0.5) * 40;
      const dy = 10 + Math.random() * 30;
      sx += dx;
      sy -= dy;
      segments.push({ x:sx, y:sy });
    }

    electricSparks.push({
      segments,
      opacity: 1.2,
    });
  }
}


function doSparks() {
  const trainScreenX = train.x;

  for (let i = electricSparks.length - 1; i >= 0; i--) {
    const spark = electricSparks[i];

    ctx.strokeStyle = `rgba(150,250,250,${spark.opacity})`;
    ctx.lineWidth = 2 + Math.random() * 4;
    ctx.beginPath();

    const startX = trainScreenX + spark.segments[0].x;
    const startY = spark.segments[0].y;
    ctx.moveTo(startX, startY);

    for (let j = 1; j < spark.segments.length; j++) {
      const seg = spark.segments[j];
      ctx.lineTo(trainScreenX + seg.x, seg.y);
    }

    ctx.stroke();

    spark.opacity -= 0.2;
    if (spark.opacity <= 0) {
      electricSparks.splice(i, 1);
    }
  }
}





// EXPLOSION BLOCK...

const expImg = imgload("others/explosion.png");
const boom = new Audio("explode.mp3");
let mono = 0.9;


function doExp(x, y, es) {
  let fol = es*mono;
  let sol = es*(1-mono);
  ctx.drawImage(expImg, x + sol/2 , y + sol/2 , fol , fol );
  mono += 0.005;
}





// FPS BLOCK...

let isfps = gett('isfpsc') || true;


function showFPS() {
  if (isfps) {
    showPopup("Already Enable... Time for Gameplay..🔥");
  } else {
    isfps = true;
    showPopup("FPS Meter is Enabled now...😎");
    localStorage.setItem('isfpsc',isfps);
  }

  off('fpsc');
}


function hideFPS() {
  if (isfps) {
    isfps = false;
    showPopup("FPS Meter is Disabled now...😎");
  } else {
    showPopup("Already Disabled... Time for Gameplay..🔥");
    localStorage.setItem('isfpsc',isfps);
  }

  off('fpsc');
}





// SCORE-PROGRESS BLOCK...

let run = 0;
let exp = 0;
let epo = 0;


function progression(xgr, abc) {
  ele("progressBar").style.width = `${(gpGot/requirement) * 100}` + "%";

  ele('score').textContent = `Graphene Collected: ${gpGot}`;

  ele('runnerScore').innerText = `Score: ${run + Math.floor(xgr/50)} || XP: ${epo + exp}`;

  const percent = xgr / abc;
  const track = ele("trackingContainer");
  const train = ele("tracking");

  const trackWidth = track.clientWidth;

  const clampedPercent = Math.min(1, Math.max(0, percent));

  const leftPos = clampedPercent * trackWidth;

  train.style.left = `${leftPos}px`;
}

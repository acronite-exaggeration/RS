
// LOADING BLOCK...

function imgload(s) {
  const img = new Image();
  img.src = s;
  return img;
}


function gett(g) {return localStorage.getItem(g)}


function ele(x) {return document.getElementById(x)}


function on(id, t) {
  const el = ele(id);
  el.style.display = t ? "flex" : "block";

  requestAnimationFrame(() => {
    el.style.transition = "opacity 0.5s ease";
    el.style.opacity = 1;
  });
}


function off(id) {
  const el = ele(id);
  el.style.transition = "opacity 0.5s ease";
  el.style.opacity = 0;
  setTimeout(() => {
    el.style.display = "none";
  }, 550);
}


setTimeout(() => on("menuxBtn",2), 2000);





// IMAGE LOADINGS...

const backx = [
  imgload("bgis/backg000.jpg"),
  imgload("bgis/backg111.jpg"),
  imgload("bgis/backg222.jpg"),
  imgload("bgis/backg333.jpg"),
  imgload("bgis/backg444.jpg"),
];


const trainx = [
  imgload("prototypes/loco000.png"),
  imgload("prototypes/loco111.png"),
  imgload("prototypes/loco222.png"),
  imgload("prototypes/loco333.png"),
  imgload("prototypes/loco444.png"),
  imgload("prototypes/loco555.png"),
];


const monsterx = [
  imgload("prototypes/proto000.png"),
  imgload("prototypes/proto111.png"),
  imgload("prototypes/proto222.png"),
  imgload("prototypes/proto333.png"),
  imgload("prototypes/proto444.png"),
  imgload("prototypes/proto555.png"),
];


const obi = [
  imgload("others/rock.png"),
  imgload("others/barrel.png"),
  imgload("others/crate.jpg"),
  imgload("others/dump.png"),
];


let bgImg = backx[0];
let trainImg = trainx[0];
let monsterImg = monsterx[0];





// INSTRUCTION BLOCK...

const instructions = [
  ["Use <strong>Arrow Keys / A & D</strong> to move", "Press <strong>Space / S / Shift</strong> to switch tracks."],
  ["<strong>M</strong> for Mute-Unmute : <strong>P</strong> for Pause-Resume", "<strong>C</strong> for collecting Graphene...🤑"],
  ["Avoid obstacles or you'll crash...🚧", "Stay ahead of the Graphene Monster...👾"],
  ["Slow down the <strong>Monster</strong> using ADVANCE...", "Collect Minimum Graphene to unlock ADVANCE button...🎯"],
  ["Reaching stations saves checkpoints...🚉", "After dying, press <strong>Continue button</strong> to resume from last checkpoint."],
  ["Access the Sidebar if got confused...☰", "Benefit from <strong>Pause-Continue & Music-Toggle</strong> features..."],
  ["Make top scores and enjoy the GamePlay...!", "Don't forget to share a Feedback & further queries..."]
];


let instruct = 0;


function showInstruction(index) {
  const ludo = instructions[index];
  ele("instructionContent").innerHTML = `<h4>${ludo[0]}</h4><h4>${ludo[1]}</h4>`;

  ele("previous").style.display = index === 0 ? "none" : "block";
  ele ("next").style.display = index === instructions.length - 1 ? "none" : "block";
}


function pastInstruction() {
  if (instruct > 0) {
    instruct--;
    showInstruction(instruct);
    sound.currentTime = '0';
    sound.play();
  }
}


function nextInstruction() {
  if (instruct < instructions.length - 1) {
    instruct++;
    showInstruction(instruct);
    sound.currentTime = '0';
    sound.play();
  }
}


function openInstructionsModal() {
  instruct = 0;
  showInstruction(instruct);
  on('modal');
}





// TRAIN SPEED & MONSTER DIFFICULTY SETTINGS...


let trainMax, acc, fri;
let mup, monsterBase, monsterMax;


function climate() {
  if (!change) return;

  const available = backx.filter(bg => bg !== bgImg);
  if (available.length === 0) return;

  const demo = available[Math.floor(Math.random() * available.length)];

  bgImg = demo;
  setTimeout(() => flash(3), 10);
}


function trEdit(ss, zz=false) {
  const nop = ["Slow...🐢", "Medium...😎", "Fast...💪", "Extreme...⚡"];
  const data = [[6,0.25], [8.5,0.35], [11,0.45], [14,0.55]];

  const datum = data[ss-1];
  trainMax = datum[0];
  acc = datum[1];
  fri = acc - 0.1;

  off('speed');
  const pop = "Train Speed is " + nop[ss-1];
  if (zz) showPopup(pop);
  localStorage.setItem('trEdit',ss);
}


function mrsEdit(koh, vv=false) {
  const ley = ["Easy...✌️", "Medium...😎", "Hard...😈", "Extreme...☠️"];
  const data = [[6,1], [7,1.4], [8,2], [9,2]];

  const datum = data[koh-1];
  monsterBase = datum[0];
  mup = datum[1];
  monsterMax = monsterBase * 2;

  off('diff');
  const pop = "Monster Difficulty is " + ley[koh-1];
  if (vv) showPopup(pop);
  localStorage.setItem('mrsEdit',koh);
}


const [xxx, zzz] = [gett('trEdit'), gett('mrsEdit')];

xxx ? trEdit(+xxx) : trEdit(2);

zzz ? mrsEdit(+zzz) : mrsEdit(2);





// SKIN SELECTION SETTINGS...

let change = false;
let diesel = false;


function usage(imgElement) {
  let q1, path, rank, skin;
  const bed = Array.isArray(imgElement);

  if (bed) {
    path = imgElement[0];
    rank = imgElement[1];
    skin = imgElement[2];
  } else {
    path = imgElement.getAttribute('src');
    rank = +imgElement.getAttribute('rank') || 1;
    skin = +imgElement.getAttribute('skin') || 1;
  }

  if (skin === 1) {
    change = false;
    q1 = "bgData";
    bgImg = backx[rank-1];

  } else if (skin === 2) {
    q1 = "trData";
    trainImg = trainx[rank-1];
    diesel = rank % 2 === 1;

  } else if (skin === 3) {
    q1 = "mrData";
    monsterImg = monsterx[rank-1];

  } else {
    change = true;
    q1 = "bgData";
    climate();
  }

  const allImgs = document.querySelectorAll('img');

  if (bed) {
    allImgs.forEach(img => {
      const src = img.getAttribute('src');
      if (src === path) {
        img.classList.add('selecta');
      }
    });

  } else {
    localStorage.setItem(q1, JSON.stringify([path,rank,skin]));
    allImgs.forEach(im => im.classList.remove("selecta"));
    imgElement.classList.add("selecta");
  }
}


['bgData','trData','mrData'].forEach(dtt => {
  const dtd = JSON.parse(gett(dtt));
  if (!dtd) return;
  usage(dtd);
});





// AUDIO BLOCK...

const music = ele("backgroundMusic");
const sound = new Audio("shift.mp3");
const woosh = new Audio("waste.mp3");
const treat = new Audio("treasure.mp3");
let musicOn = true;


function fadeOutMusic() {
  let vol = music.volume;
  function step() {
    if (vol > 0.02) {
      vol -= 0.02;
      music.volume = vol;
      requestAnimationFrame(step);
    } else {
      music.volume = 0;
      music.pause();
    }
  }
  step();
}


function fadeInMusic() {
  music.play();
  music.volume = 0;
  let fide = setInterval(() => {
    if (music.volume < 0.98) {
      music.volume += 0.02;
    } else {
      music.volume = 1;
      clearInterval(fide);
    }
  }, 25);
}


function musicToggle() {
  musicOn = !musicOn;
  musicOn ? fadeInMusic() : fadeOutMusic();
  ele('musicBtn').textContent = musicOn ? "🔊" : "🔇";
}





// VIDEO BLOCK...

function storyP() {
  off('menu');
  on('storie');
  ele('storyVideo').play();
}


function storyE() {
  ele('storyVideo').pause();
  off('storie');
  on('menu');
}


ele('storyVideo').addEventListener("ended", storyE);

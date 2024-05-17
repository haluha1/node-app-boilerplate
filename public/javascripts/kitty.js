const kittyType = [
    "stripes-kitty",
    "kinako-kitty",
    "midnight-kitty",
    "firefox-kitty",
    "maneki-kitty",
    "valentin-kitty",
    // "ghostpuffs-kitty",
    "psl-kitty",
    "vampiregoth-kitty",
    "kace-kitty",
    "ferris-kitty",
    "sprinkles-kitty"
];
var isInit = false;
function randomKittyType() {
    return kittyType[Math.floor(Math.random() * kittyType.length)];
}
function Lvb() {
    let a = ["kitty-mode-fast", "kitty-mode-medium", "kitty-mode-slow"];
    return a[Math.floor(Math.random() * a.length)]
}
function isLeft() {
    return 0 === Math.floor(2 * Math.random());
}
function addNewKitty() {
    let container = document.querySelector("#header-background");
    let newKitty = document.createElement('div');
    newKitty.classList.add("kitty-canvas");
    newKitty.classList.add(randomKittyType());
    isLeft() && newKitty.classList.add("kitty-left");
    newKitty.classList.add(Lvb());
    container.appendChild(newKitty);
    setTimeout(function (el) {
        el.remove();
    }, 4E4, newKitty);
    return true;
}
function startKitty() {
    let container = document.querySelector("#header-background");
    container.classList.add("basic-corgi-mode");
    let crab = document.createElement('div');
    crab.classList.add("crab-mode");
    container.appendChild(crab);
    addNewKitty();
    let kittyInterval = setInterval(addNewKitty, 2E4);
}
function start() {
    if (isInit) {
        return;
    }
    isInit = true;
    let btr = document.querySelector("#battery");
    btr.addEventListener("animationend", anmEnd);
    btr.classList.add("battery");

    let closeBtn = document.getElementsByClassName("closebtn");
    for (let i = 0; i < closeBtn.length; i++) {
        closeBtn[i].onclick = function () {
            let div = this.parentElement;
            div.style.opacity = "0";
            setTimeout(function () { div.style.display = "none"; }, 600);
        }
    }
}
function anmEnd() {
    let batteryContainer = document.querySelector(".battery-container");
    let messageContainer = document.querySelector(".message-container");
    // batteryContainer.classList.toggle('fade');
    batteryContainer.classList.add('fade');
    // setTimeout(function (el) { el.classList.add('hide'); }, 600, batteryContainer);
    messageContainer.classList.remove("fade");

    console.log("Animation end => Enable kitty mode.");
    startKitty();
}

document.body.addEventListener('click', start);
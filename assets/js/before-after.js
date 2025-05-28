
/**
 * Variables
 */
let array_slider = document.querySelectorAll(".beforeSlider");
let array_before = [...document.querySelectorAll(".before-image")];
let array_beforeImage = array_before.map((el) => {
    return el.getElementsByTagName("img")[0];
});
let array_resizer = document.querySelectorAll(".resizer");
let active = -1; // focused slide

/**
 * Setup main events
 */
document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resetViewport);
document.addEventListener("mouseup", resetViewport);
document.addEventListener("mouseleave", resetViewport);
document.body.addEventListener("mousemove", (e) => {
    move(e, false);
});
document.body.addEventListener("touchmove", (e) => {
    move(e, true);
});

/**
 * Initial function
 */
function init() {
    resetViewport();

    for (let i = 0; i < array_resizer.length; i++) {
        let res = array_resizer[i];

        array_slider[i].addEventListener("mousedown", () => {
            start(res, i);
        });
        array_slider[i].addEventListener("touchstart", () => {
            start(res, i);
        });
        array_slider[i].addEventListener("touchend", () => {
            finish(res, i);
        });
        array_slider[i].addEventListener("touchcancel", () => {
            finish(res, i);
        });
    }
}

/**
 * Resize the viewports
 */
function resetViewport() {
    active = -1;

    for (let j = 0; j < array_slider.length; j++) {
        let width = array_slider[j].offsetWidth;
        array_beforeImage[j].style.width = width + "px";

        array_resizer[j].classList.remove("resize");
    }
}

/**
 * Touch start & Mouse Down function
 */
function start(elem, index) {
    active = index;

    elem.classList.add("resize");
}

/**
 * Touch End & Touch Cancel & Mouse Up function
 */
function finish(elem, index) {
    if (active == -1) return;

    elem.classList.remove("resize");

    active = -1;
}

/**
 * (body element) Touch Move & Mouse Move function
 */
function move(e, touch) {
    if (active == -1) return;

    let x = 0;

    if (touch) x = e.changedTouches[0].pageX - array_slider[active].getBoundingClientRect().left;
    else x = e.pageX - array_slider[active].getBoundingClientRect().left;

    slideIt(x);

    // Cancel default actions
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
}

/**
 * Slide the view
 */
function slideIt(x) {
    let t = Math.max(0, Math.min(x, array_slider[active].offsetWidth));

    array_before[active].style.width = t + "px";
    array_resizer[active].style.left = t + "px";
}
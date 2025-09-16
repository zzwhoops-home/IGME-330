const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// you can use this to make "save points"
ctx.save();

// canvas is stateful, meaning that even if you change it out of scope, it will change permanently
ctx.fillStyle = "#438fe3";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "red";
ctx.fillRect(
    100, 130,
    150, 100
);

// prevent "leakage" of changes
ctx.restore();

ctx.fillRect(20, 20, 50, 50);

ctx.clearRect(100, 100, 75, 50);
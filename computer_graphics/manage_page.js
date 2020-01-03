
//main();
// manage page
function start_line() {
    document.getElementById("line").style.display = "inline";
    document.getElementById("circle").style.display = "none";
    document.getElementById("rectangle").style.display = "none";
    document.getElementById("triangle").style.display = "none";
    document.getElementById("shape").style.display = "none";
}

function start_circle() {
    document.getElementById("circle").style.display = "inline";
    document.getElementById("rectangle").style.display = "none";
    document.getElementById("triangle").style.display = "none";
    document.getElementById("line").style.display = "none";
    document.getElementById("shape").style.display = "none";
}

function start_rectangle() {
    document.getElementById("rectangle").style.display = "inline";
    document.getElementById("triangle").style.display = "none";
    document.getElementById("line").style.display = "none";
    document.getElementById("circle").style.display = "none";
    document.getElementById("shape").style.display = "none";
}

function start_triangle() {
    document.getElementById("triangle").style.display = "inline";
    document.getElementById("line").style.display = "none";
    document.getElementById("circle").style.display = "none";
    document.getElementById("rectangle").style.display = "none";
    document.getElementById("shape").style.display = "none";
}

function start_shape() {
    document.getElementById("shape").style.display = "inline";
    document.getElementById("triangle").style.display = "none";
    document.getElementById("line").style.display = "none";
    document.getElementById("circle").style.display = "none";
    document.getElementById("rectangle").style.display = "none";
}

function end() {
    document.getElementById("triangle").style.display = "none";
    document.getElementById("line").style.display = "none";
    document.getElementById("circle").style.display = "none";
    document.getElementById("rectangle").style.display = "none";
    document.getElementById("shape").style.display = "none";
}

//-----end of manage page-----


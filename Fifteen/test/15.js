var x =  0;
var y = 15;
var speed = 5;
var reqAnimFrame;

function animate() {

    reqAnimFrame = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame
    ;

    reqAnimFrame(animate);

    x += speed;

    if(x >= 400){
        return;
    }

    draw();
}


function draw() {
    var canvas  = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, 500, 170);
    context.fillStyle = "black";
    context.fillRect(x, y, 25, 25);
}

animate();




//function loop() {
//
//    // do stuff
//
//    requestId = window.requestAnimationFrame(loop, canvas);
//}
//
//function start() {
//    if (!requestId) {
//        loop();
//    }
//}
//
//function stop() {
//    if (requestId) {
//        window.cancelAnimationFrame(requestId);
//        requestId = undefined;
//    }
//}
    var holder = document.getElementById('holder');
    var elements = [];
    function fillElements() {
        for (var i = 1; i <= 15; i++){
            elements.push(i);
        }
    }
    fillElements();
    console.log(elements);
    elements.sort(function() {
        return Math.random()-.1;
    }).push(0);
    console.log(elements);


    function draw() {
        holder.innerHTML = '';
        for (var i = 0; i < elements.length; i++){
            if (elements[i] == 0) {
                holder.innerHTML += '<div class="empty">' + elements[i] + '</div>';
            } else {
                holder.innerHTML += '<div>' + elements[i] + '</div>';
            }

        }
    }
    draw();

    var move = {
        up: -4,
        left: -1,
        down: 4,
        right: 1
    };

    function swap(m) {
        elements[elements.indexOf(0)] = elements[m];
        elements[m] = 0;
    }

    swap(4);
    console.log(elements);
    console.log(elements.indexOf(0));
    draw();

    function up() {
        swap(elements.indexOf(0)-4);
        draw();
    }
    function down() {
        swap(elements.indexOf(0)+4);
        draw();
    }
    function right() {
        swap(elements.indexOf(0)+1);
        draw();
    }
    function left() {
        swap(elements.indexOf(0)-1);
        draw();
    }

$(document).on('keydown', function(e) {
    var key = e.keyCode;
    if (key == '37') {
        right();
    } else if (key == '38') {
        down();
    } else if (key == '39') {
        left();
    } else if (key == '40') {
        up();
    }
});

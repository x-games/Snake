$(document).ready(function(){

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var w = canvas.offsetWidth;
    var h = canvas.offsetHeight;

    var cell_width = 10;
    var direction;
    var game_loop = null;
    var food;
    var score;
    var speed = 100;


    var snake_array;


    function init_game() {
        speed = 100;
        direction = 'right';
        create_snake();
        create_food();
        score = 0;

        if(typeof game_loop != 'undefined') {
            clearInterval(game_loop);
        }
        game_loop = setInterval(paint_snake, speed);
    }
    init_game();


    function create_snake() {
        var length = 5;
        snake_array = [];
        for(var i = 0; i < length; i++) {
            snake_array.push({x: i, y:0});
        }
    }

    function create_food() {
        food = {
            x: Math.round(Math.random()*(w-cell_width)/cell_width),
            y: Math.round(Math.random()*(w-cell_width)/cell_width)
        }
    }


    function paint_snake() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(0, 0, w, h);


        var new_x = snake_array[snake_array.length-1].x;
        var new_y = snake_array[snake_array.length-1].y;

        if (direction == 'right') {new_x++}
        else if (direction == 'left') {new_x--}
        else if (direction == 'up') {new_y--}
        else if (direction == 'down') {new_y++}

        if (new_x == -1 || new_x == w/cell_width || new_y == -1 || new_y == h/cell_width || body_collision(new_x,new_y,snake_array)) {
            init_game();
            return;
        }

        if (new_x == food.x && new_y == food.y) {
            var tail = {x: new_x, y: new_y};
            score++;
            create_food();
            clearInterval(game_loop);
            speed -= 5;
            game_loop = setInterval(paint_snake, speed);
        } else {
            var tail = snake_array.shift();
            tail.x = new_x;
            tail.y = new_y;
        }

        snake_array.push(tail);


        for (var i = 0; i < snake_array.length; i++) {
            var snake_cell = snake_array[i];
            paint_cell(snake_cell.x, snake_cell.y);
        }

        paint_cell(food.x, food.y);

        var score_text = 'Score: ' + score;
        ctx.fillText(score_text, 5, h-10);
    }

    function paint_cell(x, y) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
    }

    function body_collision(x, y, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) {
                return true;
            }
        }
        return false;
    }



    $(document).on('keydown', function(e) {
        var key = e.keyCode;
        if (key == '37' && direction != 'right') {
            direction = 'left';
        } else if (key == '38' && direction != 'down') {
            direction = 'up';
        } else if (key == '39' && direction != 'left') {
            direction = 'right';
        } else if (key == '40' && direction != 'up') {
            direction = 'down';
        }
    });


    $('#pause').on('click', function() {
        if(game_loop == null) {
            game_loop = setInterval(paint_snake, speed);
        } else {
            clearInterval(game_loop);
            game_loop = null;
        }

    });


});
$(document).ready(function(){

    // todo don't use strings if it's not neccessary
    var direction = {
        RIGHT : 0,
        LEFT : 1,
        UP : 2,
        DOWN : 3
    };

    function SnakeGame() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.offsetWidth;
        this.h = this.canvas.offsetHeight;

        this.fieldWidth = 45;
        this.fieldHeight = 45;

        this.cell_width = 10;
        this.direction = 'right';
        this.game_loop = null;
        this.food = {};
        this.score = 0;
        this.movingSpeed = 100;

        this.snake_array = [];
    }

    SnakeGame.prototype.init_game = function() {
        this.movingSpeed = 100;
        this.direction = 'right';
        this.create_snake();
        this.create_food();
        this.score = 0;

        //if(typeof this.game_loop != 'undefined') {
        if(this.game_loop) {
            clearInterval(this.game_loop);
        }
        var self = this;
        this.game_loop = setInterval(function(){
            self.paint_snake()
        }, self.movingSpeed);
    };


    SnakeGame.prototype.create_snake = function() {
        var length = 5;
        this.snake_array = [];
        for(var i = 0; i < length; i++) {
            this.snake_array.push({x: i, y:0});
        }
    };

    SnakeGame.prototype.create_food = function() {
        this.food = {
            // todo use logical\graphical coord
            x: Math.round(Math.random()*(this.w-this.cell_width)/this.cell_width),
            y: Math.round(Math.random()*(this.w-this.cell_width)/this.cell_width)
        }
    };


    SnakeGame.prototype.paint_snake = function() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.strokeStyle = 'grey';
        this.ctx.strokeRect(0, 0, this.w, this.h);


        var new_x = this.snake_array[this.snake_array.length-1].x;
        var new_y = this.snake_array[this.snake_array.length-1].y;

        //var map = [
        //    {
        //        x : -1,
        //        y : 0
        //    },
        //    {
        //        x : 1,
        //        y : 0
        //    },
        //    {
        //        x : 0,
        //        y : -1
        //    },
        //    {
        //        x : 0,
        //        y : 1
        //    }
        //
        //];
        //
        //var currentMove = map[this.direction];
        //new_x += currentMove.x;
        //new_y += currentMove.y;

        // todo map this
        if (this.direction == 'right') {new_x++}
        else if (this.direction == 'left') {new_x--}
        else if (this.direction == 'up') {new_y--}
        else if (this.direction == 'down') {new_y++}

        var xOutOfFieldLeft = new_x < 0,
            xOutOfFieldRight = new_x > this.w/this.cell_width - 1,
            yOutOfFieldTop = new_y < 0,
            yOutOfFieldBottom = new_y > this.h/this.cell_width - 1,
            selfTailTouched = this.body_collision(new_x,new_y,this.snake_array);

        if ( xOutOfFieldLeft || xOutOfFieldRight || yOutOfFieldTop || yOutOfFieldBottom || selfTailTouched ) {
            this.init_game();
            return;
        }

        var foodTouched = new_x == this.food.x && new_y == this.food.y;

        var tail;


        // todo separate logic\visual
        if ( foodTouched ) {
            tail = {x: new_x, y: new_y};
            this.score++;
            this.create_food();
            clearInterval(this.game_loop);
            this.movingSpeed -= 5;
            var self = this;
            this.game_loop = setInterval(function(){
                self.paint_snake()
            }, self.movingSpeed);
        } else {
            tail = this.snake_array.shift();
            tail.x = new_x;
            tail.y = new_y;
        }

        this.snake_array.push(tail);


        for (var i = 0; i < this.snake_array.length; i++) {
            var snake_cell = this.snake_array[i];
            this.paint_cell(snake_cell.x, snake_cell.y);
        }

        this.paint_cell(this.food.x, this.food.y);

        var score_text = 'Score: ' + this.score;
        this.ctx.fillText(score_text, 5, this.h-10);
    };

    SnakeGame.prototype.paint_cell = function(x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(x*this.cell_width, y*this.cell_width, this.cell_width, this.cell_width);
        this.ctx.strokeStyle = 'grey';
        this.ctx.strokeRect(x*this.cell_width, y*this.cell_width, this.cell_width, this.cell_width);
    };
    // todo parameters aren't required
    SnakeGame.prototype.body_collision = function(x, y, array) {
        var touched = false;

        // todo while (!touched && i < arr.length)
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) {
                touched = true;
                break;
            }
        }
        return touched;
    };


    var Snake = new SnakeGame();
    Snake.init_game();

    $(document).on('keydown', function(e) {
        var key = e.keyCode;
        // todo map this
        if (key == '37' && Snake.direction != 'right') {
            Snake.direction = 'left';
        } else if (key == '38' && Snake.direction != 'down') {
            Snake.direction = 'up';
        } else if (key == '39' && Snake.direction != 'left') {
            Snake.direction = 'right';
        } else if (key == '40' && Snake.direction != 'up') {
            Snake.direction = 'down';
        }
    });


    $('#pause').on('click', function() {
        // todo start\stop belongs to snake

        if(Snake.game_loop == null) {
            Snake.game_loop = setInterval(function(){
                Snake.paint_snake()
            }, Snake.movingSpeed);
        } else {
            clearInterval(Snake.game_loop);
            Snake.game_loop = null;
        }

    });


});
$(document).ready(function(){

    // todo don't use strings if it's not necessary
    var direction = {
        UP : 0,
        RIGHT : 1,
        DOWN : 2,
        LEFT : 3
    };

    function SnakeGame() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.width;
        this.h = this.canvas.height;

        this.fieldWidth = 45;
        this.fieldHeight = 45;

        this.cell_size = 10;
        this.direction = direction.RIGHT;
        this.game_loop = null;
        this.food = {};
        this.score = 0;
        this.movingSpeed = 100;

        this.snake_array = [];
    }

    SnakeGame.prototype.init_game = function() {
        this.movingSpeed = 100;
        this.direction = direction.RIGHT;
        this.create_snake();
        this.create_food();
        this.score = 0;

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
            x: Math.round(Math.random()*(this.w-this.cell_size)/this.cell_size),
            y: Math.round(Math.random()*(this.h-this.cell_size)/this.cell_size)
        }
    };


    SnakeGame.prototype.paint_snake = function() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.strokeStyle = 'grey';
        this.ctx.strokeRect(0, 0, this.w, this.h);


        var new_x = this.snake_array[this.snake_array.length-1].x;
        var new_y = this.snake_array[this.snake_array.length-1].y;

        var map = [];
        map[direction.UP] = {
                x : 0,
                y : -1
            };

        map[direction.RIGHT] = {
                x : 1,
                y : 0
            };
        map[direction.DOWN] = {
                x : 0,
                y : 1
            };

        map[direction.LEFT]= {
                x : -1,
                y : 0
            };


        var currentMove = map[this.direction];
        new_x += currentMove.x;
        new_y += currentMove.y;

        // todo map this - done
        //if (this.direction == 'right') {new_x++}
        //else if (this.direction == 'left') {new_x--}
        //else if (this.direction == 'up') {new_y--}
        //else if (this.direction == 'down') {new_y++}

        var xOutOfFieldLeft = new_x < 0,
            xOutOfFieldRight = new_x > this.w/this.cell_size - 1,
            yOutOfFieldTop = new_y < 0,
            yOutOfFieldBottom = new_y > this.h/this.cell_size - 1,
            selfTailTouched = this.body_collision();

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

        this.drawScore();
    };

    SnakeGame.prototype.drawScore = function() {
        var score_text = 'Score: ' + this.score;
        this.ctx.fillText(score_text, 5, this.h-10);
    };

    SnakeGame.prototype.paint_cell = function(x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(x*this.cell_size, y*this.cell_size, this.cell_size, this.cell_size);
        this.ctx.strokeStyle = 'grey';
        this.ctx.strokeRect(x*this.cell_size, y*this.cell_size, this.cell_size, this.cell_size);
    };
    // todo parameters aren't required - done
    SnakeGame.prototype.body_collision = function() {
        var touched = false;
        //var i = 0;

        // todo while (!touched && i < arr.length)
        //while (!touched && i < this.snake_array.length-1) {
        //    i++;
        //    if (this.snake_array[i].x == this.snake_array[this.snake_array.length - 1].x
        //        && this.snake_array[i].y == this.snake_array[this.snake_array.length - 1].y) {
        //        touched = true;
        //        break;
        //    }
        //}
        for (var i = 0; i < this.snake_array.length-1; i++) {
            if (this.snake_array[i].x == this.snake_array[this.snake_array.length - 1].x
                && this.snake_array[i].y == this.snake_array[this.snake_array.length - 1].y) {
                touched = true;
                break;
            }
        }
        return touched;
    };

    SnakeGame.prototype.startStopGame = function () {
        var self = this;
        if(this.game_loop == null) {
            this.game_loop = setInterval(function(){
                self.paint_snake()
            }, this.movingSpeed);
        } else {
            clearInterval(this.game_loop);
            this.game_loop = null;
        }
    };


    var Snake = new SnakeGame();
    Snake.init_game();

    var keyMap = {
        RIGHT : '39',
        LEFT : '37',
        UP : '38',
        DOWN : '40'
    };


    // up, right, down, left
    //var code = 39;
    var t = [38, 39, 40, 37];
    //var index = t.indexOf(code);
    //if (index >= 0) {
    //    var opposite = t[(index+2)%4];
    //    if (Snake.direction != opposite){
    //        Snake.direction = index // direction by index
    //    }
    //}
    //
    var map = {
        //37 : function(){
        //    Snake.direction == direction.RIGHT ? Snake.direction = direction.RIGHT : Snake.direction = direction.LEFT;
        //},
        //38 : function(){
        //    Snake.direction == direction.DOWN ? Snake.direction = direction.DOWN : Snake.direction = direction.UP;
        //},
        //39 : function(){
        //    Snake.direction == direction.LEFT ? Snake.direction = direction.LEFT : Snake.direction = direction.RIGHT;
        //},
        //40 : function(){
        //    Snake.direction == direction.UP ? Snake.direction = direction.UP : Snake.direction = direction.DOWN;
        //},
        80 : function(){
            Snake.startStopGame();
        }
    };


    $(document).on('keydown', function(e) {
        var code = parseInt(e.keyCode);
        // todo map this - done

        var newDir = t.indexOf(code),
            diff = Math.abs(newDir - Snake.direction);

        console.log(newDir, 0 == diff % 2);

        if ((diff % 2) != 0) {
            Snake.direction = newDir;
            console.log(Snake.direction);
        }


        if (typeof map[code] == 'function') {
            map[code]();
        }

        //if (key == keyMap.LEFT && Snake.direction != direction.RIGHT) {
        //    Snake.direction = direction.LEFT;
        //} else if (key == keyMap.UP && Snake.direction != direction.DOWN) {
        //    Snake.direction = direction.UP;
        //} else if (key == keyMap.RIGHT && Snake.direction != direction.LEFT) {
        //    Snake.direction = direction.RIGHT;
        //} else if (key == keyMap.DOWN && Snake.direction != direction.UP) {
        //    Snake.direction = direction.DOWN;
        //}
    });


    $('#pause').on('click', function() {
        // todo start\stop belongs to snake - done
        Snake.startStopGame();
    });


});
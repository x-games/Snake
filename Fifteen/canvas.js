function FifteenGame() {
    this.activeAnimation = {
        element : null,
        duration : 200,
        startPosition : {
            x : 0,
            y : 0
        },
        endPosition : {
            x : 0,
            y : 0
        },
        time : 0,
        isActive : false
    };
    this.x = 0;
    this.speed = 5;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.w = this.canvas.width;
    this.h = this.canvas.height;


    this.elements = [];

    this.fieldSize = 16;
    this.sideSize = Math.sqrt(this.fieldSize);
    this.cell_size = 100;

    this.move = {
        up: 0 - this.sideSize,
        left: -1,
        down: this.sideSize,
        right: 1
    };
    this.empty = this.fieldSize - 1;

    this.holder = document.body.appendChild(document.createElement('div'));
}

FifteenGame.prototype.init_game = function() {
    var self = this;

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cb = function(){
        if(!self.activeAnimation.isActive) {
            return;
        }
        if(self.activeAnimation.startPosition.x != self.activeAnimation.endPosition.x ||
            self.activeAnimation.startPosition.y != self.activeAnimation.endPosition.y) {
            if(self.activeAnimation.startPosition.x != self.activeAnimation.endPosition.x) {
                if(self.activeAnimation.startPosition.x < self.activeAnimation.endPosition.x) {
                    self.chips[self.activeAnimation.element].x += self.speed;
                } else {
                    self.chips[self.activeAnimation.element].x -= self.speed;
                }
            } else if(self.activeAnimation.startPosition.y != self.activeAnimation.endPosition.y) {
                if(self.activeAnimation.startPosition.y < self.activeAnimation.endPosition.y) {
                    self.chips[self.activeAnimation.element].y += self.speed;
                } else {
                    self.chips[self.activeAnimation.element].y -= self.speed;
                }
            }
            self.paintGameCells();
        } else {
            self.swap(self.activeAnimation.element, self.empty);
            self.empty = self.activeAnimation.element;
            self.coordinateAbsolute();
            self.activeAnimation.isActive = false;
        }
        requestAnimationFrame(cb);
        console.log(self.chips[self.activeAnimation.element].x);
    };

    $('#canvas').on('click', function(e) {
        var mousePos = self.getMousePos(gameF.canvas, e);
        var message = parseInt(mousePos.x/100) + ',' + parseInt(mousePos.y/100);
        var x = parseInt(mousePos.x/100)*100;
        var y = parseInt(mousePos.y/100)*100;
        console.log(message);
        if (self.isEmptyNear(self.canvasClickedElement(x, y))) {
            self.activeAnimation.isActive = true;
            self.activeAnimation.element = self.canvasClickedElement(x, y);
            self.activeAnimation.startPosition = self.chips[self.activeAnimation.element];
            self.activeAnimation.endPosition = self.chips[self.empty];
        }
        cb();
    });

    this.fillElements();

    if (!this.solvable()) {
        this.swap(0, 1);
    }

    /* uncomment for html*/
    //for (var i = 0; i < this.fieldSize; i++) {
    //    this.holder.appendChild(document.createElement('div'));
    //}
    /**/

    this.nodesArr = this.holder.childNodes;


    $('body').on('click', 'div > div', function() {
        if(self.isCompleted()) {
            self.holder.style.backgroundColor = "gold";
            $('body').off('keydown');
        } else {
            self.moveClick($(this).index());
        }
    });

    this.coordinateAbsolute();
    //this.draw();

    this.paintGameField();





    cb();

    this.paintGameCells();
};

FifteenGame.prototype.animateCell = function() {

    this.reqAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame;

    this.reqAnimFrame(this.animateCell);

    this.x += speed;

    if(this.x = this.chips[this.empty].x) {
        return;
    }

    this.paintGameCells();

};

FifteenGame.prototype.paintGameField = function() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.w, this.h);

    //this.paintGameCells();
};

FifteenGame.prototype.paintGameCells = function() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (var i = 0, cell_text; i < this.fieldSize; i++) {
        cell_text = this.elements[i];
        if(cell_text) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.chips[i].x, this.chips[i].y, 100, 100);
            //this.ctx.fillRect((i%4)*this.cell_size, Math.floor(i / this.sideSize) * this.cell_size, 100, 100);
            this.ctx.strokeStyle = 'grey';
            this.ctx.strokeRect(this.chips[i].x, this.chips[i].y, 100, 100);
            //this.ctx.strokeRect((i%4)*this.cell_size, Math.floor(i / this.sideSize) * this.cell_size, 100, 100);
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(cell_text,
                this.chips[i].x + this.cell_size/2,
                //(i%4)*this.cell_size + this.cell_size/2,
                this.chips[i].y + this.cell_size/2);
            //Math.floor(i / this.sideSize) * this.cell_size + this.cell_size/2);
        } else {
            //this.ctx.fillStyle = 'white';
            //this.ctx.fillRect(this.chips[i].x, this.chips[i].y, 100, 100);
            //this.ctx.strokeStyle = 'grey';
            //this.ctx.strokeRect(this.chips[i].x, this.chips[i].y, 100, 100);
            cell_text = '';
            this.ctx.fillText(cell_text,
                this.chips[i].x + this.cell_size/2,
                this.chips[i].y + this.cell_size/2);
        }
    }
};

FifteenGame.prototype.canvasClickedElement = function(x, y) {
    for(var i = 0; i < this.chips.length; i++) {
        if (this.chips[i].x == x && this.chips[i].y == y) {
            console.log(i);
            return(i);
        }
    }
};

FifteenGame.prototype.isEmptyNear = function(clickIndex) {

    return(clickIndex+1 == this.empty
        || clickIndex-1 == this.empty
        || clickIndex+this.sideSize == this.empty
        || clickIndex-this.sideSize == this.empty);


    //this.paintGameCells();
};

FifteenGame.prototype.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

FifteenGame.prototype.fillElements = function() {
    for(var i = 1; i < this.fieldSize; i++) {
        this.elements.push(i);
    }
    this.elements.sort(function () {
        return Math.random() - .5;
    });
    this.elements.push(0);
};

FifteenGame.prototype.moveClick = function(clickIndex) {

    if(clickIndex+1 == this.empty
        || clickIndex-1 == this.empty
        || clickIndex+this.sideSize == this.empty
        || clickIndex-this.sideSize == this.empty) {
        this.swapElements(clickIndex, this.empty);
        this.empty = clickIndex;
    }
    this.paintGameField();
};

FifteenGame.prototype.swapElements = function(elem1, elem2) {
    this.swap(elem1, elem2);

    if(elem1+1 == elem2) {
        this.holder.childNodes[elem1].style.left = parseInt(this.holder.childNodes[elem1].style.left) + 100 + 'px';
        this.holder.childNodes[elem2].style.left = parseInt(this.holder.childNodes[elem2].style.left) - 100 + 'px';
    } else if(elem1-1 == elem2) {
        this.holder.childNodes[elem1].style.left = parseInt(this.holder.childNodes[elem1].style.left) - 100 + 'px';
        this.holder.childNodes[elem2].style.left = parseInt(this.holder.childNodes[elem2].style.left) + 100 + 'px';
    } else if(elem1+this.sideSize == elem2) {
        this.holder.childNodes[elem1].style.top = parseInt(this.holder.childNodes[elem1].style.top) + 100 + 'px';
        this.holder.childNodes[elem2].style.top = parseInt(this.holder.childNodes[elem2].style.top) - 100 + 'px';
    } else if(elem1-this.sideSize == elem2) {
        this.holder.childNodes[elem1].style.top = parseInt(this.holder.childNodes[elem1].style.top) - 100 + 'px';
        this.holder.childNodes[elem2].style.top = parseInt(this.holder.childNodes[elem2].style.top) + 100 + 'px';
    }

    var self = this;
    setTimeout(function(){
        var clonedElement1 = self.holder.childNodes[elem1].cloneNode(true);
        var clonedElement2 = self.holder.childNodes[elem2].cloneNode(true);

        self.holder.childNodes[elem2].parentNode.replaceChild(clonedElement1, self.holder.childNodes[elem2]);
        self.holder.childNodes[elem1].parentNode.replaceChild(clonedElement2, self.holder.childNodes[elem1]);
    }, 100);
};

FifteenGame.prototype.draw = function() {
    for (var i = 0; i < this.fieldSize; i++) {
        this.holder.childNodes[i].style.top = this.chips[i].y + 'px';
        this.holder.childNodes[i].style.left = this.chips[i].x + 'px';
        this.holder.childNodes[i].textContent = this.elements[i];
        this.holder.childNodes[i].style.visibility = this.elements[i] ? 'visible' : 'hidden';
    }
};

FifteenGame.prototype.coordinateAbsolute = function() {
    var chipPxSize = this.cell_size; //px
    this.chips = [];

    for (var i = 0; i < this.fieldSize; i++) {
        this.chips.push({
            x : (i % this.sideSize) * chipPxSize,
            y : Math.floor(i / this.sideSize) * chipPxSize
        })
    }
};

FifteenGame.prototype.isCompleted = function() {
    return !this.elements.some(function (item, i) {
        return item > 0 && item - 1 !== i;
    });
};

FifteenGame.prototype.go = function(move) {
    var index = this.empty + move;
    if (!this.elements[index]) {
        return false;
    }
    if (move == this.move.left || move == this.move.right) {
        if (Math.floor(this.empty / this.sideSize) !== Math.floor(index / this.sideSize)) {
            return false;
        }
    }
    this.swap(index, this.empty);
    this.empty = index;

    this.draw();
};

FifteenGame.prototype.swap = function(i1, i2) {
    var t = this.elements[i1];
    this.elements[i1] = this.elements[i2];
    this.elements[i2] = t;



    //var tt = this.chips[i1];
    //console.log(this.chips[i1]);
    //this.chips[i1] = this.chips[i2];
    //this.chips[i2] = tt;
    // todo move chip to empty cell's position
};

FifteenGame.prototype.solvable = function() {
    for (var kDisorder = 0, i = 1; i < this.elements.length - 1; i++)
for (var j = i - 1; j >= 0; j--) {
    if (this.elements[j] > this.elements[i]) {
        kDisorder++;
    }
}
return !(kDisorder % 2);
};

var gameF = new FifteenGame();
gameF.init_game();

//(function animloop(){
//    requestAnimFrame(animloop);
//    gameF.paintGameCells();
//})();
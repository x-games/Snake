function FifteenGame() {

    var self = this;

    this.elements = [];
    this.clicked_index = undefined;

    this.holder = document.getElementById('holder');
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

}

FifteenGame.prototype.init_game = function() {
    var self = this;

    this.fillElements();

    if (!this.solvable()) {
        this.swap(0, 1);
    }

    this.callback = function(x,y) {
        self.click(x,y);
    };

    this.drawer = new CanvasDrawer(this.elements, this.callback);
    //this.drawer = new HTMLDrawer(this.elements, this.callback);

    this.draw(this.clicked_index);
};

FifteenGame.prototype.click = function(x, y) {
    x = event.clientX;
    y = event.clientY;

    var numb = parseInt(x/this.cell_size) + (parseInt(y/this.cell_size))*4;
    this.clicked_index = numb;

    console.log('logic: ', parseInt(x/this.cell_size), parseInt(y/this.cell_size));
    console.log('coord: ',parseInt(x/this.cell_size)*this.cell_size, parseInt(y/this.cell_size)*this.cell_size);
    console.log('elements: ', numb);
    console.log('================');

    if(this.isEmptyNear(numb)) {
        this.swap(numb, this.empty);
        this.empty = numb;
        this.draw(this.clicked_index);
    }
};

FifteenGame.prototype.draw = function(clicked) {
    this.drawer.draw(clicked);
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

FifteenGame.prototype.solvable = function() {
    for (var kDisorder = 0, i = 1; i < this.elements.length - 1; i++)
        for (var j = i - 1; j >= 0; j--) {
            if (this.elements[j] > this.elements[i]) {
                kDisorder++;
            }
        }
    return !(kDisorder % 2);
};

FifteenGame.prototype.swap = function(i1, i2) {
    var t = this.elements[i1];
    this.elements[i1] = this.elements[i2];
    this.elements[i2] = t;
};

FifteenGame.prototype.coordinateAbsolute = function() {
    this.chips = [];

    for (var i = 0; i < this.fieldSize; i++) {
        this.chips.push({
            x : (i % this.sideSize) * this.cell_size,
            y : Math.floor(i / this.sideSize) * this.cell_size
        })
    }
};

FifteenGame.prototype.isCompleted = function() {
    return !this.elements.some(function (item, i) {
        return item > 0 && item - 1 !== i;
    });
};

FifteenGame.prototype.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

FifteenGame.prototype.isEmptyNear = function(clickIndex) {
    return(clickIndex+1 == this.empty
    || clickIndex-1 == this.empty
    || clickIndex+this.sideSize == this.empty
    || clickIndex-this.sideSize == this.empty);
};


function CanvasDrawer(elem, callback) {
    var self = this;

    this.elements = elem.slice();
    this.fieldSize = 16;
    this.sideSize = Math.sqrt(this.fieldSize);
    this.cell_size = 100;

    this.callback = callback;
    this.empty = this.fieldSize - 1;

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
    this.speed = 5;

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.canvas.addEventListener('click', function() {
        var x = 0,
            y = 0;
        self.callback(x,y);
    });

    this.createChips();

    this.drawField();
}

CanvasDrawer.prototype.draw = function(clicked) {
    var self = this;

    var cb = function() {
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
            self.drawCells();
        } else {
            self.swap(self.activeAnimation.element, self.empty);
            self.empty = self.activeAnimation.element;
            self.createChips();
            self.activeAnimation.isActive = false;
        }
        requestAnimationFrame(cb);
    };

    if(clicked + 1) {
        if (self.isEmptyNear(clicked)) {
            self.activeAnimation.isActive = true;
            self.activeAnimation.element = clicked;
            self.activeAnimation.startPosition = self.chips[self.activeAnimation.element];
            self.activeAnimation.endPosition = self.chips[self.empty];
        }
        cb();
    } else {
        this.drawCells();
    }
};

CanvasDrawer.prototype.drawField = function() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(0, 0, this.w, this.h);
};

CanvasDrawer.prototype.drawCells = function() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    for (var i = 0, cell_text; i < this.fieldSize; i++) {
        cell_text = this.elements[i];
        if(cell_text) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.chips[i].x, this.chips[i].y, 100, 100);
            this.ctx.strokeStyle = 'grey';
            this.ctx.strokeRect(this.chips[i].x, this.chips[i].y, 100, 100);
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(cell_text,
                this.chips[i].x + this.cell_size/2,
                this.chips[i].y + this.cell_size/2);
        } else {
            cell_text = '';
            this.ctx.fillText(cell_text,
                this.chips[i].x + this.cell_size/2,
                this.chips[i].y + this.cell_size/2);
        }
    }
};

CanvasDrawer.prototype.createChips = function() {
    this.chips = [];

    for (var i = 0; i < this.fieldSize; i++) {
        this.chips.push({
            x : (i % this.sideSize) * this.cell_size,
            y : Math.floor(i / this.sideSize) * this.cell_size
        })
    }
};

CanvasDrawer.prototype.isEmptyNear = function(clickIndex) {
    return(clickIndex+1 == this.empty
    || clickIndex-1 == this.empty
    || clickIndex+this.sideSize == this.empty
    || clickIndex-this.sideSize == this.empty);
};

CanvasDrawer.prototype.swap = function(i1, i2) {
    var t = this.elements[i1];
    this.elements[i1] = this.elements[i2];
    this.elements[i2] = t;
};


function HTMLDrawer(elem, callback) {
    var self = this;

    this.elements = elem;
    this.fieldSize = 16;
    this.sideSize = Math.sqrt(this.fieldSize);
    this.cell_size = 100;

    this.callback = callback;

    this.holder = document.getElementById('holder');
    this.empty = this.fieldSize - 1;

    for (var i = 0; i < this.fieldSize; i++) {
        this.holder.appendChild(document.createElement('div'));
    }

    this.holder.addEventListener('click', function() {
        var x = 0,
            y = 0;
        self.callback(x,y);
    });

    this.coordinateAbsolute();
}

HTMLDrawer.prototype.draw = function(clicked) {
    if(clicked + 1) {
        if(clicked+1 == this.empty) {
            this.holder.childNodes[clicked].style.left = parseInt(this.holder.childNodes[clicked].style.left) + 100 + 'px';
            this.holder.childNodes[this.empty].style.left = parseInt(this.holder.childNodes[this.empty].style.left) - 100 + 'px';
        } else if(clicked-1 == this.empty) {
            this.holder.childNodes[clicked].style.left = parseInt(this.holder.childNodes[clicked].style.left) - 100 + 'px';
            this.holder.childNodes[this.empty].style.left = parseInt(this.holder.childNodes[this.empty].style.left) + 100 + 'px';
        } else if(clicked+this.sideSize == this.empty) {
            this.holder.childNodes[clicked].style.top = parseInt(this.holder.childNodes[clicked].style.top) + 100 + 'px';
            this.holder.childNodes[this.empty].style.top = parseInt(this.holder.childNodes[this.empty].style.top) - 100 + 'px';
        } else if(clicked-this.sideSize == this.empty) {
            this.holder.childNodes[clicked].style.top = parseInt(this.holder.childNodes[clicked].style.top) - 100 + 'px';
            this.holder.childNodes[this.empty].style.top = parseInt(this.holder.childNodes[this.empty].style.top) + 100 + 'px';
        }

        var self = this;
        setTimeout(function(){
            var clonedElement1 = self.holder.childNodes[clicked].cloneNode(true);
            var clonedElement2 = self.holder.childNodes[self.empty].cloneNode(true);

            self.holder.childNodes[self.empty].parentNode.replaceChild(clonedElement1, self.holder.childNodes[self.empty]);
            self.holder.childNodes[clicked].parentNode.replaceChild(clonedElement2, self.holder.childNodes[clicked]);
            self.empty = clicked;
        }, 100);
    } else {
        for (var i = 0; i < this.fieldSize; i++) {
            this.holder.childNodes[i].style.top = Math.floor(i / this.sideSize) * this.cell_size + 'px';
            this.holder.childNodes[i].style.left = (i % this.sideSize) * this.cell_size + 'px';
            this.holder.childNodes[i].textContent = this.elements[i];
            this.holder.childNodes[i].style.visibility = this.elements[i] ? 'visible' : 'hidden';
        }
    }
};

HTMLDrawer.prototype.coordinateAbsolute = function() {
    this.chips = [];

    for (var i = 0; i < this.fieldSize; i++) {
        this.chips.push({
            x : (i % this.sideSize) * this.cell_size,
            y : Math.floor(i / this.sideSize) * this.cell_size
        })
    }
};


var Game = new FifteenGame();
Game.init_game();
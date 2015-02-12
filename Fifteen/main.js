function FifteenGame() {
    this.elements = [];
    this.nodesArr = [];

    this.fieldSize = 25;
    this.sideSize = Math.sqrt(this.fieldSize);

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

    this.fillElements();

    if (!this.solvable()) {
        this.swap(0, 1);
    }

    for (var i = 0; i < this.fieldSize; i++) {
        this.holder.appendChild(document.createElement('div'));
    }

    this.nodesArr = this.holder.childNodes;

    var self = this;
    //$('body').on('keydown', function (e) {
    //    if (self.go(self.move[{39: 'left', 37: 'right', 40: 'up', 38: 'down'}[e.keyCode]])) {
    //        if (self.isCompleted()) {
    //            self.holder.style.backgroundColor = "gold";
    //            $('body').off('keydown');
    //        }
    //    }
    //});

    $('body').on('click', 'div > div', function() {
        if(self.isCompleted()) {
            self.holder.style.backgroundColor = "gold";
            $('body').off('keydown');
        } else {
            self.moveClick($(this).index());
        }
    });

    this.coordinateAbsolute();
    this.draw();
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
};

FifteenGame.prototype.swapElements = function(element1, element2) {
    this.swap(element1, element2);

    if(element1+1 == element2) {
        this.holder.childNodes[element1].style.left = parseInt(this.holder.childNodes[element1].style.left) + 100 + 'px';
        this.holder.childNodes[element2].style.left = parseInt(this.holder.childNodes[element2].style.left) - 100 + 'px';
    } else if(element1-1 == element2) {
        this.holder.childNodes[element1].style.left = parseInt(this.holder.childNodes[element1].style.left) - 100 + 'px';
        this.holder.childNodes[element2].style.left = parseInt(this.holder.childNodes[element2].style.left) + 100 + 'px';
    } else if(element1+this.sideSize == element2) {
        this.holder.childNodes[element1].style.top = parseInt(this.holder.childNodes[element1].style.top) + 100 + 'px';
        this.holder.childNodes[element2].style.top = parseInt(this.holder.childNodes[element2].style.top) - 100 + 'px';
    } else if(element1-this.sideSize == element2) {
        this.holder.childNodes[element1].style.top = parseInt(this.holder.childNodes[element1].style.top) - 100 + 'px';
        this.holder.childNodes[element2].style.top = parseInt(this.holder.childNodes[element2].style.top) + 100 + 'px';
    }

    var self = this;
    setTimeout(function(){
        var clonedElement1 = self.holder.childNodes[element1].cloneNode(true);
        var clonedElement2 = self.holder.childNodes[element2].cloneNode(true);


        self.holder.childNodes[element2].parentNode.replaceChild(clonedElement1, self.holder.childNodes[element2]);
        self.holder.childNodes[element1].parentNode.replaceChild(clonedElement2, self.holder.childNodes[element1]);
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
    var chipPxSize = 100; //px
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




////todo init function
//var Fifteen = {
//    // todo make field size constant
//    move: {
//        up: -4,
//        left: -1,
//        down: 4,
//        right: 1
//    },
//    // todo make filling func
//    elements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].sort(function () {
//        return Math.random() - .5;
//    }).concat(0),
//    empty: 15, //todo
//    isCompleted: function () { // todo map, reduce
//        return !this.elements.some(function (item, i) {
//            return item > 0 && item - 1 !== i;
//        });
//    },
//    go: function (move) {
//        var index = this.empty + move;
//        if (!this.elements[index]) {
//            return false;
//        }
//        if (move == this.move.left || move == this.move.right) {
//            if (Math.floor(this.empty / 4) !== Math.floor(index / 4)) {
//                return false;
//            }
//        }
//        this.swap(index, this.empty);
//        this.empty = index;
//        return true;
//    },
//    swap: function (i1, i2) {
//        var t = this.elements[i1];
//        this.elements[i1] = this.elements[i2];
//        this.elements[i2] = t;
//    },
//    solvable: function () {
//        for (var kDisorder = 0, i = 1; i < this.elements.length - 1; i++)
//            for (var j = i - 1; j >= 0; j--) {
//                if (this.elements[j] > this.elements[i]) {
//                    kDisorder++;
//                }
//            }
//        return !(kDisorder % 2);
//    }
//};
//if (!Fifteen.solvable()) {
//    Fifteen.swap(0, 1);
//}
//var holder = document.body.appendChild(document.createElement('div'));
//for (var i = 0; i < 16; i++) {
//    holder.appendChild(document.createElement('div'));
//}
//$('body').on('keydown', function (e) {
//    if (Fifteen.go(Fifteen.move[{39: 'left', 37: 'right', 40: 'up', 38: 'down'}[e.keyCode]])) {
//        draw();
//        if (Fifteen.isCompleted()) {
//            holder.style.backgroundColor = "gold";
//            window.removeEventListener('keydown', arguments.callee);
//        }
//    }
//});
//draw();
//function draw() {
//    for (var i = 0; i < 16; i++) {
//        holder.childNodes[i].textContent = Fifteen.elements[i];
//        holder.childNodes[i].style.visibility = Fifteen.elements[i] ? 'visible' : 'hidden';
//    }
//}
//
//var fieldSize = 400, //px
//    chipSize = fieldSize / 4,
//    chips = [];
//
//for (var i = 0; i < 16; i++) {
//    chips.push({
//        x : (i % 4) * chipSize,
//        y : Math.floor(i / 4) * chipSize
//    })
//}
//console.log(chips);
/*  demo.js 
    MIT License

    Set up the demo page for the A* Search
*/
/* global Graph, astar, $ */

const obstacles = [
    [30, 59, 47, 122, 105, 30, 31, 32, 33, 34, 35], // y = 1
    [33, 79, 89, 141, 34, 57, 186, 30, 31, 32, 33, 34, 35], // y = 2
    [52, 3, 48, 19, 87, 34, 103, 176, 30, 31, 32, 33, 34, 35], // y = 3
    [33, 22, 67, 106, 5, 165, 112, 96, 14, 53, 116], // y = 4
    [8, 98, 144, 86, 168, 78, 93], // y = 5
    [42, 122, 141, 77, 138, 142,], // y = 6
    [9, 121, 133, 146, 66, 141, 142, 115,], // y = 7
    [19, 148, 1, 92, 52, 160, 142, 166, 50, 51, 52, 53, 30, 31, 32, 33, 34, 35, 115,], // y = 8
    [49, 159, 66, 62, 147, 174, 142, 160, , 50, 51, 52, 53, 30, 31, 32, 33, 34, 35, 115,], // y = 9
    [5, 112, 11, 141, 179, 142, 50, 51, 52, 53, 28, 160, 32, 163, 30, 30, 31, 32, 33, 34, 35, 115,], // y = 10
    [18, 152, 89, 18, 92, 4, 142, 95, 148, 160, 51, 52, 53, 115, 30, 31, 32, 33, 34, 35], // y = 11
    [52, 67, 73, 159, 72, 53, 142, 37, 160, 144, 115, 50, 51, 52, 53, , 30, 31, 32, 33, 34, 35], // y = 12
    [138, 81, 75, 159, 112, 85, 32, 160, 16, 115], // y = 13
    [34, 55, 139, 111, 84, 77, 115], // y = 14
    [87, 110, 50, 92, 120, 179, 115], // y = 15
    [56, 51, 39, 5, 137, 16, 157, 115], // y = 16
    [48, 30, 57, 34, 41, 161, 116, 115], // y = 17
    [32, 31, 96, 50, 99, 85, 41, 137, 8, 88, 47, 111, 115], // y = 18
    [133, 138, 18, 20, 40, 99, 33, 46, 115],  // y = 19
    [], // y = 20
];

hiddenObstacles = [[] // y = 1
    , [141] // y = 2
    , [141] // y = 3
    , [141, 19] // y = 4
    , [141, 19] // y = 5
    , [19] // y = 6
    , [19, 66] // y = 7
    , [] // y = 8
    , [] // y = 9
    , [] // y = 10
    , [] // y = 11
    , [] // y = 12
    , [] // y = 13
    , [] // y = 14
    , [] // y = 15
    , [] // y = 16
    , [] // y = 17
    , [] // y = 18
    , [] // y = 19
    , [] // y = 20
];

var winds = [
    //	Center: [4, 11], wind from: south, strength: 8, diameter: 8.
    {x: [0, 12], y: [3, 20], strength: 10, directionFrom: "south"},
    // Center: [10, 50], wind from: east, strength: 8, diameter: 8.
    {x: [2, 18], y: [42, 58], strength: 1, directionFrom: "east"},
    // Center: [2, 86], wind from: west, strength: 10, diameter: 10.
    {x: [0, 12], y: [76, 96], strength: 10, directionFrom: "west"}, 
    // Center: [3, 160], wind from: north, strength: 2, diameter: 8.
    {x: [0, 11], y: [152, 168], strength: 2, directionFrom: "north"},
    // Center: [5, 135], wind from: east, strength: 9, diameter: 8.
    {x: [0, 13], y: [127, 143], strength: 9, directionFrom: "east"},
    //Center: [16, 150], wind from: west, strength: 6, diameter: 8.
    {x: [8, 20], y: [142, 158], strength: 6, directionFrom: "west"},
    // Center: [20, 40], wind from: south, strength: 10, diameter: 4.
    {x: [16, 20], y: [36, 44], strength: 10, directionFrom: "south"},
    // Center: [3, 160], wind from: north, strength: 2, diameter: 8.
    {x: [0, 11], y: [152, 168], strength: 2, directionFrom: "north"},
]

function getWinds(x,y){
    for (let i = 0; i < winds.length; i++) {
        const wind = winds[i];
        if (x >= wind.x[0] && x <= wind.x[1] && y >= wind.y[0] && y <= wind.y[1]) {
            return wind;
        }
    }
    return null;
}

var WALL = 0,
    performance = window.performance;

$(function () {

    var $grid = $("#search_grid"),
        $selectWallFrequency = $("#selectWallFrequency"),
        $checkDebug = $("#checkDebug"),
        $searchDiagonal = $("#searchDiagonal"),
        $checkClosest = $("#checkClosest");

    var opts = {
        wallFrequency: $selectWallFrequency.val(),
        gridHeight: 20,
        gridWidth: 190,
        debug: $checkDebug.is("checked"),
        diagonal: $searchDiagonal.is("checked"),
        closest: $checkClosest.is("checked")
    };

    var grid = new GraphSearch($grid, opts, astar.search);

    $("#btnGenerate").click(function () {
        grid.initialize();
    });

    $selectWallFrequency.change(function () {
        grid.setOption({ wallFrequency: $(this).val() });
        grid.initialize();
    });



    $checkDebug.change(function () {
        grid.setOption({ debug: $(this).is(":checked") });
    });

    $searchDiagonal.change(function () {
        var val = $(this).is(":checked");
        grid.setOption({ diagonal: val });
        grid.graph.diagonal = val;
    });

    $checkClosest.change(function () {
        grid.setOption({ closest: $(this).is(":checked") });
    });

    $("#generateWeights").click(function () {
        if ($("#generateWeights").prop("checked")) {
            $('#weightsKey').slideDown();
        } else {
            $('#weightsKey').slideUp();
        }
    });

});

var css = { start: "start", finish: "finish", wall: "wall", active: "active" };

function GraphSearch($graph, options, implementation) {
    this.$graph = $graph;
    this.search = implementation;
    this.opts = $.extend({ wallFrequency: 0.1, debug: true }, options);
    this.initialize();
}
GraphSearch.prototype.setOption = function (opt) {
    this.opts = $.extend(this.opts, opt);
    this.drawDebugInfo();
};
GraphSearch.prototype.initialize = function () {
    this.grid = [];
    var self = this,
        nodes = [],
        $graph = this.$graph;

    $graph.empty();

    var cellWidth = 10,  // -2 for border
        cellHeight = 10,
        $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight),
        startSet = false;
        //Set variable to the value of the checkbox with id hiddenWalls

    var showHiddenWalls = $("#hiddenWalls").prop("checked")

    for (var x = 0; x < 20; x++) {
        var $row = $("<div class='clear' />"),
            nodeRow = [],
            gridRow = [];

        for (var y = 0; y < 190; y++) {
            var id = "cell_" + x + "_" + y,
            $cell = $cellTemplate.clone();
            $cell.attr("id", id).attr("x", x).attr("y", y);
            $row.append($cell);
            gridRow.push($cell);

            //Mark start and enpoint visually
            if(x == 9 && y == 7 || x==8 && y==175){
                $cell.addClass('anchor');
            }
            
            var isWall = 1;

            if (obstacles[x].includes(y)) {
                isWall = 0;
                $cell.addClass(css.wall);
            }
            if (showHiddenWalls && hiddenObstacles[x].includes(y)) {
                $cell.addClass('hiddenWall');
                isWall = 0;
            }

            if (isWall === 0) {
                nodeRow.push(WALL);
            }
            else {
                var cell_weight = getWinds(x,y) ? (getWinds(x,y).strength) : 5;
                nodeRow.push(cell_weight);
                $cell.addClass('weight' + cell_weight);
                if ($("#displayWeights").prop("checked")) {
                    $cell.html(cell_weight);
                }
                if (!startSet) {
                    $cell.addClass(css.start);
                    startSet = true;
                }
                var w = getWinds(x,y);

                if(w){
                    $cell.addClass('wind');
                    $cell.addClass(w.directionFrom);
                }
            }
        }
        $graph.append($row);

        this.grid.push(gridRow);
        nodes.push(nodeRow);
    }

    this.graph = new Graph(nodes);

    // bind cell event, set start/wall positions
    this.$cells = $graph.find(".grid_item");
    this.$cells.click(function () {
        self.cellClicked($(this));
    });
};
GraphSearch.prototype.cellClicked = function ($cell) {

    var end;
    //If the checkbox with class setStart is checked, set the start position
    if ($('#setStart').is(':checked')) {
        this.$cells.removeClass(css.start);
        $cell.addClass("start");
        $('#setStart').prop('checked', false);
        start = this.nodeFromElement($cell);
    } else {
        end = this.nodeFromElement($cell);
        this.$cells.removeClass(css.finish);
        $cell.addClass("finish");
    }
    if ($cell.hasClass(css.wall) || $cell.hasClass(css.start)) {
        return;
    }


    var $start = this.$cells.filter("." + css.start),
        start = this.nodeFromElement($start);

    var sTime = performance ? performance.now() : new Date().getTime();

    var path = this.search(this.graph, start, end, {
        closest: this.opts.closest
    });
    var fTime = performance ? performance.now() : new Date().getTime(),
        duration = (fTime - sTime).toFixed(2);

    if (path.length === 0) {
        $("#message").text("couldn't find a path (" + duration + "ms)");
        this.animateNoPath();
    }
    else {
        $("#message").text("search took " + duration + "ms.");
        this.drawDebugInfo();
        this.animatePath(path);
    }
};
GraphSearch.prototype.drawDebugInfo = function () {
    this.$cells.html(" ");
    var that = this;
    if (this.opts.debug) {
        that.$cells.each(function () {
            var node = that.nodeFromElement($(this)),
                debug = false;
            if (node.visited) {
                debug = "F: " + node.f + "<br />G: " + node.g + "<br />H: " + node.h;
            }

            if (debug) {
                $(this).html(debug);
            }
        });
    }
};
GraphSearch.prototype.nodeFromElement = function ($cell) {
    return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
};
GraphSearch.prototype.animateNoPath = function () {
    var $graph = this.$graph;
    var jiggle = function (lim, i) {
        if (i >= lim) { $graph.css("top", 0).css("left", 0); return; }
        if (!i) i = 0;
        i++;
        $graph.css("top", Math.random() * 6).css("left", Math.random() * 6);
        setTimeout(function () {
            jiggle(lim, i);
        }, 5);
    };
    jiggle(15);
};
GraphSearch.prototype.animatePath = function (path) {
    var grid = this.grid,
        timeout = 1000 / grid.length,
        elementFromNode = function (node) {
            return grid[node.x][node.y];
        };

    var self = this;
    // will add start class if final
    var removeClass = function (path, i) {
        if (i >= path.length) { // finished removing path, set start positions
            return setStartClass(path, i);
        }
        // elementFromNode(path[i]).removeClass(css.active);
        setTimeout(function () {
            removeClass(path, i + 1);
        }, timeout * path[i].getCost());
    };
    var setStartClass = function (path, i) {
        if (i === path.length) {
            self.$graph.find("." + css.start).removeClass(css.start);
            elementFromNode(path[i - 1]).addClass(css.start);
        }
    };
    var addClass = function (path, i) {
        if (i >= path.length) { // Finished showing path, now remove
            return removeClass(path, 0);
        }
        elementFromNode(path[i]).addClass(css.active);
        setTimeout(function () {
            addClass(path, i + 1);
        }, timeout * path[i].getCost());
    };

    addClass(path, 0);
    this.$graph.find("." + css.start).removeClass(css.start);
    this.$graph.find("." + css.finish).removeClass(css.finish).addClass(css.start);
};


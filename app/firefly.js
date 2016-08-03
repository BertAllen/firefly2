angular.module("MasterController", [])
    .controller("FireflyController", function ($scope, $interval) {
    $scope.btnText = "Start";

    $scope.redish = true;
    $scope.greenish = true;
    $scope.blueish = true;
    $scope.iterations = 0;
    //color layer --v

    $scope.quilt = [];
    var data = [];
    $scope.colorLayer = function () {
        //populating the grid    
        for (var x = 0; x < 80; x++) {
            $scope.quilt[x] = [];
            for (var y = 0; y < 80; y++) {
                var obj = {
                    red: Math.floor(Math.random() * 256),
                    green: Math.floor(Math.random() * 256),
                    blue: Math.floor(Math.random() * 256),
                    neighbors: [],
                    xx: x,
                    yy: y,
                }
                obj.netColor = $scope.colorConverter(obj);
                $scope.quilt[x][y] = obj;
                data.push($scope.quilt[x][y]);
                // $scope.drawMe(obj.netColor);

            }
        }
        dThreeDraw(data);
        //wiring the grid
        for (var x = 0; x < 80; x++) {
            for (var y = 0; y < 80; y++) {
                for (var a = -1; a < 2; a++) {
                    for (var b = -1; b < 2; b++) {
                        if (a == 0 && b == 0) { b = 1 }
                        var m = x + a;
                        var n = y + b;
                        if (m == -1) { m = 79 }
                        if (m == 80) { m = 0 }
                        if (n == -1) { n = 79 }
                        if (n == 80) { n = 0 }
                        $scope.quilt[x][y].neighbors.push($scope.quilt[m][n]);
                    }
                }
            }
        }
        window.quilt = $scope.quilt; // use to view quilt values
        return $scope.quilt;
    }//end of colorLayer function

    //syncron --v      package com.Atavia;
    $scope.syncron = function (obj) {
        var color = ["red", "green", "blue"]
        //here is the syncro logic
        for (n = 0; n < 3; n++) {
            var tint = color[n];
            // if (color != "red" && color != "green" && color != "blue") {
            //     return;
            // }
            var blockValue = 0;
            //short[] test = new short[1];
            var buddies = 0;
            for (var i = 0; i < 8; i++) {
                var test = obj.neighbors[i][tint] - obj[tint];
                var flag = 0;
                if (test < -128) {
                    blockValue += 256;
                    flag = 1;
                    ++buddies;
                }
                if (test > 128) {
                    blockValue -= 256;
                    flag = 1;
                    --buddies;
                }
                blockValue += obj.neighbors[i][tint];
                if (flag == 0) {
                    if(test != 0){
                    if (test < 0) {
                        --buddies;
                    } else {
                        ++buddies;
                    }
                    }
                }
            }
            var average = blockValue / 8;
            //how to react to syncro logic result
            //public SyncroLogicResult() {
            var result = obj[tint];
            //if (average-exam[0] ==0); {result = exam[0];} <<--this line not needed
            // if (average - result <= 0 && average - result > -51 && buddies <= 0) {
                
            // code to make the color less as result --v

            if (buddies < 0) {
                result -= 1;
            }
            if (buddies < -4) {
                result -= 1;
            }
            // if (average - obj[tint] < 0) {
            //     result -= 1
            // }

            if (result < 0) {
                result += 256;
            }

            // code to make the color greater as result --v
            // if (average - result >= 0 && average - result < 51 && buddies >= 0) {

            if (buddies > 0) {
                result += 1;
            }
            if (buddies > 4) {
                result += 1;
            }
            // if (average - obj[tint] > 0) {
            //     result += 1
            // }
            if (result > 255) {
                result -= 256;
            }

            // if (average - result >= 51 && average - result < 101 && buddies >= 0) {
            //     result += 2;
            //     if (buddies > 0) {
            //         if (buddies > 4) {
            //             result += 2;
            //         } else {
            //             result += 1
            //         }
            //     }
            //     if (result > 255) {
            //         result -= 256;
            //     }
            // }
            //return;//code here needs to take care of the "no change" case 
            obj[tint] = result;
        }
        return;
    }// end of syncron function

    $scope.nightTime = function () {
        $('#field').empty();
        if ($scope.btnText === "Start") {
            $scope.btnText = "Continue";
            // $scope.colorLayer();
        }
        // else {
        //     $scope.btnText = "Start";
        // }
        var loops = 0;
        while (loops < 10) {
            for (var y = 0; y < 80; y++) {
                for (var x = 0; x < 80; x++) {
                    $scope.syncron($scope.quilt[x][y]);
                    //print out quilt obj here ...........

                    $scope.quilt[x][y].netColor = $scope.colorConverter($scope.quilt[x][y]);
                    // $scope.drawMe($scope.quilt[x][y].netColor);
                }//end of x loop
            }//end of y loop
            dThreeDraw(data);
            loops++;
        }
    }//end nightTime function 

// beginning of drawMe function ..................................    
    $scope.drawMe = function (squareColor) {
        $(document).ready(function () {
            var unitSize = 6; // width (and height) of one square
            var unitsWide = 80; // number of squares along x-axis
            var unitsTall = 80; // number of squares along y-axis
            var field = $('#field').css({
                overflow: 'hidden',
                border: '16px solid #000000',
                width: unitSize * unitsWide + 32
            });

            $('<span class="square"></span>').css({
                display: 'block',
                float: 'left',

                width: unitSize,
                height: unitSize,
                'background-color': squareColor
            }).appendTo(field);

        });
    }
    // end of drawMe function .........................

// start of d3 drawing function .....
        dThreeDraw = function (data) {
            var svg = d3.selectAll("svg");
                // .attr("width", 480)
                // .attr("height", 480);
            debugger;
            var square = svg.selectAll("rect")
                .data(data)
                .attr("width", 6).attr("height", 6)

            square.exit().remove();

            square.enter().append("rect")
                .attr("x", function (d) { return d.xx * 6; } )
                .attr("y", function (d) { return d.yy * 6; } );
            
            square.attr("fill", function (d) { return d.netColor } );
}// end of d3 drawing function


    // colors converted to hex values here --v
    $scope.colorConverter = function (obj) {
        var colorOut = "#";
        if (!$scope.redish) {
            colorOut += "00";
        } else {
            if (obj.red.toString(16).length == 1) {
                colorOut += "0";
            }
            colorOut += obj.red.toString(16);
        }
        if (!$scope.greenish) {
            colorOut += "00";
        } else {
            if (obj.green.toString(16).length == 1) {
                colorOut += "0"
            }
            colorOut += obj.green.toString(16);
        }
        if (!$scope.blueish) {
            colorOut += "00";
        } else {
            if (obj.blue.toString(16).length == 1) {
                colorOut += "0"
            }
            colorOut += obj.blue.toString(16);
        }
        return colorOut;
    }

    // timeout function that will allow for updating the view --v    
    $scope.waitForMe = function () {
        if ($scope.btnText === "Start") {
            $scope.colorLayer();
        }
        $scope.hitme++;
        // var count = 5;
        // var x = $interval(function(){  
        // for (var ticks = 0; ticks < 5; ticks++){
        // count--;
        $scope.iterations++;
        $scope.nightTime();
        // if (!$scope.reddish || !$scope.greenish || !$scope.blueish) {
        //     // $interval.cancel(x)
        // }
        // } //, 3000 )
    }
})
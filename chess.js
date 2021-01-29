$(function() {

    board = $(".board").first();
    // create chess board
    for (i = 1; i < 9; i++) {
        for (j = 1; j < 9; j++) {
            board.append('<div class="square" id="' + i +
                                      j + '"></div>');
            if ((i + j) % 2 == 0) {
                $(".square").last().css("background-color", "SeaShell");
            }   else {
                $(".square").last().css("background-color", "Khaki");
            }
        }
    }

    // place white pieces
    $("#81").append('<img class="piece white rook" id="wr1" src="wr.png" alt="white_rook">');
    $("#82").append('<img class="piece white knight" id="wn1" src="wn.png" alt="white_rook">');
    $("#83").append('<img class="piece white bishop" id="wb1" src="wb.png" alt="white_rook">');
    $("#84").append('<img class="piece white queen" id="wq" src="wq.png" alt="white_rook">');
    $("#85").append('<img class="piece white king" id="wk" src="wk.png" alt="white_rook">');
    $("#86").append('<img class="piece white bishop" id="wb2" src="wb.png" alt="white_rook">');
    $("#87").append('<img class="piece white knight" id="wn2" src="wn.png" alt="white_rook">');
    $("#88").append('<img class="piece white rook" id="wr2" src="wr.png" alt="white_rook">');

    $("#11").append('<img class="piece black rook" id="br1" src="br.png" alt="black_rook">');
    $("#12").append('<img class="piece black knight" id="bn1" src="bn.png" alt="black_rook">');
    $("#13").append('<img class="piece black bishop" id="bb1" src="bb.png" alt="black_rook">');
    $("#14").append('<img class="piece black queen" id="bq" src="bq.png" alt="black_rook">');
    $("#15").append('<img class="piece black king" id="bk" src="bk.png" alt="black_rook">');
    $("#16").append('<img class="piece black bishop" id="bb2" src="bb.png" alt="black_rook">');
    $("#17").append('<img class="piece black knight" id="bn2" src="bn.png" alt="black_rook">');
    $("#18").append('<img class="piece black rook" id="br2" src="br.png" alt="black_rook">');


    var src;
    var movingPiece;

    function allowDrop(e) {
        e.preventDefault();
    }

    function drag(e) {
        e.dataTransfer.setData("text", e.target.id);
        src = e.target.parentElement.id;
        movingPiece = e.target.id;
    }

    function drop(e) {
        e.preventDefault();
        // image to move
        var data = e.dataTransfer.getData("text");

        // determine location
        if (e.target.classList.contains("square")) {
            var dest = e.target; // empty square
        } else if (e.target.parentElement.classList.contains("square")) {
            var dest = e.target.parentElement;
        }

        // determine whether move is legal
        if (move(movingPiece, src, dest.id)) {
            dest.appendChild(document.getElementById(data));
        }
    }

    function move(pc, start, end) {
        // can't move to the current square
        if (start == end) { return false; }

        var dif1 = start[0] - end[0];
        var dif2 = start[1] - end[1];
        switch(pc[1]) {
            case "r": // rooks
                return rMove(pc[0], start, end);
                break;
            case "n": // knights
                console.log("knight");
                if (dif1 == 0 ||
                    dif2 == 0 ||
                    (Math.abs(dif1) + Math.abs(dif2) != 3)) {
                    return false; 
                } else if (isSquareOccupied(end[0], end[1])) {
                    return take(pc[0], end[0], end[1]);
                }
                return true;
                break;
            case "b": // bishops
                return bMove(pc[0], start, end);
                break;
            case "k": // kings
                console.log("Kings: ");
                if (Math.abs(dif1) < 2 && Math.abs(dif2) < 2) { return true; }
                break;
            case "q": // queens
                return (rMove(pc[0], start, end) || bMove(pc[0], start, end));
                break;
            case "p": // pawns- black pawns and white pawns move differently
                if (pc[0] == "w") {
                    return true; 
                } else {
                    return true;
                }
                break;
            default:
                return false;
        }
    }

    function rMove(color, start, end) {
        var dif1 = start[0] - end[0];
        var dif2 = start[1] - end[1];
        var i;
        if ((dif1 != 0 && dif2 != 0)) { // rooks move along rows or columns
            return false; // not a rook move
        }

        // check if vertical move is blocked by another piece
        if (dif1 == 0) { // rook moving vertically
            var sign = Math.sign(start[1] - end[1]); // moving left or right?
            for (i = parseInt(start[1]) - sign; i != end[1]; i -= sign) {
                if (isSquareOccupied(start[1], i)) {
                    console.log("invlaid move: blocked by another piece");
                    return false; // move blocked
                }
            }
        }

        // check if horizontal move is blocked by another piece
        if (dif2 == 0) { // rook moving horizontally
            var sign = Math.sign(start[0] - end[0]); // moving up or down?
            for (i = parseInt(start[0]) - sign; i != end[0]; i -= sign) {
                if (isSquareOccupied(i, start[0])) {
                    console.log("invlaid move: blocked by another piece");
                    return false; // move blocked
                }
            }
        }

        // check if destination square is occupied
        if (isSquareOccupied(end[0], end[1])) {
            // if occupied by an enemy piece then take it and return true,
            // if occupied by a friendly piece then return false.
            return take(color, end[0], end[1]);
        }
        return true;
    }

    function bMove(color, start, end) {
        var dif1 = start[0] - end[0],
            dif2 = start[1] - end[1];
        if (Math.abs(dif1) != Math.abs(dif2)) {
            return false;
        }

        // these describe the four possible directions of the move
        var sign1 = Math.sign(dif1),
            sign2 = Math.sign(dif2);

        for (i = 1; i < Math.abs(dif1); i++) {
            // x, y are the co-ordinates of a square between start and end
            var x = parseInt(start[0]) - i * sign1,
                y = parseInt(start[1]) - i * sign2;
            if (isSquareOccupied(x, y)) { // if the square with id "xy" is occupied
                console.log("invlaid move: blocked by another piece");
                return false; // move blocked
            }
        }

        // check if destination square is occupied
        if (isSquareOccupied(end[0], end[1])) {
            // if occupied by an enemy piece then take it and return true,
            // if occupied by a friendly piece then return false.
            return take(color, end[0], end[1]);
        }
        return true;
    }

    function qMove(color, start, end) {
        // a queen move is either a rook move or a bishop move
        return (rMove(color, start,end) || bMove(color, start, end));
    }

    function nMove(color, start, end) {
        var dif1 = start[0] - end[0];
        var dif2 = start[1] - end[1];

        if (dif1 == 0 ||
            dif2 == 0 ||
            (Math.abs(dif1) + Math.abs(dif2) != 3)) {
            return false;
        } else if (isSquareOccupied(end[0], end[1])) {
            return take(color, end[0], end[1]);
        }
        return true;
    }

    // TODO: disallow moves into check
    function kMove(color, start, end) {
        var dif1 = start[0] - end[0];
        var dif2 = start[1] - end[1];
        
        if (Math.abs(dif1) >= 2 || Math.abs(dif2) >= 2) {
            return false;
        } else if (isSquareOccupied(end[0], end[1])) {
            return take(color, end[0], end[1]);
        }
        return true;
    }

    // check if a square contains a piece
    function isSquareOccupied(i, j) {
        var sq = document.getElementById(String(i) + String(j));
        if (sq.querySelector(".piece") != null) {
            debugger;
            return true; // square occupied
        }
        return false; // square empty
    }

    // check if destination of a move is occupied by a piece. returns false if
    // piece has the same color as the moving piece and returns true plus
    // removes the piece if it has opposite color.
    function take(color, i, j) {
        var sq = document.getElementById(String(i) + String(j));
        var pc = sq.querySelector(".piece");
        if (pc.id[0] == color) {
            return false;
        }
        pc.remove();
        return true;
    }

    var squares = document.getElementsByClassName("square");
    var i;
    for (i = 0; i < squares.length; i++) {
        squares[i].ondragover=allowDrop;
        squares[i].droppable="true";
        squares[i].ondrop = drop;
    }
    var pieces = document.getElementsByClassName("piece");
    for (i = 0; i < pieces.length; i++) {
        pieces[i].draggable="true";
        pieces[i].ondragstart=drag;
    }
});

//TODO: check destination square for a enemy piece, implement alternating
//turns for the colours, implement taking, implement
//pawn moves, pawn special moves and pawn take, implement castling, implement check and
//invalid move relating to check, implement checkmate,

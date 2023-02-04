let canvas = document.getElementById("game-canvas");

const board = new Board(8, 8, 80);
const chess = new Game(board, canvas);

const pawn = new Piece( board,
    "Pawn", 0, 'images/boccher.png', 2, 2,
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1]
)
const queen = new Piece( board,
    "Queen", 0, 'images/bocchiball.png', 5, 7,
    [10, 10, 10, 10, 10, 10, 10, 10], //n, e, s, w, ne, se, sw, nw
    [10, 10, 10, 10, 10, 10, 10, 10]
)

const knight = new Piece( board,
    "Knight", 0, 'images/ryo.png', 6, 4,
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [-15, -6, 10, 17, 15, 6, -10, -17] //ne, ne, se, se, sw, sw, nw, nw
    )

const white_pieces = [pawn]
const black_pieces = [queen, knight]
// board.addBoardPieces(pieces)


// for(let i = 0; i < board.state.length; i++){
//     console.log(board.state[i])
// }
const white = new Side(white_pieces, -1); //on god this will bite me in the ass but ill fix it someday
const black = new Side(black_pieces, 1)

const sides = [white, black]

board.addSides(sides);

chess.init()
chess.runGame()

//add pieces to board state
//remove pieces from board state
//reset board state
//the pieces exist in multiple places at once
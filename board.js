class Board {
    constructor(height, width){
        this.height = height
        this.width = width
        this.pieces = []
        this.dead_pieces = []
        this.sides = [];
        this.pawn_files = 1;
        this.offense_files = 1;

    }

    addSide(name, pieces, multiplier){
        pieces.forEach(piece=>{
            piece.raw_move_range
            piece.side_name = name;
        })
        this.sides.push({side_name: name, side_pieces: pieces, range_multiplier: multiplier})
    }
    // getPieces(){
    //     return this.pieces;
    // }



}




//i want custom side number, custom positions, custom aount of pieces (up to 3 rows)
//for now lets say the king has to be located in the bottom row, 5th column
//compete pawn row for now
//custom "attack" row

//thinking about coordinate systems
//white is the origin system, everything else is rotated to fit it
//so all pieces dont have to change system
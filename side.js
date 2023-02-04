class Side{
    constructor(pieces, side_int){
        this.pieces = pieces
        this.side_int = side_int;
        this.assignSideToPieces();
    }

    assignSideToPieces(){
        for(let i = 0; i < this.pieces.length; ++i){
            this.pieces[i].side = this.side_int;
        }
    }
}
class Board {
    constructor(height_tiles, width_tiles, tile_in_px){
        this.tile_in_px = tile_in_px

        this.height = height_tiles;
        this.width = width_tiles;
        this.heightPX = height_tiles * tile_in_px;
        this.widthPX = width_tiles * tile_in_px;

        this.mousePos = {x:0, y:0};

        this.sides;

        this.state = [];
        this.pieces = [];
        for(let i = 0; i < this.height * this.width; i++){
            this.state.push(0)
        }
        this.piece_clicked;
        this.selected_piece;
        this.held_piece = false;
    }

    updateBoard(context){

        this.state =[]; //every loop, reset the state (keeping pieces)

        for(let i = 0; i < this.height * this.width; i++){ //fill the state with 0s
            this.state.push(0)
        }

        for(let i = 0; i < pieces.length; i++){ //add pieces from pieces to state
            // this.pieces[i] = pieces[i];
            this.state[pieces[i].board_index] = pieces[i]
        }

        this.pieces=[]; //temporary
        
        for(let i = 0; i < this.state.length; i++){
            if(this.state[i] != 0){
                this.pieces.push(this.state[i])
            }
        }

        this.updateBoardPieces();

        this.draw(context)

        let hovered_piece = this.isMouseOnPiece(this.mousePos.x, this.mousePos.y)

        if(hovered_piece){
            this.drawHoverOverTile(context, hovered_piece.coords.x, hovered_piece.coords.y)
        }

        if(this.selected_piece){
            this.drawPieceRange(context, this.selected_piece)
        }

        if(this.held_piece && this.selected_piece){
            this.drawPieceAtMouse(context, this.selected_piece)
            // console.log("a")

            for(let i = 0; i < this.selected_piece.legal_tiles.length; i++){
                let coords = this.translateBoardIndexToCoords(this.selected_piece.legal_tiles[i]);
                // console.log()
                if(this.mousePos.x > coords.x * this.tile_in_px && this.mousePos.x <(coords.x + 1) * this.tile_in_px && 
                    this.mousePos.y > coords.y * this.tile_in_px && this.mousePos.y < (coords.y + 1) * this.tile_in_px){
                    this.drawHoverOverTile(context, coords.x, coords.y)
                }
            }  
        }
    }

    updateBoardPieces(){
        // console.log("a")
        for(let i = 0; i < this.pieces.length; i++){
            let piece = this.pieces[i]

            piece.updatePiece()
            // console.log(piece)
        }
    }

    addSides(sides){
        this.sides = sides
        for(let i = 0; i < sides.length; i++){
            for(let j = 0; j < sides[i].pieces.length){
                this.pieces.push(this.sides[i].pieces[j]);
            // this.state[pieces[i].board_index] = pieces[i]
            }
        }
    }

    addBoardPieces(pieces){
        for(let i = 0; i < pieces.length; i++){
            this.pieces[i] = pieces[i];
            // this.state[pieces[i].board_index] = pieces[i]
        }
    }

    isMouseOnPiece(x, y){
        for(let i = 0; i < this.pieces.length; i++){
            let piece = this.pieces[i]
            if(x > (piece.coords.x) * this.tile_in_px && x < (piece.coords.x + 1) * this.tile_in_px &&
                y > (piece.coords.y) * this.tile_in_px && y < (piece.coords.y + 1) * this.tile_in_px){
                    return piece;
            }
        }
    }

    translateBoardIndexToCoords(index){
        return {x: (index % this.width), y: ((index - (index % this.width)) / this.width)}
    }

    getBoardIndexFromMousePos(){
        let x = ((this.mousePos.x - (this.mousePos.x % this.tile_in_px)) / this.tile_in_px)
        let y = ((this.mousePos.y - (this.mousePos.y % this.tile_in_px)) / this.tile_in_px)

        return (x + y * this.width);
    }

    draw(context){
        this.drawBoard(context)
        this.drawPieces(context)
        // this.drawPieceRange(context)
    }

    drawPieceAtMouse(context, piece){
        context.drawImage(piece.image, this.mousePos.x - this.tile_in_px / 2, this.mousePos.y - this.tile_in_px/ 2, this.tile_in_px, this.tile_in_px)
    }

    drawPieces(context){
        for(let i = 0; i < this.pieces.length; i++){
            let piece = this.pieces[i]
            // console.log(piece)
            context.drawImage(piece.image, piece.coords.x * this.tile_in_px, piece.coords.y * this.tile_in_px, this.tile_in_px, this.tile_in_px)
        }
    }

    drawPieceRange(context, piece){
        // for(let i = 0; i < this.pieces.length; i++){
        //     let piece = this.pieces[i]
            // console.log(piece)
            // context.drawImage(piece.image, piece.coords.x * this.tile_in_px, piece.coords.y * this.tile_in_px, this.tile_in_px, this.tile_in_px)
        for(let j = 0;  j < piece.legal_tiles.length; j++){
            let coords = this.translateBoardIndexToCoords(piece.legal_tiles[j])
            context.strokeStyle = "white"
            context.beginPath();
            context.arc((coords.x + 1) * this.tile_in_px - this.tile_in_px / 2, coords.y * this.tile_in_px + this.tile_in_px/2, 25, 0, 2 * Math.PI);
            context.stroke();

                        // console.log(this.state)
            // console.log(piece.name)
            // console.log(i)
            // console.log(piece.legal_tiles)
            // console.log(piece.name)
            // console.log(coords)
            // }
        }
    }

    drawBoard(context){
        if(context == null){
            return;
        }
    
        context.clearRect(0, 0, this.heightPX, this.widthPX)
    
        for(let i = 0; i < this.height; i++){
            let count = 0;
            if(i%2!=0){
                count = 1;
            }
            for(let j = 0 + count; j < this.width + count; j++){
                if(j%2!=0){
                    context.fillStyle = "#769656";
                }else{
                    context.fillStyle = "#000000";
                }
                // console.log(j-count * 1);
                context.fillRect((j - count) * this.tile_in_px, i*this.tile_in_px, 
                this.tile_in_px, this.tile_in_px);
            }
        }
    }

    drawHoverOverTile(context, x, y){
        context.fillStyle = "#555555"
        context.fillRect(x * this.tile_in_px, y * this.tile_in_px, this.tile_in_px, this.tile_in_px);
    }
}


//mouse click
//
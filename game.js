class Game {
    constructor(board, canvas){
        this.board = board;
        this.canvas = canvas;
        this.sideToMove = 0;
    }

    runGame(){
        // this.init()
        const context = canvas.getContext("2d");
        this.board.updateBoard(context) //update board when piece is placed
        // this.board.draw(context)
        // this.runGame();
        requestAnimationFrame(this.runGame.bind(this)) //BIND THIS FUNCTION ALWAYS
    }

    init(){
        window.addEventListener("mousemove", (e)=>{this.board.mousePos = this.getMousePos(canvas, e)}, false)

        window.addEventListener("click",(e)=>{
            let piece = this.board.isMouseOnPiece(this.board.mousePos.x, this.board.mousePos.y)

            this.board.selected_piece = piece;
        })

        window.addEventListener("mousedown", (e)=>{ 
            let piece = this.board.isMouseOnPiece(this.board.mousePos.x, this.board.mousePos.y)

            // if(!piece){return}
            this.board.selected_piece = piece;
            this.board.held_piece = true;
            //while mouse is down, piece is 
        })

        window.addEventListener("mouseup", (e)=>{ 
            //if let go over a tile in the piece's range
            if(!this.board.selected_piece) return;
            
            let mouseCoords = this.board.translateBoardIndexToCoords(this.board.getBoardIndexFromMousePos())

            for(let i = 0; i < this.board.selected_piece.legal_tiles.length; i++){
                let coords = this.board.translateBoardIndexToCoords(this.board.selected_piece.legal_tiles[i]);
                // console.log()
                if(this.board.held_piece && mouseCoords.x == coords.x && mouseCoords.y == coords.y){
                    this.board.selected_piece.coords = {x: mouseCoords.x, y: mouseCoords.y}
                    this.board.selected_piece.board_index = mouseCoords.x + mouseCoords.y * this.board.width;
                }
            }  

            this.board.selected_piece = undefined;
            this.board.held_piece = false;
        })
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }


}
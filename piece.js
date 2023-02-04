class Piece {
    constructor(board, name, side, image, init_x, init_y, move_range, attack_range, offsets = [8, 1, -8, -1, 9, -7, -9, 7]){
        this.board = board;
        this.name = name;
        this.side = side; //we'll see if this is useful
        this.image = new Image();
        this.image.src = image;
        this.coords = {x: init_x - 1, y: init_y - 1} //0 indexed
        this.board_index = (init_x - 1) + (init_y-1) * this.board.height;
        // console.log(this.board_index)

        this.offsets = offsets
        this.move_range = move_range; //object
        this.attack_range = attack_range; //object
        this.legal_tiles = [];
    }

    updatePiece(){

        // console.log(this.name)
        this.legal_tiles = []
        this.getMoveableTilesInRange();
        this.getAttackablePiecesInRange();

        // console.log(this.board_index)
        // console.log(this.legal_tiles)
        // console.log(this.name)
    }

    getMoveableTilesInRange(){

        for(let i = 0; i < this.move_range.length; i++){ //for every direction

            let rangeMax = this.move_range[i];
            if(this.move_range[i] > 9) rangeMax = board.width

            for(let j = 1; j < rangeMax + 1; j++){ //for every tile that the piece can go in said direction

                if(this.move_range[i] == 0) break; //if range is 0, break
                
                let new_pos = this.board_index + this.offsets[i] * j

                let new_pos_coords = this.board.translateBoardIndexToCoords(new_pos)
                let offset_coords = this.translateOffsetToCoords(this.offsets[i])

                if(!this.isInValidColumnRow(this.offsets[i])) break; //works for now
            
                if(this.board.state[new_pos]) break;


                this.legal_tiles.push(new_pos);

                if(new_pos_coords.x + offset_coords.x < 0 || new_pos_coords.x + offset_coords.x > this.board.width - 1 || 
                    new_pos_coords.y + offset_coords.y < 0 || new_pos_coords.y + offset_coords.y > this.board.width - 1) break;
            }
        }
    }

    getAttackablePiecesInRange(){
        for(let i = 0; i < this.attack_range.length; i++){ //for every direction

            let rangeMax = this.attack_range[i];
            if(this.attack_range[i] > 9) rangeMax = board.width

            for(let j = 1; j < rangeMax + 1; j++){ //for every tile that the piece can go in said direction

                if(this.attack_range[i] == 0) break; //if range is 0, break
                
                let new_pos = this.board_index + this.offsets[i] * j

                let new_pos_coords = this.board.translateBoardIndexToCoords(new_pos)
                let offset_coords = this.translateOffsetToCoords(this.offsets[i])

                if(!this.isInValidColumnRow(this.offsets[i])) break; //works for now

                if(this.board.state[new_pos]){
                    this.legal_tiles.push(new_pos); //if piece exist
                }

                if(new_pos_coords.x + offset_coords.x < 0 || new_pos_coords.x + offset_coords.x > this.board.width - 1 || 
                    new_pos_coords.y + offset_coords.y < 0 || new_pos_coords.y + offset_coords.y > this.board.width - 1) break;
            }
        }
    }


    //case -1 not working on 1 file  => fixed?
    //side ranges not working past 1st on 0th row/ 7th row
    //vertical ranges not working past 1st on 0th column/ 7th column
    
    translateOffsetToCoords(offset){
        if(offset < 0){ //when negative ie -15, -6, -4
            if(offset >= -4){

                return {x: offset, y:0}
            }

            let y = ((offset-4) + (Math.abs(offset-4) % this.board.width)) / this.board.width; //-15 => -2    -6 => -1
            let x = offset - y * this.board.width // -15 => 1   -6 => 2

            return {x:x, y:y}

        } else if(offset >= 0){
            if(offset <= 4){

                return {x:offset, y:0};
            }

            let y = ((offset+4) - ((offset+4) % this.board.width)) / this.board.width; //10 - 2 / 8 = 1
            let x = offset - y * this.board.width; // 2

            return {x:x, y:y}
        }
    }

    isInValidColumnRow(offset){ //ugly as hell
        let row_valid;
        let column_valid;

        //starts jumping at -5/5
        //anything above is a jumper
        //for jumpers, max is just the board maximum - their x and shift their x over based on proportion 

        if(offset < 0){ //when negative ie -15, -6, -4
            if(offset >= -4){
                // column_row_limits = {
                //     row_limit: offset * -1, //might be buggy
                //     column_limit: 0
                // }//it cannot go before the 4th file for -4

                return this.coords.x > (offset * -1)-1;
            }

            let y = ((offset-4) + (Math.abs(offset-4) % this.board.width)) / this.board.width; //-15 => -2    -6 => -1
            let x = offset - y * this.board.width // -15 => 1   -6 => 2

            // column_row_limits = { //this is DEFINITELY buggy
            //     row_limit: y < 0? (this.board.width-y) % this.board.width - 1: this.board.width-y,
            //     column_limit: x < 0? (this.board.width-x) % this.board.width - 1: this.board.width-x
            // }

            row_valid = y < 0 ? this.coords.y > (this.board.width-y) % this.board.width - 1: this.coords.y < this.board.width-y
            column_valid = x < 0? this.coords.x > (this.board.width-x) % this.board.width - 1: this.coords.x < this.board.width-x

        } else if(offset >= 0){
            if(offset <= 4){
                // column_row_limits = {
                //     row_limit: 8-offset, //might be buggy
                //     column_limit: 0
                // }

                return this.coords.x < 8 - offset;
            }

            let y = ((offset+4) - ((offset+4) % this.board.width)) / this.board.width; //10 - 2 / 8 = 1
            let x = offset - y * this.board.width; // 2

            // column_row_limits = {
            //     row_limit: y < 0? (this.board.width-y) % this.board.width - 1: this.board.width-y,
            //     column_limit: x < 0? (this.board.width-x) % this.board.width - 1: this.board.width-x //could replace with (x * -1) -1: ?
            // }

            row_valid = y < 0? this.coords.y > (this.board.width-y) % this.board.width - 1: this.coords.y < this.board.width-y
            column_valid = x < 0? this.coords.x > (this.board.width-x) % this.board.width - 1: this.coords.x < this.board.width-x

            
        }
        return row_valid && column_valid
        //ok now it go this much x and this much y
        //-3, -2, -1, 0, 1, 2, 3, 
        //+5, +3, +1, +8, +6, +4, +2
        //2,  1,  0,  8, 7, 6, 5
        //-3 => max x = 2
        //3 => max x = 5

        //-2, -1, 0, 1, 2
        //1,  0,  8, 7, 6
        //y of negative 2 => max y = 1
        //y of 2 => max y => 6
    }

    // isOutOfBoard(index){

    // }

    //board index 1
}

//right now, the "move_range" is actually how far the piece can go in that direction
//the real offsets are stored in board
//i think each piece should probably just store an offset/custom offset

//offset knight problem:
//stop pushing legal moves when pieces are too close to a file/column
//ie for an offset of 6, it will stop pushing when the piece reaches the second column / final row
//for an offset of 7, it will stop pushing once the piece reaches the first column/final row



//what do i want
//to prevent jumping across board
//how to do??
//set limits so if piece is on limit of range then range no appear or valid
//with an offset of ___
//if the offset is less than 4, then its on the same row
//beyond 4, compensate for ys and xs
//
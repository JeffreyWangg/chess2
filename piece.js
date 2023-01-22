class Piece {
    constructor(x, y, raw_move_range, raw_attack_range, icon, name, move_trait, board){
        this.name = name
        this.raw_move_range = raw_move_range;
        this.moves_list = [{x:this.x, y:this.y}];
        this.raw_attack_range = raw_attack_range;
        this.attack_move_list = [];
        this.x = (x - 1) * 80 + 80/2;
        this.y = (y - 1) * 80 + 80/2;
        this.move_trait = move_trait

        this.icon = new Image();
        this.icon.src = icon;
        this.held = false;
        this.board = board
    }
    
    getName(){
        return this.name
    }

    update(){
        this.translateRangeToCoords(this.raw_move_range, "MOVE");
        this.translateRangeToCoords(this.raw_attack_range, "ATTACK");
        this.moves_list.push({x:this.x, y:this.y});
        // console.log(this.attack_move_list)
        // console.log(this.moves_list)
    }

    draw(w, h,context, x=this.x, y=this.y){
        // this.icon.addEventListener("load",()=>{
            context.drawImage(this.icon, x-80/2, y-80/2, w, h)
        // }, false)
        // console.log("draw")
    }

    draw_range(context){
        // console.log("draw begin")
        for(let i = 0; i < this.moves_list.length; i++){
            context.strokeStyle = "white"
            context.beginPath();
            context.arc(this.moves_list[i].x, this.moves_list[i].y, 25, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    //if in a range's x and y

    inMoveRange(x, y){
        for(let i = 0; i < this.moves_list.length; i++){
            let moves_list_x = this.moves_list[i].x;
            let moves_list_y = this.moves_list[i].y;
            if(x < moves_list_x + 80/2 && x > moves_list_x - 80/2 &&
            y < moves_list_y + 80/2 && y >moves_list_y - 80/2){
                return true;
            }
        }
        return false;
    }

    translateRangeToCoords(raw, type){
        let default_stop = false;
        if(type == "ATTACK"){
            default_stop = true;
        }
        let coord_array = [];
        let counter = 0;

        if(raw[0][0] > 0){ //if allow movement IN ORTHO DIRECTION
            // console.log("allow draw")
            raw[0].forEach(dir => { //for each ortho direction

                // console.log(this.name, dir.x, dir.y)
                // console.log("draw   ")
                let x_sign = Math.sign(dir.x)
                let y_sign = Math.sign(dir.y)


                if(this.move_trait == "JUMP_STRICT"){
                    let stop = default_stop;
                    this.board.pieces.forEach(piece => {
                        if(piece.x == this.x + dir.x * 80 && piece.y == this.y - dir.y * 80){
                            stop = !stop;
                        }
                    })
                    if(!stop){coord_array.push({x:this.x + dir.x * 80, y:this.y - dir.y * 80})}
                } else if(this.move_trait == "JUMP" || this.move_trait == "STRICT"){
                //this mess needs to be fixed somehow
                if(dir.flip){
                    let stop = default_stop;
                    for(let y = 1; y < Math.abs(dir.y) + 1; y+=dir.step){
                        this.board.pieces.forEach(piece => {
                            if(piece.x == this.x && piece.y == this.y - y * 80 * y_sign){
                                stop = !stop;
                            }
                        })
                        if(!stop){coord_array.push({x: this.x, y: this.y - y * 80 * y_sign});}
                    }
                    stop = default_stop;
                    for(let x = 1; x < Math.abs(dir.x) + 1; x+=dir.step){
                        this.board.pieces.forEach(piece => {
                            if(piece.x == this.x + x * 80 * x_sign && piece.y == this.y - dir.y * 80){
                                stop = !stop;
                            }
                        })
                        if(!stop){coord_array.push({x:this.x + x * 80 * x_sign, y:this.y - dir.y * 80});}
                    }
                } else {
                    let stop = default_stop;
                    for(let x = 1; x < Math.abs(dir.x) + 1; x+=dir.step){
                        this.board.pieces.forEach(piece => {
                            if(piece.x == this.x + x * 80 * x_sign && piece.y == this.y){
                                stop = !stop;
                            }
                        })
                        if(!stop){coord_array.push({x:this.x + x * 80 * x_sign, y:this.y});}
                    }
                    stop = default_stop;
                    for(let y = 1; y < Math.abs(dir.y) + 1; y+=dir.step){
                        this.board.pieces.forEach(piece => {
                            if(piece.x == this.x + dir.x * 80 && piece.y == this.y - y * 80 * y_sign){
                                stop = !stop;
                            }
                        })
                        if(!stop){coord_array.push({x:this.x + dir.x * 80, y:this.y - y * 80 * y_sign});}
                    }
                }
            }
            });
        }
        // console.log()
        if(raw[1][0] > 0){
            // console.log("diaonglas")
            raw[1].forEach(dir => {
                let x_sign = Math.sign(dir.x)
                let y_sign = Math.sign(dir.y)

                if(dir.allDiagonalDirections){
                    let stop = default_stop;
                    for(let i = 0; i < 4; i++){
                        switch(i){
                            case 0:
                                x_sign = -1, y_sign = 1;
                                break;
                            case 1:
                                x_sign = -1, y_sign = -1;
                                break;
                            case 2:
                                x_sign = 1, y_sign = -1;
                                break;
                            case 3:
                                x_sign = 1, y_sign = 1;
                                break;
                        }
                        stop = default_stop
                        for(let x = 1; x < Math.abs(dir.x) + 1; x++){
                            if(this.move_trait == "JUMP_STRICT"){
                                x = Math.abs(dir.x)
                            }
                            this.board.pieces.forEach(piece => {
                                if(piece.x == this.x + x * 80 * x_sign && piece.y == this.y - x * 80 * y_sign){
                                    stop = !stop;
                                    
                                }
                            })
                            if(!stop){coord_array.push({x:this.x + x * 80 * x_sign, y:this.y - x * 80 * y_sign});}
                        }
                    }
                    return;
                }
                let stop = default_stop;
                for(let x = 1; x < Math.abs(dir.x) + 1; x++){
                    if(this.move_trait == "JUMP_STRICT"){
                        x = Math.abs(dir.x)
                    }
                    this.board.pieces.forEach(piece => {
                        if(piece.x == this.x + x * 80 * x_sign && piece.y == this.y - x * 80 * y_sign){
                            stop = !stop;
                        }
                    })
                    if(!stop){coord_array.push({x: this.x + x * 80 * x_sign, y:this.y - x * 80 * y_sign});}
                }
            })
        }

        console.log(counter)

        if(type == "MOVE"){
            this.moves_list = coord_array;
        } else if(type == "ATTACK"){
            this.attack_move_list = coord_array;
        }
        // console.log("interpreter ran " + type)
    }

    // draw(w, h, x, y){
    //     this.icon.addEventListener("load",()=>{this.context.drawImage(this.icon, x, y, w, h)}, false)
    // }



}


//the only things we'll use move range for:
//draw range? check
//is movement in range? check
//restrict piece movement? check
//if diagonal range:
//draw diagonal range
//same range checker
//so the problem is just about drawing the stupid fucking thing

//add movement traits to signify how to draw the rest of the range (right now i will draw every square)
//and movement restrictions

//add range interpreter that looks at board and the raw move range and makes a list of possible moves legal to the piece
//^ done


//for each range
//put x boxes into range, put y boxes into range, stop direction when hit piece

//if attack range, only add coords when


//if jump strict
//everywhere except pieces
//strict
//pieces block range
//jump strict
//only at end of line
console.log("working")

canvas = document.getElementById("game-canvas");
//fix this later

let held_piece = false;
let mousepos;
//hashmap?

//centers are + width / 2 and + height/2
//ok ill have to fix this later but right now
//DRAWING IS DONE WITH TOP LEFT CORNER AS ORIGIN
//LOGIC IS DONE WITH CENTER AS ORIGIN
//this will totally f me up later but leaving this as a note for future :)


//draw function now centered around center

//NEED TO SEPARATE LOGIC AND DRAWING

init();

function main(board){
    const context = canvas.getContext("2d");
    if(context == null){
        return;
    }

    context.clearRect(0, 0, 640, 640)

    for(let i = 0; i < 8; i++){
        let count = 0;
        if(i%2!=0){
            count = 1;
        }
        for(let j = 0 + count; j < 8 + count; j++){
            if(j%2!=0){
                context.fillStyle = "#769656";
            }else{
                context.fillStyle = "#000000";
            }
            // console.log(j-count * 1);
            context.fillRect((j - count) * 80, i*80, 80, 80);
        }
    }


    // let pieces = board.getPieces(); //figure out hwo classes work again

    // const context = canvas.getContext("2d");
    // console.log("a")
    if(held_piece){
        // console.log(mousepos.x)
        // held_piece.x = mousepos.x //refers to mouse
        // held_piece.y = mousepos.y
        let column = mousepos.x - (mousepos.x%80); //see if there's a better way to get multiples than this
        let row = mousepos.y - (mousepos.y%80); //refers to top left corner of boxes
        held_piece.draw(80, 80, context, mousepos.x, mousepos.y) //draws center image at mouse pos
        // console.log(held_piece.x)
        
        // context.fillStyle = "red"
        // context.fillRect(mousepos.x - 80/2, mousepos.y - 80/2, 80, 80) //shifted to center, drawn at mousepos

        // console.log(held_piece.inMoveRange(mousepos.x, mousepos.y))

        board.pieces.forEach(piece => { //fix this scuffed shit

            // console.log(held_piece.x == piece.x, held_piece.y == piece.y)
            if(!(held_piece.x == piece.x && held_piece.y == piece.y)){
                piece.draw(80, 80, context)
            }
        })

        held_piece.draw_range(context)

        if(held_piece.inMoveRange(mousepos.x, mousepos.y)){
            context.fillStyle = "green"
            context.fillRect(column, row, 80, 80) //drawn at column and row based on top left of box (fix this)
        }
    } else {
        board.pieces.forEach(piece => {
            //if piece was on that square, it is now dead


            // let column = piece.x - (piece.x%80) + 80/2; //see if there's a better way to get multiples than this
            // let row = piece.y - (piece.y%80) + 80/2; //gets column and row, shifted so that image will be drawn in center
            //and piece coords are in center

            // console.log(piece.x - transpose_x, piece.y - transpose_y)
            // console.log(column, row)


            piece.update()

            //combine this and the above loop?
            for(let attack_index = 0; attack_index < piece.attack_move_list.length; attack_index++){
                board.pieces.forEach(test_piece => {
                    if(piece.attack_move_list[attack_index].x == test_piece.x && piece.attack_move_list[attack_index].y == test_piece.y){
                        // console.log("attackable")
                        piece.moves_list.push(piece.attack_move_list[attack_index])
                        // console.log(held_piece.moves_list)
                    }
                })
            }

            piece.draw(80, 80, context) //the draw function transforms it down and right, so the drawing gets done from the
            //top left, but it looks centered
            // piece.x = column, piece.y = row;
            //make update function in draw?

            // context.fillStyle = "red"
            // context.fillRect(column-80/2, row-80/2, 80, 80)
        })
    }

    // console.log(held_piece.moves_list)

    window.requestAnimationFrame(function(){main(board)})

    //make sure to round the mouse position in the future so that numbers aren't weird and a pain in the ass
    //add unit size?
}

function init(){

    const board = new Board(640, 640)

    const queen = new Piece(5, 1,
        [
            [1, {x:10, y:0, flip:true, step:1}, 
                {x:-10, y:0, flip:true, step:1},
                {x:0, y:10, flip:true, step:1},
                {x:0, y:-10, flip:true, step:1},
                // {x:-3, y:3, flip:false, step:1}
            ],  //cardinal directions,
            [1, {x:10, y:1, step:1, allDiagonalDirections:true}, 
                // {x:9, y:1, step:1, allDiagonalDirections:false}
            ]  //diagonal directions
            //could also do [1, {x:0, y:1}, {x:0, y:-1}] to go backwards and forwards
        ]
        , 
        [
            [1, {x:10, y:0, flip:true, step:1}, 
                {x:-10, y:0, flip:true, step:1},
                {x:0, y:10, flip:true, step:1},
                {x:0, y:-10, flip:true, step:1},
                // {x:-3, y:3, flip:false, step:1}
            ],  //cardinal directions,
            [1, {x:10, y:1, step:1, allDiagonalDirections:true}, 
                // {x:9, y:1, step:1, allDiagonalDirections:false}
            ]  //diagonal directions
        ]
        , "images/bocchiball.png", "Queen", "STRICT", board
        )

    const pawn = new Piece(5, 5, 
        [
            [1, {x:0, y:1, flip:true, step:1}, 
                // {x:-3, y:3, flip:false, step:1}
            ],  //cardinal directions,
            [0, {x:-2, y:1, step:1, allDiagonalDirections:true}, 
                // {x:9, y:1, step:1, allDiagonalDirections:false}
            ]  //diagonal directions
            //could also do [1, {x:0, y:1}, {x:0, y:-1}] to go backwards and forwards
        ]
        , 
        [
            [0, {x:0, y:1, flip:true, step:1}, 
                // {x:-3, y:3, flip:false, step:1}
            ],  //cardinal directions,
            [1, {x:1, y:1, step:1, allDiagonalDirections:false},
                {x:-1, y:1, step:1, allDiagonalDirections:false}, 
                // {x:9, y:1, step:1, allDiagonalDirections:false}
            ]  //diagonal directions
        ]
        , "images/boccher.png", "Pawn", "STRICT", board);
        const knight = new Piece(3, 5, 
            [
                [1, {x:1, y:2, flip:true, step:1}, 
                    {x:-1, y:2, flip:true, step:1}, 
                    {x:2, y:1, flip:true, step:1}, 
                    {x:-2, y:1, flip:true, step:1}, 
                    {x:2, y:-1, flip:true, step:1}, 
                    {x:-2, y:-1, flip:true, step:1}, 
                    {x:1, y:-2, flip:true, step:1}, 
                    {x:-1, y:-2, flip:true, step:1}, 
                ],  //cardinal directions,
                [0] //diagonal directions
                //could also do [1, {x:0, y:1}, {x:0, y:-1}] to go backwards and forwards
            ]
            , 
            [
                [1, {x:1, y:2, flip:true, step:1}, 
                    {x:-1, y:2, flip:true, step:1}, 
                    {x:2, y:1, flip:true, step:1}, 
                    {x:-2, y:1, flip:true, step:1}, 
                    {x:2, y:-1, flip:true, step:1}, 
                    {x:-2, y:-1, flip:true, step:1}, 
                    {x:1, y:-2, flip:true, step:1}, 
                    {x:-1, y:-2, flip:true, step:1}, 
                    // {x:-3, y:3, flip:false, step:1}
                ],  //cardinal directions,
                [0]  //diagonal directions
            ]
            , "images/ryo.png", "KNIGHT", "JUMP_STRICT", board);
    board.pieces.push(pawn)
    board.pieces.push(queen)
    board.pieces.push(knight)

    // console.log(pawn.getName())

    // console.log(board.pieces)
    // console.log(board.getPieces())
    // board.getPieces()

    window.addEventListener("mousemove", (e)=>{mousepos = getMousePos(canvas, e)}, false)
    window.addEventListener("mousedown", (e)=>{ 
        board.pieces.forEach(piece => {
        console.log(held_piece)
        if(mousepos.x > piece.x - 80/2 && mousepos.x < piece.x + 80/2 && 
            mousepos.y > piece.y - 80/2 && mousepos.y < piece.y + 80/2){
                piece.held = true;
                held_piece = piece;
        }})
    })
    window.addEventListener("mouseup", (e)=>{
    // console.log(held_piece)
    if(held_piece && held_piece.inMoveRange(mousepos.x, mousepos.y)){
        console.log(held_piece.moves_list)
        console.log(mousepos.x, mousepos.y)
        held_piece.x = mousepos.x - (mousepos.x%80) + 80/2
        held_piece.y = mousepos.y - (mousepos.y%80) + 80/2

        for(let i = 0; i < board.pieces.length; i++){
            if(held_piece.x == board.pieces[i].x && held_piece.y == board.pieces[i].y &&
                held_piece.name != board.pieces[i].name
                ){
                console.log("test")
                console.log(board.pieces[i].name)
                board.dead_pieces.push(board.pieces.splice(i, 1))
            }
        }
    }
    held_piece=false;
    })
    main(board)
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

//MAKE SIDES OF THE BOARD
//MULTIPLY RANGES BY NEGATIVE TO GO UPSIDE DOWN?
//FIX PIECES GOING OUTSIDE OF BOARD
//PREVENT SAME SIDE PIECES FROM ATTACKING EACH OTHER
//add checkmate and game rules







//IMPLEMENTATION:
/*
we could do a class system, where pieces are each their own different class
we could also do a basic translation where "p" in a 2d refers to pawn, and we handle each character accordingly
but that feels slow so i dont really wanna do that
so if we doa  class system, we can handle range and other properties
what will range be defined as? position +/- squares maybe
do we store in a 2d array? or would something like a hash table work bette/

*/

//for range: add new class properties?
//JUMP_STRICT, JUMP, STRICT
//jump strict only allows max range, jump allows jumping + move, strict is strict movement

//placing done (for now)
//add range indicator (doneish - add range indicators over pieces and prevent piece duplication?)
//add attack 
//add forced movement (done, possibly buggy (as all code is))
//add more pieces (just need to make ranges, hope it isnt bugged)
//add actual chess


//handle straight vs strange movement?



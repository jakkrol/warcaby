//base config
var state = false;
var onMove = "b";
var canJump = false;

var jumper = "0";

//creating board
function createBoard(){
    var counter = 8;
    var number = false;
    for(let i = 1; i <= 64; i++){
        const el = document.createElement("div");
        el.textContent = i;
        el.id = i;
    
        if(counter == 0){
            counter = 8;
            number = !number;
        }
        if(i%2==number){
            el.classList.add("wh");
        }else{
            el.classList.add("bl");
        }
    
        var box = document.getElementById("box");
        box.appendChild(el);
    
        counter--;
    }
    
    
}


//creating pawns
function createPawns(){
    $(function() {
        var childrenArray = $('.box').children(".bl").toArray();
        //console.log(childrenArray);

        //adding pawns to board and giving ID's
        for(let i = 1; i <= childrenArray.length; i++){
            const p = document.createElement("img");
            p.setAttribute("class", "pawn");
            if(i <= 12 ) {
                p.src = "b_pawn.png";
                p.id = "b_" + childrenArray[i-1].id;
            }if(i >= 21){
                p.src = "w_pawn.png";
                p.id = "w_" + childrenArray[i-1].id;
            }if(i > 12 && i < 21){
                continue;
            }
             
            childrenArray[i - 1].appendChild(p);
        }

        //adding drag listeners to pawns
        var pawns = document.querySelectorAll('img');
        i = 0;
        while (i < pawns.length) {
            var c = pawns[i++];
            // Add the event listeners
            c.addEventListener('dragstart', dragStart);
            c.addEventListener('dragend', dragEnd);
            c.setAttribute("draggable", "true");
          }




          endTurn();
      });


      
}


//starting to drag a pawn
function dragStart(e) {
    //console.log("start: " + e);
    e.dataTransfer.setData("text", e.target.id);


    var squares = document.querySelectorAll('.bl');
    i = 0;
    while (i < squares.length) {
        var c = squares[i++];
        var sp = e.target.id.split("_");

        //checking squares around every pawn and looking if they are valid in checkIfValid function
        if(onMove == "w" || onMove == "b"){
            //console.log(onMove);
            var square = parseInt(sp[1]);
        if(c.id == sp[1]-9 || c.id == sp[1]-7 || c.id == square+9 || c.id == square+7){
            checkIfValid(c, sp[1], sp[0]);

        }
    }
    }
}

//ending drag without moving pawn to another square
function dragEnd(e) {
   deleteDropFromAllSquares();
   jumper = "0";
}


//allow dropping on certain square
function allowDrop(ev) {
    ev.preventDefault();
    console.log("DROP");
}
  
//running after droping pawn to another square
function drop(ev) {
    
    //if pawn jump over another pawn then take beaten pawn out
    if(canJump || jumper != "0"){
        var id = ev.dataTransfer.getData("text").split("_");
        var jumpedSum = parseInt(ev.target.id) - parseInt(id[1]);
        var jumpedOver = parseInt(id[1]) + (jumpedSum/2);
        //console.log("Jumped Over = " + jumpedOver);
        $("#" + jumpedOver + " img").remove();
        jumper = onMove + "_" + ev.target.id;
    }
    //set pawn on new square remove listeners and end turn
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    document.getElementById(data).id = onMove + "_" + ev.target.id;

    


    //console.log("JUMPER TO " + jumper);
    deleteDropFromAllSquares();
    if(checkIfCanJumpMore()){
        var pawns = document.querySelectorAll('.pawn');

            i = 0;
            while (i < pawns.length) {
                var c = pawns[i++];
                if(c.id == jumper)
                c.setAttribute("draggable", "true");
                else
                c.setAttribute("draggable", "false");
            }
    }else {
        endTurn();
    }
}

//deleting all drop and dragover listeners from every square
function deleteDropFromAllSquares() {
    var squares = document.querySelectorAll('.bl');
    var j = 0;

    while (j < squares.length) {
        var c = squares[j++];
        c.removeEventListener('drop', drop);
        c.removeEventListener('dragover', allowDrop);
        }

        
        //console.log("DELETED");
}

//checking square is valid to move pawn
function checkIfValid(c, pawn, color, checking = false) {
    //console.log("HHHHHHH: " + c);
//if can't move 1 diagonal ---> looking for jump possibility
    if($(c).find('img').length == 1){
        var anotherPawn = $(c).find('img');
        var move = c.id - pawn;
        var pawn2color = anotherPawn[0].id.split("_");
        //if pawn in checked square is enemy ----> 
        if(pawn2color[0] != color){
            var square = parseInt(c.id);
            var possibeSquareJump = square + move;
            console.log("POSSIBLE SQUARE: " + possibeSquareJump);
            //check if can jump over and capture ----- if YES block possibility to move without capturing any pawn and give drop listeners to jump destination square, if NO do nothing
            if($("#"+possibeSquareJump).find('img').length == 0){
                // if(!canJump){
                //     deleteDropFromAllSquares();
                // }
                
                var posiible = document.getElementById(possibeSquareJump);
                if(possibeSquareJump > 64 || possibeSquareJump < 1){
                    canJump = false;
                    //return false;
                }
                if(posiible.className == "wh"){
                    console.log("POLE JEST BIALE");
                    canJump = false;
                    //return false;
                }else{
                posiible.addEventListener('drop', drop);
                posiible.addEventListener('dragover', allowDrop);
                jumper = color + "_" + pawn;
                canJump = true;
                return true;
                }
            }else{
                canJump = false;
                //return false;
            }
        }
    }
//if can move 1 diagonal and can't jump
    
    if(!canJump){
    var move = c.id - pawn;
    if(onMove == "w")
        if(move < 0){
            c.addEventListener('drop', drop);
            c.addEventListener('dragover', allowDrop);
            console.log("SETTING LISTENER" + c.id);
        }
    if(onMove == "b")
        if(move > 0){
            c.addEventListener('drop', drop);
            c.addEventListener('dragover', allowDrop);
            console.log("SETTING LISTENER" + c.id);
        }
    }
    console.log("DOTARLO" + canJump);
    return false;
    
}


function checkIfCanJumpMore() {
    if(jumper == "0"){
        return false;
    }
    else{
        var valid = 0;
        var squares = document.querySelectorAll('.bl');
        i = 0;
        while (i < squares.length) {
            var c = squares[i++];
            var sp = jumper.split("_");
    
            //checking squares around jumper pawn and looking if they are valid in checkIfValid function
            if(onMove == "w" || onMove == "b"){
                //console.log(onMove);
                var square = parseInt(sp[1]);
            if(c.id == sp[1]-9 || c.id == sp[1]-7 || c.id == square+9 || c.id == square+7){
                console.log("C.ID: " + c.id);
                if(checkIfValid(c, sp[1], sp[0])){
                    console.log("VALID");
                    valid = 1;
                }else{
                    console.log("UNVALID");
                }
            }
        }
        }
    }

    if(valid == 1){
        return true;
    }
    return false;
}


function checkIfCanJump() {
    var pawns = document.querySelectorAll('.pawn');
            j = 0;
            while (j < pawns.length) {
                var squares = document.querySelectorAll('.bl');
                i = 0;
                while (i < squares.length) {
                    var c = squares[i++];
                    
                    var sp = pawns[j].id.split("_");
                    //console.log("O HUJ::::" + sp);
            
                    //checking squares around every pawn and looking if they are valid in checkIfValid function
                    if(onMove == "w" && sp[0] == "w"){
                        //console.log(onMove);
                        var square = parseInt(sp[1]);
                    if(c.id == sp[1]-9 || c.id == sp[1]-7 || c.id == square+9 || c.id == square+7){
                        if(checkIfValid(c, sp[1], sp[0])){
                            return true;
                        }
            
                    }
                }
                if(onMove == "b" && sp[0] == "b"){
                    //console.log(onMove);
                    var square = parseInt(sp[1]);
                if(c.id == sp[1]-9 || c.id == sp[1]-7 || c.id == square+9 || c.id == square+7){
                    if(checkIfValid(c, sp[1], sp[0])){
                        return true;
                    }
        
                }
            }
                }
                j++;
            }
    return false;
}


//running when turn is ended, letting move to next player
function endTurn() {
    console.log("END TURN");
    state = !state;

    if(state){
        onMove = "w";
        var pawns = document.querySelectorAll('.pawn');

            i = 0;
            while (i < pawns.length) {
                var c = pawns[i++];
                var sp = c.id.split("_");
                if(sp[0] == "w")
                c.setAttribute("draggable", "true");
                else
                c.setAttribute("draggable", "false");
            }
    }
    if(!state){
        onMove = "b";
        var pawns = document.querySelectorAll('.pawn');
        
            i = 0;
            while (i < pawns.length) {
                var c = pawns[i++];
                var sp = c.id.split("_");
                if(sp[0] == "b")
                c.setAttribute("draggable", "true");
                else
                c.setAttribute("draggable", "false");
            }
    }

    jumper = "0";
    canJump = false;

    if(checkIfCanJump()){
        canJump = true;
    }
    console.log("KONIEC TURY");
    console.log("CANJUMP: " + canJump);
}




createBoard();
createPawns();

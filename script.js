let canvas = document.querySelector(".canvas");
let bird = document.querySelector(".bird");
let container = document.querySelector(".container");

const windowHeight = window.innerHeight;
const multiplier = windowHeight/512;
document.body.style.transform = `scale(${multiplier})`;

let gravityAcc = 1.5;
let birdX = 12;
let birdY = 150;
let birdHeight = 24;
let birdLength = 34;
let groundHeight = 408;


let globalPipesX = 290;
let pipeWidth = 52;
let pipeLength = 320;
let distanceBetweenPipes = 100;
let jumpHeight = 60;
let pipeSpeed = 1;
let score = 0;
let repeat = true;

let scoreHeader = document.createElement("h1");
    scoreHeader.classList.add("score");
    scoreHeader.innerHTML = score;
    canvas.appendChild(scoreHeader);

initialState();

function randomHeight(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function initialState(){
    bird.style.left = birdX + 'px';
    bird.style.top = birdY + 'px';

    let canvasGreyOverlay = document.createElement("div");
    canvasGreyOverlay.classList.add("canvasGreyOverlay");
    canvas.appendChild(canvasGreyOverlay);

    let playButton = document.createElement("button");
        playButton.classList.add("playButton");
        playButton.innerHTML = "Play";
        playButton.addEventListener("click", ()=>{
            canvas.removeChild(playButton);
            canvas.removeChild(canvasGreyOverlay);
            startGame();
        });
        canvas.appendChild(playButton);

}

function createPipeSet(pipesX, distanceBetweenPipes){
    let pipesY = randomHeight(-50,-290);
    let pipeUp = document.createElement("div")
        pipeUp.classList.add("pipeUp");
        pipeUp.style.left = pipesX + 'px';
        pipeUp.style.top = pipesY + 'px';

    let pipeDown = document.createElement("div");
        pipeDown.classList.add("pipeDown");
        pipeDown.style.left = pipesX + 'px';
        pipeDown.style.top = 320 + pipesY + distanceBetweenPipes + 'px';

    canvas.appendChild(pipeUp);
    canvas.appendChild(pipeDown);

    movePipeSet(pipeUp, pipeDown, pipesX, pipeSpeed, pipesY);
}

function movePipeSet(pipeUp, pipeDown, pipesX, pipeSpeed, pipesY){
    if(pipesX <= -pipeWidth){
        if(repeat){
            canvas.removeChild(pipeUp);
            canvas.removeChild(pipeDown);
            return false;
        }   
    }
    else{
        updateState(pipesX, pipesY);
        pipesX -= pipeSpeed;
        pipeUp.style.left = pipesX + 'px';
        pipeDown.style.left = pipesX + 'px';
        setTimeout(()=>{
            movePipeSet(pipeUp, pipeDown, pipesX, pipeSpeed, pipesY)
        },10)
    }
}

function updateScore(score){
    scoreHeader.innerHTML = score;
}

function updateState(pipesX, pipesY){
    if(repeat){
        if(birdX+birdLength >= pipesX && birdX <= pipesX + pipeWidth){
            if(birdY <= pipesY + pipeLength || birdY + birdHeight >= pipesY + pipeLength + distanceBetweenPipes){
                gameOver();
                repeat = false;
            }
        }
        if(birdX+birdLength === pipesX + pipeWidth) {
            score++;
            updateScore(score);
        }
    }
}

function startGravity(gAcceleration){
    if(birdY+24 >= 408 ){
        gameOver();
    } 
    else{
    birdY += gAcceleration;
    bird.style.top = birdY + 'px';

    setTimeout(() => {
        startGravity(gAcceleration)
    },10)
    }
}

function jump(){
    if(birdY-birdHeight > 0){
        birdY -= jumpHeight;
        bird.style.top = birdY + 'px';
        return birdY;
    }  
}

function checkSpacebar(event){
    if(event.keyCode === 32){
        jump(bird, birdY, jumpHeight);
    }
}

function startGame(){ 
    repeat = true; 
    document.addEventListener("keyup", checkSpacebar);
    canvas.addEventListener("click", jump);

    score = 0;
    scoreHeader.innerHTML = score;

    startGravity(gravityAcc);
    setInterval(()=>{
        createPipeSet(globalPipesX, distanceBetweenPipes)
        }, 2000);
    return score;
}

function clearAllIntervals(){
    var intervals = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for(let i= 1; i < intervals; i++){
        window.clearInterval(i);
    }
}

function reloadGameState(){
        if(birdY+birdHeight >= groundHeight){
            birdY -= 150;
        }
        bird.style.left = birdX + 'px';
        bird.style.top = birdY + 'px';
    
        var pipesUp = document.querySelectorAll('.pipeUp');
        var pipesDown = document.querySelectorAll('.pipeDown');
        
        pipesUp.forEach(pipe => {
            pipe.remove();
        })
    
        pipesDown.forEach(pipe => {
            pipe.remove();
        })
    
        let canvasGreyOverlay = document.createElement("div");
        canvasGreyOverlay.classList.add("canvasGreyOverlay");
        canvas.appendChild(canvasGreyOverlay);

        let status = document.createElement("h1");
        status.classList.add("status");
        status.innerHTML = "You died.<br>&nbsp Score:" + score;
        canvasGreyOverlay.appendChild(status);
    
        let playAgainButton = document.createElement("button");
            playAgainButton.classList.add("playButton");
            playAgainButton.innerHTML = "Play again";
            playAgainButton.addEventListener("click", ()=>{
                    startGame()

                    canvas.removeChild(playAgainButton);
                    canvas.removeChild(canvasGreyOverlay);
                    canvasGreyOverlay.removeChild(status);

            });
            canvas.appendChild(playAgainButton);
        
}

function gameOver(){
    clearAllIntervals();
    reloadGameState();
}



var heart;
var iks;
var rector;
var star;
var thunder;
var plane;
var attak;
var grid;
var tigerLeft;
var tigerRight;
var colors = ['red', 'blue', 'green', 'black','grey', 'yellow'];
var figures = [];
var point = {};
var Game = {};
Game.isUnitMove = false;
var clickPoint = {};
var ctx;
var objClick = {};
var objHex = {};
var hpEffect = {};
hpEffect.ticks = 0;
hpEffect.isActive = false;
hpEffect.pos = 0;
var movingEffect ={};
movingEffect.posX = 0;
movingEffect.posY = 0;
movingEffect.ticks = 0;
const aHex = 50;
const d2h = Math.sqrt(3)*aHex; //
const dh = (Math.sqrt(3)*aHex)/2; //
objClick.isActive = false;
objClick.radius = 0;

point.x = 0;
point.y = 0;
clickPoint.x = 0;
clickPoint.y = 0;
loadResources(); 
function getNewHex()
{
    let objHex = {};
    objHex.arrPoint = [];
    objHex.xC = 0;
    objHex.yC = 0;
    objHex.unitIndex = -1;
    return objHex;    
}
function loadResources() {
    heart = new Image();
    heart.src = "images/heart.png";
    attak = new Image();
    attak.src = "images/attak50.png";
    iks = new Image();
    iks.src = "images/iks.png";
    star = new Image();
    star.src = "images/star.png";
    thunder = new Image();
    thunder.src = "images/thunder.png";
    rector = new Image();
    rector.src = "images/rector.png";
    plane = new Image();
    plane.src = "images/plane.png";
    grid = new Image();
    grid.src = "images/grid.png";    
    tigerLeft = new Image();
    tigerLeft.src = "images/TigerLeftSprite100.png";
    tigerRight = new Image();
    tigerRight.src = "images/TigerRight100.png";
    //TigerRight100

    figures.push(heart);
    figures.push(iks);
    figures.push(star);
    figures.push(thunder);
    figures.push(rector);

}
window.requestAnimFrame = (function(){ 
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){ 
              window.setTimeout(callback, 1000 / 60); 
            }; 
  })();

$(document).ready(function(){
    Init();
    var canvas = document.getElementById('canvas'); 
    ctx = canvas.getContext('2d'); 
    ctx.fillStyle = 'red';  
    canvas.onmousemove = function(evt) {
        point.x = evt.pageX- canvas.offsetLeft;
        point.y = evt.pageY- canvas.offsetTop;

        checkCollision();
   }

  canvas.onclick = function(evt) {
    clickPoint.x = evt.pageX- canvas.offsetLeft;
    clickPoint.y = evt.pageY- canvas.offsetTop;
    objClick.radius = 0;
    objClick.isActive = true;  
    Game.isUnitMove = true;
    Game.isUnitMove = true;
    if(Game.isUnitMove) return;
    
    tryMoveUnit();
    }
   //totdo: адекватная загрузка ресурсов. рисование ислючительно после загрузки. 

   window.requestAnimFrame(drowPlane);
});
var currentHexIndex = -1;
const _360 = 2 * Math.PI;
function tryMoveUnit()
{
    checkCollision();
    
    if(currentHexIndex != -1){        
        //проверить еще что он не занят другим юнитом и вообще проходим. и вот тут неплохо было бы иметь просто тсатус ячейки.
        // init Step
        let hex =  arrHexs[currentHexIndex]; 
       // кликнули по себе, просто делаем переход хода, следующего (не факт что своему.)
       if(arrHexs[currentHexIndex].unitIndex == currentUnit)
       {
        nextUnit();
        return;
       }
       if(hex.unitIndex == -1){ // тоесть пустая клетка
        Game.isUnitMove = true;
        arrHexs[units[currentUnit].pos].unitIndex = -1; // очищаю клетку, что с нее уехали.
        units[currentUnit].isMoving = true;
        movingEffect.posX = arrHexs[units[currentUnit].pos].xC;
        movingEffect.posY = arrHexs[units[currentUnit].pos].yC;
        movingEffect.ticks = 0;
        units[currentUnit].pos = currentHexIndex; // назначаю юниту, новую позицию. где он должен оказаться в итоге.
        arrHexs[currentHexIndex].unitIndex = currentUnit; //назначаю клетке, что на ней теперь стоит этот перемещенный юнит.

        nextUnit();
        return;
       }
       if(units[currentUnit].group == units[arrHexs[currentHexIndex].unitIndex].group){
           return; // если я кликнул по юниту своих войск, ничего не происходит. 
       }  
       else {
           // тут пересчет атаки
           let tergetUnit =  units[arrHexs[currentHexIndex].unitIndex];
           let curUnit = units[currentUnit];
           let diffHp = tergetUnit.currentHp - curUnit.atak;

           hpEffect.value = diffHp > 0 ? curUnit.atak : tergetUnit.currentHp;
           hpEffect.isActive = true;
           hpEffect.pos = currentHexIndex;

           tergetUnit.currentHp = diffHp >0 ? diffHp : 0;           
           nextUnit();
        return;
       }
    }
}
function nextUnit()
{
    // карусель
    currentUnit++;
    if(currentUnit >= units.length)
    {
        currentUnit = 0;
    }
}
//var showAttak = false;
function checkCollision()
{
    if(currentHexIndex != -1){
    let _hex =  arrHexs[currentHexIndex];
    ctx.beginPath();
    ctx.arc(_hex.xC, _hex.yC, dh, 0, _360, false);
    ctx.closePath();

    if(ctx.isPointInPath(point.x, point.y)) return;
    }
    for (let index = 0; index < arrHexs.length; index++) {
        ctx.beginPath();
        ctx.arc(arrHexs[index].xC, arrHexs[index].yC, dh, 0, _360, false);
        ctx.closePath();
    
        if(ctx.isPointInPath(point.x, point.y)){
            currentHexIndex = index;            
            return;
        }
        
    }
    currentHexIndex = -1;

}
var arrHexs = [];
var units = [];
var currentUnit = 0;
function Init()
{   
    let startPosx = aHex;
    let startPosy = aHex;
    for(let yindex = 0; yindex< 4; yindex++) {
        let ypos = startPosy+ (yindex*3*aHex);
        for (let index = 0; index < 7; index++) {
            let h = getNewHex();
            h.yC = ypos;
            h.xC = startPosx+(index*d2h);
            arrHexs.push(h);
        }
    }

    startPosx = startPosx+dh;
    startPosy = startPosy+(aHex*3)/2;

    for(let yindex = 0; yindex< 3; yindex++) {
        let ypos = startPosy+ (yindex*3*aHex);
        for (let index = 0; index < 7; index++) {
            let h = getNewHex();
            h.yC = ypos;
            h.xC = startPosx+(index*d2h);
            arrHexs.push(h);
        }
    }
    units.push({pos:5, maxHp: 100, currentHp: 57, group: 1, atak: 30, isMoving: false, oldPos: {}});     
    units.push({pos:10, maxHp: 100, currentHp: 80, group: 1, atak: 30, isMoving: false, oldPos: {} });
    units.push({pos:16, maxHp: 100, currentHp: 12, group: 1, atak: 30, isMoving: false, oldPos: {} });
    units.push({pos:20, maxHp: 100, currentHp: 100, group: 2, atak: 30, isMoving: false, oldPos: {} });
    units.push({pos:26, maxHp: 100, currentHp: 90, group: 2, atak: 30, isMoving: false, oldPos: {} });
    
    arrHexs[5].unitIndex = 0;
    arrHexs[10].unitIndex = 1;
    arrHexs[16].unitIndex = 2;
    arrHexs[20].unitIndex = 3;
    arrHexs[26].unitIndex = 4;
   // h.arrPoint.push({x:0,y:0});
   // h.arrPoint.push({x:50,y:0});
  //  h.arrPoint.push({x:50,y:50});
   // h.arrPoint.push({x:0,y:50});
}

function drowPlane()
{
    window.requestAnimFrame(drowPlane);    
        ctx.fillStyle = 'red';
        ctx.drawImage(plane,0,0);
        //ctx.drawImage(grid,0,0);
        drawGrid();
        drawUnits();
        drawHpEffect();
       // ctx.fillRect(point.x,point.y,10,10); 
       //попытка нарисовать круги клика если такой был. 
        drawClick();
    }


function drawUnits()
{
    for (let index = 0; index < units.length; index++) {       
        let pos = units[index].pos;
        let x = arrHexs[pos].xC;
        let y = arrHexs[pos].yC;

        if(units[index].isMoving)
        {
            x = movingEffect.posX;
            y = movingEffect.posY;
            // а теперь пересчет новой позиции на следующий тик. логика такая что когда мы достигнем нужной клетки. остановить анимацию. 
            // где то тут расчет выбора спрайта для анимации.
            let c = Math.sqrt()

        }

        if(units[index].group == 1)
        {
            ctx.drawImage(tigerLeft,0,0, 100, 74, x-48,y-37, 100, 74);

        }else 
        {
            ctx.drawImage(tigerRight, x-48,y-37);
        }
        
        drawHp(index);
        drawAttak(index,x,y);
    }
}
function drawAttak(index,x,y)
{
    if(units[index].pos == currentHexIndex) {
        if(units[currentUnit].group != units[index].group){
            ctx.drawImage(attak, x-25,y-25);
        }
    }
     
}
function drawHpEffect()
{
    if(hpEffect.isActive)
    {
        let hex = arrHexs[hpEffect.pos];
        ctx.fillStyle = "red";
        ctx.font = " 11pt Arial";

        ctx.fillText((-1)*hpEffect.value,hex.xC-10,hex.yC-25-hpEffect.dY);
        hpEffect.ticks++;
        hpEffect.dY = hpEffect.ticks / 4;
        if(hpEffect.ticks > 100) 
        {
            hpEffect.ticks = 0;
            hpEffect.dY = 0;
            hpEffect.isActive = false;
        }
    }
}

function drawGrid()
{
    for (let index = 0; index < arrHexs.length; index++) {     

        ctx.beginPath();
        ctx.arc(arrHexs[index].xC, arrHexs[index].yC, dh, 0, _360, false);
        
        // orange -  wait user tern
        if(index == units[currentUnit].pos)
        {
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = 'orange';
            ctx.fill();            
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'red';
        }

        if(index == currentHexIndex) 
        {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'grey';
            ctx.fill();            
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'red';
        }

        ctx.stroke();   
    }
    
}
function drawHp(unitIndex)
{
    let uindex = unitIndex;
    let maxHp = units[uindex].maxHp;
    let curHp = units[uindex].currentHp;
    let unitPos = units[uindex].pos;
    let xLine = arrHexs[unitPos].xC - 25;
    let yLine = arrHexs[unitPos].yC - 30;
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'green';
    let persent = (curHp/maxHp)*10;
    let intRect = Math.floor(persent); // тут я получаю свою 5, если скажем было 5.6
    let ost = (persent-intRect)*10; // а тут получаю свои 0.6 ввиде 6, для будущих 6рх.

    if(persent<=10 && persent>=7) {ctx.fillStyle = 'green';}
    if(persent<7 && persent>=4) {ctx.fillStyle = 'yellow';}
    if(persent<4 && persent>=0) {ctx.fillStyle = 'red';}
    for (let index = 0; index < intRect; index++) {
        
        ctx.fillRect(xLine,yLine,5,5);
        xLine += 6;
    }
    
}
function drawClick()
{
    if(objClick.isActive){
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(clickPoint.x, clickPoint.y, objClick.radius, 0, _360, false);
        ctx.fill();
        ctx.stroke();
        objClick.radius+= 2;
        if(objClick.radius>25) 
        {
            objClick.isActive = false;
            objClick.radius = 0;
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'black';
    }    
}

function getColor()
{
    let cl = Math.floor(Math.random() * colors.length); 
    return colors[cl];
}
function getFigures()
{
    let f = Math.floor(Math.random() * figures.length); 
    return figures[f];
}
function drowFigures(ctx)
{
    setTimeout(function(){
        ctx.fillStyle = getColor(); 
        let x = Math.floor(Math.random() * 800); 
        let y = Math.floor(Math.random() * 600); 
        //let w = Math.floor(Math.random() * 100)+1; 
        ctx.drawImage(getFigures(),x,y);  
        drowFigures(ctx);
        },100);
  
}
function drowRect(ctx)
{
    setTimeout(function(){
    ctx.fillStyle = getColor(); 
    let x = Math.floor(Math.random() * 800); 
    let y = Math.floor(Math.random() * 600); 
    let w = Math.floor(Math.random() * 100)+1; 
    ctx.fillRect(x,y,w,w); 
    drowRect(ctx);
    },1);
    
}



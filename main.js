var heart;
var iks;
var rector;
var star;
var thunder;
var plane;
var grid;
var colors = ['red', 'blue', 'green', 'black','grey', 'yellow'];
var figures = [];
var point = {};
var clickPoint = {};
var ctx;
var objClick = {};
var objHex = {};
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
    return objHex;    
}
function loadResources() {
    heart = new Image();
    heart.src = "images/heart.png";
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
    }
   //totdo: адекватная загрузка ресурсов. рисование ислючительно после загрузки. 

   window.requestAnimFrame(drowPlane);
});
var currentHexIndex = 0;
const _360 = 2 * Math.PI;
function checkCollision()
{
    let _hex =  arrHexs[currentHexIndex];
    ctx.beginPath();
    ctx.arc(_hex.xC, _hex.yC, dh, 0, _360, false);
    ctx.closePath();

    if(ctx.isPointInPath(point.x, point.y)) return;
     
    for (let index = 0; index < arrHexs.length; index++) {
        ctx.beginPath();
        ctx.arc(arrHexs[index].xC, arrHexs[index].yC, dh, 0, _360, false);
        ctx.closePath();
    
        if(ctx.isPointInPath(point.x, point.y))currentHexIndex = index;
        
    }

}
var arrHexs = [];
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
       // ctx.fillRect(point.x,point.y,10,10); 
        drawClick(); //попытка нарисовать круги клика если такой был. 
}
function drawGrid()
{
    for (let index = 0; index < arrHexs.length; index++) {        
        ctx.beginPath();
        ctx.arc(arrHexs[index].xC, arrHexs[index].yC, dh, 0, _360, false);

        if(index == currentHexIndex) ctx.fill();

        ctx.stroke();   
    }
    
}
function drawClick()
{
    if(objClick.isActive){
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(clickPoint.x, clickPoint.y, objClick.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        objClick.radius+= 2;
        if(objClick.radius>50) 
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



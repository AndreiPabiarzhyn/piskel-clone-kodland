
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let brushSize=1;
let drawing=false;
let undoStack=[];
let scale=1;
let showGrid=false;

canvas.addEventListener("mousedown",()=>{drawing=true; save();});
canvas.addEventListener("mouseup",()=>drawing=false);
canvas.addEventListener("mousemove",draw);

function setBrush(s){brushSize=s;}

function draw(e){
 if(!drawing)return;
 const rect=canvas.getBoundingClientRect();
 const x=Math.floor((e.clientX-rect.left)/scale);
 const y=Math.floor((e.clientY-rect.top)/scale);
 ctx.fillStyle=document.getElementById("color").value;
 for(let dx=0;dx<brushSize;dx++){
  for(let dy=0;dy<brushSize;dy++){
    ctx.fillRect(x+dx,y+dy,1,1);
  }
 }
}

function save(){
 undoStack.push(canvas.toDataURL());
 if(undoStack.length>30)undoStack.shift();
}

function undo(){
 if(!undoStack.length)return;
 let img=new Image();
 img.src=undoStack.pop();
 img.onload=()=>ctx.drawImage(img,0,0);
}

function downloadPNG(){
 let a=document.createElement("a");
 a.href=canvas.toDataURL();
 a.download="sprite.png";
 a.click();
}

function downloadGIF(){
 let gif=new GIF({workers:2,quality:10});
 gif.addFrame(canvas,{delay:200});
 gif.on('finished',function(blob){
   let a=document.createElement("a");
   a.href=URL.createObjectURL(blob);
   a.download="sprite.gif";
   a.click();
 });
 gif.render();
}

function newSprite(){
 ctx.clearRect(0,0,canvas.width,canvas.height);
}

function resizeCanvas(){
 let w=prompt("width",canvas.width);
 let h=prompt("height",canvas.height);
 canvas.width=w;
 canvas.height=h;
}

function uploadGIF(e){
 let file=e.target.files[0];
 let r=new FileReader();
 r.onload=(ev)=>{
   let img=new Image();
   img.onload=()=>ctx.drawImage(img,0,0);
   img.src=ev.target.result;
 }
 r.readAsDataURL(file);
}

function zoomIn(){
 scale+=0.5;
 canvas.style.transform=`scale(${scale})`;
}

function zoomOut(){
 scale=Math.max(1,scale-0.5);
 canvas.style.transform=`scale(${scale})`;
}

function toggleGrid(){
 showGrid=!showGrid;
 drawGrid();
}

function drawGrid(){
 if(!showGrid)return;
 ctx.strokeStyle="#ddd";
 for(let x=0;x<canvas.width;x++){
  ctx.beginPath();
  ctx.moveTo(x,0);
  ctx.lineTo(x,canvas.height);
  ctx.stroke();
 }
 for(let y=0;y<canvas.height;y++){
  ctx.beginPath();
  ctx.moveTo(0,y);
  ctx.lineTo(canvas.width,y);
  ctx.stroke();
 }
}

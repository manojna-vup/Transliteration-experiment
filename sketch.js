let speechRec;
let resultText = "";
let displayText = "";
let targetText = "";
let typingIndex = 0;
let phase = "waiting"; 
let customFont;
let currentSlide = 0;

const questions = [
  "HOW DO YOU SAY KNOWLEDGE IN YOUR LANGUAGE?",
  "WHAT'S A WORD OR PHRASE THAT CANNOT BE TRANSLATED INTO ENGLISH?",
  "WHAT'S AN IDIOM OR PHRASE THAT WOULD LOSE ITS MEANING IF TRANSLATED INTO ENGLISH?",
  "WHAT DO YOU THINK GETS LOST WHEN EVERYTHING NEEDS TO BE WRITTEN IN ENGLISH?",
  "WHAT WAS YOUR FIRST EXPERIENCE LIKE READING OR WRITING YOUR LANGUAGE IN ANOTHER SCRIPT?"
];


const slideBGColors = ["#A3D1F6","#F9F09C","#B8B7FF","#E38952","#477152"];
const textColors = ["#06007F","#762671","#21007F","#6D2025","#FFC3FC"];


let finishedTypingTime = 0;

function preload() {
  customFont = loadFont("fonts/PPNeueMontrealMono-Medium.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(customFont);
  textAlign(LEFT, TOP);
  fill(textColors[currentSlide]);

  
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  speechRec.start(true, false); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function mousePressed() {
  currentSlide++;
  if (currentSlide >= questions.length) currentSlide = 0;
  resetSlide();
}

function resetSlide() {
  resultText = "";
  displayText = "";
  targetText = "";
  typingIndex = 0;
  phase = "waiting";
  finishedTypingTime = 0;
  fill(textColors[currentSlide]);
}

function gotSpeech() {
  if (!speechRec.resultValue) return;

  resultText = speechRec.resultString.toUpperCase();
  console.log("Heard:", resultText);

 
  switch(currentSlide) {
    case 0:
      targetText = resultText;
      displayText = "";
      typingIndex = 0;
      phase = "typing";
      break;
    case 1:
    case 2:
      targetText = resultText;
      displayText = "";
      typingIndex = 0;
      phase = "typing_slide2";
      break;
    case 3:
      targetText = resultText;
      displayText = "";
      typingIndex = 0;
      phase = "typing_slide4";
      break;
    case 4:
      targetText = resultText;
      displayText = "";
      typingIndex = 0;
      phase = "typing_slide5";
      break;
  }
}

function draw() {
  background(slideBGColors[currentSlide]);
  fill(textColors[currentSlide]);

 
  textSize(70);
  const margin = 40;
  const maxQW = width - margin*2;
  text(questions[currentSlide], margin, 40, maxQW, 300);

  
  switch(currentSlide) {
    case 0: drawSlide1(); break;
    case 1: drawSlide2(); break;
    case 2: drawSlide2(); break; // same as slide 2
    case 3: drawSlide4(); break;
    case 4: drawSlide5(); break;
  }
}


function drawSlide1() {
  textSize(70);
  const margin = 40;
  const ansY = height - 200;

  text(displayText, margin, ansY, width - margin*2, height - ansY);

  if (phase === "typing") {
    if (frameCount % 4 === 0 && typingIndex < targetText.length) {
      displayText += targetText.charAt(typingIndex);
      typingIndex++;
    } else if (typingIndex >= targetText.length) {
      if (finishedTypingTime === 0) finishedTypingTime = millis();
      if (millis() - finishedTypingTime > 1000) {
        phase = "erasing";
        finishedTypingTime = 0;
      }
    }
  } else if (phase === "erasing") {
    if (frameCount % 3 === 0 && displayText.length > 0) {
      displayText = displayText.slice(0, -1);
    } else if (displayText.length === 0) {
      targetText = "KNOWLEDGE";
      typingIndex = 0;
      phase = "finalTyping";
    }
  } else if (phase === "finalTyping") {
    if (frameCount % 4 === 0 && typingIndex < targetText.length) {
      displayText += targetText.charAt(typingIndex);
      typingIndex++;
    }
  }
}


function drawSlide2() {
  renderSlideWithUnderline(true);
}


function drawSlide4() {
  textSize(70);
  const margin = 40;
  const ansY = height - 200;
  const maxLineWidth = width - margin*2;
  const lineHeight = 80;

  
  if (phase === "typing_slide4") {
    if (frameCount % 4 === 0 && typingIndex < targetText.length) {
      displayText += targetText.charAt(typingIndex);
      typingIndex++;
    } else if (typingIndex >= targetText.length) {
      phase = "done_slide4";
    }
  }

  const words = displayText.split(/\s+/).filter(w => w.length>0);
  let lines = [];
  let curLine="", curWidth=0;
  for (let i=0;i<words.length;i++){
    let w = words[i];
    let wWithSpace = (curLine==="")? w: " "+w;
    let wWidth = textWidth(wWithSpace);
    if(curWidth + wWidth <= maxLineWidth){
      curLine += wWithSpace;
      curWidth += wWidth;
    } else {
      lines.push(curLine.trim());
      curLine = w;
      curWidth = textWidth(w);
    }
  }
  if(curLine!=="") lines.push(curLine.trim());

  let startY = ansY - (lines.length-1)*lineHeight;

  
  for (let i=0;i<lines.length;i++){
    let lineText = lines[i];
    let y = startY + i*lineHeight;
    let parts = lineText.split(" ");
    let x = margin;
    for(let p=0;p<parts.length;p++){
      let w = parts[p];
      let wWidth = textWidth(w);

      fill(slideBGColors[currentSlide]);
      stroke(textColors[currentSlide]);
      strokeWeight(2);
      text(w, x, y);
      noStroke();

      
     

      x += wWidth + textWidth(" ");
    }
  }
}


function drawSlide5() {
  textSize(70);
  const margin = 40;
  const ansY = height - 200;
  const maxLineWidth = width - margin*2;
  const lineHeight = 80;

  if (phase === "typing_slide5") {
    if(frameCount%4===0 && typingIndex<targetText.length){
      displayText += targetText.charAt(typingIndex);
      typingIndex++;
    } else if (typingIndex>=targetText.length){
      phase = "done_slide5";
    }
  }

  const words = displayText.split(/\s+/).filter(w=>w.length>0);
  let lines=[], curLine="", curWidth=0;
  for(let i=0;i<words.length;i++){
    let w = words[i];
    let wWithSpace=(curLine==="")? w:" "+w;
    let wWidth=textWidth(wWithSpace);
    if(curWidth + wWidth <= maxLineWidth){
      curLine+=wWithSpace;
      curWidth+=wWidth;
    } else {
      lines.push(curLine.trim());
      curLine=w;
      curWidth=textWidth(w);
    }
  }
  if(curLine!=="") lines.push(curLine.trim());

  let startY = ansY - (lines.length-1)*lineHeight;

  fill(textColors[currentSlide]);
  noStroke();
  for(let i=0;i<lines.length;i++){
    let lineText=lines[i];
    let y=startY+i*lineHeight;
    text(lineText, margin, y);
  }
}


function renderSlideWithUnderline(addUnderline){
  textSize(70);
  const margin = 40;
  const ansY = height - 200;
  const maxLineWidth = width - margin*2;
  const lineHeight = 80;

  if(phase === "typing_slide2"){
    if(frameCount%4===0 && typingIndex<targetText.length){
      displayText += targetText.charAt(typingIndex);
      typingIndex++;
    } else if (typingIndex>=targetText.length){
      phase="done_slide2";
    }
  }

  const words = displayText.split(/\s+/).filter(w=>w.length>0);
  let lines=[], curLine="", curWidth=0;
  for(let i=0;i<words.length;i++){
    let w=words[i];
    let wWithSpace=(curLine==="")? w:" "+w;
    let wWidth=textWidth(wWithSpace);
    if(curWidth+wWidth<=maxLineWidth){
      curLine+=wWithSpace;
      curWidth+=wWidth;
    } else {
      lines.push(curLine.trim());
      curLine=w;
      curWidth=textWidth(w);
    }
  }
  if(curLine!=="") lines.push(curLine.trim());

  let startY = ansY - (lines.length-1)*lineHeight;

  fill(textColors[currentSlide]);
  noStroke();
  for(let i=0;i<lines.length;i++){
    let lineText=lines[i];
    let y=startY+i*lineHeight;
    let parts=lineText.split(" ");
    let x=margin;
    for(let p=0;p<parts.length;p++){
      let w=parts[p];
      let wWidth=textWidth(w);
      text(w,x,y);
      if(addUnderline){
        stroke(255,0,0);
        strokeWeight(1);
        drawingContext.setLineDash([6,6]);
        line(x,y+70,x+wWidth,y+70);
        drawingContext.setLineDash([]);
        noStroke();
      }
      x+=wWidth+textWidth(" ");
    }
  }
}

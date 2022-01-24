function setup() {
  createCanvas(1000, 2000);
}

function draw() {
  background(255);
  
  // Example 1
  noStroke();
  fill(120, 240, 60);
  rect(40, 40, 250, 120);
  stroke(0);
  fill(255);
  circle(100, 100, 100);
  square(180, 50, 100);

  // Example 2
  noStroke();
  fill("rgba(255, 0, 0, 0.25)"); //Red circle
  circle(145, 300, 100);
  fill("rgba(0, 255, 0, 0.25)"); //Green circle
  circle(180, 350, 100);
  fill("rgba(0, 0, 255, 0.25)"); //Blue circle
  circle(110, 350, 100);

  // Example 3
  fill(0);
  rect(50, 500, 250, 120);
  fill(255, 255, 0);
  arc(110, 560, 100, 100, PI + QUARTER_PI, HALF_PI + QUARTER_PI );
  fill(240, 65, 44);
  circle(230, 560, 100);
  rect(180, 560, 100, 50);
  fill(255);
  circle(205, 560, 30);
  circle(255, 560, 30);
  fill(0, 50, 255);
  circle(205, 560, 20);
  circle(255, 560, 20);

  // Example 4
  fill(0, 0, 130);
  square(40, 680, 250);
  strokeWeight(4);
  stroke(255);
  fill(0, 128, 0);
  circle(165, 805, 120);
  fill(255, 0, 0);

  beginShape();
  vertex(165, 745); // top
  vertex(180, 790);
  vertex(225, 790); // right
  vertex(190, 820);
  vertex(200, 860); // bottom-right
  vertex(165, 840);
  vertex(130, 860); // bottom-left
  vertex(140, 820);

  vertex(105, 790); // left
  vertex(150, 790);
  endShape(CLOSE);
}
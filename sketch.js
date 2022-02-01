let c = null;
let x0 = null;
let y0 = null;

function setup() {
  createCanvas(1000, 500);
  background(200, 200, 200);
}

function draw() {
  let red = 'rgb(255, 0, 0)'
  let orange = 'rgb(255,165,0)'
  let yellow = 'rgb(255,255,0)'
  let green = 'rgb(0,255,0)'
  let cyan = 'rgb(0,255,255)'
  let blue = 'rgb(0,0,255)'  
  let magenta = 'rgb(255,0,255)'
  let brown = 'rgb(139,69,19)'
  let white = 'rgb(255,255,255)'
  let black = 'rgb(0,0,0)'

  if (mouseIsPressed)
  {
    // Check if mouse has been let go by looking for null values
    if (!x0 || !y0)
    {
      // Valid to pick a new color!
      if (mouseX > 10 && mouseX < 40)
      {
        if (mouseY > 10 && mouseY < 40)
        {
          c = red;
        }
        else if (mouseY > 50 && mouseY < 80)
        {
          c = orange;
        }
        else if (mouseY > 90 && mouseY < 120)
        {
          c = yellow;
        }
        else if (mouseY > 130 && mouseY < 160)
        {
          c = green;
        }
        else if (mouseY > 170 && mouseY < 200)
        {
          c = cyan;
        }
        else if (mouseY > 210 && mouseY < 240)
        {
          c = blue;
        }
        else if (mouseY > 250 && mouseY < 280)
        {
          c = magenta;
        }
        else if (mouseY > 290 && mouseY < 320)
        {
          c = brown;
        }
        else if (mouseY > 330 && mouseY < 360)
        {
          c = white;
        }
        else if (mouseY > 370 && mouseY < 400)
        {
          c = black;
        }
      }
    }
    if (c)
    {
      if (!x0 || !y0)
      {
        x0 = mouseX;
        y0 = mouseY;
      }
      else
      {
        strokeWeight(20);
        stroke(c);
        line(x0, y0, mouseX, mouseY);
        x0 = mouseX;
        y0 = mouseY;
      }
    }
  }
  else
  {
    x0 = null;
    y0 = null;
  }
  
  noStroke();
  fill(200, 200, 200);
  rect(5, 5, 40, 400);
  fill(red);
  square(10, 10, 30);
  fill(orange);
  square(10, 50, 30);
  fill(yellow);
  square(10, 90, 30);
  fill(green);
  square(10, 130, 30);
  fill(cyan);
  square(10, 170, 30);
  fill(blue);
  square(10, 210, 30);
  fill(magenta);
  square(10, 250, 30);
  fill(brown);
  square(10, 290, 30);
  fill(white);
  square(10, 330, 30);
  fill(black);
  square(10, 370, 30);
}
//A processing.org implementation of SHEPARD's METHOD for INVERSE DISTANCE WEIGHTING FOLLOWING FORMULA FOUND AT http://www.ems-i.com/smshelp/Data_Module/Interpolation/Inverse_Distance_Weighted.htm
//TOMSCHOFIELDART.COM THIS CODE IS FREE UNDER CREATIVE COMMONS NON COMMERCIAL ATTRIBUTION SHARE ALIKE 2012

//this pimage will hold our heatmap
PImage mapImage;
PFont font;
float [] _xs;
float [] _ys;
float [] _f;
//an arbitary number of data points
int numDataPoints = 10;

void setup() {
  size(800, 600);
  colorMode(HSB);
  font = loadFont("AppleBraille-14.vlw");
  textFont (font, 14);
  
  //make some random data points
  _xs = new float[numDataPoints];
  _ys = new float[numDataPoints];
  _f = new float[numDataPoints];

  for (int i=0;i<numDataPoints;i++) {
    _xs[i]=random(width);
    _ys[i]=random(height);
    _f[i]=random(1.0);
  }
 mapImage=makeHeatMap();
}

void draw() {
  
  
  image(mapImage, 0, 0);
  
  for (int i=0;i<numDataPoints;i++) {
    text(str(_f[i]), _xs[i], _ys[i]);
  }
}

//returns the a pimage of screen size
PImage makeHeatMap() {
  PImage timg=createImage(width, height, RGB);
  timg.loadPixels();

  loadPixels();
  
  //maxpossible distance between any 2 pixels is the diagonal distance across the screen
  float maxDist = sqrt((width*width)+(height*height));
  float heats[] =new float[pixels.length];
  float x=0.0f;
  float y=0.0f;
  for (int i=0;i<pixels.length;i++) {
    float _hue=getInterpValue( x, y, _xs, _ys, _f);
   
    color aColor=color(255-(255*_hue),255,255);
    timg.pixels[i]= aColor;
    x++;
    if (x>=width) {
      x=0; 
      y++;
    }
  }
  timg.updatePixels();
  return timg;
}

//ITERATES THROUGH ALL THE DATA POINTS AND FINDS THE FURTHERS ONE
float getMaxDistanceFromPoint(float x, float y, float [] xs, float [] ys) {
  float maxDistance=0.0f;
  //get disance between this and each pther point
  for (int i=0;i<xs.length;i++) {
    float thisDist=dist(x, y, xs[i], ys[i]);
    //if this distance is greater than previous distances, this is the new max
    if (thisDist>maxDistance) {
      maxDistance=thisDist;
    }
  }
  return maxDistance;
}

//RETURNS AN ARRAY OF THE DISTANCE BETWEEN THIS PIXEL AND ALL DATA POINTS
float [] getAllDistancesFromPoint(float x, float y, float [] xs, float [] ys) {
  float [] allDistances = new float [xs.length];
  for (int i=0;i<xs.length;i++) { 
    allDistances[i]= dist(x, y, xs[i], ys[i]);
  }
  
  return allDistances;
}


//RETURNS THE ACTUAL WEIGHTED VALUE FOR THIS PIXEL
float getInterpValue(float x, float y, float [] xs, float [] ys, float f[]) {
  float interpValue=0.0f;

  for (int i=0;i<xs.length;i++) {
    float maxDist = getMaxDistanceFromPoint( x, y, xs, ys);
    float [] allDistances = getAllDistancesFromPoint( x, y, xs, ys);
    float thisDistance = dist(x, y, xs[i], ys[i]);
    interpValue += f[i]*getWeight( maxDist, thisDistance, allDistances );
  }
  return interpValue;
}

//THE WEIGHT IS THE VALUE COEFFICIENT (? RIGHT TERM) BY WHICH WE WILL MULTIPLY EACH VALUE TO GET THE CORRECT WEIGHTING
float getWeight(float maxDistance, float thisDistance, float [] allDistances ) {
  float weight=0.0f;
  float firstTerm = pow(((maxDistance - thisDistance   )/( maxDistance * thisDistance  )), 2);
  float secondTerm=0.0f;
  for (int i=0;i<allDistances.length;i++) {
    secondTerm+=pow(((maxDistance - allDistances[i]   )/( maxDistance * allDistances[i]  )), 2);
  }
  weight = firstTerm/secondTerm;
  return weight;
}


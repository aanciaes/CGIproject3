var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;

matrixStack = [];

var x = 0;
var y = 0;
var z = 0;

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    
    setupProjection();
    setupView();
    
}

function setupProjection() {
    projection = perspective(60, 1, 0.1, 100);
    //projection = ortho(-1,1,-1,1,0.1,100);
}

function setupView() {
    modelView = mat4();
    multMatrix(lookAt([0,0,5], [0,0,0], [0,1,0]));
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene()
{
    
    //var d = (new Date()).getTime();
    var d = 1;
    
    
    //estam
    multTranslation([0,-2,0]);
    //multRotX(radians(270));
    
    pushMatrix();
        multTranslation([0,0,0.55]);
        multScale([3.5,0.5,3.5]);
        draw_cube([1,1,1]);
    popMatrix();
    
    
    //base do carro
    pushMatrix();
        multTranslation([x, 1, 2.2+z]);
    
        multScale([0.7,0.15,0.5]);

        draw_cube([1,0,0]);
    popMatrix();
    
    pushMatrix();
                multTranslation([0+x,1.15,2.2+z]);
                multScale([0.3,0.13,0.3]);
                draw_cylinder([0.0, 1.0, 0.0]);
    popMatrix();
    
    
   // pushMatrix();
    
        //multRotY((45));//roda
    
        pushMatrix();
            multTranslation([x , 1.71, 2.2+z]);
            multScale([0.15,1,0.15]);
            multRotY((20));
            draw_cube([1.0, 0.0, 0.0]);
        popMatrix();
    
    pushMatrix();
            multTranslation([0+x,2.21,2.2+z]);
            multScale([0.2,0.2,0.2]);
            multRotY((20));            
            multRotX((90));
            draw_cylinder([0.0, 1.0, 0.0]);
    popMatrix();
    
    
        /*pushMatrix();
            pushMatrix();
                multTranslation([0,1.25,2.2]);
                multScale([0.5,1,0.5]);
                draw_cylinder([0.0, 1.0, 0.0]);
            popMatrix();
        popMatrix();
    
    */
    //popMatrix();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    
    requestAnimFrame(render);
}


function press(event) {
    
    //0.7 = metade do tamanho do lado da base
    switch(event.which){
        case 37:
            if(x>-0.7)
                x-=0.1;
        break;
        case 38:
            if(z>-0.7)
                z-=0.1;
        break;    
        case 39:
            if(x<0.7)
                x+=0.1;
        break;
        case 40:
            if(z<0.7)
                z+=0.1;
        break;
        default:break;
    }
}


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    
    initialize();
    
    
  // alert("ola");
    
    render();
    onkeydown = press;

}

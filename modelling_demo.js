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
var view;

matrixStack = [];

var x = 0;
var y = 0;
var z = 0;

var theta=0;
var alpha=0;
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
    view = lookAt([0,0,5], [0,0,0], [0,1,0]);
    modelView = mat4(view[0], view[1], view[2], view[3]);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

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



function draw_scene(){
    
		multTranslation([0,-2,0.2]);

		pushMatrix();
			multTranslation([0,0,0.55]);
			multScale([3.5,0.5,3.5]);
			draw_cube([1,1,1]);
		popMatrix();
	
		pushMatrix();
		multTranslation([x,0,2.25]);
		//pushMatrix();
			
			pushMatrix();
			multTranslation([0,1,0]);
			
				pushMatrix();
					multTranslation([0.2,0,0]);
					multScale([0.15,0.15,0.45]);
					multRotX(90);

					draw_cylinder([2.0, 2.0, 0.0]);

				popMatrix();
	
				pushMatrix();
					multTranslation([-0.2,0,0]);
					multScale([0.15,0.15,0.45]);
					multRotX(90);
					draw_cylinder([2.0, 2.0, 0.0]);

				popMatrix();
			
				pushMatrix();
					multTranslation([0, 0.1, 0]);
					
					pushMatrix(); //Base do Carro
						multTranslation([0, 0, -0.05]);
						multScale([0.7,0.15,0.5]);
						draw_cube([1,0,0]);
					popMatrix();
					
					pushMatrix();
						multTranslation([0,0.15,0]);
						multRotY(theta);

							pushMatrix(); //Base Astro principal
								multScale([0.3,0.13,0.3]);
								draw_cylinder([0.0, 1.0, 0.0]);
							popMatrix();
							
							pushMatrix();
								multTranslation([0 , 0.56, 0]);
								
									pushMatrix();//Astro Principal
										multScale([0.15,1,0.15]);
										draw_cube([1.0, 0.0, 0.0]);
									popMatrix();
									
								pushMatrix();
										multTranslation([0,0.5,0]);
										
											pushMatrix();//Cilindro grua
												multScale([0.2,0.2,0.2]);
												multRotZ(alpha);
												multRotX(-90);
												draw_cylinder([0.0, 1.0, 0.0]);
											popMatrix();
											pushMatrix();

												multRotX(-90);
												multRotY(alpha);
             
        
												pushMatrix();
            
    
													multScale([0.1,0.1,0.5]);    
													multTranslation([0,0,-0.5]);
													draw_cube([1.0, 0.0, 0.0]);
    
   
												popMatrix();
    
													multTranslation([0,0,-0.5+y]);
													multScale([0.05,0.05,0.5]);
													draw_cube([1.0, 0.0, 0.0]);        
    
												popMatrix();
											popMatrix();
											
								
							popMatrix();
						
					popMatrix();
					
				popMatrix();
			
			popMatrix();
		
		popMatrix();
	
	
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
            //tecla esquerda
            if(x>-0.7)
                x-=0.05;
        break;
        case 38:
            //tecla cima
            if(alpha>-120)
            alpha--;
        break;    
        case 39:
            //tecla direita
            if(x<0.7)
                x+=0.05;
        break;
        case 40:
            //tecla baixo
            if(alpha<120)
            alpha++;
        break;
        case 79:
            //o
            if(y<0.25)
                y+=0.01;
        break; 
        case 80:
            //p
            if(y > -0.25)
                y-=0.01;
        break;    
        case 81:
            theta++;
        break;
        
        case 87:
            theta--;
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

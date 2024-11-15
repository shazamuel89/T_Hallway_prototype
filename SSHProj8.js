var gl;
var canvas;
var program;



// Geometry
var numPositions = 162;
var positionsArray = [];
var vertices = [ // These vertices describe a 3D hallway T-intersection
    vec4(-3.0,  1.0, -6.0, 1.0), // 0
    vec4(-3.0,  1.0, -4.0, 1.0), // 1

    vec4(-1.0,  1.0, -6.0, 1.0), // 2
    vec4(-1.0,  1.0, -4.0, 1.0), // 3
    vec4(-1.0,  1.0, -2.0, 1.0), // 4
    vec4(-1.0,  1.0,  0.0, 1.0), // 5
    vec4(-1.0,  1.0,  2.0, 1.0), // 6
    vec4(-1.0,  1.0,  4.0, 1.0), // 7

    vec4( 1.0,  1.0, -6.0, 1.0), // 8
    vec4( 1.0,  1.0, -4.0, 1.0), // 9
    vec4( 1.0,  1.0, -2.0, 1.0), // 10
    vec4( 1.0,  1.0,  0.0, 1.0), // 11
    vec4( 1.0,  1.0,  2.0, 1.0), // 12
    vec4( 1.0,  1.0,  4.0, 1.0), // 13

    vec4( 3.0,  1.0, -6.0, 1.0), // 14
    vec4( 3.0,  1.0, -4.0, 1.0), // 15
    

    vec4(-3.0,  -1.0, -6.0, 1.0), // 16
    vec4(-3.0,  -1.0, -4.0, 1.0), // 17

    vec4(-1.0,  -1.0, -6.0, 1.0), // 18
    vec4(-1.0,  -1.0, -4.0, 1.0), // 19
    vec4(-1.0,  -1.0, -2.0, 1.0), // 20
    vec4(-1.0,  -1.0,  0.0, 1.0), // 21
    vec4(-1.0,  -1.0,  2.0, 1.0), // 22
    vec4(-1.0,  -1.0,  4.0, 1.0), // 23

    vec4( 1.0,  -1.0, -6.0, 1.0), // 24
    vec4( 1.0,  -1.0, -4.0, 1.0), // 25
    vec4( 1.0,  -1.0, -2.0, 1.0), // 26
    vec4( 1.0,  -1.0,  0.0, 1.0), // 27
    vec4( 1.0,  -1.0,  2.0, 1.0), // 28
    vec4( 1.0,  -1.0,  4.0, 1.0), // 29

    vec4( 3.0,  -1.0, -6.0, 1.0), // 30
    vec4( 3.0,  -1.0, -4.0, 1.0)  // 31
];

// Transformation
var displacementX = 0;
var displacementY = 0;
var displacementZ = 0;
var movementSpeed = 0.03;
const keysPressed = {};
var displacementXLoc;
var displacementYLoc;
var displacementZLoc;

// Viewing
var fovy = 60.0;
var aspect;
var near = 0.01;
var far = 20.0;
var projectionMatrix;
var projectionMatrixLoc;

// Light source
var normalsArray = [];
var originalLightPosition = vec4(0.0, 0.99, -5.0, 1.0); // Light source positioned to cast deep, stretched shadows
var lightAmbient = vec4(0.5, 0.55, 0.4, 1.0); // Brighter, with a hint of greenish-yellow for a fluorescent effect
var lightDiffuse = vec4(0.9, 0.95, 0.7, 1.0);  // High diffuse for well-lit surroundings with Backrooms tint
var lightSpecular = vec4(0.2, 0.2, 0.15, 1.0); // Slight specular for subtle highlights on surfaces
// Material shading
var materialAmbient = vec4(0.5, 0.5, 0.4, 1.0);   // Lightly toned material to reflect more ambient light
var materialDiffuse = vec4(0.8, 0.8, 0.6, 1.0);   // Matched with the light color to maintain eerie uniformity
var materialSpecular = vec4(0.3, 0.3, 0.2, 1.0);  // Modest specular reflection for a slightly worn effect
var materialShininess = 30.0; // Moderate shininess for soft highlights, keeping the look slightly matte


// Describes textures 0 and 1
var texCoordsArray = [];
var texSize = 256;
var texture0;

// Backrooms texture
var image0 = new Uint8Array(4 * texSize * texSize);
for (var i = 0; i < texSize; i++) {
    for (var j = 0; j < texSize; j++) {
        // Create a yellowish background color with slight variations
        var baseYellow = 220;  // Base yellow color (light yellow)
        var noise = Math.random() * 20 - 10;  // Small noise to add variation to the texture
        var yellow = Math.min(255, Math.max(0, baseYellow + noise));  // Adjust yellow tone with noise

        // Add subtle patterning with small square tiles (like faded wallpaper)
        var tileSize = 32; // Tile size for the wallpaper pattern
        var tileX = Math.floor(i / tileSize);
        var tileY = Math.floor(j / tileSize);

        // Use a simple alternating pattern for the tiles (checkerboard effect)
        var pattern = (tileX + tileY) % 2 === 0 ? yellow : yellow * 0.9;  // Subtle difference for tile borders

        // Assign the pattern to the red, green, and blue channels to get the yellow wallpaper effect
        var red = pattern;  // Yellowish tone (same value for red, green, and blue)
        var green = pattern;
        var blue = pattern * 0.5;  // A little less blue for the yellowish tint

        // Adding small imperfections to simulate the worn wallpaper look
        var imperfectionNoise = Math.random() * 10 - 5;  // Slight imperfections
        red = Math.min(255, Math.max(0, red + imperfectionNoise));  // Apply imperfection to red channel
        green = Math.min(255, Math.max(0, green + imperfectionNoise)); // Apply imperfection to green channel
        blue = Math.min(255, Math.max(0, blue + imperfectionNoise)); // Apply imperfection to blue channel

        // Assign the colors to the texture array
        image0[4 * i * texSize + 4 * j] = red;  // Red channel
        image0[4 * i * texSize + 4 * j + 1] = green;  // Green channel
        image0[4 * i * texSize + 4 * j + 2] = blue;  // Blue channel
        image0[4 * i * texSize + 4 * j + 3] = 255;  // Alpha channel (fully opaque)
    }
}
var texCoord = [
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
    vec2(0, 1)
];



function T_Hallway()
{
    quad( 0,  2,  3,  1);
    quad( 2,  8,  9,  3);
    quad( 8, 14, 15,  9);
    quad( 3,  9, 10,  4);
    quad( 4, 10, 11,  5);
    quad( 5, 11, 12,  6);
    quad( 6, 12, 13,  7);
    quad(30, 24, 25, 31);
    quad(24, 18, 19, 25);
    quad(18, 16, 17, 19);
    quad(25, 19, 20, 26);
    quad(26, 20, 21, 27);
    quad(27, 21, 22, 28);
    quad(28, 22, 23, 29);
    quad(19,  3,  4, 20);
    quad(20,  4,  5, 21);
    quad(21,  5,  6, 22);
    quad(22,  6,  7, 23);
    quad( 9, 25, 26, 10);
    quad(10, 26, 27, 11);
    quad(11, 27, 28, 12);
    quad(12, 28, 29, 13);
    quad( 1,  3, 19, 17);
    quad( 9, 15, 31, 25);
    quad( 2,  0, 16, 18);
    quad( 8,  2, 18, 24);
    quad(14,  8, 24, 30);
}
function quad(a, b, c, d) { // Vertices must be provided in clockwise order
    // Find normal vector to plane
    var a1 = subtract(vertices[b], vertices[a]); // Find vector along edge from a to b
    var a2 = subtract(vertices[c], vertices[b]); // Find vector along edge from b to c
    var normal = cross(a1, a2); // Find normal vector using cross product of planar vectors
    normal = vec3(normal);

    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    positionsArray.push(vertices[b]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);


    positionsArray.push(vertices[a]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    positionsArray.push(vertices[c]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    positionsArray.push(vertices[d]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);
}

// Updates the position of the object based on which keys are pressed
function updatePosition() {
    if (keysPressed['ArrowUp']) {
        displacementZ += movementSpeed; // Move object in the positive z-direction
    }
    if (keysPressed['ArrowLeft']) {
        displacementX += movementSpeed; // Move object in the positive x-direction
    }
    if (keysPressed['ArrowDown']) {
        displacementZ -= movementSpeed; // Move object in the negative z-direction
    }
    if (keysPressed['ArrowRight']) {
        displacementX -= movementSpeed; // Move object in the negative x-direction
    }
    // Call itself on the next frame
    requestAnimationFrame(updatePosition);
}

function configureTexture() {
    texture0 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image0);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}



window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL 2.0 isn't available.");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2, 0.5, 0.95, 1.0); // Blue background
    gl.enable(gl.DEPTH_TEST);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Geometry
    T_Hallway();
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // Transformations
    // Track key presses and releases
    window.addEventListener("keydown", (event) => {
        keysPressed[event.key] = true;
    });
    window.addEventListener("keyup", (event) => {
        keysPressed[event.key] = false;
    });
    // Start the keypress update loop
    updatePosition();
    displacementXLoc = gl.getUniformLocation(program, "uDisplacementX");
    displacementYLoc = gl.getUniformLocation(program, "uDisplacementY");
    displacementZLoc = gl.getUniformLocation(program, "uDisplacementZ");

    // Viewing
    const fovyValue = document.getElementById("fovyValue");
    document.getElementById("fovySlider").onchange = function(event) {
        fovyValue.textContent = event.target.value; // Display the current FOV value
        fovy = event.target.value; // Change FOV
    };
    aspect = canvas.width / canvas.height;
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    // Lighting
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);
    // Get light values on material
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"), originalLightPosition);
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"), diffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), specularProduct);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

    // Textures
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);
    configureTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture0);
    gl.uniform1i(gl.getUniformLocation(program, "uTex0"), 0);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(displacementXLoc, displacementX);
    gl.uniform1f(displacementYLoc, displacementY);
    gl.uniform1f(displacementZLoc, displacementZ);

    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Create a copy of originalLightPosition and apply displacement to it
    lightPosition = vec4(
        originalLightPosition[0] + displacementX,
        originalLightPosition[1] + displacementY,
        originalLightPosition[2] + displacementZ,
        originalLightPosition[3]
    );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"), lightPosition);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}
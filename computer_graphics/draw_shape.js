
function draw_shape() {

    start();

    function hexToRgb(hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            var no = 1.0;

            console.log("New after conversion ----- " + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(','));

            return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
        }

        throw new Error('Bad Hex');

    }

    var a, b, c, d, e, f, g, h;

    function start() {
        a = document.getElementById("top_left_xs").value;
        b = document.getElementById("top_left_ys").value;
        c = document.getElementById("top_right_xs").value;
        d = document.getElementById("top_right_ys").value;
        e = document.getElementById("bottom_left_xs").value;
        f = document.getElementById("bottom_left_ys").value;
        g = document.getElementById("bottom_right_xs").value;
        h = document.getElementById("bottom_right_ys").value;

        var x = document.getElementById("colorpickershape").value;

        console.log("Before hex " + x);

        var zi = hexToRgb(x);

        console.log(" from function --- " + zi);

        const canvas = document.querySelector('#glcanvas');
        const gls = canvas.getContext('webgl');

        // If we don't have a GL context, give up now

        if (!gls) {
            alert('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }

        // Vertex shader program

        const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position =   aVertexPosition;
    }
  `;

        // Fragment shader program



        const fsSource = `
    
    
    void main() {
        
        gl_FragColor = vec4(${zi},1.0);
    }
  `;

        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        const shaderProgram = initShaderProgram(gls, vsSource, fsSource);

        // Collect all the info needed to use the shader program.
        // Look up which attribute our shader program is using
        // for aVertexPosition and look up uniform locations.
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gls.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
            uniformLocations: {
                projectionMatrix: gls.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gls.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        const buffers = initBuffers(gls);

        // Draw the scene
        drawScene(gls, programInfo, buffers);
    }

    //
    // initBuffers
    //
    // Initialize the buffers we'll need.
    //
    function initBuffers(gls) {

        // Create a buffer for the square's positions.

        const positionBuffer = gls.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gls.bindBuffer(gls.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.

        const positions = [
            a, b,
            g, h,
            e, f,
            c, d,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gls.bufferData(gls.ARRAY_BUFFER,
            new Float32Array(positions),
            gls.STATIC_DRAW);

        return {
            position: positionBuffer,
        };
    }

    //
    // Draw the scene.
    //
    function drawScene(gls, programInfo, buffers) {
        gls.clearColor(1.0, 1.0, 1.0, 4.0);  // Clear to black, fully opaque
        gls.clearDepth(1.0);                 // Clear everything
        gls.enable(gls.DEPTH_TEST);           // Enable depth testing
        gls.depthFunc(gls.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gls.clear(gls.COLOR_BUFFER_BIT | gls.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gls.canvas.clientWidth / gls.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            [-0.0, 0.0, -6.0]);  // amount to translate

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = gls.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gls.bindBuffer(gls.ARRAY_BUFFER, buffers.position);
            gls.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gls.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        gls.useProgram(programInfo.program);

        // Set the shader uniforms

        gls.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gls.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const offset = 0;
            const vertexCount = 4;
            gls.drawArrays(gls.TRIANGLE_STRIP, offset, vertexCount);
        }
    }

    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    function initShaderProgram(gls, vsSource, fsSource) {
        const vertexShader = loadShader(gls, gls.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gls, gls.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const shaderProgram = gls.createProgram();
        gls.attachShader(shaderProgram, vertexShader);
        gls.attachShader(shaderProgram, fragmentShader);
        gls.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gls.getProgramParameter(shaderProgram, gls.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    function loadShader(gls, type, source) {
        const shader = gls.createShader(type);

        // Send the source to the shader object

        gls.shaderSource(shader, source);

        // Compile the shader program

        gls.compileShader(shader);

        // See if it compiled successfully

        if (!gls.getShaderParameter(shader, gls.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gls.getShaderInfoLog(shader));
            gls.deleteShader(shader);
            return null;
        }

        return shader;
    }


}


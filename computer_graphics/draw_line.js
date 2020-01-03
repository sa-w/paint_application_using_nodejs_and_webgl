

function draw_a_line() {

    var a;
    var b;
    var c;
    var d;

    var x;
    var zi;

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

    begin_the_line();

    function begin_the_line() {
        a = document.getElementById("top_left_xline").value;
        b = document.getElementById("top_left_yline").value;
        c = document.getElementById("bottom_left_xline").value;;
        d = document.getElementById("bottom_left_yline").value;

        x = document.getElementById("colorpickerline").value;

        console.log("Before hex " + x);

        zi = hexToRgb(x);

        const canvas = document.querySelector('#glcanvas');
        const gl = canvas.getContext('webgl');

        // If we don't have a GL context, give up now

        if (!gl) {
            alert('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }

        // Vertex shader program

        //uniform mat4 uModelViewMatrix;
        //uniform mat4 uProjectionMatrix;

        const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position =  aVertexPosition;
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
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        // Collect all the info needed to use the shader program.
        // Look up which attribute our shader program is using
        // for aVertexPosition and look up uniform locations.
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            },
        };

        // Here's where we call the routine that builds all the
        // objects we'll be drawing.
        const buffers = initBuffers(gl);

        // Draw the scene
        drawScene(gl, programInfo, buffers);
    }
    // initBuffers
    // Initialize the buffers we'll need. 
    function initBuffers(gl) {

        // Create a buffer for the square's positions.

        const positionBuffer = gl.createBuffer();

        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now create an array of positions for the square.

        const positions = [
            a, b,
            c, d,
        ];

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.

        gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(positions),
            gl.STATIC_DRAW);

        return {
            position: positionBuffer,
        };
    }

    //
    // Draw the scene.
    //
    function drawScene(gl, programInfo, buffers) {
        gl.clearColor(1.0, 1.0, 1.0, 4.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);


        {
            const offset = 0;
            const vertexCount = 2;
            gl.lineWidth(1);
            gl.drawArrays(gl.LINES, offset, vertexCount);

        }
    }

    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    function initShaderProgram(gl, vsSource, fsSource) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    function loadShader(gl, type, source) {
        const shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

}
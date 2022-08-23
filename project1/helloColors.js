let canvas = document.getElementById('the-canvas');
/**@type{WebGLRenderingContext}*/
let gl = canvas.getContext('webgl2');

gl.clearColor(0.9, 0.9, 1.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//All the triangle vertices and the color they will have
let verts = [
    -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,
    -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,
    0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 1.0,
    -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0
];

//Creating a buffer and binding the data to it
let vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

//creating the code for the shaders
let vertex_source = 
    `#version 300 es
    precision mediump float;

    in vec3 coordinates;
    in vec4 color;

    out vec4 v_color;

    void main(void){
        gl_Position = vec4(coordinates, 1.0);
        v_color = color;
}`;

let fragment_source = 
    `#version 300 es
    precision mediump float;

    in vec4 v_color;

    out vec4 f_color;

    void main(void){
        f_color = v_color;
}`;

let vert_shader = gl.createShader(gl.VERTEX_SHADER);
let frag_shader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vert_shader, vertex_source);
gl.shaderSource(frag_shader, fragment_source);

gl.compileShader(vert_shader);
gl.compileShader(frag_shader);
            
let shader_program = gl.createProgram();

gl.attachShader(shader_program, vert_shader);
gl.attachShader(shader_program, frag_shader);

gl.linkProgram(shader_program);
gl.useProgram(shader_program);

let atr_coord = gl.getAttribLocation(shader_program, "coordinates");
let atr_color = gl.getAttribLocation(shader_program, "color");

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.vertexAttribPointer(atr_coord, 3, gl.FLOAT, false, 7*4, 0);
gl.enableVertexAttribArray(atr_coord);

gl.vertexAttribPointer(atr_color, 4, gl.FLOAT, false, 7*4, 3*4);
gl.enableVertexAttribArray(atr_color);
            
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 6);
let canvas = document.getElementById('the-canvas');
/** Sets uniform data for a row-major matrix4
@param {WebGLRenderingContext} gl
@param {WebGLProgram} program
@param {string} name
@param {number[]} data */
let gl = canvas.getContext('webgl2');
function set_uniform_matrix4( gl, program, name, data ) {
    const loc = gl.getUniformLocation( program, name );
    gl.uniformMatrix4fv( loc, true, data );
}

gl.clearColor(0.9, 0.9, 1.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
let verts = [
    -0.5, -0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
    0.0, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0,
    0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0,
];

let vertex_source = 
        `#version 300 es
        precision mediump float;

        uniform mat4 modelview;

        in vec3 coordinates;
        in vec4 color;

        out vec4 v_color;

        void main(void){
            gl_Position = modelview * vec4(coordinates, 1.0);
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

let vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

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

const rotateXY = 0.25;
const rotateXZ = 0.5;
const rotateYZ = 0.05;

let amntXY = 0.0;
let amntXZ = 0.0;
let amntYZ = 0.0;

let last_update = performance.now();

//All the triangle vertices and the color they will have

function render(now){
    gl.clear(gl.COLOR_BUFFER_BIT);

    let time_delta = (now - last_update) / 1000;
    last_update = performance.now();

    amntXY += rotateXY * time_delta;
    amntXZ += rotateXZ * time_delta;
    amntYZ += rotateYZ * time_delta;

    amntXY %= 1.0;
    amntXZ %= 1.0;
    amntYZ %= 1.0;

    let modelXY = Mat4.rotation_xy(amntXY);
    let modelXZ = Mat4.rotation_xz(amntXZ);
    let modelYZ = Mat4.rotation_yz(amntYZ);
    
    let model = modelXY.mul(modelXZ.mul(modelYZ))
    set_uniform_matrix4(gl, shader_program, "modelview", model.data);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(render);

}

requestAnimationFrame(render);
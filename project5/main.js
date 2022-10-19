let canvas = document.getElementById('the-canvas');
let gl = canvas.getContext('webgl2');
const VERTEX_STRIDE = 28;//We are setting the vertex stride here

gl.clearColor(0.9, 0.9, 1.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//The shaders
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

//Preping the shaders
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

function displayMesh(aMesh){//Calls this after loading the mesh into the mesh class

    const rotateXZ = 0.125;//Set the rotation amount here

    let amntXZ = 0.0;

    let last_update = performance.now();

    function render(now){//render the mesh

        gl.enable(gl.CULL_FACE);//Enable culling
        gl.cullFace(gl.BACK);//Cull the back
        gl.frontFace(gl.CW);//Got to set the winding order, CW = clock wise, CCW = counter clock wise

        gl.enable(gl.DEPTH_TEST);//Enable the depth test
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//Clear the color buffer and depth buffer
        gl.useProgram( aMesh.program );//use the shader

        let time_delta = (now - last_update) / 1000;
        last_update = performance.now()

        amntXZ += rotateXZ * time_delta;
        amntXZ %= 1.0;

        let model = (Mat4.frustum(-1, 1, 0.25, 4, 3)).mul((Mat4.translation(0, 0, 1)).mul((Mat4.scale(0.5, 0.5, 0.5)).mul(Mat4.rotation_xz(amntXZ))));

        set_uniform_matrix4(gl, aMesh.program, "modelview", model.data);//Send the matrix data
        
        //Bind the buffers
        gl.bindBuffer( gl.ARRAY_BUFFER, aMesh.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, aMesh.indis );

        set_vertex_attrib_to_buffer( 
            gl, aMesh.program, 
            "coordinates", 
            aMesh.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, aMesh.program, 
            "color", 
            aMesh.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        gl.drawElements( gl.TRIANGLES, aMesh.n_indis, gl.UNSIGNED_SHORT, 0 );//Draw the mesh

        requestAnimationFrame(render);//Request another frame

    }

    requestAnimationFrame(render);//Request intial frame
    
}

//Mesh.from_obj_file(gl, meshFile, shader_program, displayMesh);//Get the mesh data
let lol = Mesh.box(gl, shader_program, 3/4, 4/3, 3/4);
displayMesh(lol);
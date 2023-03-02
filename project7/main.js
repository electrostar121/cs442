let canvas = document.getElementById('the-canvas');
let gl = canvas.getContext('webgl2');

gl.clearColor(0.9, 0.9, 1.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//The shaders
let vertex_source = 
        `#version 300 es
        precision mediump float;

        uniform mat4 modelview;

        in vec3 coordinates;
        in vec4 color;

        in vec2 uv;

        out vec4 v_color;
        out vec2 v_uv;

        void main(void){
            gl_Position = modelview * vec4(coordinates, 1.0);
            v_color = color;
            v_uv = uv;
}`;

let fragment_source = 
        `#version 300 es
        precision mediump float;

        uniform sampler2D tex_0;

        in vec4 v_color;
        in vec2 v_uv;

        out vec4 f_color;

        void main(void){
            f_color = texture( tex_0, v_uv );
}`;

//Preping the shaders
let vert_shader = gl.createShader(gl.VERTEX_SHADER);
let frag_shader = gl.createShader(gl.FRAGMENT_SHADER);
let tex = gl.createTexture();

gl.shaderSource(vert_shader, vertex_source);
gl.shaderSource(frag_shader, fragment_source);

gl.compileShader(vert_shader);
gl.compileShader(frag_shader);
                
let shader_program = gl.createProgram();

gl.attachShader(shader_program, vert_shader);
gl.attachShader(shader_program, frag_shader);

gl.linkProgram(shader_program);


function xor_texture(width) {
    let data = new Array( 256 * 256 * 4 );
    // 4 because there are 4 bytes per pixel: R, G, B, and A
    for( let row = 0; row < width; row++ ) {
        for( let col = 0; col < width; col++ ) {
        // calculations go here

            let pix = ( row * width + col ) * 4;

            data[pix] = data[pix + 1] = data[pix + 2] = row ^ col;

            data[pix + 3] = 255;

        }
    }
    return new Uint8Array( data );
}


gl.bindTexture( gl.TEXTURE_2D, tex );

gl.texImage2D(
    gl.TEXTURE_2D, 
    0, gl.RGBA,
    256, 256, 0, 
    gl.RGBA, gl.UNSIGNED_BYTE,  
    xor_texture(256)
);

gl.generateMipmap(gl.TEXTURE_2D);

let image = new Image();

function on_load(){

    gl.bindTexture( gl.TEXTURE_2D, tex );

    gl.texImage2D( 
        gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, image );

    gl.generateMipmap(gl.TEXTURE_2D);

}

image.onload = on_load;
image.src = 'tex/texture_map.png';

function displayMesh(aMesh){//Calls this after loading the mesh into the mesh class

    let controls = Keys.start_listening();

    const rotateXZ = 0.125;//Set the rotation amount here

    let amntXZ = 0.0;

    let last_update = performance.now();

    let x = 0.0;
    let y = 0.0;
    let z = 0.0;
    let roll = 0.0;
    let yaw = 0.0;
    let pitch = 0.0;

    let view = new Mat4();

    let speed = 0.01;

    let forward = (new Vec4(view.rc(0,2), view.rc(1,2), view.rc(2,2))).norm();
    let right = (new Vec4(view.rc(0,0), view.rc(1,0), view.rc(2,0))).norm();
    let up = (new Vec4(view.rc(0,1), view.rc(1,1), view.rc(2,1))).norm();

    let position = new Vec4(0,0,0);

    let result = new Vec4(0, 0, 0);

    let model = (Mat4.translation(0, 0, 1)).mul((Mat4.scale(0.5, 0.5, 0.5)).mul(new Mat4()));

    let modelview = view.mul(model);

    function render(now){//render the mesh

        gl.enable(gl.CULL_FACE);//Enable culling
        gl.cullFace(gl.BACK);//Cull the back
        gl.frontFace(gl.CW);//Got to set the winding order, CW = clock wise, CCW = counter clock wise

        gl.enable(gl.DEPTH_TEST);//Enable the depth test
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);//Clear the color buffer and depth buffer
        gl.useProgram( aMesh.program );//use the shader

        
        set_uniform_matrix4(gl, aMesh.program, "modelview", modelview.data);//Send the matrix data
        
        //Bind the buffers
        gl.bindBuffer( gl.ARRAY_BUFFER, aMesh.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, aMesh.indis );

        set_vertex_attrib_to_buffer( 
            gl, aMesh.program, 
            "coordinates", 
            aMesh.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        /*

        set_vertex_attrib_to_buffer( 
            gl, aMesh.program, 
            "color", 
            aMesh.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        */

        set_vertex_attrib_to_buffer( 
            gl, aMesh.program, 
            "uv", 
            aMesh.verts, 2, 
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        const sampler_loc = gl.getUniformLocation(aMesh.program, 'tex_0');
        gl.uniform1i(sampler_loc, 0);

        gl.drawElements( gl.TRIANGLES, aMesh.n_indis, gl.UNSIGNED_SHORT, 0 );//Draw the mesh

        requestAnimationFrame(render);//Request another frame

    }

    function update(){
        
        if(controls.is_key_down('KeyA')){

            position = (right.scaled(-speed)).add(position);
            
        }
        
        if(controls.is_key_down('KeyD')){
        
            position = (right.scaled(speed)).add(position);
                        
        }
        
        if(controls.is_key_down('KeyW')){
            
            position = (forward.scaled(speed)).add(position);
            
        }
        
        if(controls.is_key_down('KeyS')){
            
            position = (forward.scaled(-speed)).add(position);
            
        }

        if(controls.is_key_down('KeyC')){
            
            position = (up.scaled(-speed)).add(position);;
            
        }

        if(controls.is_key_down('Space')){

            position = (up.scaled(speed)).add(position);
            
        }

        if(controls.is_key_down('KeyQ')){
            
            roll -= speed;
            
        }

        if(controls.is_key_down('KeyE')){
            
            roll += speed;
            
        }

        if(controls.is_key_down('ArrowLeft')){
            
            yaw += speed;
            
        }

        if(controls.is_key_down('ArrowRight')){
            
            yaw -= speed;
            
        }

        if(controls.is_key_down('ArrowUp')){
            
            pitch -= speed;
            
        }

        if(controls.is_key_down('ArrowDown')){
            
            pitch += speed;
            
        }

        if(controls.is_key_down("KeyR")){

            position = new Vec4(0, 0, 0);
            roll = 0.0;
            pitch = 0.0;
            yaw = 0.0;

        }

        //x-basis vector gets the right
        //z-basis vector get the forward

        view = (Mat4.translation(position.x, position.y, position.z)).mul((Mat4.rotation_xz(yaw)).mul((Mat4.rotation_yz(pitch)).mul((Mat4.rotation_xy(roll)))));

        forward = (new Vec4(view.rc(0,2), view.rc(1,2), view.rc(2,2))).norm();
        right = (new Vec4(view.rc(0,0), view.rc(1,0), view.rc(2,0))).norm();
        up = (new Vec4(view.rc(0,1), view.rc(1,1), view.rc(2,1))).norm();

        view = view.inverse();

        modelview = Mat4.frustum(-1, 1, 0.25, 3, 4).mul(view.mul(model));

    }

    setInterval(update, 1000/60);

    requestAnimationFrame(render);//Request intial frame
    
}

//Mesh.from_obj_file(gl, meshFile, shader_program, displayMesh);//Get the mesh data
let lol = Mesh.box(gl, shader_program, 1, 1, 1);
displayMesh(lol);
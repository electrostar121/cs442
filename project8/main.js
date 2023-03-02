let canvas = document.getElementById('the-canvas');
let gl = canvas.getContext('webgl2');

gl.clearColor(0.9, 0.9, 1.0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//The shaders
let vertex_source = 
        `#version 300 es
        precision mediump float;

        uniform mat4 modelview;

        uniform float mat_ambient;
        uniform float mat_diffuse;
        uniform float mat_specular;
        uniform float mat_shininess;

        uniform vec3 sun_dir;
        uniform vec3 sun_color;

        uniform vec3 point_Coord;
        uniform vec3 point_Color;

        uniform vec3 camera_dir;

        in vec3 coordinates;
        in vec4 color;
        in vec3 norm;

        in vec2 uv;

        out vec4 v_color;
        out vec2 v_uv;

        vec3 diff_color(vec3 normal, vec3 light_dir, vec3 light_color, float mDiffuse){

            return mDiffuse * light_color * max(dot(normal, light_dir), 0.0);

        }

        vec3 spec_color(vec3 normal, vec3 light_dir, vec3 light_color, vec3 cam_dir, float shiny, float spec){

            vec3 reflect_dir = 2.0 * (dot(normalize(light_dir), normal)) * normal - light_dir;

            return (spec * pow(max(dot(reflect_dir, cam_dir), 0.0), shiny)) * light_color;

        }

        void main(void){

            vec4 result = modelview * vec4(coordinates, 1.0);
            
            vec4 Sspecular_color = vec4(spec_color(norm, sun_dir, sun_color, camera_dir - vec3(coordinates[0], coordinates[1], coordinates[2]), mat_shininess, mat_specular), 0.0);
            vec4 Sdiffuse_color = vec4(diff_color(norm, sun_dir, sun_color, mat_diffuse), 1.0);
            vec4 Sambient_color = vec4(mat_ambient, mat_ambient, mat_ambient, 1.0);

            vec4 specular_color = vec4(spec_color(norm, point_Coord, point_Color, camera_dir - vec3(coordinates[0], coordinates[1], coordinates[2]), mat_shininess, mat_specular), 0.0);
            vec4 diffuse_color = vec4(diff_color(norm, point_Coord, point_Color, mat_diffuse), 1.0);
            vec4 ambient_color = vec4(mat_ambient, mat_ambient, mat_ambient, 1.0);

            vec3 distance = point_Coord - vec3(result[0], result[1], result[2]);
            
            gl_Position = modelview * vec4(coordinates, 1.0);
            v_color = Sambient_color + Sdiffuse_color + Sspecular_color + specular_color + diffuse_color + ambient_color + (diffuse_color + specular_color) * vec4((0.002 * distance), 1.0);
            v_uv = uv;
        
        }
`;

let fragment_source = 
        `#version 300 es
        precision mediump float;

        uniform sampler2D tex_0;

        in vec4 v_color;
        in vec2 v_uv;

        out vec4 f_color;

        void main(void){
            f_color = v_color * texture( tex_0, v_uv );
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

    set_uniform_scalar(gl, shader_program, 'mat_ambient', 0.25);
    set_uniform_scalar(gl, shader_program, 'mat_diffuse', 1.0);
    set_uniform_scalar(gl, shader_program, 'mat_specular', 2.0);
    set_uniform_scalar(gl, shader_program, 'mat_shininess', 4.0);

    set_uniform_vec3_array(gl, shader_program, 'sun_dir', [1.0, 1.0, 0.0]);
    set_uniform_vec3_array(gl, shader_program, 'sun_color', [1.0, 1.0, 1.0]);

    set_uniform_vec3_array(gl, shader_program, 'point_Coord', [-1.0, -2.0, 0.0]);
    set_uniform_vec3_array(gl, shader_program, 'point_Color', [1.0, 0.0, 0.0]);

    gl.texImage2D( 
        gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, image );

    gl.generateMipmap(gl.TEXTURE_2D);

}

image.onload = on_load;
image.src = 'tex/metal_scale.png';

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

    let position = new Vec4(0,0,-1);

    let result = new Vec4(0, 0, 0);

    let model = (Mat4.scale(0.5, 0.5, 0.5)).mul(new Mat4());

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

        set_vertex_attrib_to_buffer(
            gl, aMesh.program, 
            "norm", 
            aMesh.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 36
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

            position = new Vec4(0, 0, -1);
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

        set_uniform_vec3_array(gl, shader_program, 'camera_dir', [position.x, position.y, position.z]);

    }

    setInterval(update, 1000/60);

    requestAnimationFrame(render);//Request intial frame
    
}

//Mesh.from_obj_file(gl, meshFile, shader_program, displayMesh);//Get the mesh data
let lol = Mesh.sphere(gl, shader_program, 200);
displayMesh(lol);
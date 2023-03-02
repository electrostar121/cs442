let canvas = document.getElementById('the-canvas');
let gl = canvas.getContext('webgl2');

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//The shaders
let vertex_source = 
        `#version 300 es
        precision mediump float;

        uniform mat4 modelview;
        uniform mat4 model;

        uniform float mat_ambient;
        uniform float mat_diffuse;
        uniform float mat_specular;
        uniform float mat_shininess;

        uniform vec3 sun_dir;
        uniform vec3 sun_color;

        uniform vec3 light1_loc;
        uniform vec3 light1_color;

        uniform vec3 light2_loc;
        uniform vec3 light2_color;

        uniform vec3 cameraLoc;

        const float light_attenuation_k = 0.01;
        const float light_attenuation_l = 0.1;
        const float light_attenuation_q = 0.00;

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

            float cosLight = dot(normalize(light_dir), normal);

            if(cosLight <= 0.0){

                return vec3(0.0, 0.0, 0.0);

            }

            vec3 reflect_dir = 2.0 * (cosLight) * normal - light_dir;

            return (spec * pow(max(dot(reflect_dir, cam_dir), 0.0), shiny)) * light_color;

        }

        float attenuation( vec3 vector_to_light ) {
            float light1_dist = length( vector_to_light );
            float light1_atten = 1.0 / ( 
                light_attenuation_k + 
                light_attenuation_l * light1_dist +
                light_attenuation_q * light1_dist * light1_dist
            );

            return light1_atten;
        }

        void main(void){

            vec3 normal_tx = normalize( mat3( model ) * norm);
            vec3 coords_tx = ( model * vec4( coordinates, 1.0 ) ).xyz;
            
            gl_Position = modelview * vec4(coordinates, 1.0);
            vec3 eye_dir = normalize( cameraLoc - coords_tx );

            vec4 ambient_color = vec4(mat_ambient, mat_ambient, mat_ambient, 1.0);

            float cosSun = dot(sun_dir, normal_tx);
            vec3 specSun = spec_color(normal_tx, sun_dir, sun_color, eye_dir, mat_shininess, mat_specular);
            vec3 diffSun = diff_color(normal_tx, sun_dir, sun_color, mat_diffuse);
            vec4 colorSun = vec4(diffSun + specSun, 1.0);

            vec3 light1Vector = light1_loc - coords_tx;
            vec3 light1Dir = normalize(light1Vector);
            float light1Atten = attenuation(light1Vector);
            vec3 light1Diff = diff_color(normal_tx, light1Dir, light1_color, mat_diffuse);
            vec3 light1Spec = spec_color(normal_tx, light1Dir, light1_color, eye_dir, mat_shininess, mat_specular);
            vec4 colorLight1 = vec4(light1Diff + light1Spec, 1.0);

            vec3 light2Vector = light2_loc - coords_tx;
            vec3 light2Dir = normalize(light2Vector);
            float light2Atten = attenuation(light2Vector);
            vec3 light2Diff = diff_color(normal_tx, light2Dir, light2_color, mat_diffuse);
            vec3 light2Spec = spec_color(normal_tx, light2Dir, light2_color, eye_dir, mat_shininess, mat_specular);
            vec4 colorLight2 = vec4(light2Diff + light2Spec, 1.0);
            
            v_color = (0.0 * color) + (1.0 * (ambient_color + colorSun + colorLight1 + colorLight2));
            v_uv = uv;
        
        }
`;

let fragment_source = 
        `#version 300 es
        precision mediump float;

        uniform sampler2D tex_0;

        in vec2 v_uv;
        in vec4 v_color;

        out vec4 f_color;

        void main(void){
            f_color = v_color * texture( tex_0, v_uv );
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

texturesLocation = ['tex/mcSun.png', 'tex/mcEarth.png', 'tex/mcMoon.png', 'tex/mash-moment.png', 'tex/obama.jpg', 'tex/starrySky.jpg']
texturesProperti = [[0.25, 1.0, 2.0, 4.0], [0.5, 1.0, 1.0, 2.0], [0.5, 1.0, 1.0, 2.0], [0.25, 1.0, 2.0, 4.0], [0.25, 1.0, 2.0, 4.0], [0.5, 0.00001, 0.00001, 0.00001]]
textures = []

for(let pic in texturesLocation){

    textures.push(new LitMaterial(gl, texturesLocation[pic], null, texturesProperti[pic][0], texturesProperti[pic][1], texturesProperti[pic][2], texturesProperti[pic][3]))

}

let root = new Node(0, 0, 0, 0, 0, 0, 1, 1, 1, Mesh.sunBox(gl, shader_program, 1.5, 1.5, 1.5));
let earth =  root.create_child_node(5, 0, 0, 0, 0, 0, 1, 1, 1, Mesh.box(gl, shader_program, 1, 1, 1));
let moon = earth.create_child_node(2.5, 0, 0, 0, 0, 0, 1, 1, 1, Mesh.sunBox(gl, shader_program, 1, 1, 1));
let mash = root.create_child_node(0, 5, 0, 0, 0, 0, 1, 1, 1, Mesh.sphere(gl, shader_program, 200));
let obama = root.create_child_node(0, -5, 0, 0, 0, 0, 1, 1, 1, Mesh.sphere(gl, shader_program, 200));



let lightRoot = new Node(0, 0, 0, 0, 0, 0, 1, 1, 1, new Light(0, 0, 0, 0, 0, 0, 0));
let light1 = lightRoot.create_child_node(1, -2, 0, 0, 0, 0, 1, 1, 1, new Light(0, 0, 0, 1, 0, 0, 1));
let light2 = lightRoot.create_child_node(0, 5, 1, 0, 0, 0, 1, 1, 1, new Light(0, 0, 0, 0, 1, 0, 2));

let viewNode = new Node(0, 10, -10, 0, -0.15, 0, 1, 1, 1, null);
let skybox = viewNode.create_child_node(-5, 0, 0, 0, 0, 0, 1, 1, 1, Mesh.skyBox(gl, shader_program, 1000, 1000, 1000));

gl.enable(gl.CULL_FACE);//Enable culling
gl.cullFace(gl.BACK);//Cull the back

gl.enable( gl.DEPTH_TEST );
gl.enable( gl.BLEND );
gl.frontFace(gl.CW);

gl.depthMask( true );
gl.depthFunc( gl.LEQUAL );

gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

gl.useProgram(shader_program);

function render(now){
        
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let jobs = []
    let lights = []

    root.generate_render_batch(new Mat4(), jobs, lights);
    lightRoot.generate_render_batch(new Mat4(), jobs, lights);
    viewNode.generate_render_batch(new Mat4(), jobs, lights);

    console.log(jobs)

    for(let light in lights){

        lights[light].color.x = lights[light].loc.x;
        lights[light].color.y = lights[light].loc.y;
        lights[light].color.z = lights[light].loc.z;

        lights[light].color.bind(gl, shader_program);

    }

    for(let job in jobs){

        set_uniform_matrix4(gl, shader_program, "modelview", Mat4.frustum(-0.5, 1, 0.25, 3, 4).mul(viewNode.get_view_matrix().mul(jobs[job].matrix)).data);//Send the matrix data
        set_uniform_matrix4(gl, shader_program, "model", jobs[job].matrix.data);
        
        //Bind the buffers
        gl.bindBuffer( gl.ARRAY_BUFFER, jobs[job].mesh.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, jobs[job].mesh.indis );

        set_vertex_attrib_to_buffer( 
            gl, shader_program, 
            "coordinates", 
            jobs[job].mesh.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, shader_program, 
            "uv", 
            jobs[job].mesh.verts, 2, 
            gl.FLOAT, false, VERTEX_STRIDE, 28
        );

        set_vertex_attrib_to_buffer(
            gl, shader_program, 
            "norm", 
            jobs[job].mesh.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 36
        );
        
        /*
        set_vertex_attrib_to_buffer( 
            gl, shader_program, 
            "color", 
            jobs[job].mesh.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        */

        if(textures[job].loaded === true){

            textures[job].bind(gl, shader_program);

        }

        const sampler_loc = gl.getUniformLocation(shader_program, 'tex_0');
        gl.uniform1i(sampler_loc, 0);

        gl.drawElements( gl.TRIANGLES, jobs[job].mesh.n_indis, gl.UNSIGNED_SHORT, 0 );

    }

    requestAnimationFrame(render);

}

let controls = Keys.start_listening();
let speed = 0.1;
let oRoll = 0

function update(){

    if(controls.is_key_down('KeyA')){

        viewNode.move_in_direction(-speed, 0, 0);
        //skybox.move_in_direction(-speed, 0, 0);
        
    }
    
    if(controls.is_key_down('KeyD')){
    
        viewNode.move_in_direction(speed, 0, 0);
        //skybox.move_in_direction(speed, 0, 0);
                    
    }
    
    if(controls.is_key_down('KeyW')){
        
        viewNode.move_in_direction(0, 0, speed);
        //skybox.move_in_direction(0, 0, speed);
        
    }
    
    if(controls.is_key_down('KeyS')){
        
        viewNode.move_in_direction(0, 0, -speed);
        //skybox.move_in_direction(0, 0, -speed);
        
    }

    if(controls.is_key_down('KeyC')){
        
        viewNode.move_in_direction(0, -speed, 0);
        //skybox.move_in_direction(0, -speed, 0);
        
    }

    if(controls.is_key_down('Space')){

        viewNode.move_in_direction(0, speed, 0);
        //skybox.move_in_direction(0, speed, 0);
        
    }

    if(controls.is_key_down('KeyQ')){
        
        viewNode.add_roll(-0.01);
       //skybox.add_roll(-0.01);
        
    }

    if(controls.is_key_down('KeyE')){
        
        viewNode.add_roll(0.01);
        //skybox.add_roll(0.01);
        
    }

    if(controls.is_key_down('ArrowLeft')){
        
        viewNode.add_yaw(0.01);
        //skybox.add_yaw(0.01);
        
    }

    if(controls.is_key_down('ArrowRight')){
        
        viewNode.add_yaw(-0.01);
        //skybox.add_yaw(-0.01);
        
    }

    if(controls.is_key_down('ArrowUp')){
        
        viewNode.add_pitch(-0.01);
        //skybox.add_pitch(-0.01);
        
    }

    if(controls.is_key_down('ArrowDown')){
        
        viewNode.add_pitch(0.01);
        //skybox.add_pitch(0.01);
        
    }

    root.add_yaw(0.005);
    earth.add_yaw(0.001);

    lightRoot.add_yaw(-0.05);
    light1.add_pitch(0.1);

}

setInterval(update, 1000/60);
requestAnimationFrame(render)

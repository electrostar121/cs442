const VERTEX_STRIDE = 48;//We are setting the vertex stride here


class Mesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor( gl, program, vertices, indices ) {
        this.verts = create_and_load_vertex_buffer( gl, vertices, gl.STATIC_DRAW );
        this.indis = create_and_load_elements_buffer( gl, indices, gl.STATIC_DRAW );

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;

    }

    /**
     * Create a box mesh with the given dimensions and colors.
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static box( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let norm1 = (new Vec4(hwidth, -hheight, -hdepth)).norm();
        let norm2 = (new Vec4(-hwidth, -hheight, -hdepth)).norm();
        let norm3 = (new Vec4(-hwidth, hheight, -hdepth)).norm();
        let norm4 = (new Vec4(hwidth, hheight, -hdepth)).norm();
        let norm5 = (new Vec4(hwidth, -hheight, hdepth)).norm();
        let norm6 = (new Vec4(-hwidth, -hheight, hdepth)).norm();
        let norm7 = (new Vec4(-hwidth, hheight, hdepth)).norm();
        let norm8 = (new Vec4(hwidth, hheight, hdepth)).norm();


        let verts = [
            //Front Face
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     (1.0/3.0),.5,   norm1.x, norm1.y, norm1.z,//bottom right
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,.5,           norm2.x, norm2.y, norm2.z,//bottom left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,0,            norm3.x, norm3.y, norm3.z,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     (1.0/3.0),0,    norm4.x, norm4.y, norm4.z,//top right

            //Back Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     (1.0/3.0),1.0,  norm5.x, norm5.y, norm5.z,//bottom right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1.0,          norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,.5,           norm7.x, norm7.y, norm7.z,//top left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     (1.0/3.0),.5,   norm8.x, norm8.y, norm8.z,//top right
            
            //Right Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1.0,0.5,        norm5.x, norm5.y, norm5.z,//top right
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     (2.0/3.0),0.5,  norm1.x, norm1.y, norm1.z,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     (2.0/3.0),0.0,  norm4.x, norm4.y, norm4.z,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1.0,0.0,        norm8.x, norm8.y, norm8.z,//bottom right

            //Left Face
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     (2.0/3.0),.5,  norm2.x, norm2.y, norm2.z,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     (1.0/3.0),.5,  norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     (1.0/3.0),0,  norm7.x, norm7.y, norm7.z,//top left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     (2.0/3.0),0,  norm3.x, norm3.y, norm3.z,//bottom right
            
            //Top Face
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     (2.0/3.0),1.0,  norm4.x, norm4.y, norm4.z,//top right
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     (1.0/3.0),1.0,  norm3.x, norm3.y, norm3.z,//top left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     (1.0/3.0),0.5,  norm7.x, norm7.y, norm7.z,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     (2.0/3.0),0.5,  norm8.x, norm8.y, norm8.z,//bottom right

            //Bottom Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1.0,1.0,         norm5.x, norm5.y, norm5.z,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     (2.0/3.0),1.0,   norm6.x, norm6.y, norm6.z,//top left
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     (2.0/3.0),.5,  norm2.x, norm2.y, norm2.z,//bottom left
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     1.0,.5,        norm1.x, norm1.y, norm1.z//bottom right
        ];

        let indis = [
            // clockwise winding
            
            0, 1, 2, 2, 3, 0, 
            5, 4, 7, 7, 6, 5, 
            8, 9, 10, 10, 11, 8, 
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 21, 22, 22, 23, 20,

            // counter-clockwise winding
            /*
            0, 3, 2, 2, 1, 0,
            4, 7, 3, 3, 0, 4,
            5, 6, 7, 7, 4, 5,
            1, 2, 6, 6, 5, 1,
            3, 7, 6, 6, 2, 3,
            4, 0, 1, 1, 5, 4,
            */
        ];

        return new Mesh( gl, program, verts, indis );
    }

    static sunBox( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let norm1 = (new Vec4(hwidth, -hheight, -hdepth)).norm();
        let norm2 = (new Vec4(-hwidth, -hheight, -hdepth)).norm();
        let norm3 = (new Vec4(-hwidth, hheight, -hdepth)).norm();
        let norm4 = (new Vec4(hwidth, hheight, -hdepth)).norm();
        let norm5 = (new Vec4(hwidth, -hheight, hdepth)).norm();
        let norm6 = (new Vec4(-hwidth, -hheight, hdepth)).norm();
        let norm7 = (new Vec4(-hwidth, hheight, hdepth)).norm();
        let norm8 = (new Vec4(hwidth, hheight, hdepth)).norm();


        let verts = [
            //Front Face
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     1,1,   norm1.x, norm1.y, norm1.z,//bottom right
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,1,           norm2.x, norm2.y, norm2.z,//bottom left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,0,            norm3.x, norm3.y, norm3.z,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     1,0,    norm4.x, norm4.y, norm4.z,//top right

            //Back Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1,1.0,  norm5.x, norm5.y, norm5.z,//bottom right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1.0,          norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,0,           norm7.x, norm7.y, norm7.z,//top left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1,0,   norm8.x, norm8.y, norm8.z,//top right
            
            //Right Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1.0,1,        norm5.x, norm5.y, norm5.z,//top right
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     0,1,  norm1.x, norm1.y, norm1.z,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     0,0.0,  norm4.x, norm4.y, norm4.z,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1.0,0.0,        norm8.x, norm8.y, norm8.z,//bottom right

            //Left Face
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     1,1,  norm2.x, norm2.y, norm2.z,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1,  norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,0,  norm7.x, norm7.y, norm7.z,//top left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     1,0,  norm3.x, norm3.y, norm3.z,//bottom right
            
            //Top Face
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     1,1.0,  norm4.x, norm4.y, norm4.z,//top right
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,1.0,  norm3.x, norm3.y, norm3.z,//top left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,0,  norm7.x, norm7.y, norm7.z,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1,0,  norm8.x, norm8.y, norm8.z,//bottom right

            //Bottom Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1.0,1.0,         norm5.x, norm5.y, norm5.z,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1.0,   norm6.x, norm6.y, norm6.z,//top left
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,0,  norm2.x, norm2.y, norm2.z,//bottom left
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     1.0,0,        norm1.x, norm1.y, norm1.z//bottom right
        ];

        let indis = [
            // clockwise winding
            
            0, 1, 2, 2, 3, 0, 
            5, 4, 7, 7, 6, 5, 
            8, 9, 10, 10, 11, 8, 
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 21, 22, 22, 23, 20,

            // counter-clockwise winding
            /*
            0, 3, 2, 2, 1, 0,
            4, 7, 3, 3, 0, 4,
            5, 6, 7, 7, 4, 5,
            1, 2, 6, 6, 5, 1,
            3, 7, 6, 6, 2, 3,
            4, 0, 1, 1, 5, 4,
            */
        ];

        return new Mesh( gl, program, verts, indis );
    }

    static skyBox( gl, program, width, height, depth ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let norm1 = (new Vec4(hwidth, -hheight, -hdepth)).norm();
        let norm2 = (new Vec4(-hwidth, -hheight, -hdepth)).norm();
        let norm3 = (new Vec4(-hwidth, hheight, -hdepth)).norm();
        let norm4 = (new Vec4(hwidth, hheight, -hdepth)).norm();
        let norm5 = (new Vec4(hwidth, -hheight, hdepth)).norm();
        let norm6 = (new Vec4(-hwidth, -hheight, hdepth)).norm();
        let norm7 = (new Vec4(-hwidth, hheight, hdepth)).norm();
        let norm8 = (new Vec4(hwidth, hheight, hdepth)).norm();


        let verts = [
            //Front Face
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     1,1,   norm1.x, norm1.y, norm1.z,//bottom right
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,1,           norm2.x, norm2.y, norm2.z,//bottom left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,0,            norm3.x, norm3.y, norm3.z,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     1,0,    norm4.x, norm4.y, norm4.z,//top right

            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1,1,  norm5.x, norm5.y, norm5.z,//bottom right
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     0,1,   norm1.x, norm1.y, norm1.z,//bottom right
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     0,0,    norm4.x, norm4.y, norm4.z,//top right
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1,0,   norm8.x, norm8.y, norm8.z,//top right

            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     1,1,          norm6.x, norm6.y, norm6.z,//bottom left
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     0,1,  norm5.x, norm5.y, norm5.z,//bottom right
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     0,0,   norm8.x, norm8.y, norm8.z,//top right
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     1,0,           norm7.x, norm7.y, norm7.z,//top left

            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     1,1,           norm2.x, norm2.y, norm2.z,//bottom left
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1,          norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,0,           norm7.x, norm7.y, norm7.z,//top left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     1,0,            norm3.x, norm3.y, norm3.z,//top left

            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     1,1,    norm4.x, norm4.y, norm4.z,//top right
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,1,            norm3.x, norm3.y, norm3.z,//top left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     0,0,           norm7.x, norm7.y, norm7.z,//top left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     1,0,   norm8.x, norm8.y, norm8.z,//top right

            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     1,1,  norm5.x, norm5.y, norm5.z,//bottom right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     0,1,          norm6.x, norm6.y, norm6.z,//bottom left
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,0,           norm2.x, norm2.y, norm2.z,//bottom left
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     1,0,   norm1.x, norm1.y, norm1.z,//bottom right

        ];

        let indis = [
            // clockwise winding
            /*
            0, 1, 2, 2, 3, 0, 
            5, 4, 7, 7, 6, 5, 
            8, 9, 10, 10, 11, 8, 
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 21, 22, 22, 23, 20,
            */
            // counter-clockwise winding
            0, 3, 2, 2, 1, 0,
            4, 7, 6, 6, 5, 4,
            8, 11, 10, 10, 9, 8,
            12, 15, 14, 14, 13, 12,
            16, 19, 18, 18, 17, 16,
            20, 23, 22, 22, 21, 20,

        ];

        return new Mesh( gl, program, verts, indis );
    }

    static sphere(gl, program, subdivs){

        let verts = [];
        let indis = [];

        let layer, ai, si, ci;
        let rotate, aj, sj, cj;

        let u, v;

        let p1, p2;

        for(layer = 0; layer <= subdivs; layer++){

            ai = layer * Math.PI / subdivs;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            v = layer / subdivs;

            for(rotate = 0; rotate <= subdivs; rotate++){

                aj = rotate * 2 * Math.PI / subdivs;
                sj = Math.sin(aj);
                cj = Math.cos(aj);
                
                u = rotate / subdivs;

                verts.push(si * sj, ci, cj * si);

                verts.push(1, 0, 0, 1);

                verts.push(1 - u, v);

                let norm = (new Vec4(si * sj, ci, cj * si)).norm();
                verts.push(norm.x, norm.y, norm.z);

            }

        }

        for(layer = 0; layer < subdivs; layer++){

            for(rotate = 0; rotate < subdivs; rotate++){

                p1 = layer * (subdivs + 1) + rotate;
                p2 = p1 + (subdivs + 1);

                indis.push(p1);
                indis.push(p2);
                indis.push(p1 + 1);

                indis.push(p1 + 1);
                indis.push(p2);
                indis.push(p2 + 1);


            }

        }

        return new Mesh(gl, program, verts, indis);

    }


    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render( gl ) {
        
        gl.enable( gl.CULL_FACE );
        gl.cullFace( gl.BACK );

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram( this.program );

        let model = new Mat4();

        set_uniform_matrix4(gl, this.program, "modelview", model.data);
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.verts );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indis );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "coordinates", 
            this.verts, 3, 
            gl.FLOAT, false, VERTEX_STRIDE, 0 
        );

        set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );

        gl.drawElements( gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0 );

        requestAnimationFrame(this.render);
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text( gl, program, text ) {
        // create verts and indis from the text 
		
		let verts = [];
		let indis = [];
		
		// YOUR CODE GOES HERE

        let lines = text.split(/\r?\n/).map(line => {return line.trim();});//Split text via lines

        for(var index = 0; index < lines.length; index++){

            let line = lines[index].split(/(\s+)/).map(line => {return line.trim();});//split the line via white space

            if(line[0] === 'v'){//each line that has v

                let tmp = line.filter((x) => x != 'v' && x != '');//get the data as long as it isnt v or nothing

                verts.push(...(tmp.map(x => {return parseFloat(x, 10);})));//push it into verts
                verts.push(...[Math.random(), Math.random(), Math.random(), 1])//push a random color into the verts

            }else if(line[0] === 'f') {//each line that has f

                let tmp = line.filter((x) => x != 'f' && x != '');//get the data as long as it isnt f or nothing

                indis.push(...(tmp.map(x => {return parseInt(x, 10) - 1;})));//subtract 1 and push into indis
                
            }

        }
		
        return new Mesh( gl, program, verts, indis );//generate new mesh object with data we got
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file( gl, file_name, program, f ) {
        let request = new XMLHttpRequest();
        
        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
           // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) { 
                throw new Error( 'HTTP error when opening .obj file: ', request.statusText ); 
            }

            // now we know the file exists and is ready
			// load the file 
            let loaded_mesh = Mesh.from_obj_text( gl, program, request.responseText );

            console.log( 'loaded ', file_name );
            f( loaded_mesh );
        };

        
        request.open( 'GET', file_name ); // initialize request. 
        request.send();                   // execute request
    }
}
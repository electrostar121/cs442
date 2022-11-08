const VERTEX_STRIDE = 36;//We are setting the vertex stride here


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

        let verts = [
            //Front Face
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     0.25,.5,//bottom right
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     0,.5,//bottom left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     0,.25,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     .25,.25,//top right

            //Back Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     .5,.5,//bottom right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     .75,.5,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     .75,.25,//top left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     .5,.25,//top right
            
            //Right Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     .5,.25,//top right
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     .25,.25,//top left
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     .25,.5,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     .5,.5,//bottom right

            //Left Face
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     .75,.5,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     1,.5,//bottom left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     1,.25,//top left
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     .75,.25,//bottom right
            
            //Top Face
            hwidth, hheight, -hdepth,       1.0, 1.0, 0.0, 1.0,     .5,0,//top right
            -hwidth, hheight, -hdepth,      0.0, 0.0, 1.0, 1.0,     .75,0,//top left
            -hwidth, hheight, hdepth,       0.5, 0.5, 1.0, 1.0,     .75,.25,//bottom left
            hwidth, hheight, hdepth,        1.0, 1.0, 0.5, 1.0,     .5,.25,//bottom right

            //Bottom Face
            hwidth, -hheight, hdepth,       1.0, 0.0, 1.0, 1.0,     .5,.5,//top right
            -hwidth, -hheight, hdepth,      0.0, 1.0, 1.0, 1.0,     .75,.5,//top left
            -hwidth, -hheight, -hdepth,     0.0, 1.0, 0.0, 1.0,     .75,.75,//bottom left
            hwidth, -hheight, -hdepth,      1.0, 0.0, 0.0, 1.0,     .5,.75,//bottom right
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
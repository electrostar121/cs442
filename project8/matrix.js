
/**
 * Matrix with row-major layout:
 *  0       1       2       3
 *  4       5       6       7
 *  8       9       10      11
 *  12      13      14      15
 */
class Mat4 {

    constructor( data ) {
        if( data == null ) {
            this.data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]
        }
        else {
            this.data = data;
        }
    }

    static identity() {
        return new Mat4();
    }

    toString() {
        var str_vals = this.data.map( function( val ) { return "" + val } )
        var str = 
            str_vals.slice( 0, 4 ).join(' ') + '; ' + 
            str_vals.slice( 4, 8 ).join(' ') + '; ' +
            str_vals.slice( 8, 12 ).join(' ') + '; ' +
            str_vals.slice( 12, 16 ).join(' ');

        return '[' + str + ']';
    }

    /**
     * Returns a rotation matrix in the XY plane, rotating by the given number of turns. 
     * @param {number} turns amount to rotate by
     * @returns {Mat4}  
     */
    static rotation_xy( turns ) {
        
        // return the rotation matrix
        var turnsRad = turns * 2 * Math.PI;

        return new Mat4([
            Math.cos(turnsRad), Math.sin(turnsRad), 0, 0,
            -Math.sin(turnsRad), Math.cos(turnsRad), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
        
    }

    /**
     * Returns a rotation matrix in the XZ plane, rotating by the given number of turns
     * @param {number} turns amount to rotate by
     * @returns {Mat4}  
     */
    static rotation_xz( turns ) {

        // return the rotation matrix
        var turnsRad = turns * 2 * Math.PI;

        return new Mat4([
            Math.cos(turnsRad), 0, Math.sin(turnsRad), 0,
            0, 1, 0, 0,
            -Math.sin(turnsRad), 0, Math.cos(turnsRad), 0,
            0, 0, 0, 1
        ]);
    }

    /**
     * Returns a rotation matrix in the YZ plane, rotating by the given number of turns
     * @param {number} turns amount to rotate by
     * @returns {Mat4}  
     */
    static rotation_yz( turns ) {
        
        // return the rotation matrix
        var turnsRad = turns * 2 * Math.PI;

        return new Mat4([
            1, 0, 0, 0,
            0, Math.cos(turnsRad), Math.sin(turnsRad), 0,
            0, -Math.sin(turnsRad), Math.cos(turnsRad), 0,
            0, 0, 0, 1
        ]);
    }

    static translation( dx, dy, dz ) {
        
        // return the translation matrix
        return new Mat4([
            1, 0, 0, dx,
            0, 1, 0, dy,
            0, 0, 1, dz,
            0, 0, 0, 1
        ]);
    }

    static scale( sx, sy, sz ) {
        
        // return the scaling matrix
        return new Mat4([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    }
    
    rc( row, col ) {
        return this.data[ row * 4 + col ]
    }
    
    mul( right ) {
        
        // return the result of multiplication
        return new Mat4([
            this.rc(0, 0) * right.rc(0, 0) + this.rc(0, 1) * right.rc(1, 0) + this.rc(0, 2) * right.rc(2, 0) + this.rc(0, 3) * right.rc(3, 0),
            this.rc(0, 0) * right.rc(0, 1) + this.rc(0, 1) * right.rc(1, 1) + this.rc(0, 2) * right.rc(2, 1) + this.rc(0, 3) * right.rc(3, 1),
            this.rc(0, 0) * right.rc(0, 2) + this.rc(0, 1) * right.rc(1, 2) + this.rc(0, 2) * right.rc(2, 2) + this.rc(0, 3) * right.rc(3, 2),
            this.rc(0, 0) * right.rc(0, 3) + this.rc(0, 1) * right.rc(1, 3) + this.rc(0, 2) * right.rc(2, 3) + this.rc(0, 3) * right.rc(3, 3),

            this.rc(1, 0) * right.rc(0, 0) + this.rc(1, 1) * right.rc(1, 0) + this.rc(1, 2) * right.rc(2, 0) + this.rc(1, 3) * right.rc(3, 0),
            this.rc(1, 0) * right.rc(0, 1) + this.rc(1, 1) * right.rc(1, 1) + this.rc(1, 2) * right.rc(2, 1) + this.rc(1, 3) * right.rc(3, 1),
            this.rc(1, 0) * right.rc(0, 2) + this.rc(1, 1) * right.rc(1, 2) + this.rc(1, 2) * right.rc(2, 2) + this.rc(1, 3) * right.rc(3, 2),
            this.rc(1, 0) * right.rc(0, 3) + this.rc(1, 1) * right.rc(1, 3) + this.rc(1, 2) * right.rc(2, 3) + this.rc(1, 3) * right.rc(3, 3),

            this.rc(2, 0) * right.rc(0, 0) + this.rc(2, 1) * right.rc(1, 0) + this.rc(2, 2) * right.rc(2, 0) + this.rc(2, 3) * right.rc(3, 0),
            this.rc(2, 0) * right.rc(0, 1) + this.rc(2, 1) * right.rc(1, 1) + this.rc(2, 2) * right.rc(2, 1) + this.rc(2, 3) * right.rc(3, 1),
            this.rc(2, 0) * right.rc(0, 2) + this.rc(2, 1) * right.rc(1, 2) + this.rc(2, 2) * right.rc(2, 2) + this.rc(2, 3) * right.rc(3, 2),
            this.rc(2, 0) * right.rc(0, 3) + this.rc(2, 1) * right.rc(1, 3) + this.rc(2, 2) * right.rc(2, 3) + this.rc(2, 3) * right.rc(3, 3),

            this.rc(3, 0) * right.rc(0, 0) + this.rc(3, 1) * right.rc(1, 0) + this.rc(3, 2) * right.rc(2, 0) + this.rc(3, 3) * right.rc(3, 0),
            this.rc(3, 0) * right.rc(0, 1) + this.rc(3, 1) * right.rc(1, 1) + this.rc(3, 2) * right.rc(2, 1) + this.rc(3, 3) * right.rc(3, 1),
            this.rc(3, 0) * right.rc(0, 2) + this.rc(3, 1) * right.rc(1, 2) + this.rc(3, 2) * right.rc(2, 2) + this.rc(3, 3) * right.rc(3, 2),
            this.rc(3, 0) * right.rc(0, 3) + this.rc(3, 1) * right.rc(1, 3) + this.rc(3, 2) * right.rc(2, 3) + this.rc(3, 3) * right.rc(3, 3)
        ]);

    }

	// right multiply by column vector
    transform( x, y, z, w ) {
        this.transform_vec( new Vec4( x, y, z, w ) );
    }

    transform_vec( vec ) {
        
        // return the transformed vector
        return new Vec4(
            this.data[0] * vec.x + this.data[1] * vec.y + this.data[2] * vec.z + this.data[3] * vec.w,
            this.data[4] * vec.x + this.data[5] * vec.y + this.data[6] * vec.z + this.data[7] * vec.w,
            this.data[8] * vec.x + this.data[9] * vec.y + this.data[10] * vec.z + this.data[11] * vec.w,
            this.data[12] * vec.x + this.data[13] * vec.y + this.data[14] * vec.z + this.data[15] * vec.w,
        );
    }


    // inverting a 4x4 matrix is ugly, there are 16 determinants we 
    // need to calculate. Because it's such a pain, I looked it up:
    // https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
    // author: willnode
    inverse() {
        // var A2323 = m.m22 * m.m33 - m.m23 * m.m32 ;
        const A2323 = this.rc(2, 2) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 2); 
        
        // var A1323 = m.m21 * m.m33 - m.m23 * m.m31 ;
        const A1323 = this.rc(2, 1) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 1);
        
        // var A1223 = m.m21 * m.m32 - m.m22 * m.m31 ;
        const A1223 = this.rc(2, 1) * this.rc(3, 2) - this.rc(2, 2) * this.rc(3, 1);

        // var A0323 = m.m20 * m.m33 - m.m23 * m.m30 ;
        const A0323 = this.rc(2, 0) * this.rc(3, 3) - this.rc(2, 3) * this.rc(3, 0);

        // var A0223 = m.m20 * m.m32 - m.m22 * m.m30 ;
        const A0223 = this.rc(2, 0) * this.rc(3, 2) - this.rc(2, 2) * this.rc(3, 0);

        // var A0123 = m.m20 * m.m31 - m.m21 * m.m30 ;
        const A0123 = this.rc(2, 0) * this.rc(3, 1) - this.rc(2, 1) * this.rc(3, 0);

        // var A2313 = m.m12 * m.m33 - m.m13 * m.m32 ;
        const A2313 = this.rc(1, 2) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 2);

        // var A1313 = m.m11 * m.m33 - m.m13 * m.m31 ;
        const A1313 = this.rc(1, 1) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 1);

        // var A1213 = m.m11 * m.m32 - m.m12 * m.m31 ;
        const A1213 = this.rc(1, 1) * this.rc(3, 2) - this.rc(1, 2) * this.rc(3, 1);

        // var A2312 = m.m12 * m.m23 - m.m13 * m.m22 ;
        const A2312 = this.rc(1, 2) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 2);

        // var A1312 = m.m11 * m.m23 - m.m13 * m.m21 ;
        const A1312 = this.rc(1, 1) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 1);

        // var A1212 = m.m11 * m.m22 - m.m12 * m.m21 ;
        const A1212 = this.rc(1, 1) * this.rc(2, 2) - this.rc(1, 2) * this.rc(2, 1);

        // var A0313 = m.m10 * m.m33 - m.m13 * m.m30 ;
        const A0313 = this.rc(1, 0) * this.rc(3, 3) - this.rc(1, 3) * this.rc(3, 0);

        // var A0213 = m.m10 * m.m32 - m.m12 * m.m30 ;
        const A0213 = this.rc(1, 0) * this.rc(3, 2) - this.rc(1, 2) * this.rc(3, 0);
        
        // var A0312 = m.m10 * m.m23 - m.m13 * m.m20 ;
        const A0312 = this.rc(1, 0) * this.rc(2, 3) - this.rc(1, 3) * this.rc(2, 0);

        // var A0212 = m.m10 * m.m22 - m.m12 * m.m20 ;
        const A0212 = this.rc(1, 0) * this.rc(2, 2) - this.rc(1, 2) * this.rc(2, 0);

        // var A0113 = m.m10 * m.m31 - m.m11 * m.m30 ;
        const A0113 = this.rc(1, 0) * this.rc(3, 1) - this.rc(1, 1) * this.rc(3, 0);
        
        // var A0112 = m.m10 * m.m21 - m.m11 * m.m20 ;
        const A0112 = this.rc(1, 0) * this.rc(2, 1) - this.rc(1, 1) * this.rc(2, 0);
        

        const det = 
        this.rc(0, 0) * ( this.rc(1, 1) * A2323 - this.rc(1, 2) * A1323 + this.rc(1, 3) * A1223 ) -
        this.rc(0, 1) * ( this.rc(1, 0) * A2323 - this.rc(1, 2) * A0323 + this.rc(1, 3) * A0223 ) +
        this.rc(0, 2) * ( this.rc(1, 0) * A1323 - this.rc(1, 1) * A0323 + this.rc(1, 3) * A0123 ) -
        this.rc(0, 3) * ( this.rc(1, 0) * A1223 - this.rc(1, 1) * A0223 + this.rc(1, 2) * A0123 );

        const dr = 1.0 / det;

        return new Mat4( [
            dr * ( this.rc(1, 1) * A2323 - this.rc(1, 2) * A1323 + this.rc(1, 3) * A1223 ),
            dr *-( this.rc(0, 1) * A2323 - this.rc(0, 2) * A1323 + this.rc(0, 3) * A1223 ),
            dr * ( this.rc(0, 1) * A2313 - this.rc(0, 2) * A1313 + this.rc(0, 3) * A1213 ),
            dr *-( this.rc(0, 1) * A2312 - this.rc(0, 2) * A1312 + this.rc(0, 3) * A1212 ),

            dr *-( this.rc(1, 0) * A2323 - this.rc(1, 2) * A0323 + this.rc(1, 3) * A0223 ),
            dr * ( this.rc(0, 0) * A2323 - this.rc(0, 2) * A0323 + this.rc(0, 3) * A0223 ),
            dr *-( this.rc(0, 0) * A2313 - this.rc(0, 2) * A0313 + this.rc(0, 3) * A0213 ),
            dr * ( this.rc(0, 0) * A2312 - this.rc(0, 2) * A0312 + this.rc(0, 3) * A0212 ),

            dr * ( this.rc(1, 0) * A1323 - this.rc(1, 1) * A0323 + this.rc(1, 3) * A0123 ),
            dr *-( this.rc(0, 0) * A1323 - this.rc(0, 1) * A0323 + this.rc(0, 3) * A0123 ),
            dr * ( this.rc(0, 0) * A1313 - this.rc(0, 1) * A0313 + this.rc(0, 3) * A0113 ),
            dr *-( this.rc(0, 0) * A1312 - this.rc(0, 1) * A0312 + this.rc(0, 3) * A0112 ),

            dr *-( this.rc(1, 0) * A1223 - this.rc(1, 1) * A0223 + this.rc(1, 2) * A0123 ),
            dr * ( this.rc(0, 0) * A1223 - this.rc(0, 1) * A0223 + this.rc(0, 2) * A0123 ),
            dr *-( this.rc(0, 0) * A1213 - this.rc(0, 1) * A0213 + this.rc(0, 2) * A0113 ),
            dr * ( this.rc(0, 0) * A1212 - this.rc(0, 1) * A0212 + this.rc(0, 2) * A0112 ),
        ] );
    }

    static frustum(near, far, fov, aspectX, aspectY){

        let top  = Math.tan((fov * 2 * Math.PI) / 2) * near;
        let bottom = -top;
        let right = top * (aspectY/aspectX);
        let left = -right;

        let c1 = 2 * far * near / (far - near);
        let c2 = (far + near) / (far - near);

        let tx = (right + left)/(right - left);
        let ty = (top + bottom)/(top - bottom);

        let sx = 2 * near / (right - left);
        let sy = 2 * near / (top - bottom);
        
      
        return new Mat4([
            sx, 0, 0, tx,
            0, sy, 0, ty,
            0, 0, c1, -c2,
            0, 0, 1, 0,
        ]);


    }

    clone() {
        let c = new Array(16);
        for( let i = 0; i < 16; i++ ) { c[i] = this.data[i]; }
        return new Mat4( c );
    }
	
	toString() {
		let pieces = [ '[' ];
		
		for( let row = 0; row < 4; row ++ ){
			pieces.push( '[' );
			
			for( let col = 0; col < 4; col ++ ){
				let i = row * 4 + col;
				pieces.push( this.data[i] );
			}
			
			pieces.push( ']' )
		}
		
		pieces.push( ']' );
		
		return pieces.join( ' ' );
	}
}
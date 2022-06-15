
const DitherStudies = () => {

    const DEBUG = false;

    function getclosestcol(pixel, palette_d3)
    {
        // find euclidean distance against each color in palette
        var eucldist = [];

        for (let i = 0; i < palette_d3.length; i++) {
            eucldist[i] = Math.sqrt(
                Math.pow(pixel.l - palette_d3[i].l, 2) + 
                Math.pow(pixel.a - palette_d3[i].a, 2) + 
                Math.pow(pixel.b - palette_d3[i].b, 2)
            );
        }

        let closest_color = Math.min.apply(Math, eucldist);

        if (DEBUG) console.log("Closest color: " + closest_color)

        // assigning everything for debug
        let index = eucldist.indexOf(Math.min.apply(Math, eucldist));

        if (DEBUG) console.log("index: " + index);
        let closest = palette_d3[index];
        if (DEBUG) console.log("closest: " + closest);
        return closest;
    }

    /*
    x, y: location of cell to calculate
    ltor: left to right
    */
    function calculateCell(x, y, val, palette, matrix, ltor) {
        matrix[y][x] = getclosestcol(val, palette);

        diffmatrix = {
            "l": matrix[y][x].l - val.l,
            "a": matrix[y][x].a - val.a,
            "b": matrix[y][x].b - val.b,
        };

        if (typeof(coefset.nums) == "undefined" || coefset.nums == null) {
            if (y % 2 == 0) {
                nums = coefset.nums_even
            } else {
                nums = coefset.nums_odd
            }
        }
        else 
        {
            nums = coefset.nums
        }

        // loop through coefficients for the dither and carry over error
        // i:x,j:y where i.j are coeffs and x,y are matrix cells
        for (let j = 0; j < nums.length; j++) {
            for (let i = 0; i < nums[j].length; i++) {
                let x_use = x + i - coefset.start_x;
                let y_use = y + j - coefset.start_y;

                if (!ltor) {
                    // we're flowing right to left and need to flip the location of the
                    // x we're using
                    x_use = x - i + coefset.start_x;
                }

                // if we are not out of range
                if (y_use >= 0 && y_use < matrix.length &&
                    x_use >= 0 && x_use < matrix[y].length) {

                    matrix[y_use][x_use] = d3.lab(
                        matrix[y_use][x_use].l - diffmatrix["l"] * nums[j][i] / coefset.denom,
                        matrix[y_use][x_use].a - diffmatrix["a"] * nums[j][i] / coefset.denom,
                        matrix[y_use][x_use].b - diffmatrix["b"] * nums[j][i] / coefset.denom
                    );
                }
            }
        }
    }

    function calculateDither(palette_cols, starting_color, algorithm, flow, rows = 48 * 10, cols= 36 * 10) {

        // convert colors to lab color
        var palette = [];
        for (let i = 0; i < palette_cols.length; i++) {
            palette[i] = d3.lab(palette_cols[i]);

            if (DEBUG) console.log(i);
            if (DEBUG) console.log(palette[i]);
            if (DEBUG) console.log(d3.rgb(palette[i]));
        }

        // build matrix
        var matrix = []; 
        for (let i=0; i < rows; i++) {
            matrix[i] = new Array(cols).fill(starting_color);
        }

        palette_d3 = [];

        for(let i = 0; i < palette.length; i++) {
            palette_d3[i] = d3.lab(palette[i]);
        }

        coefset = DitherStudies.kernels[algorithm];

        for (let y = 0; y < matrix.length; y++) {
            ltor = (flow == 'ltor' || y % 2 == 0 && flow != 'rtol'); // direction

            if (ltor) {
                for(let x = 0; x < matrix[y].length; x++) {
                    calculateCell(x, y, matrix[y][x], palette_d3, matrix, ltor);
                }
            } else {
                for(let x = matrix[y].length - 1; x >= 0; x--) {
                    calculateCell(x, y, matrix[y][x], palette_d3, matrix, ltor);
                }
            }
        }

        return matrix;
    }

    return ({
        calculateDither: calculateDither
    });
}

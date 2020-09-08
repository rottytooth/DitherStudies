
DEBUG = false;

var palette_cols = 
[
    "#ff0000",
    "#00ff00",
    "#0000ff"
];

// convert colors to lab color
var palette = [];
for (let i in palette_cols) {
    palette[i] = d3.rgb(palette_cols[i]);

    console.log(i)
    console.log(palette[i]);
    console.log(d3.rgb(palette[i]))    
}

// get average for starting color
starting_color = d3.rgb(
    (palette[0].r + palette[1].r + palette[2].r) / 3, 
    (palette[0].g + palette[1].g + palette[2].g) / 3, 
    (palette[0].b + palette[1].b + palette[2].b) / 3, 
    1);

starting_color = d3.color("#ff9933");

function getclosestcol(pixel)
{
    // find euclidean distance against each color in palette
    var eucldist = [];

    for (let i in palette) {
        eucldist[i] = Math.sqrt(
            Math.pow(pixel.r - palette[i].r, 2) + 
            Math.pow(pixel.g - palette[i].g, 2) + 
            Math.pow(pixel.b - palette[i].b, 2)
        );
    }

    let closest_color = Math.min.apply(Math, eucldist);

    if (DEBUG) console.log("Closest color: " + closest_color)

    // assigning everything for debug
    let index = eucldist.indexOf(Math.min.apply(Math, eucldist));

    if (DEBUG) console.log("index: " + index);
    let closest = palette[index];
    if (DEBUG) console.log("closest: " + closest);
    return closest;
}

// build matrix
var height = 36 * 10;
var width = 48 * 10;
var matrix = [];
for (let i=0; i < height; i++) {
    matrix[i] = new Array(width).fill(starting_color);
}

coefset = DitherStudies.kernels["Floyd-Steinberg"];

function calculate_cell(x, y, val) {
    matrix[y][x] = getclosestcol(val);

    diffmatrix = {
        "r": matrix[y][x].r - val.r,
        "g": matrix[y][x].g - val.g,
        "b": matrix[y][x].b - val.b,
    };

    // loop through coefficients for the dither and carry over error
    // i:x,j:y where i.j are coeffs and x,y are matrix cells
    for (let j = 0; j < coefset.coef.length; j++) {
        for (let i = 0; i < coefset.coef[j].length; i++) {
            let x_use = x + i - coefset.start_x
            let y_use = y + j - coefset.start_y

            // if we are not out of range
            if (y_use >= 0 && y_use < matrix.length &&
                x_use >= 0 && x_use < matrix[y].length) {

                matrix[y_use][x_use] = d3.rgb(
                    matrix[y_use][x_use].r - diffmatrix["r"] * coefset.coef[j][i],
                    matrix[y_use][x_use].g - diffmatrix["g"] * coefset.coef[j][i],
                    matrix[y_use][x_use].b - diffmatrix["b"] * coefset.coef[j][i]
                );
            }
        }
    }
}

for (let y = 0; y < matrix.length; y++) {
    for(let x = 0; x < matrix[y].length; x++) {
        calculate_cell(x, y, matrix[y][x]);
    }
}

x = getclosestcol(starting_color);
if (DEBUG) console.log(x);


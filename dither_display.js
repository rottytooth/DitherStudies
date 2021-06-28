/*
    Print the actual dither to the screen
*/

const EQ_SIDE_TO_HEIGHT = Math.sqrt(3)/2;
const HEX_SIDE_TO_HEIGHT = 1.732051;

var ds;

/*
 * Something has changed; time to update the display
 */
function updateDisplay() {

    const urlParams = new URLSearchParams(window.location.search);
    const palette = decodeURIComponent(urlParams.get('cols')).split(',');
    const colorToDither = d3.lab(decodeURIComponent(urlParams.get('s')));
    const algo = urlParams.get('algo');
    const flow = urlParams.get('flow');
    const pixelSize = parseInt(urlParams.get('size'));
    const shape = urlParams.get('shape');

    // FIXME: matrix seems to have a set size in this function
    matrix = ds.calculateDither(palette, colorToDither, algo, flow);

    drawDither(matrix, pixelSize, shape);
}

function drawDither(matrix, pixelSize, shape) {

    setSize(shape);
    // updateLink();

    var c = document.getElementById("ditherCanvas");
    var ctx = c.getContext("2d");

    switch(shape){
        case 'triangle':
            width = Math.ceil(width * 1.5);
            break;
        case 'righttriangle':
            width *= 2;
            break;
        case 'hexagon':
            width = Math.ceil(width / 2.0);
//            height *= 2;
    }

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            ctx.fillStyle = matrix[h][w];
            var oddcol = (w % 2 == 1); // are we in an odd column
            var oddrow = (h % 2 == 1); // are we in an odd row

            let xoffset = 0; // actual starting place for x
            switch(shape){
                case 'square':
                    ctx.fillRect(w * pixelSize, h * pixelSize, pixelSize, pixelSize);
                    break;
                case 'triangle':
                    xoffset = w * (pixelSize / 2) - (pixelSize * 2);

                    ctx.beginPath();
                    if ((oddrow && oddcol) || (!oddrow && !oddcol)) {
                        // facing down
                        ctx.moveTo(xoffset - 1, pixelSize * EQ_SIDE_TO_HEIGHT * (h + 1)); // left
                        ctx.lineTo(pixelSize + xoffset + 1, pixelSize * EQ_SIDE_TO_HEIGHT * (h + 1)); // right
                        ctx.lineTo(pixelSize / 2 + xoffset, pixelSize * EQ_SIDE_TO_HEIGHT * h - 1); // top
                    } else {
                        ctx.moveTo(xoffset - 1, pixelSize * EQ_SIDE_TO_HEIGHT * h - 1); // left
                        ctx.lineTo(pixelSize + xoffset + 1, pixelSize * EQ_SIDE_TO_HEIGHT * h - 1); // right
                        ctx.lineTo(pixelSize / 2 + xoffset, pixelSize * EQ_SIDE_TO_HEIGHT * (h + 1)); // bottom
                    }
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'righttriangle':
                    xoffset = (w / 2 - (oddcol ? .5 : 0)) * pixelSize;

                    ctx.beginPath();
                    if (oddcol) { // down-facing
                        ctx.moveTo(xoffset - .2, pixelSize * h - 0.2);
                        ctx.lineTo(xoffset + pixelSize + 0.2, pixelSize * h - 0.2);
                        ctx.lineTo(xoffset + pixelSize + 0.2, pixelSize * (h + 1) + 0.2);
                    } else {
                        ctx.moveTo(xoffset, pixelSize * h);
                        ctx.lineTo(xoffset - 0.2, pixelSize * (h + 1));
                        ctx.lineTo(xoffset + pixelSize - 0.2, pixelSize * (h + 1));
                    }

                    ctx.closePath();
                    ctx.fill();

                    if (!oddcol) {
                        ctx.beginPath();
                        ctx.moveTo(xoffset, pixelSize * h);
                        ctx.lineTo(xoffset + 0.3, pixelSize * (h + 1) - 0.3);
                        ctx.lineTo(xoffset + pixelSize + 0.3, pixelSize * (h + 1) - 0.3);
                        ctx.closePath();
                        ctx.fill();
                    }
                    break;
                case 'hexagon':
                    // pixelSize will be height of the hexagon; 
                    sidelen = pixelSize / HEX_SIDE_TO_HEIGHT;

                    let starting_x = w * sidelen * 3.0
                    let starting_y = (h - 1) * pixelSize / 2.0

                    if (oddrow) {
                        starting_x += -1.5 * sidelen;
                    }

                    ctx.beginPath();
                    ctx.moveTo(starting_x - .2, starting_y - .2);
                    ctx.lineTo(starting_x + sidelen + .2, starting_y - .2);
                    ctx.lineTo(starting_x + 1.5 * sidelen + .2, starting_y + pixelSize / 2.0);
                    ctx.lineTo(starting_x + sidelen + .2, starting_y + pixelSize + .2);
                    ctx.lineTo(starting_x, starting_y + pixelSize + .2);
                    ctx.lineTo(starting_x - 0.5 * sidelen - .2, starting_y + pixelSize / 2.0);

                    ctx.closePath();
                    ctx.fill();
                    break;
            }
        }
    }
}

function setSize(shape) {
    switch(shape) {
        case 'square':
            height = Math.ceil(document.body.clientHeight / pixelSize);
            width = Math.ceil(document.body.clientWidth / pixelSize);
            break;
        case 'triangle':
            height = Math.ceil(document.body.clientHeight / pixelSize) * 2;
            width = Math.ceil(document.body.clientWidth / pixelSize) * EQ_SIDE_TO_HEIGHT * 2;
            break;
        case 'righttriangle':
            height = Math.ceil(document.body.clientHeight / pixelSize);
            width = Math.ceil(document.body.clientWidth / pixelSize) * 2;
            break;
        case 'hexagon':
            height = Math.ceil(document.body.clientHeight / pixelSize) * 2;
            width = Math.ceil(document.body.clientWidth / pixelSize);
            break;
    }
}

(function() {
    ds = DitherStudies();

    canvas = document.getElementById("ditherCanvas");
    canvas.width = document.body.clientWidth - 300;
    canvas.height = document.body.clientHeight;
})();



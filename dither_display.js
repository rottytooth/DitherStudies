/*
    Print the actual dither to the screen
*/

const EQ_SIDE_TO_HEIGHT = Math.sqrt(3)/2;
const HEX_SIDE_TO_HEIGHT = 1.732051;

var ds;

/*
 * Something has changed; time to update the display
 * 
 * PARAMS:
 * height: height of the canvas
 * width: width of the canvas
 */
function updateDisplay(height, width, overlapx, overlapy) {

    const urlParams = new URLSearchParams(window.location.search);
    const palette = decodeURIComponent(urlParams.get('cols')).split(',');
    const colorToDither = d3.lab(decodeURIComponent(urlParams.get('s')));
    const algo = urlParams.get('algo');
    const flow = urlParams.get('flow');
    const pixelSize = parseInt(urlParams.get('size'));
    const shape = urlParams.get('shape');

    // FIXME: matrix seems to have a set size in this function

    const [rows, cols] = getRowCount(shape, height, width);

    matrix = ds.calculateDither(palette, colorToDither, algo, flow, rows, cols);

    drawDither(matrix, pixelSize, shape, rows, cols);
}

function drawDither(matrix, pixelSize, shape, rows, cols) {

    // updateLink();

    var c = document.getElementById("ditherCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var h = 0; h < rows; h++) {
        for (var w = 0; w < cols; w++) {
            ctx.fillStyle = matrix[h][w];
            var oddcol = (w % 2 == 1); // are we in an odd column
            var oddrow = (h % 2 == 1); // are we in an odd row

            let xoffset = 0; // actual starting place for x
            switch(shape) {
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
            case 'righttriangle_rev':
                xoffset = (w / 2 - (oddcol ? .5 : 0)) * pixelSize;

                ctx.beginPath();
                if (oddcol) { // down-facing
                    ctx.moveTo(xoffset, pixelSize * (h + 1));
                    ctx.lineTo(xoffset + pixelSize + 0.2, pixelSize * h - 0.2);
                    ctx.lineTo(xoffset + pixelSize - 0.2, pixelSize * (h + 1));
                } else {
                    ctx.moveTo(xoffset - .2, pixelSize * h - 0.2);
                    ctx.lineTo(xoffset - 0.2, pixelSize * (h + 1));
                    ctx.lineTo(xoffset + pixelSize + 0.2, pixelSize * h + 0.2);
                }

                ctx.closePath();
                ctx.fill();

                if (!oddcol) {
                    ctx.beginPath();
                    ctx.moveTo(xoffset, pixelSize * h);
                    ctx.lineTo(xoffset + 0.3, pixelSize * (h + 1) - 0.3);
                    ctx.lineTo(xoffset + pixelSize + 0.3, pixelSize * h - 0.3);
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
                    starting_x -= -1.5 * sidelen;
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

function getRowCount(shape, height, width) {

    rows = Math.ceil(height / pixelSize);
    cols = Math.ceil(width / pixelSize);

    switch(shape) {
        case 'square':
             cols--;
            break;
        case 'triangle':
            rows *= 2;
            cols = Math.ceil(cols * (1 / EQ_SIDE_TO_HEIGHT) * 2);
            cols -= 2;
            break;
        case 'righttriangle':
        case 'righttriangle_rev':
            cols *= 2;
            cols -= 2;
            break;
        case 'hexagon':
            rows *= 2;
            cols -= 3;
            break;
    }
    return [rows, cols];
}

function save_img(canvasId) {
    var canvas = document.getElementById(canvasId);
    window.open(canvas.toDataURL('image/png'));
}

downloadCount = 0;

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function save_img_jquery(link, canvasId) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = `dither_${pad(downloadCount.toString(),4)}.png`;
    downloadCount++;
}

(function() {
    ds = DitherStudies();

    canvas = document.getElementById("ditherCanvas");
    canvas.width = document.body.clientWidth - 300;
    canvas.height = document.body.clientHeight;

    document.addEventListener('keydown', (event) => {
        var keyValue = event.key;
        var codeValue = event.code;
       
        // console.log("keyValue: " + keyValue);
        // console.log("codeValue: " + codeValue);

        if (codeValue == 'ArrowRight') {
            document.getElementById("colorslide0").value = document.getElementById("colorslide0").valueAsNumber + 1
            adjSliders(document.getElementById("colorslide0"))
        }
        if (codeValue == 'ArrowLeft') {
            document.getElementById("colorslide0").value = document.getElementById("colorslide0").valueAsNumber - 1
            adjSliders(document.getElementById("colorslide0"))
        }
        if (codeValue == 'KeyD') {
            $('#download').click();
            // save_img_jquery($('#download'), 'ditherCanvas')
        }
      }, false);
    
})();



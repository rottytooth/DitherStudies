/*
    Print the actual dither to the screen
*/

const yoffset = Math.sqrt(3)/2; // used for eq triangles only

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
    const pixelSize = urlParams.get('size');
    const shape = urlParams.get('shape');

    matrix = ds.calculateDither(palette, colorToDither, algo, flow);

    drawDither(matrix, pixelSize, shape);
}

function drawDither(matrix, pixelSize, shape) {

    setSize(shape);
    // updateLink();

    var c = document.getElementById("ditherCanvas");
    var ctx = c.getContext("2d");

    for (var h = 0; h < height; h++) {
        for (var w = 0; w < width; w++) {
            ctx.fillStyle = matrix[h][w];
            switch(shape){
                case 'square':
                    ctx.fillRect(w * pixelSize, h * pixelSize, pixelSize, pixelSize);
                    break;
                case 'triangle':
                    var oddcol = (w % 2 == 1); // are we in an odd column
                    var oddrow = (h % 2 == 1); // are we in an odd row
                    var xoffset = w * (pixelSize / 2) - (pixelSize * 2);

                    ctx.beginPath();
                    if ((oddrow && oddcol) || (!oddrow && !oddcol)) {
                        ctx.moveTo(xoffset, pixelSize * yoffset * (h + 1));
                        ctx.lineTo(pixelSize + xoffset, pixelSize * yoffset * (h + 1));
                        ctx.lineTo(pixelSize / 2 + xoffset, pixelSize * yoffset * h);
                    } else {
                        ctx.moveTo(xoffset, pixelSize * yoffset * h);
                        ctx.lineTo(pixelSize + xoffset, pixelSize * yoffset * h);
                        ctx.lineTo(pixelSize / 2 + xoffset, pixelSize * yoffset * (h + 1));
                    }
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
            width = Math.ceil(document.body.clientWidth / pixelSize) * yoffset * 2;
            break;
    }
}

(function() {
    ds = DitherStudies();

    canvas = document.getElementById("ditherCanvas");
    canvas.width = document.body.clientWidth - 300;
    canvas.height = document.body.clientHeight;
})();



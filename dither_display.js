
const EQ_SIDE_TO_HEIGHT = Math.sqrt(3)/2;
const HEX_SIDE_TO_HEIGHT = 1.732051;

// default sets of colors on first load 
const colorsets = [
    {first:"#00ff00",second:"#ff00ff",avg:"#e0c4b6"},
    {first:"#ffffff",second:"#000000",avg:"#777777"},
    {first:"#ff0033",second:"#00ffcc",avg:"#d0a97a"},
    {first:"#7312ff",second:"#c5ff00",avg:"#ba96a9"}
]

const defaultColorSet = colorsets[Math.floor(Math.random() * colorsets.length)];


const margin = 30; // minimal hue margin difference for a randomized color

// size in pixels for different size shapes. Should have equal # of entries so they fit in the same slider
const pixelSizes = {
    "square": [5, 6, 8, 10, 14, 18, 27, 40, 80],
    "triangle": [6, 8, 10, 14, 18, 27, 40, 60, 80, 100],
    "righttriangle": [6, 8, 10, 14, 18, 27, 40, 60, 80],
    "righttriangle_rev": [6, 8, 10, 14, 18, 27, 40, 60, 80],
    "hexagon": [5, 6, 8, 10, 14, 18, 27, 40, 80],
    "hexagon_rev": [3, 4, 5, 6, 8, 10, 14, 18, 27]
};

var isPlaying = false; // whether it is currently in "play" mode (running an animation)

var downloadCount = 0; // this is for counting the images exported from the site in this session

var sliderLocs = []; // this will hold the prepopulated value of each of the color sliders

var ds; // this will be a DitherStudies object

var prevTime = new Date();

// speeds in milliseconds for playback
const playspeeds = [1000,750,500,250,125,80]

// We hold on to the previous matrix before drawing because in "play" mode, 
// we don't want to draw exactly the same image that we had just displayed
var prevMatrix = [];

/*
 * Something has changed; time to update the display
 * 
 * PARAMS:
 * height: height of the canvas
 * width: width of the canvas
 */
function updateDisplay(height, width) {

    state = decodeLocation(); // current state, drawn from url

    const [rows, cols] = getRowCount(state.shape, height, state.pixelSize);

    matrix = ds.calculateDither(state.palette, state.colorToDither, state.algo, state.flow, rows, cols);

    drawDither(matrix, state.pixelSize, state.shape, rows, cols);
    

    if (isPlaying && compareMatrices(prevMatrix, matrix)) {
        // bypass this step in the animation and go to the next
        console.log("Detected the frame was the same as the previous and skipped");
        play();
    }

    prevMatrix = matrix;
}

function compareMatrices(matrix1, matrix2) {
    return (JSON.stringify(matrix1) == JSON.stringify(matrix2));
}

// return current state. If state is not populated, return defaults
const decodeLocation = () => {
    urlParams = new URLSearchParams(window.location.search);
    palette = decodeURIComponent(urlParams.get('cols'));
    if (palette != null && palette != "null") {
        palette = palette.split(",");
    } else {
        palette = null;
    }
    slidervals = decodeURIComponent(urlParams.get('s'));
    if (slidervals != null && slidervals != "null") {
        slidervals = slidervals.split(",");
        slidervals = slidervals.map(function (x) { 
            return parseInt(x); 
          });
    }
    else slidervals = null;

    if (palette == null || slidervals == null) {
        // okay, we're missing palette or slidervals, let's just send the entire set of defaults

        return {
            palette: [defaultColorSet.first, defaultColorSet.second],
            colorToDither: d3.lab(defaultColorSet.avg),
            slidervals: [127, 127],
            algo: 'FloydSteinberg',
            flow: 'ltor',
            pixelSize: 8,
            shape: 'square'            
        }
    }

    return {
        // comma-separated list of the colors
        palette: palette,
        
        // this is the combined color, the palette and the slidervals can produce this
        colorToDither: d3.lab(decodeURIComponent(urlParams.get('c'))),

        // the amount of each color
        slidervals: slidervals,

        // which kernel was selected
        algo: urlParams.get('algo'),

        // l_to_r, serpentine, etc
        flow: urlParams.get('flow'),

        pixelSize: parseInt(urlParams.get('size')),

        shape: urlParams.get('shape')
    };
}

// These are for the Kernel Pop-Up
function openKernelPopup() {
    document.getElementById("kernelPopUp").style.display = 'block';
    document.getElementById("kernelBackground").style.display = 'block';

    document.getElementById("kernelBackground").style.height = document.getElementById("kernelPopUp").clientHeight + "px";
}
function close_kernel_popup() {
    document.getElementById("kernelPopUp").style.display = 'none';
    document.getElementById("kernelBackground").style.display = 'none';
}

/*
 * Draw the actual dither, pixel by pixel
 */
function drawDither(matrix, pixelSize, shape, rows, cols) {

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

                // overlap control
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

                // fills out bottom triangles for overlap
                if (!oddcol) {
                    ctx.beginPath();
                    ctx.moveTo(xoffset, pixelSize * h);
                    ctx.lineTo(xoffset + 0.3, pixelSize * (h + 1) - 0.3);
                    ctx.lineTo(xoffset + pixelSize + 0.3, pixelSize * h - 0.3);
                    ctx.closePath();
                    ctx.fill();
                }
                break;
            case 'hexagon_rev':
                let sidelenrev = (pixelSize * HEX_SIDE_TO_HEIGHT) / 2.0;

                let start_x = w * sidelenrev * 2.0;
                let start_y = h * pixelSize * 1.5 - sidelenrev * 0.5;

                if (oddrow) {
                    start_x += sidelenrev;
                }
  
                pixelOffset = 0.0;
                if (pixelSize > 4) pixelOffset = 0.2;
                if (pixelSize > 10) pixelOffset = 0.4;

                ctx.beginPath();
                ctx.moveTo(start_x, start_y - pixelOffset);
                ctx.lineTo(start_x + sidelenrev + pixelOffset, start_y + pixelSize / 2.0 - pixelOffset);
                ctx.lineTo(start_x + sidelenrev + pixelOffset, start_y + pixelSize * 3.0 / 2.0 + pixelOffset);
                ctx.lineTo(start_x, start_y + 2.0 * pixelSize + pixelOffset);
                ctx.lineTo(start_x - sidelenrev - pixelOffset, start_y + pixelSize * 3.0 / 2.0 + pixelOffset);
                ctx.lineTo(start_x - sidelenrev - pixelOffset, start_y + pixelSize / 2.0 - pixelOffset);

                ctx.closePath();
                ctx.fill();
                break;            
            case 'hexagon':
                // pixelSize will be height of the hexagon; 
                let sidelen = pixelSize / HEX_SIDE_TO_HEIGHT;

                let starting_x = w * sidelen * 3.0
                let starting_y = (h - 1) * pixelSize / 2.0

                if (oddrow) {
                    starting_x -= 1.5 * sidelen;
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

// Given the height and width of the canvas and the shape and size of the pixel, returns the number of rows and cols and adjusts the size of the canvas to the largest that looks right for that shape
function getRowCount(shape, height, pixelSize) {

    rows = Math.floor(height / pixelSize);
    cols = Math.floor(originalWidth / pixelSize);

    origcols = cols;
    offset = 1;
    offset_h = 0;

    switch(shape) {
        case 'square':
             rows++;
             break;
        case 'triangle':
            rows *= 2;
            cols = Math.ceil(cols * (1 / EQ_SIDE_TO_HEIGHT) * 2);
            break;
        case 'righttriangle':
        case 'righttriangle_rev':
            cols *= 2;
            rows += 2;
            break;
        case 'hexagon_rev':
            rows *= 2;
            cols = Math.floor(originalWidth / (pixelSize * HEX_SIDE_TO_HEIGHT));
            cols += 2;
            offset = HEX_SIDE_TO_HEIGHT;
            break;
        case 'hexagon':
            rows *= 2;
            cols = Math.floor(originalWidth / (pixelSize * 1.5));
            rows += 1;
            offset_h = 1.2;
            break;
    }

    calculated_width = (origcols + offset_h) * pixelSize * offset;    // only expand if calc width is wider than original size
    if (originalWidth > calculated_width) {
        document.getElementById('ditherCanvas').width = calculated_width;
    } else {
        document.getElementById('ditherCanvas').width = Math.ceil(originalWidth / pixelSize) * pixelSize;
    }

    return [rows, cols];
}

function save_img(canvasId) {
    var canvas = document.getElementById(canvasId);
    window.open(canvas.toDataURL('image/png'));
}

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

// average the supplied colors and return their complement in hex form
function getComplementaryColor(colorList) {
    var r_tot = 0, g_tot = 0, b_tot = 0;
    for(var count = 0; count < colorList.length; count++) {
        var locol = d3.rgb(colorList[count]);
        r_tot += locol.r;
        g_tot += locol.g;
        b_tot += locol.b;
    }

    // if we're going to end up with that average grey, pick a random bright color
    if (r_tot >= 253 && g_tot >= 253 && b_tot >= 253) {
        if (!colorList.some(x => d3.hcl(x).l >= 98.0)) {
            // if it doesn't have white
            if (Math.random() < .2) {
                return d3.hsl(0, 0, 100).formatHex();
            }
        }
        if (!colorList.some(x => d3.hcl(x).l <= 1.0)) {
            // if it doesn't have black
            if (Math.random() < .2) {
                return d3.hsl(0, 0, 0).formatHex();
            }
        }
        let hue = Math.floor(Math.random() * 360);
        for (let i = 0; 
            colorList.some(x => d3.hsl(x).h > hue - margin) && 
            colorList.find(x => d3.hsl(x).h < hue + margin); 
            i++) {
                
            hue = Math.floor(Math.random() * 360);
            if (i > 6) break;
        }
        new_color = d3.hsl(hue, 1, .5).formatHex();
        return new_color;
    }

    return d3.rgb(
        255 - (r_tot / count), 
        255 - (g_tot / count), 
        255 - (b_tot / count)
    ).formatHex();
}

function clickColor(t, number) {

    number = parseInt(number);

    // for each color after the one clicked
    for (let i = number + 1; document.getElementById("colorpick" + i) != null; i++) {

        colist = [];

        // for each color before that
        for (let j = 0; j < i; j++) {
            colist[j] = document.getElementById("colorpick" + j).value;
        }
        document.getElementById("colorpick" + i).value = getComplementaryColor(colist);
    }

    recalc();
}

function reMapArray(array, changed, arraySum) {
    const sum = array.reduce( (a, b) => a+b );
    const adjust = (sum - arraySum) / (array.length - 1);
    return array.map( (a, i) => i === changed ? a : a - adjust );
}


function adjSliders(t) {
    var sliders = document.getElementsByClassName("slider");

    slider_changed = parseInt(t.id.slice(-1));

    var oldValues = JSON.parse(JSON.stringify(sliderLocs));
    var newValues = Array.prototype.slice.call(sliders).map(a => parseInt(a.value));

    remove_one = false; // indicates we are using a new value of 0 for calculations that should not be sent to the display

    if (oldValues.length < newValues.length) {
        oldValues[oldValues.length] = (512 / oldValues.length);
        slider_changed = oldValues.length - 1;
    }
    if (newValues.length < oldValues.length) {
        newValues[newValues.length] = (512 / oldValues.length);
        slider_changed = newValues.length - 1;
        remove_one = true; 
    }

    newValues = reMapArray(newValues, slider_changed, 255);    

    if (remove_one) {
        newValues.pop();
    }

    sliderLocs = newValues;

    // // DEBUG
    // let total_avg = newValues.reduce((partialSum, a) => partialSum + parseInt(a), 0) / newValues.length;

    // sum = 0;
    // for (let i = 0; i < newValues.length; i++) {
    //     console.log(`Slider ${i} = ${newValues[i]}`);
    //     sum += newValues[i];
    // }

    // console.log(`sum = ${sum}`);
    // console.log(`total_avg = ${total_avg}`);

    createColorChildControls(sliderLocs.length, sliderLocs);
    recalc();
}


var player; // manages intervals

function play() {
    if (DitherStudies.DEBUG) {
        startTime = new Date();
        var timeDiff = startTime - prevTime;
        console.log(`${timeDiff / 1000} since last frame`);
        prevTime = startTime;
    }

    let download = document.getElementById("ch_download").checked;
    let colorslide = document.getElementById("colorslide0");
    colorslide.value++;
    adjSliders(colorslide);
    download_link = document.getElementById('download');

    if (download) {
        download_link.click();
    }
    if (colorslide.value >= 255) 
        stopPlayAndDownload();

    if (DitherStudies.DEBUG) {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        console.log(`drew dither in ${timeDiff / 1000} seconds`);    
    }
}
function playAndDownload() {
    isPlaying = true;
    document.getElementById("playbutton_play").classList.add("activated");
    document.getElementById("playbutton_stop").classList.remove("activated");

    clearInterval(player);
    player = setInterval(play, playspeeds[document.getElementById("playspeed").value]);
}
function stopPlayAndDownload() {
    isPlaying = false;
    document.getElementById("playbutton_play").classList.remove("activated");
    document.getElementById("playbutton_stop").classList.add("activated");

    clearInterval(player);
}
function changePlaySpeed() {
    clearInterval(player);    
    playAndDownload();
}

function currshape() {
    // determine shape
    var radios = document.getElementsByName('shape');
    var shape = '';

    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            shape = radios[i].value;
            break;
        }
    }

    return shape;
}

function currPixelSize() {
    let idx = parseInt(document.getElementById('pixelsize').value);
    pixelSize = pixelSizes[shape][idx];
    return pixelSize;
}

function updateFlow(flow) {
    // change direction of top text to fit the flow direction
    if (flow == "ltor") {
        document.getElementById("toptitle").style.transform = '';
        document.getElementById("studiestitle").style.transform = '';
        document.getElementById("subtitle_line1").style.transform = '';
        document.getElementById("subtitle_line2").style.transform = '';
    } else if (flow == "serpentine") {
        document.getElementById("toptitle").style.transform = '';
        document.getElementById("studiestitle").style.transform = 'scaleX(-1)';
        document.getElementById("subtitle_line1").style.transform = '';
        document.getElementById("subtitle_line2").style.transform = 'scaleX(-1)';
    } else { // rtol
        document.getElementById("toptitle").style.transform = 'scaleX(-1)';
        document.getElementById("studiestitle").style.transform = '';
        document.getElementById("subtitle_line1").style.transform = 'scaleX(-1)';
        document.getElementById("subtitle_line2").style.transform = 'scaleX(-1)';
    }
}

function recalc() {

    var sliders = document.getElementsByClassName("slider");

    palette = [];
    slider_values = [];

    var l = 0, a = 0, b = 0;

    // find weighted average of selected colors based on slider locations.
    // this is the color which is then dithered into the palette
    for(let i = 0; i < sliders.length; i++) {
        palette[i] = document.getElementById("colorpick" + i).value;
        score = parseInt(document.getElementById("colorslide" + i).value);
        orig = d3.lab(palette[i]);
        l += orig.l * score;
        a += orig.a * score;
        b += orig.b * score;
        slider_values[i] = score;
    }
    var finalcolor = d3.lab(l / 256, a / 256, b / 256);

    // determine ltor vs serpentine
    var radios = document.getElementsByName('flow');
    var flow = '';

    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            flow = radios[i].value;
            break;
        }
    }

    updateFlow(flow);

    let shape = currshape();
    let pixelSize = currPixelSize();

    algoselect = document.getElementById("ditheringAlgorithm");

    updateLocation(palette, slider_values, finalcolor, algoselect.value, flow, pixelSize, shape);

    // set See Kernel link
    document.getElementById("see_kernel").innerText = `About ${algoselect.options[algoselect.selectedIndex].text}`;

    populatePopUp();

    let height = document.getElementById('ditherCanvas').clientHeight;
    let width = document.getElementById('ditherCanvas').clientWidth;

    // FIXME: this will look at shape and pass the appropriate offset
    updateDisplay(height, width); // this is a call to dither_display
}

function updateLocation(palette_cols, slider_values, starting_color, algorithm, flow, size, shape) {
    // pushState would add history / back button
    history.replaceState(null, null, "?cols=" + encodeURIComponent(palette_cols.join()) + "&s=" + encodeURIComponent(slider_values.join(",")) + "&c=" + encodeURIComponent(starting_color.formatHex()) + "&algo=" + algorithm + "&flow=" + flow + "&size=" + size + "&shape=" + shape);
}

function updateColorControls() {
    color_count = document.querySelector('input[name="colorListSize"]:checked').value;
    createColorChildControls(color_count);
    while (sliderLocs.length < color_count) {
        sliderLocs.push(256 / colorslength);
    } 
    recalc();
}

function createColorControls() {
    createColorChildControls(state.palette.length);
}

// this can be called either from dropdown change or from querystring
function createColorChildControls(colorslength, passed_sliderLocs = []) {
    colorslength = parseInt(colorslength);

    state = decodeLocation();

    var sliders = document.getElementById("sliders");
    // var colors = parseInt(document.getElementById("colorList").value);

    var prevColors = [];
    // var currColors = [];

    if ('palette' in state && state.palette != null) {
        prevColors = state.palette;
    }

    sliders.innerHTML = '';

    // if sliderLocs not passed, try to get from state
    sliderLocs = passed_sliderLocs;
    if (sliderLocs == []){
        if ('slidervals' in state && state.slidervals != null) {
            sliderLocs = state
            .slidervals;
        }
    }
 
    for (let i = 0; i < colorslength; i++) {
        var colorpicker = document.createElement("input");
        colorpicker.id = "colorpick" + i;
        colorpicker.setAttribute("type", "color");
        colorpicker.setAttribute("class", "colorpicker");
        colorpicker.setAttribute("onchange", "clickColor(this, '" + i + "')");

        if (prevColors.length > i) {
            colorpicker.setAttribute("value", prevColors[i]);
        } else if (i == 0) { 
            // no colors yet, use defaults
            colorpicker.setAttribute("value", colorset.first);
        } else if (i == 1) {
            // no second color yet, use default
            colorpicker.setAttribute("value", colorset.second);
        } else {
            var colorList = [];
            for (let j = 0; j < i; j++) {
                colorList[j] = d3.lab(document.getElementById("colorpick" + j).getAttribute("value"));
            }
            colorpicker.setAttribute("value", getComplementaryColor(colorList));
        }

        var selectHolder = document.createElement("div");
        selectHolder.setAttribute("class", "slidecontainer");

        var selectSlide = document.createElement("input");
        selectSlide.id = "colorslide" + i;
        selectSlide.setAttribute("type", "range");
        selectSlide.setAttribute("min", "0");
        selectSlide.setAttribute("max", "255");
        if (sliderLocs.length <= i) {
            sliderLocs[i] = (256 / colorslength );
        }
        selectSlide.setAttribute("value", sliderLocs[i]);
        selectSlide.setAttribute("class", "slider");
        selectSlide.setAttribute("onchange", "adjSliders(this)");

        selectHolder.appendChild(selectSlide);
        sliders.appendChild(colorpicker);
        sliders.appendChild(selectHolder);
    }

    // we've lost a color, re-balance the remaining ones
    if (colorslength < prevColors.length) {
        totval = 0;
        for (let i = 0; i < colorslength; i++) {
            totval += parseInt(document.getElementById("colorslide" + i).getAttribute("value"));
        }

        for (let i = 0; i < colorslength; i++) {
            currval = document.getElementById("colorslide" + i).getAttribute("value");
            document.getElementById("colorslide" + i).setAttribute("value", currval * (256 / totval) - 1);
        }
    }
}

function populateDitherDropDown() {
    state = decodeLocation();

    document.getElementById("ditheringAlgorithm").innerText = "";
    shape = currshape();

    kern_list = DitherStudies.kernels;
    dither_list = [];
    group_list = [];
    Object.keys(kern_list).forEach((key) => {
        dither_list.push({"key":key, "name":kern_list[key].name, "group":kern_list[key].group, "shapes":kern_list[key].shapes});
        if (!group_list.includes(kern_list[key].group)) {
            group_list.push(kern_list[key].group);
        }
    }); 

    group_list.forEach(group => { 
        let optgroup = document.createElement("optgroup");
        optgroup.setAttribute("label", group);

        let added = false;

        filtered = dither_list.filter(a => a.group == group);

        for (i = 0; i < filtered.length; i++) {
            let dither = filtered[i];
            if (dither.shapes.includes(shape)) {
                let selected = "";
                if (dither.key == state.algo) {
                    selected = "selected='selected'";
                }
                let op = `<option value='${dither.key}' ${selected}>${dither.name}</option>`;
                optgroup.innerHTML += op;    
                added = true;
            }
        }

        if (added)
            document.getElementById("ditheringAlgorithm").appendChild(optgroup);
    });
}

// set size slider from querystring
function setSizeSlider() {
    // NOTE: This only works if the size value is in the array for that shape
    state = decodeLocation();
    let value = pixelSizes[state.shape].findIndex(e => e == state.pixelSize);
    if (!value) {
        value = pixelSizes[state.shape].findIndex(e => e > state.pixelSize);
    }
    if (!value) {
        value = pixelSizes[state.shape].length - 2;
    }
    document.getElementById("pixelsize").value = value;
}

// square vs triangle etc: update
function setShape() {
    populateDitherDropDown(); // each shape has its own allowable kernels
    recalc();
}

function setPixelSize() {
    recalc();
}

function populatePopUp() {
    let state = decodeLocation();
    let currentDitherLbl = document.getElementById("currentDither");
    let currKernel = DitherStudies.kernels[state.algo];
    currentDitherLbl.innerText = currKernel.name;
    let popupDesc = document.getElementById("popupDesc");

    popupDesc.innerText = ""
    if ("desc" in currKernel) {
        if (Array.isArray(currKernel.desc)) {
            popupDesc.innerHTML = "";
            for (var i = 0; i < currKernel.desc.length; i++) {
                popupDesc.innerHTML += `<p>${currKernel.desc[i]}</p>`;
            }
        } else
            popupDesc.innerHTML += `<p>${currKernel.desc}</p>`;
    } else {
        popupDesc.innerText = "";
    }

    if ("odd_pixel" in currKernel) {
        popupDesc.innerHTML += "<p>This is a double kernel, with different matrices for up-facing (odd) pixels vs. down-facing (even) pixels.</p>"
    }

    nums = {};

    // if it is not a triangle, the default case
    if (state.shape != "triangle" && state.shape != "righttriangle" && state.shape != "righttriangle_rev")
    {        
        _drawDitherMap(currKernel, "kernelMap");

        let downker = document.getElementById("kernelMap_Down");
        downker.width = 0;
        downker.height = document.getElementById("kernelMap").height;

    } else { // triangles have up and down kernels, so need two canvases

        if ('nums' in currKernel) {
            _drawDitherMap(currKernel, "kernelMap");
            _drawDitherMap(currKernel, "kernelMap_Down", true);
        } else {
            _drawDitherMap(currKernel.even_pixel, "kernelMap");
            _drawDitherMap(currKernel.odd_pixel, "kernelMap_Down", true);
        }    
    }

    document.getElementById("kernelBackground").style.height = document.getElementById("kernelPopUp").clientHeight + "px";
}

function _drawDitherMap(currKernel, kernelDivName, flip=false) {
    let c = document.getElementById(kernelDivName);
    c.width = document.getElementById("popupContent").clientWidth / 2.0 - 3;
    c.height = 300;

    last_y = _drawDitherKernel(c, currKernel.nums, currKernel.start_x, currKernel.start_y, currKernel.denom, flip);

    c.height = last_y + 5;

    _drawDitherKernel(c, currKernel.nums, currKernel.start_x, currKernel.start_y, currKernel.denom, flip);
}

function _drawDitherKernel(c, nums, start_x, start_y, denom, flip=false) {
    let state = decodeLocation();
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    flip = flip ? 1 : 0

    ctx.lineWidth = 2;

    let pixelSize = 50;
    ctx.font = "20px Lato, sans-serif";
    ctx.textAlign = 'center';


    let last_x = 0;
    let last_y = 0;

    for (let y = 0; y < nums.length; y++) {
        for (let x = 0; x < nums[0].length; x++) {
            content = nums[y][x];

            oddrow = Math.abs(y - start_y) % 2 != 0;
            oddcol = Math.abs(x - start_x) % 2 != flip;

            if (y < start_y || (y == start_y && x < start_x)) {
                continue;
            }
            
            if (y == start_y && x == start_x) {
                content = "\u00d7";
            }
            else if (content == 0) {
                if (nums[y].slice(0,x).length == 0 || nums[y].slice(0,x).reduce((a,b) => a + b) == 0)
                    continue;
                if (nums[y].slice(x).length == 0 || nums[y].slice(x).reduce((a,b) => a + b) == 0)
                    continue;
            }

            

            // Yes, this is all cut-and-pasted from drawDither() above then with little changes made to it, and the whole thing should be refactored to combine the two
            switch(state.shape) {
                case "square":
                    ctx.rect(pixelSize * x + 2, pixelSize * y + 2, pixelSize, pixelSize);
                    ctx.fillText(content, pixelSize * x + pixelSize / 2.0, pixelSize * y + pixelSize / 2.0 + 10);
                    last_x = pixelSize * x + pixelSize;
                    last_y = pixelSize * y + pixelSize;
                    break;
                case "triangle":
                    triPixelSize = pixelSize * 1.4;
                    xoffset = x * (triPixelSize / 2);
                    ctx.beginPath();
                    if ((oddrow && oddcol) || (!oddrow && !oddcol)) {
                        // apex at top
                        left = {};
                        left.x = xoffset;
                        left.y = triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1) + 3;

                        right = {};
                        right.x = triPixelSize + xoffset;
                        right.y = triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1) + 3;

                        apex = {};
                        apex.x = triPixelSize / 2 + xoffset;
                        apex.y = triPixelSize * EQ_SIDE_TO_HEIGHT * y + 3;

                        ctx.fillText(content, triPixelSize / 2 + xoffset, triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1.5) - triPixelSize * .6);

                        last_x = triPixelSize + xoffset;
                        last_y = triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1) + 3;
                    } else {
                        left = {};
                        left.x = xoffset;
                        left.y = triPixelSize * EQ_SIDE_TO_HEIGHT * y + 3;

                        right = {};
                        right.x = triPixelSize + xoffset;
                        right.y = triPixelSize * EQ_SIDE_TO_HEIGHT * y + 3;

                        apex = {};
                        apex.x = triPixelSize / 2 + xoffset;
                        apex.y = triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1) + 3;

                        ctx.fillText(content, triPixelSize / 2 + xoffset, triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1.5) - triPixelSize * .85);

                        last_x = triPixelSize + xoffset;
                        last_y = triPixelSize * EQ_SIDE_TO_HEIGHT * (y + 1) + 3;
                    }
                    // console.log(`left: ${left.x}, ${left.y}`);
                    // console.log(`right: ${right.x}, ${right.y}`);
                    // console.log(`apex: ${apex.x}, ${apex.y}`);
                    ctx.moveTo(left.x, left.y);
                    ctx.lineTo(right.x, right.y);
                    ctx.lineTo(apex.x, apex.y);
                    ctx.closePath();
                    break;
                case "righttriangle":
                    triPixelSize = pixelSize * 1.2;
                    xoffset = (x / 2 - (oddcol ? .5 : 0)) * triPixelSize + 30;
                    ctx.beginPath();

                    if (oddcol) { // down-facing
                        ctx.moveTo(xoffset, triPixelSize * y + 2);
                        ctx.lineTo(xoffset + triPixelSize + 0.2, triPixelSize * y + 2);
                        ctx.lineTo(xoffset + triPixelSize + 0.2, triPixelSize * (y + 1) + 2);

                        ctx.fillText(content, xoffset + triPixelSize * 0.7, triPixelSize * (y + 0.5));
                    } else {
                        ctx.moveTo(xoffset, triPixelSize * y + 2);
                        ctx.lineTo(xoffset - 0.2, triPixelSize * (y + 1) + 2);
                        ctx.lineTo(xoffset + triPixelSize - 0.2, triPixelSize * (y + 1) + 2);

                        ctx.fillText(content, xoffset + triPixelSize * 0.3, triPixelSize * (y + 0.9));
                    }
                    ctx.closePath();
                    last_x = xoffset + triPixelSize + 0.2;
                    last_y = triPixelSize * (y + 1) + 0.2;
                    break;
                case "righttriangle_rev":
                    triPixelSize = pixelSize * 1.2;
                    xoffset = (x / 2 - (oddcol ? .5 : 0)) * triPixelSize + 30;
                    ctx.beginPath();

                    if (oddcol) { // down-facing
                        ctx.moveTo(xoffset, triPixelSize * (y + 1) + 2);
                        ctx.lineTo(xoffset + triPixelSize, triPixelSize * y + 2);
                        ctx.lineTo(xoffset + triPixelSize, triPixelSize * (y + 1) + 2);

                        ctx.fillText(content, xoffset + triPixelSize * 0.7, triPixelSize * (y + 0.9));
                    } else {
                        ctx.moveTo(xoffset, triPixelSize * y + 2);
                        ctx.lineTo(xoffset, triPixelSize * (y + 1) + 2);
                        ctx.lineTo(xoffset + triPixelSize, triPixelSize * y + 2);

                        ctx.fillText(content, xoffset + triPixelSize * 0.3, triPixelSize * (y + 0.5));
                    }
    
                    ctx.closePath();
                    last_x = xoffset + triPixelSize + 0.2;
                    last_y = triPixelSize * (y + 1) + 0.2;
                    break;
                case 'hexagon_rev':
                    triPixelSize = pixelSize * 0.6;

                    let sidelenrev = (triPixelSize * HEX_SIDE_TO_HEIGHT) / 2.0;

                    let start_x = x * sidelenrev * 2.0 + 35;
                    let start_y = y * triPixelSize * 1.5 + 5;
    
                    if (oddrow) {
                        start_x += sidelenrev;
                    }
                            
                    ctx.beginPath();
                    ctx.moveTo(start_x, start_y);
                    ctx.lineTo(start_x + sidelenrev, start_y + triPixelSize / 2.0);
                    ctx.lineTo(start_x + sidelenrev, start_y + triPixelSize * 3.0 / 2.0);
                    ctx.lineTo(start_x, start_y + 2.0 * triPixelSize);
                    ctx.lineTo(start_x - sidelenrev, start_y + triPixelSize * 3.0 / 2.0);
                    ctx.lineTo(start_x - sidelenrev, start_y + triPixelSize / 2.0);
    
                    ctx.fillText(content, start_x, start_y + triPixelSize * 1.2);

                    ctx.closePath();
                    last_x = start_x + sidelenrev;
                    last_y = start_y + triPixelSize * 3.0 / 2.0 + 5;
                    break;                
                case "hexagon": // this is actually the second hexagon
                    triPixelSize = pixelSize;

                    // pixelSize will be height of the hexagon; 
                    let sidelen = triPixelSize / HEX_SIDE_TO_HEIGHT;

                    let starting_x = x * sidelen * 3.0 + 2 * sidelen + 3;
                    let starting_y = y * triPixelSize / 2.0 + 3;

                    if (oddrow) {
                        starting_x -= 1.5 * sidelen;
                    }

                    ctx.beginPath();
                    ctx.moveTo(starting_x, starting_y);
                    ctx.lineTo(starting_x + sidelen, starting_y);
                    ctx.lineTo(starting_x + 1.5 * sidelen, starting_y + triPixelSize / 2.0);
                    ctx.lineTo(starting_x + sidelen, starting_y + triPixelSize);
                    ctx.lineTo(starting_x, starting_y + triPixelSize);
                    ctx.lineTo(starting_x - 0.5 * sidelen, starting_y + triPixelSize / 2.0);

                    ctx.fillText(content, starting_x + sidelen * 0.5, starting_y + triPixelSize / 1.7);

                    ctx.closePath();
                    if (last_x < starting_x + 1.5 * sidelen)
                        last_x = starting_x + 1.5 * sidelen;
                    last_x += 20;
                    last_y = starting_y + triPixelSize + 5;
                    break;    
            }
            ctx.stroke();
        }
    }
    ctx.fillText("/ " + denom, last_x + pixelSize / 2 + 10, last_y - pixelSize / 2 + 10);

    if (state.shape == "hexagon_rev")
        last_y += 7;
    return last_y;
}

var originalWidth;

// STARTUP
(function() {
    ds = DitherStudies();

    canvas = document.getElementById("ditherCanvas");
    if (canvas != undefined ) {
        canvas.width = document.body.clientWidth - sizeOfControls;
        canvas.height = document.body.clientHeight;    

        originalWidth = canvas.width; // global, used for pixel calculation

        if (/[?&]cols=/.test(location.search)) {
            // we have just loaded the page and there is already a "cols" in the querystring
        
            updateDisplay(
                document.getElementById('ditherCanvas').clientHeight,
                document.getElementById('ditherCanvas').clientWidth);        
        }
    }
    state = decodeLocation();

    elems = document.getElementsByName('shape');
    for (let i = 0; i < elems.length; i++) {
        if (elems[i].value == state.shape) {
            elems[i].checked = true;
        }
    }

    document.getElementById("ditheringAlgorithm").onchange = recalc;

    var color_nums = document.getElementsByName("colorListSize");
    for (let i = 0; i < color_nums.length; i++) {
        color_nums[i].onchange = updateColorControls;
        if (color_nums[i].value == state.palette.length) {
            color_nums[i].checked = true;
        }
    }

    var color_nums = document.getElementsByName("flow");
    for (let i = 0; i < color_nums.length; i++) {
        color_nums[i].onchange = updateColorControls;
        if (color_nums[i].value == state.flow) {
            color_nums[i].checked = true;
        }
    }

    populateDitherDropDown();
    createColorControls();
    setSizeSlider();
    populatePopUp();

    algoselect = document.getElementById("ditheringAlgorithm");
    document.getElementById("see_kernel").innerText = `About ${algoselect.options[algoselect.selectedIndex].text}`;

    if (canvas != undefined) {
        let height = document.getElementById('ditherCanvas').clientHeight;
        let width = document.getElementById('ditherCanvas').clientWidth;
        updateDisplay(height, width);

        window.addEventListener('resize', function() {
            populatePopUp();

            canvas = document.getElementById("ditherCanvas");
            canvas.width = document.body.clientWidth - sizeOfControls;
            canvas.height = document.body.clientHeight;

            let height = document.getElementById('ditherCanvas').clientHeight;
            let width = document.getElementById('ditherCanvas').clientWidth;
            updateDisplay(height, width);
        });

        document.getElementById("ditherCanvas").addEventListener("click", close_kernel_popup);
    }
 })();


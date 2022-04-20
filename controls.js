/*
    Control panel for the dithers, and all the initial calculations
    associated with them
 */

const defaultFirstColor = "#00ff00";
const defaultSecondColor = "#ff00ff";

const pixelSizes = [4, 5, 6, 8, 10, 14, 18, 27, 40, 80];

const maxCols = 4;

var pixelSize = 8; // starting pixel size

// average the supplied colors and return their complement in hex form
function getComplementaryColor(colorList) {
    var r_tot = 0, g_tot = 0, b_tot = 0;
    for(var count = 0; count < colorList.length; count++) {
        var locol = d3.rgb(colorList[count]);
        r_tot += locol.r;
        g_tot += locol.g;
        b_tot += locol.b;
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

// this will hold the prepopulated value of each of the color sliders
var sliderLocs = [];

function adjSliders(t) {
    var sliders = document.getElementsByClassName("slider");

    slider_changed = parseInt(t.id.slice(-1));
    slidersum = 512 - sliderLocs[slider_changed]; // sum of the ones that did not change

    var newSliderLocs = [];
    for(let i = 0; i < sliders.length; i++) {
        if (slider_changed != i)
            document.getElementById("colorslide" + i).value = sliderLocs[i] * (512 - parseInt(document.getElementById("colorslide" + slider_changed).value)) / slidersum 
        newSliderLocs[i] = document.getElementById("colorslide" + i).value;
    }
    sliderLocs = newSliderLocs;

    recalc();
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

function recalc() {

    var sliders = document.getElementsByClassName("slider");
    var colorpickers = document.getElementsByClassName("colorpicker");

    palette = [];

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
    }
    var finalcolor = d3.lab(l / 512, a / 512, b / 512);

    // determine ltor vs serpentine
    var radios = document.getElementsByName('flow');
    var flow = '';

    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            flow = radios[i].value;
            break;
        }
    }

    shape = currshape();

    // console.log(document.getElementById("colorpick0").value);
    // console.log(document.getElementById("colorpick1").value);
    // console.log(document.getElementById("colorslide0").value);
    // console.log(document.getElementById("colorslide1").value);

    updateLocation(palette, finalcolor, document.getElementById("ditheringAlgorithm").value, flow, pixelSize, shape);

    let height = document.getElementById('ditherCanvas').clientHeight;
    let width = document.getElementById('ditherCanvas').clientWidth;

    // FIXME: this will look at shape and pass the appropriate offset
    updateDisplay(height, width, 0, 0); // this is a call to dither_display. In the "uncombined" view, the updateLocation() all above would actually reload the page for the display monitor, and that would then just do a calculateDither based on that
}

function updateLocation(palette_cols, starting_color, algorithm, flow, size, shape) {
    // pushState would add history / back button
    history.replaceState(null, null, "?cols=" + encodeURIComponent(palette_cols.join()) + "&s=" + encodeURIComponent(starting_color.formatHex()) + "&algo=" + algorithm + "&flow=" + flow + "&size=" + size + "&shape=" + shape);
}

function createColorControls() {
    var sliders = document.getElementById("sliders");
    var colors = parseInt(document.getElementById("colorList").value);

    var prevColors = [];
    var currColors = [];

    for(let i = 0; i < document.getElementsByClassName("colorpicker").length; i++) {
        prevColors[i] = document.getElementById("colorpick" + i).value;
    }

    sliders.innerHTML = '';

    sliderLocs = [];

    for (let i = 0; i < colors; i++) {
        var colorpicker = document.createElement("input");
        colorpicker.id = "colorpick" + i;
        colorpicker.setAttribute("type", "color");
        colorpicker.setAttribute("class", "colorpicker");
        colorpicker.setAttribute("onchange", "clickColor(this, '" + i + "')");

        if (prevColors.length > i) {
            colorpicker.setAttribute("value", prevColors[i]);
        } else if (i == 0) { // default colors
            colorpicker.setAttribute("value", defaultFirstColor);
        } else if (i == 1) {
            colorpicker.setAttribute("value", defaultSecondColor);
        } else {
            var colorList = [];
            for (let j = 0; j < i; j++) {
                colorList[j] = d3.lab(document.getElementById("colorpick" + j).getAttribute("value"));
            }
            colorpicker.setAttribute("value", getComplementaryColor(colorList));
        }
        currColors[i] = colorpicker.getAttribute("value");

        var selectHolder = document.createElement("div");
        selectHolder.setAttribute("class", "slidecontainer");

        var selectSlide = document.createElement("input");
        selectSlide.id = "colorslide" + i;
        selectSlide.setAttribute("type", "range");
        selectSlide.setAttribute("min", "0");
        selectSlide.setAttribute("max", "511");
        selectSlide.setAttribute("value", Math.floor(512 / colors));
        selectSlide.setAttribute("class", "slider");
        selectSlide.setAttribute("onchange", "adjSliders(this)");

        selectHolder.appendChild(selectSlide);
        sliders.appendChild(colorpicker);
        sliders.appendChild(selectHolder);

        sliderLocs[i] = 512 / colors;
    }

    recalc();
}

function populateDitherDropDown() {
    $("#ditheringAlgorithm").empty();
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
        let $optgroup = $(`<optgroup label='${group}'>`);
        let added = false;

        filtered = dither_list.filter(a => a.group == group);

        for (i=0; i<filtered.length; i++) {
            let dither = filtered[i];
            if (dither.shapes.includes(shape)) {
                let op = `<option value='${dither.key}'>${dither.name}</option>`;
                $optgroup.append(op);    
                added = true;
            }
        }

        if (added)
            $("#ditheringAlgorithm").append($optgroup);
    });
}

function shapeChange() {
    populateDitherDropDown();
    recalc();
}

function setPixelSize(t) {
    shape = currshape();
    let idx = parseInt(t.value);
    if (shape == 'triangle' || shape == 'righttriangle')
        idx += 2;
    pixelSize = pixelSizes[idx];
    recalc();
}

(function() {
    document.getElementById("ditheringAlgorithm").onchange = recalc;
    document.getElementById("colorList").onchange = createColorControls;

    populateDitherDropDown();
    createColorControls();

 })();

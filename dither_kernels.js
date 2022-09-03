/*
    Coefficients for each type of error-diffusion dither
 */

DitherStudies.shapes = [
    "square",
    "righttriangle",
    "righttriangle_rev",
    "triangle",
    "hexagon"
]

DitherStudies.kernels = {
    
    "FloydSteinberg" : {
        "name" : "Floyd-Steinberg", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 7], [3, 5, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle","hexagon","hexagon_rev"],
        "group": "FS and Variants",
        "desc" : ["Published in 1976 by Robert W. Floyd and Louis Steinberg. One of the most popular dithering kernels, used widely in image manipulation software. It has inspired a number of variations, some of which sit below it in this drop-down. Photoshop's diffusion dither is a proprietary variation of FS.","Although designed for square pixels, as the most common dithering kernel, it is here made available across all of the shapes, for comparison with those designed for non-square shapes."]
    },
    "ZFan" : { 
        "name" : "Zhigang Fan",
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 7], [1, 3, 5, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "ShiauFan2" : {
        "name" : "Shiau-Fan (1994)", 
        "start_x" : 3,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 0, 8], [1, 1, 2, 4, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants",
        "desc": "The Shiau-Fan kernels attempt to reduce the visual artifacts of Floyd-Steinberg. From \"Method for quantization gray level pixel data with extended distribution set\" (1994). One of the few digital halftoning patterns that was patented (expired in 2011)."
    },
    "ShiauFan" : {
        "name" : "Shiau-Fan (1996)",
        "start_x" : 2,
        "start_y" : 0,
        "denom": 8,
        "nums": [[0, 0, 0, 4], [1, 1, 2, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants",
        "desc": "The Shiau-Fan kernels attempt to reduce the visual artifacts of Floyd-Steinberg. From \"A set of easily implementable coefficients in error diffusion with reduced worm artifacts\" (1996). A simplification of their 1994 kernel."
    },
    "FilterLite" : {
        "name" : "Filter Lite", 
        "start_x" : 1,
        "start_y" : 0,
        "denom": 4,
        "nums" : [[0, 0, 2], [1, 1, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants",
        "desc": "Created by Frankie Sierra. The simplest of Floyd-Steinberg variations."
    },
    "Atkinson" : {
        "name" : "Atkinson", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 8,
        "nums" : [[0, 0, 1, 1], [1, 1, 1, 0], [0, 1, 0, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants",
        "desc": "Created by Bill Atkinson of Hypercard fame. Atkinson dithering loses information in the darkest and brightest parts of the image but has better contrast in the middle range; this is due to only 3/4 of the error propogating to other pixels. Its artifacts look like those of no other kernel and it is the sole Floyd-Steinberg derivative that does not create the 1x1 pixel checkerboard pattern at 50% grey."
    },
    "JaJuNi" : {
        "name" : "Jarvis, Judice and Ninke", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 48,
        "nums" : [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "JaJuNi and Variants",
        "desc" : "JaJuNi was developed around the same time as Floyd-Steinberg and also inspired a number of variations. It is far more complex than FS, although generally considered to have fewer visual artifacts when applied to photographic images."
    },
    "Stucki" : {
        "name" : "Stucki", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 42,
        "nums" : [[0, 0, 0, 8, 4], [2, 4, 8, 4, 2], [1, 2, 4, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "JaJuNi and Variants",
        "desc": "Published in 1981 by an IBM Research Lab in Switzerland. Finer grained modification of Jarvis-Judice-Ninke with error distribution more locally concentrated. From \"MECCA - A Multiple-Error Correcting Computation Algorithm for Bilevel Image Hard Copy Reproductions\""
    },
    "Burkes" : {
        "name" : "Burkes", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 2], [1, 2, 4, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "JaJuNi and Variants",
        "desc": "A simplified version of Stucki created in 1988 for speed but featuring strongly orthogonal artifacts. Like other variants of existing filters, speed-ups mainly hinge on converting the division operations to bit-shift operations (ie. division by a power of two)."
    },
    "Sierra" : {
        "name" : "Sierra", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 32,
        "nums" : [[0, 0, 0, 5, 3], [2, 4, 5, 4, 2], [0, 2, 3, 2, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "JaJuNi and Variants",
        "desc": "Created by Frankie Sierra. Simplified from Jarvis but giving similar results."
    },
    "TwoRowSierra" : {
        "name" : "Two-Row Sierra", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 3], [1, 2, 3, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "JaJuNi and Variants",
        "desc": "Created by Frankie Sierra. A simplification of the Sierra kernel, brought down to two rows."
    },
    "StephensonArce": {
        "name" : "Stephenson Arce",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 200,
        "nums" : [[0,0,32,0],[12,26,30,16],[12,26,12,0],[5,12,12,5]],
        "shapes": ["square","hexagon","hexagon_rev"],
        "group": "Other Shapes",
        "desc": "Designed for the hexagonal layout of printer dots."
    },
    "RightTriangle_Temkin1": {
        "name" : "RightTri Temkin 1", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 11], [1, 3, 1]],
        "shapes": ["righttriangle","righttriangle_rev"],
        "group": "Other Shapes"
    },
    "RightTriangle_BiDirectional": {
        "name" : "RightTri Bi-Directional",
        "even_pixel": {
            "start_x" : 1,
            "start_y" : 0,
            "denom" : 16,
            "nums" : [[0, 0, 11], [1, 3, 1]]    
        },
        "odd_pixel": {
            "start_x" : 1,
            "start_y" : 0,
            "denom" : 16,
            "nums" : [[0, 0, 7], [2, 5, 2]]
        },
        "shapes": ["righttriangle","righttriangle_rev"],
        "group": "Other Shapes"
    },
    "HexDiagonals1": {
        "name" : "HexDiagonals 1", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 5], [0, 0, 2], [0, 8, 1]],
        "shapes": ["hexagon"],
        "group": "Other Shapes",
        "desc": "One of the highest scoring kernels in an exhaustive search of 9x9 grids with a denominator of 16."
    },
    "Hex2": {
        "name" : "Hex2", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 2], [0, 0, 2], [3, 8, 1]],
        "shapes": ["hexagon"],
        "group": "Other Shapes",
        "desc": "One of the highest scoring kernels in an exhaustive search of 9x9 grids with a denominator of 16."
    },
    "HexRevThreeRow1": {
        "name" : "HexRev1", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 2], [0, 0, 2], [4, 0, 8]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "Stearns": {
        "name": "Stearns",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 28,
        "nums" : [[ 0, 0, 5, 3 ], [ 3, 5, 3, 1 ], [ 1, 3, 3, 1 ]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle","hexagon","hexagon_rev"],
        "group": "Other Shapes"
    },
    "TwoRowGrey": {
        "name": "TwoRowGrey",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 8,
        "nums" : [[0, 0, 4], [1, 1, 1]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "MLHexRev1": {
        "name": "ML Hex Rev 1",
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 26,
        "nums" : [[0, 0, 0, 11, 0], [2, 2, 3, 4, 2], [0, 0, 0, 1, 0]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "MLHexRev2": {
        "name": "ML Hex Rev 2",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 45,
        "nums" : [[0, 0, 21], [6, 8, 10]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "MLHexRev3": {
        "name": "ML Hex Rev 3",
        "start_x" : 3,
        "start_y" : 0,
        "denom" : 89,
        "nums" : [[0, 0, 0, 0, 11, 3], [9, 2, 7, 4, 8, 9], [2, 2, 3, 2, 0, 2], [2, 3, 2, 7, 8, 3]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "MLHexRev4": {
        "name": "ML Hex Rev 4",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 55,
        "nums" : [[0, 0, 19], [3, 8, 5], [1, 4, 1], [1, 6, 7]],
        "shapes": ["hexagon_rev"],
        "group": "Other Shapes"
    },
    "MLHex3G": {
        "name": "ML Hex Third Gen",
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 26,
        "nums" : [[0, 0, 0, 1], [7, 4, 6, 8]],
        "shapes": ["hexagon"],
        "group": "Other Shapes",
        "desc": "Produced by a genetic algorithm, this pattern creates grid-like patterns due to the spacing of pixels far to the left."
    },
}



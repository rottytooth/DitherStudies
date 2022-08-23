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
        "group": "FS and Variants"
    },
    "ZFan" : { 
        "name" : "Zhigang Fan",
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 48,
        "nums" : [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "ShiauFan" : {
        "name" : "Shiau-Fan",
        "start_x" : 2,
        "start_y" : 0,
        "denom": 8,
        "nums": [[0, 0, 0, 4], [1, 1, 2, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "ShiauFan2" : {
        "name" : "Shiau-Fan 2", 
        "start_x" : 3,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 0, 8], [1, 1, 2, 4, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "FilterLite" : {
        "name" : "Filter Lite", 
        "start_x" : 1,
        "start_y" : 0,
        "denom": 4,
        "nums" : [[0, 0, 2], [1, 1, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "Atkinson" : {
        "name" : "Atkinson", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 8,
        "nums" : [[0, 0, 1, 1], [1, 1, 1, 0], [0, 1, 0, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "FS and Variants"
    },
    "JaJuNi" : {
        "name" : "Jarvis, Judice and Ninke", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 48,
        "nums" : [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "Jarvis and Variants"
    },
    "Stucki" : {
        "name" : "Stucki", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 42,
        "nums" : [[0, 0, 0, 8, 4], [2, 4, 8, 4, 2], [1, 2, 4, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "Jarvis and Variants"
    },
    "Burkes" : {
        "name" : "Burkes", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 2], [1, 2, 4, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "Jarvis and Variants"
    },
    "Sierra" : {
        "name" : "Sierra", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 32,
        "nums" : [[0, 0, 0, 5, 3], [2, 4, 5, 4, 2], [0, 2, 3, 2, 0]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "Jarvis and Variants"
    },
    "TwoRowSierra" : {
        "name" : "Two-Row Sierra", 
        "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 3], [1, 2, 3, 2, 1]],
        "shapes": ["square","righttriangle","righttriangle_rev","triangle"],
        "group": "Jarvis and Variants"
    },
    "StephensonArce": {
        "name" : "Stephenson Arce",
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 200,
        "nums" : [[0,0,32],[12,26,30,16],[12,26,12,0],[5,12,12,5]],
        "shapes": ["hexagon","hexagon_rev"],
        "group": "Other Shapes"
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
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums_even" : [[0, 0, 11], [1, 3, 1]],
        "nums_odd" : [[0, 0, 7], [2, 5, 2]],
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
        "group": "Other Shapes"
    },
    "Hex2": {
        "name" : "Hex2", 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 2], [0, 0, 2], [3, 8, 1]],
        "shapes": ["hexagon"],
        "group": "Other Shapes"
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
    }
}



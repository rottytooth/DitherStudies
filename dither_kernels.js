/*
    Coefficients for each type of error-diffusion dither
 */

DitherStudies.kernels = {
    
    "FloydSteinberg" :
        { "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 7], [3, 5, 1]]
    },
    "ZFan" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 48,
        "nums" : [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]]
    },
    "ShiauFan" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom": 8,
        "nums": [[0, 0, 0, 4], [1, 1, 2, 0]]
    },
    "ShiauFan2" :
        { "start_x" : 3,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 0, 8], [1, 1, 2, 4, 0]]
        },
    "JaJuNi" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 48,
        "nums" : [[0, 0, 0, 7, 5], [3, 5, 7, 5, 3], [1, 3, 5, 3, 1]]
    },
    "Stucki" : 
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 42,
        "nums" : [[0, 0, 0, 8, 4], [2, 4, 8, 4, 2], [1, 2, 4, 2, 1]]
        },
    "Burkes" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 2], [1, 2, 4, 2, 1]]
        },
    "Sierra" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 32,
        "nums" : [[0, 0, 0, 5, 3], [2, 4, 5, 4, 2], [0, 2, 3, 2, 0]]
    },
    "TwoRowSierra" :
        { "start_x" : 2,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 0, 4, 3], [1, 2, 3, 2, 1]]
    },
    "FilterLite" :
        { "start_x" : 1,
        "start_y" : 0,
        "denom": 4,
        "nums" : [[0, 0, 2], [1, 1, 0]]
    },
    "Atkinson" :
        { "start_x" : 1,
        "start_y" : 0,
        "denom" : 8,
        "nums" : [[0, 0, 1, 1], [1, 1, 1, 0], [0, 1, 0, 0]]
    },
    "StephensonArce":
    {
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 200,
        "nums" : [[0,0,32],[12,26,30,16],[12,26,12,0],[5,12,12,5]]
    },
    "RightTriangle_Temkin1":
    { 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums" : [[0, 0, 11], [1, 3, 1]]
    },
    "RightTriangle_BiDirectional":
    { 
        "start_x" : 1,
        "start_y" : 0,
        "denom" : 16,
        "nums_even" : [[0, 0, 11], [1, 3, 1]],
        "nums_odd" : [[0, 0, 7], [2, 5, 2]]
    }
}
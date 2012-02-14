```
                      __                 
                     |  ]                
 _ .--.  ,--.    .--.| |  ,--.   _ .--.  
[ `/'`\]`'_\ : / /'`\' | `'_\ : [ `/'`\] 
 | |    // | |,| \__/  | // | |, | |     
[___]   \'-;__/ '.__.;__]\'-;__/[___]  

```


# Raphaël radar chart

## Radar chart implemented with [Raphael.js][raphael]

Works where Raphael.js works (Firefox 3.0+, Safari 3.0+, Chrome 5.0+, Opera 9.5+ and Internet Explorer 6.0+).

Only 2.35 KB (1.01KB gzipped) -very lightweight!

## [Example](http://valve.github.com/g.raphael-radar/example)

## Basic usage

``` 
var paper = Raphael('some_div_id', 800, 800);
paper.radar(cx, cy, radius, data_array, options);
```

To see real example, have a look at test/index.html 

### Options

This chart can be customized by passing the options that will override the default values, for example

``` 
paper.radar(400, 400, 300, [4, 8, 15, 16, 23, 42],
  {    
    meshSize: 30,//the space between adjacent meshes,
    labels: ["USA", "Canada", "Sweden", "Ukraine", "Uzbekistan", "Russia"],
    labelFontSize: 20, //huge font
    drawLabels: true, //to draw labels or not
    armFill: 'none', //color of arm fill
    armStroke: 'rgba(255, 106, 0, .5)', //color of arm stroke
    armStrokeWidth: 1, //width of arm stroke
    drawArms: true, //to draw arms or not
    meshFill: 'none', //color of mesh fill
    meshStroke: 'rgba(120, 120, 120, .5)', //color of mesh stroke
    meshStrokeWidth: 1, //width of mesh stroke
    drawMesh: true, //to draw mesh or not
    max: 100, //maximum value, if not present, calculated from maximum value of data array
    pathFill: 'none', //color of data path fill
    pathStroke: '#0026ff', //color of data path stroke
    pathStrokeWidth: 3, //data path stroke width
    pathCircleOuterRadius: 4, //data path circle outer radius
    pathCircleInnerRadius: 2, // data path circle inner radius
    drawPathCircles: true //whether to draw the circles on the data path 
  });
```

### Licence

This code is [MIT][mit] licenced:

Copyright (c) 2012 Valentin Vasilyev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[raphael]: http://raphaeljs.com/
[mit]: http://www.opensource.org/licenses/mit-license.php

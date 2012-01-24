/*
 * g.raphael-radar 0.1 - Radar chart, based on Raphaël.js
 *
 * Copyright (c) 2012 Valentin Vasilyev (iamvalentin@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 (function(){ 
   function Radar(paper, cx, cy, r, values, opts){
    if(!values || values.length == 0) throw 'Values array is required';
   	opts = opts || {};
    var 
      startAngle = 270,
      angle = 360/values.length;  
    var defaultOpts = {
      meshSize: 30,
      labels: [],
      drawLabels: true,
      armFill: 'none',
      armStroke: 'rgba(255, 106, 0, .5)',
      armStrokeWidth: 1,
      drawArms: true,
      meshFill: 'none',
      meshStroke: 'rgba(120, 120, 120, .5)',
      meshStrokeWidth: 1,
      drawMesh: true,
      max: Math.max.apply(Math, values),
      pathFill: 'none',
      pathStroke: '#0026ff',
      pathStrokeWidth: 3,
      pathCircleOuterRadius: 4,
      pathCircleInnerRadius: 2,
      drawPathCircles: true   
    };
    //replacing default opts with explicitly provided
    for(var prop in opts){
      defaultOpts[prop] = opts[prop];    
    }
    opts = defaultOpts;
    delete defaultOpts;

    var arm = function(cx, cy, r, angle){
      var rad = Raphael.rad(angle);
      var x = cx + (r * Math.cos(rad));
      var y = cy + (r * Math.sin(rad));
      return ["M", cx, cy, "L", x, y, "Z"].join(",");
    }

    var meshLine = function(cx, cy, r, startAngle, angle){ 
      var mesh = ["M"];
      var circle = startAngle + 360;
      while(startAngle < circle){
        var x = cx + r * Math.cos(Raphael.rad(startAngle));
        var y = cy + r * Math.sin(Raphael.rad(startAngle));
        mesh.push(x);
        mesh.push(y);
        mesh.push("L");
        startAngle += angle;
      }
      mesh.push("Z");
      return mesh.join(",");       
    }

    var label = function(cx, cy, r, angle){
      var rad = Raphael.rad(angle);
      var x = cx + r * Math.cos(rad);
      var y = cy + r * Math.sin(rad);
      return {
        x: (Math.round(x) === cx) ? x : (x < cx ? x - 10 : x + 10),
        y: (Math.round(y) === cy) ? y : (y < cy ? y - 10 : y + 10),
        attr:{
          "text-anchor": (Math.round(x) === cx) ? "middle"  : (x < cx ?  "end" : "start"),
          "font-size": r/20
        }
      };
    }

    var path = function(cx, cy, r, angle1, angle2, value1, value2, max){
      var rad1 = Raphael.rad(angle1);
      var rad2 = Raphael.rad(angle2);
      var p1 = {
        x: cx + r/max*value1 * Math.cos(rad1), 
        y: cy + r/max*value1 * Math.sin(rad1)
      };
      var p2 = {
        x: cx + r/max*value2 * Math.cos(rad2), 
        y: cy + r/max*value2 * Math.sin(rad2)
      };
      paper.path(["M", p1.x, p1.y, "L", p2.x, p2.y, "Z"].join(",")).attr({
        "stroke": opts.pathStroke,
        "fill": opts.pathFill,
        "stroke-width": opts.pathStrokeWidth
      });     
    }

    var circle = function(cx, cy, r, angle, value, max, title){
      var rad = Raphael.rad(angle);      
      var p = {
        x: cx + r/max*value * Math.cos(rad), 
        y: cy + r/max*value * Math.sin(rad)
      };   
    
      paper.circle(p.x, p.y, opts.pathCircleOuterRadius * 2).attr({fill: opts.pathStroke, stroke: 'none', title: title+": "+ value});        
      paper.circle(p.x, p.y, opts.pathCircleInnerRadius * 2).attr({fill: "#fff", stroke: "none",title: title+": "+ value});    
    }
  
    //arms
    if(opts.drawArms){
      for(i in values){    
        paper.path(arm(cx, cy, r, startAngle + angle * i)).attr({
          fill: opts.armFill,
          stroke: opts.armStroke,
          "stroke-width": opts.armStrokeWidth
        });        
      }
    }
    //mesh
    if(opts.drawMesh){
      var meshCount = Math.floor(r/opts.meshSize);
      var meshHeight = r / meshCount;
      var meshRadius = meshHeight;
      var meshes = [];
      while(meshCount > 0){
        meshes.push(meshLine(cx, cy, meshRadius, startAngle, angle));
        meshRadius+=meshHeight;
        --meshCount;
      }
      for(i in meshes){
        paper.path(meshes[i]).attr({
          fill: opts.meshFill,
          stroke: opts.meshStroke,
          "stroke-width": opts.meshStrokeWidth 
        });
      }
    }
    //labels
    if(opts.drawLabels){
      for(i in opts.labels){
        var textObject = label(cx, cy, r, startAngle + angle * i);
        paper.text(textObject.x, textObject.y, opts.labels[i]).attr(textObject.attr);
      }
    }
    
    //path
    for(var i = 0; i < values.length-1; i++){
      path(cx, cy, r, startAngle + angle * i, startAngle + angle * (i + 1), values[i], values[i+1], opts.max);
    } 
    path(cx, cy, r, startAngle - angle, startAngle, values[values.length-1], values[0], opts.max);
    
    //circles on path
    if(opts.drawPathCircles){
      for(var i in values){
        circle(cx, cy, r, startAngle + angle *i, values[i], opts.max, opts.labels[i]);
      }
    }    
  }; 
  //inheritance
  var F = function() {};
  F.prototype = Raphael.g;
  Radar.prototype = new F;

  //public
  Raphael.fn.radar = function(cx, cy, r, values, opts) {
      return new Radar(this, cx, cy, r, values, opts);
  };  	
})();
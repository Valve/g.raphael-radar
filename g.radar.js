/*
* g.raphael-radar 0.3 - Radar chart, based on Raphaël.js
* https://github.com/Valve/g.raphael-radar
* Copyright (c) 2012 Valentin Vasilyev (iamvalentin@gmail.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
(function () {
    function Radar(paper, cx, cy, r, values, opts) {
        var $r = Raphael; //for minification;
        if (!values || values.length == 0) throw 'Values array is required';
        opts = opts || {};
        var startAngle = 270,
      angle = 360 / values.length;
        var defaultOpts = {
            meshSize: 30,
            labels: [],
            labelFontSize: 14,
            valueFontSize: 14,
            drawLabels: true,
            drawValues: true,
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
            drawPathCircles: true,
            closePath: true
        };
        //replacing default opts with explicitly provided
        for (var prop in opts) {
            defaultOpts[prop] = opts[prop];
        }
        opts = defaultOpts;
        delete defaultOpts;

        var arm = function (cx, cy, r, angle) {
            var rad = $r.rad(angle);
            var x = cx + (r * Math.cos(rad));
            var y = cy + (r * Math.sin(rad));
            return ["M", cx, cy, "L", x, y, "Z"].join(",");
        }

        var meshLine = function (cx, cy, r, startAngle, angle) {
            var mesh = ["M"];
            var circle = startAngle + 360;
            while (startAngle < circle) {
                var x = cx + r * Math.cos($r.rad(startAngle));
                var y = cy + r * Math.sin($r.rad(startAngle));
                mesh.push(x);
                mesh.push(y);
                mesh.push("L");
                startAngle += angle;
            }
            mesh.push("Z");
            return mesh.join(",");
        }

        var label = function (cx, cy, r, angle) {
            var rad = $r.rad(angle);
            var x = cx + r * Math.cos(rad);
            var y = cy + r * Math.sin(rad);
            return {
                x: (Math.round(x) === cx) ? x : (x < cx ? x - 10 : x + 10),
                y: (Math.round(y) === cy) ? y : (y < cy ? y - 10 : y + 10),
                attr: {
                    "text-anchor": (Math.round(x) === cx) ? "middle" : (x < cx ? "end" : "start"),
                    "font-size": opts.labelFontSize
                }
            };
        }

        var labelvalue = function (cx, cy, r, angle, value, max) {
            var rad = $r.rad(angle);
            var x = cx + r / max * value * Math.cos(rad);
            var y = cy + r / max * value * Math.sin(rad);
            if (Math.round(x) === cx) {
                y += 10 * Math.sin(rad);
            }

            return {
                x: (Math.round(x) === cx) ? x+2 : (x < cx ? x - 10 : x + 10),
                y: (Math.round(y) === cy) ? y-2 : (y < cy ? y - 10 : y + 10),
                attr: {
                    "text-anchor": (Math.round(x) === cx) ? "middle" : (x < cx ? "end" : "start"),
                    "font-size": opts.valueFontSize
                }
            };
        }

        var path = function (cx, cy, r, startAngle, values, max) {
            var pathData = [];
            var i = 0, l = values.length;
            while (i < l) {
                var rad = $r.rad(startAngle + 360 / values.length * i);
                pathData.push(i == 0 ? "M" : "L");
                pathData.push(cx + r / max * values[i] * Math.cos(rad));
                pathData.push(cy + r / max * values[i] * Math.sin(rad));
                ++i;
            }
            
            if (opts.closePath) {
                pathData.push("Z");
            }

            paper.path(pathData.join(",")).attr({
                "stroke": opts.pathStroke,
                "fill": opts.pathFill,
                "stroke-width": opts.pathStrokeWidth,
                "stroke-linejoin": 'round'
            });
        }

        var circle = function (cx, cy, r, angle, value, max, title) {
            var rad = $r.rad(angle);
            var p = {
                x: cx + r / max * value * Math.cos(rad),
                y: cy + r / max * value * Math.sin(rad)
            };

            paper.circle(p.x, p.y, opts.pathCircleOuterRadius * 2).attr({ fill: opts.pathStroke, stroke: 'none', title: title + ": " + value });
            paper.circle(p.x, p.y, opts.pathCircleInnerRadius * 2).attr({ fill: "#fff", stroke: "none", title: title + ": " + value });
        }

        //arms
        if (opts.drawArms) {
            var i = 0, l = values.length;
            while (i < l) {
                paper.path(arm(cx, cy, r, startAngle + angle * i)).attr({
                    fill: opts.armFill,
                    stroke: opts.armStroke,
                    "stroke-width": opts.armStrokeWidth
                });
                ++i;
            }
        }
        //mesh
        if (opts.drawMesh) {
            var meshCount = Math.floor(r / opts.meshSize);
            var meshHeight = r / meshCount;
            var meshRadius = meshHeight;
            var meshes = [];
            while (meshCount--) {
                meshes.push(meshLine(cx, cy, meshRadius, startAngle, angle));
                meshRadius += meshHeight;
            }
            var i = 0, l = meshes.length;
            while (i < l) {
                paper.path(meshes[i]).attr({
                    fill: opts.meshFill,
                    stroke: opts.meshStroke,
                    "stroke-width": opts.meshStrokeWidth
                });
                ++i;
            }
        }
        // values
        if (opts.drawValues) {
            var i = values.length;
            while (i--) {                
                var textObject = labelvalue(cx, cy, r, startAngle + angle * i, values[i], opts.max);
                var fulltext = values[i];
                var text = paper.text(textObject.x, textObject.y, fulltext).attr(textObject.attr);           

            }
        }
        //labels
        if (opts.drawLabels) {
            var i = opts.labels.length;
            while (i--) {
                var textObject = label(cx, cy, r, startAngle + angle * i);

                var fulltext = opts.labels[i]; 
                var text = paper.text(textObject.x, textObject.y, fulltext).attr(textObject.attr);
                fulltext = fulltext.replace("-", "- ").replace("/", "/ ");

                var words = fulltext.split(" ");
                var wordsCount = words.length;

                var maxwidth = Math.min(textObject.x, paper.width - textObject.x);
                var maxheight = Math.min(textObject.y, paper.height - textObject.y);

                
                var fontSizeMin = 8;
                for (var fontSize = opts.labelFontSize; fontSize >= fontSizeMin; --fontSize) {
                    text.attr("font-size", fontSize);
                    var tempText = "";
                    for (var i1 = 0; i1 < wordsCount; ++i1) {
                        text.attr("text", tempText + " " + words[i1]);
                        if (text.getBBox().width > maxwidth) {
                            tempText += "\n" + words[i1];
                        } else {
                            tempText += " " + words[i1];
                        }
                    }
                    text.attr("text", tempText);
                    if (text.getBBox().width > maxwidth) {
                        tempText = tempText.replace("-", "-\n");
                        text.attr("text", tempText);
                    }
                    if (fontSize == fontSizeMin ||
                     (text.getBBox().height <= maxheight &&
                     (text.getBBox().width <= maxwidth || wordsCount > 1))) {
                        var titleCountLines = tempText.split("\n").length;
                        text.attr("text", tempText.substring(1));
                        break;
                    }
                }
            }
        }


        path(cx, cy, r, startAngle, values, opts.max);

        //circles on path
        if (opts.drawPathCircles) {
            var i = values.length;
            while (i--) {
                circle(cx, cy, r, startAngle + angle * i, values[i], opts.max, opts.labels[i]);

            }
        }
    };
    //inheritance
    var F = function () { };
    F.prototype = Raphael.g;
    Radar.prototype = new F();

    //public
    Raphael.fn.radar = function (cx, cy, r, values, opts) {
        return new Radar(this, cx, cy, r, values, opts);
    };
})();
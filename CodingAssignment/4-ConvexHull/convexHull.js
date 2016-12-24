		function drawPoint(context,x,y,r,color){
			context.beginPath();
			context.arc(x, y, r, 0, 2 * Math.PI, false);
			context.fillStyle = color;
			context.fill();
			context.lineWidth = 0;
			context.stroke();
		}

		function drawBoundary(context,width,height,color){
			context.beginPath();
			context.moveTo(0,0);
			context.lineTo(width,0);
			context.lineTo(width,height);
			context.lineTo(0,height);
			context.lineTo(0,0);
			context.stroke();
		}
		function drawLine(context,pt1, pt2, color){
			context.beginPath();
			context.moveTo(pt1.x,pt1.y);
			context.lineTo(pt2.x,pt2.y);
			context.strokeStyle = color;
			context.stroke();
		}

		function randomPoints(points, N, size, padding){
			for(var i=0; i<N; i++){
	     		points.push({
	     			x:Math.floor((Math.random() * (size-2*padding)) + 1 + padding),
	     			y:Math.floor((Math.random() * (size-2*padding)) + 1 + padding)
	     		})
	     	}
		}

		function drawAllPoints(context, points, radius, pointColor){
			for(var i=0; i<points.length; i++){
	     		drawPoint(context,points[i].x,points[i].y,radius,pointColor);
	     	}
		}

		function drawConvex(context,points,convexHullIndex,radius,pointColor){
			var N = convexHullIndex.length;
			for(var i=0; i<N; i++){
	     		drawPoint(context,points[convexHullIndex[i]].x,points[convexHullIndex[i]].y,radius,pointColor);
	     		drawLine(context,points[convexHullIndex[i]], points[convexHullIndex[(i+1)%N]], pointColor);
	     	}
		}
		function drawRemoved(context, points, position,radius, color){
			drawPoint(context,points[position].x,points[position].y,radius,color);
		}


		function ccw(a,b,c){
			var area = (b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x);
			if(area < 0)return -1; //clockwise
			else if(area >0)return 1; //conterclockwise
			else return 0; //collinear
		}

		function convexHull(points, context, radius){
			var startPoint = points[0];
			var angles = [];
			var index = [];
			// find the largest y point
			for(var i=0; i<points.length; i++){
				if(points[i].y > startPoint.y)startPoint = points[i];
			}

			// calculate angles
			for(var i=0; i<points.length; i++){
				var angle = Math.atan2(points[i].y - startPoint.y, points[i].x - startPoint.x);
				angles.push(angle);
				index.push(i);
			}
			// sort points according to angles.   well.. I just use the simplest selection sort
			if(angles.length !== points.length){
				console.log('angles length is not same as points length');
				return;
			}
			for(var i=0; i<angles.length; i++){
				var min=i;
				for(var j=i+1; j<points.length; j++){
					if(angles[index[j]]>angles[index[min]]){
						min = j;
					}
				}
				if(min!=i){
					var temp = index[min];
					index[min] = index[i];
					index[i] = temp;
				}
			}

			// draw sorted points with numbers
			context.font = "13px Arial";
			for(var i=0; i<points.length; i++){
				context.fillText(i+`:(${points[index[i]].x},${points[index[i]].y})`,points[index[i]].x+5,points[index[i]].y-5);
			}

			// loop sorted points by conterclockwise, if angle is clockwise then drop it
			var p = 1;	
			while(p<index.length){
				var ccwResult = ccw(points[index[p-1]], points[index[p]], points[index[(p+1) % index.length]])
				console.log(`${p-1} -- ${p} -- ${(p+1) %index.length} : ccw = ${ccwResult}`);
				if( ccwResult=== -1){
					// counter clockwise
					p++;
				}else if(ccwResult===0){ // in one line
					console.log('in one line');
					if(Math.abs(points[index[(p+1) % index.length]].x - points[index[p-1]].x) < Math.abs(points[index[p]].x -points[index[p-1]].x) ||
						Math.abs(points[index[(p+1) % index.length]].y - points[index[p-1]].y) < Math.abs(points[index[p]].y -points[index[p-1]].y)){
						// corner case: 0 2 1 in one line , should remove 2 instead 1
						//console.log('corner case 0 2 1 in one line');
						console.log(`remove (${points[index[p+1]].x},${points[index[p+1]].y})`);
						drawRemoved(context, points, index[p+1], radius, '#eee');
						index.splice(p+1,1);
					}else{
						console.log(`remove (${points[index[p]].x},${points[index[p]].y})`);
						drawRemoved(context, points, index[p], radius, '#eee');
						index.splice(p,1);
						if(p>1)p--;  //corner case, if p=1, p--, p=0, then angle will be -1, 0, 1
					}
				}else{
					console.log(`remove (${points[index[p]].x},${points[index[p]].y})`);
					drawRemoved(context, points, index[p], radius, '#eee');
					index.splice(p,1);
					if(p>1)p--;  //corner case, if p=1, p--, p=0, then angle will be -1, 0, 1
				}

				// console all index
				for(var j = 0; j<index.length; j++){
					console.log(`size: ${index.length}, index[${j}] = ${index[j]}`);
				}
			}
			return index;
		}
		// initialization
		var canvas = document.getElementById('convex-hull');
     	var context = canvas.getContext('2d');
     	var radius = 5;
     	var pointColor = 'black';
     	var hullColor = 'red';
     	var N = 100;
     	var points =[];
     	var size = 800;
     	var padding = 100;

     	// draw boundary
     	drawBoundary(context, size, size, 'black');

     	// generate random points
     	randomPoints(points, N, size, padding);

     	// manually set points
     		// corner case : 0,2,1 in one line
     		// points = [{"x":292,"y":304},{"x":512,"y":162},{"x":313,"y":54},{"x":512,"y":524},{"x":266,"y":422},{"x":268,"y":444},{"x":290,"y":173},{"x":61,"y":61},{"x":441,"y":494},{"x":361,"y":153},{"x":512,"y":186},{"x":189,"y":132},{"x":343,"y":63},{"x":78,"y":462},{"x":334,"y":182}]

     	//draw all points
     	drawAllPoints(context, points, radius, pointColor);

     	// find convex hull
     	var convexHullIndex = convexHull(points, context, radius);

     	// draw convex hull points 
     	drawConvex(context,points,convexHullIndex,radius,hullColor);

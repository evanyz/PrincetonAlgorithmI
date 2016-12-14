
function drawBlock(object,x,y,size,color){
	object.beginPath();
	object.rect(x, y, size, size);
	object.fillStyle = color;
	object.fill();
}

function drawBorder(object,x,y,width,height,color){
	object.beginPath();
	object.lineWidth="1";
	object.strokeStyle="#888";
	object.rect(x, y, width, height);
	object.stroke();
}

function initiate(object, width, height){
	object.setAttribute("width",width);
	object.setAttribute("height",height);
	drawBorder(object.getContext("2d"),0,0,width,height,"#333");
}

function QUUnion(parent,weight,i,j){	// default is let i's parent be j
	var iRoot=root(parent,i);
	var jRoot=root(parent,j);
	if(iRoot == jRoot) return; // same root
	if(weight[iRoot]>weight[jRoot]){
		parent[jRoot]=iRoot;
		weight[iRoot]+=weight[jRoot];
	}
	else{
		parent[iRoot]=jRoot;
		weight[jRoot]+=weight[iRoot];
	}
}

function root(parent,i){
	while(i!=parent[i]){
		i=parent[i];
	}
	return i;
}
function QUFind(parent,weight,i,j){
	var iOrigin = root(parent,i);
	var jOrigin = root(parent,j);
	if(iOrigin===jOrigin)return true;
	else return false;
}


function openRandBlock(connected, parent, weight, n, ctx , nwidth, borderWidth, sizeUnit) {
    setInterval(function () {
    	console.log('setTimeout called');
        if (connected === false) {
        	var rand = Math.floor((Math.random() * n) + 1);
			console.log('rand = ' +rand);
			if(open[rand]===true)return;
			open[rand] = true;
			//up
			if(rand-nwidth>0)QUUnion(parent,weight,rand-nwidth,rand);
			//down
			if(rand+nwidth<n)QUUnion(parent,weight,rand+nwidth,rand);
			// left side case
			if(rand%nwidth==1){
				//right
				QUUnion(parent,weight,rand+nwidth,rand);
			}
			// right side case
			else if(rand%nwidth==0){
				//left
				QUUnion(parent,weight,rand+nwidth,rand);
			}
			// middle side case
			else{
				//right
				QUUnion(parent,weight,rand+nwidth,rand);
				//left
				QUUnion(parent,weight,rand+nwidth,rand);
			}
			if(QUFind(parent,weight,0,rand)===true){
				drawBlock(ctx,Math.floor(rand/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,rand%nwidth*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"blue");}
			else{
				drawBlock(ctx,Math.floor(rand/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,rand%nwidth*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"#FFF");
			}
			if(QUFind(parent,weight,0,n+1)===true){connected = true;}
			return connected;
        }
    }, 500);
}

function main(){
	var sizeUnit = 8;
	var borderWidth = 1;
	var sizeAll = 200;
	var nwidth = sizeAll / (sizeUnit+2*borderWidth);
	var n = Math.floor(nwidth * nwidth);
	//console.log(n);
	var c = document.getElementById("percolation");
	var ctx = c.getContext("2d");
	initiate(c,sizeAll,sizeAll);
	drawBlock(ctx, borderWidth, borderWidth, sizeAll-borderWidth*2, "#000");

	// INITIALIZATION contruct the weighted quick union
	var parent = [];
	var weight = [];
	var open = [];
	for(var i = 0; i<n+2; i++){	//n+2 elements, 0,and n+1 are the top and bottom
		parent[i]=i;  // 0 is blocked
		weight[i]=1;	//default weight is 1
		open[i]=false;  //false is closed
	}
	for(var i = 0; i < nwidth; i++){ //first row connect to 0
		QUUnion(parent,weight,i+1,0);
		// if(QUFind(parent,weight,0,i+1)===true){
		// 	drawBlock(ctx,(i)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((i)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"blue");}
		// else{
		// 	drawBlock(ctx,(i)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((i)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"#FFF");
		// }
	}
	for(var i = 0; i < nwidth; i++){ //last row connect to n+1
		QUUnion(parent,weight,n-i,n+1);
	}

	//  randomly open some block
	var maxN = n;
	var connected = false;
	while(maxN-- && connected===false){
		connected = openRandBlock(connected, parent, weight, n, ctx, nwidth, borderWidth,sizeUnit);
	}

}

main();


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
	console.log('connect '+ i + ' and '+ j);
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

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function openRandBlock(connected, parent, weight, n, ctx , nwidth, borderWidth, sizeUnit, open, pseudoRandom) {
    setInterval(function () {
    	console.log('setTimeout called');
        if (connected === false) {
        	//var rand = Math.floor((Math.random() * n) + 1);
        	if (window.increCount === undefined) {
			    window.increCount = 1;
			}else{
				window.increCount++;
			}
			rand = pseudoRandom[window.increCount];
			console.log(`increCount = ${window.increCount}`)
        	//========= test code ========
			// var testarray=[6,9,12,17,22,23,24,25,28,29,31,50,51];
			
			// if(rand==31){c
			// 	console.log('break point rand = 31');
			// }
			// if(window.increCount < testarray.length){rand=testarray[increCount];}
			//rand = window.increCount;

			// =========== test code

			console.log('rand = ' +rand);
			if(open[rand]===true)return;
			open[rand] = true;
			//up
			if(rand-nwidth>0 && open[rand-nwidth]){
				QUUnion(parent,weight,rand-nwidth,rand);
			}
			//down
			if(rand+nwidth<n && open[rand+nwidth])QUUnion(parent,weight,rand+nwidth,rand);
			// left side case
			if(rand%nwidth==1){
				//right
				if(open[rand+1]==true)QUUnion(parent,weight,rand+1,rand);
			}
			// right side case
			else if(rand%nwidth==0){
				//left
				if(open[rand-1]==true)QUUnion(parent,weight,rand-1,rand);
			}
			// middle side case
			else{
				//right
				if(open[rand+1]==true)QUUnion(parent,weight,rand+1,rand);
				//left
				if(open[rand-1]==true)QUUnion(parent,weight,rand-1,rand);
			}
			// draw this block
			if(QUFind(parent,weight,0,rand)===true){
				drawBlock(ctx,(rand-1)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((rand-1)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"blue");}
			else{
				drawBlock(ctx,(rand-1)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((rand-1)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"#FFF");
			}


			// redraw all blocks into blue if root is 0
			for(var index=1;index<n;index++){
				if( root(parent, index)==0 && open[index]===true){
					drawBlock(ctx,(index-1)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((index-1)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"blue");
				}
			}

			// draw connectivity
			for(var index=1;index<n;index++){
				if(QUFind(parent,weight,0,index)===true && open[index]===true){
					drawBlock(ctx,(index-1)%nwidth*(borderWidth*2+sizeUnit)+borderWidth,Math.floor((index-1)/nwidth)*(borderWidth*2+sizeUnit)+borderWidth,sizeUnit,"blue");
				}
			}



			if(QUFind(parent,weight,0,n+1)){
				connected = true;
			}
			return connected;
        }
    }, 20);
}

function main(){

	var live = true;
	var test = false;
	if(live == true){
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

		// generate pseudo random array
		var pseudoRandom =[];
		console.log('random array size: '+n);
		for (var i = 1; i <= n; i++) {
		   pseudoRandom.push(i);
		}
		shuffle(pseudoRandom);
		//  randomly open some block
		var maxN = n;
		var connected = false;
		while(maxN-- && connected===false){
			connected = openRandBlock(connected, parent, weight, n, ctx, nwidth, borderWidth,sizeUnit, open, pseudoRandom);
		}
	}


	if(test == true){
		var n=10;
		var parent = [];
		var weight = [];
		for(var i = 0; i<n; i++){	//n+2 elements, 0,and n+1 are the top and bottom
			parent[i]=i;  // 0 is blocked
			weight[i]=1;	//default weight is 1
		}

		QUUnion(parent,weight,0,4);
		QUUnion(parent,weight,0,3);
		console.log(QUFind(parent,weight,4,3));
		console.log(QUFind(parent,weight,4,7));
		QUUnion(parent,weight,2,9);
		QUUnion(parent,weight,2,8);
		console.log(QUFind(parent,weight,8,9));

	}

}

main();

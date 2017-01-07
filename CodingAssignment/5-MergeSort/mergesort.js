function isSorted(a,increase,lo,hi){	 //increase should be true or false
	for(var i=lo; i<hi-1; i++){
		if(a[i]<a[i+1]!==increase)return false;
	}
	return true;
}
function mergeSortMerge(a, aux, lo, mid, hi){
	var increase = true;
	var increaseStr = increase==true?'increase':'decrease';
	if(!isSorted(a,increase,lo,mid)){
		console.log(`a[${lo}] to a[${mid}] do not ${increaseStr}`);
		return false;
	}
	if(!isSorted(a,increase,mid+1,hi)){
		console.log(`a[${mid+1}] to a[${hi}] do not ${increaseStr}`);
		return false;
	}
	// copy
	for(var i =lo;i<=hi;i++){
		aux[i]=a[i];
	}
	// merge
	var i = lo;
	var j = mid+1;
	for(var k=lo;k<=hi;k++){
		if(i>mid) a[k]=aux[j++];
		else if(j>hi) a[k]=aux[i++];
		else if(aux[i]<=aux[j]) a[k]=aux[i++];
		else a[k]=aux[j++];
	}
	// console output
	console.log(`lo = ${lo}, hi = ${hi}:`);
	for(var i=lo; i<=hi; i++){
		console.log(a[i]);
	}
	console.log(`========`);
}
function mergeSort(a, aux, lo, hi){
	if(lo>=hi) return;
	var mid = Math.floor((lo + hi)/2);
	mergeSort(a, aux, lo, mid);
	mergeSort(a, aux, mid+1, hi);
	mergeSortMerge(a, aux, lo, mid, hi);
}
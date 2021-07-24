var debounceFirstFunction={}
/**
 *  只执行最开始一次
 * @param {Object} fn
 * @param {Object} wait 
 */
function debounceFirst(tag,fn,wait){
	if(!wait){
		wait = 100;
	}
	let exe = debounceFirstFunction[tag];
	if(!exe){
		debounceFirstFunction[tag] = fn;
		setTimeout(()=>{
			console.log(debounceFirstFunction[tag]);
			debounceFirstFunction[tag]();
			debounceFirstFunction[tag] = undefined;
		},wait);
	}
}
exports.debounceFirst = debounceFirst;
/* debounceFirst("a",()=>{console.log(1111)});
debounceFirst("a",()=>{console.log(2222)});
debounceFirst("a",()=>{console.log(2222)});
debounceFirst("a",()=>{console.log(2222)});
setTimeout(()=>{
	 debounce("a",()=>{console.log(444)});
},1000); */


var debounceFunction={}
/**
 *  只执行最后一次
 * @param {Object} fn
 * @param {Object} wait 
 */
function debounce(tag,fn,wait){
	if(!wait){
		wait = 100;
	}
	let exe = debounceFunction[tag];
	if(exe){
		delete debounceFunction[tag];
		clearTimeout(exe);
	}
	exe = setTimeout(fn,wait);
	debounceFunction[tag] = exe;
}
exports.debounce = debounce;
/* debounce("a",()=>{console.log(1111)});
debounce("a",()=>{console.log(1111)});
debounce("a",()=>{console.log(1111)});
debounce("a",()=>{console.log(2222)});
setTimeout(()=>{
	 debounce("a",()=>{console.log(3333)});
},1000); */



var throttleFunction={}
/**
 *  一定时间内只执行最后一次
 * @param {Object} fn
 * @param {Object} wait 
 */
function throttle(tag,fn,wait){
	if(!wait){
		wait = 100;
	}
	if(!throttleFunction[tag]){
		setTimeout(()=>{
			throttleFunction[tag]();
			throttleFunction[tag] = undefined;
		},wait)
	}
	throttleFunction[tag] = fn;
}
exports.throttle = throttle;
/* throttle("a",()=>{console.log(1111)});
throttle("a",()=>{console.log(2222)});

setTimeout(()=>{
	 throttle("a",()=>{console.log(3333)});
	 throttle("a",()=>{console.log(1111)});
	 throttle("a",()=>{console.log(2222)});
	 throttle("a",()=>{console.log(3333)});
},1000); */
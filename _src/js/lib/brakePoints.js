import throttle from 'lodash.throttle';

const bpList = {
	'(min-width: 1441px)': 'desktop-wide',
	'(max-width: 1440px)': 'desktop',
	'(max-width: 1195px)': 'tablet',
	'(max-width: 980px)': 'phone-big',
	'(max-width: 767px)': 'phone',
};
let current = '';

const bp = {
	previous:'',
	current: '',
};

function onResize() {
	
	for (let item in bpList) {
		if (window.matchMedia(item).matches) {
			current = bpList[item];
		}
	}
	
	if (bp.current !== current) {
		
		bp.previous = bp.current;
		bp.current = current;
		
		let event = new CustomEvent('bp-' + current);
		window.dispatchEvent(event);
		event = new CustomEvent('bpChanged');
		window.dispatchEvent(event);
		// console.log(bp);
	}
}

window.addEventListener('resize', throttle(onResize,100));
onResize();

//module.exports =  bp;
export default bp;

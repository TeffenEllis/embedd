/*global describe, it*/

import {expect} from 'chai';
import {decode, parseDate, embeddConstructor} from '../src/embedd';
import {redditConstructor} from '../src/reddit';
import {hnConstructor} from '../src/hn';

const spec = {
	url: 'https://www.eff.org/deeplinks/2015/10/closing-loopholes-europes-net-neutrality-compromise',
	limit: 5
};

const embeddSpec = {
	submitUrl: 'test',
	dataFmt: function(){},
	commentFmt: function(){},
	threadFmt: function(){}
};

function extend(o1, o2) {
	let result={};
	
	for(let key in o1) result[key]=o1[key];
	for(let key in o2) result[key]=o2[key];
	
	return result;
}

function isBoolean(x) {
	return typeof x === 'boolean';
}

function verifyComments(obj) {
	return !!(obj.comments && obj.score && obj.threads);
}

describe('decode', () => {

	function escapeHtml(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
		
    return div.innerHTML;
	}
	
	it('should return valid html', () => {
		let str = '<h1>hello</h1>';
		let encoded = escapeHtml(str);
		let html = decode(escapeHtml(str));
		
		expect(html).to.equal(str);
	});

	it('should return false if passed an empty string', () => {
		let html = decode('');
		expect(html).to.equal(false);
	});

	it('should return false if passed a falsey value', () => {
		let html = decode(false);
		expect(html).to.equal(false);
	});
	
});

describe('parseDate', function() {

	it('should return false if no value is passed', () => {
		let d = parseDate();
		expect(d).to.equal(false);
	});

	it('should return false if time passed is in the future', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now + 50);
		
		expect(d).to.equal(false);
	});
	
	it('should return "a few seconds ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now);
		
		expect(d).to.equal('a few seconds ago');
	});

	it('should return "1 minute ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 60);
		
		expect(d).to.equal('1 minute ago');
	});

	it('should return "2 minutes ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 120);
		
		expect(d).to.equal('2 minutes ago');
	});

	it('should return "1 hour ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 3600);
		
		expect(d).to.equal('1 hour ago');
	});

	it('should return "2 hours ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 7200);
		
		expect(d).to.equal('2 hours ago');
	});

	it('should return "1 day ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 86400);
		
		expect(d).to.equal('1 day ago');
	});

	it('should return "2 days ago"', () => {
		let now = new Date().getTime() / 1000,
				d = parseDate(now - 172800);
		
		expect(d).to.equal('2 days ago');
	});
	
});

describe('embeddConstructor', () => {

	it('should throw an error if no spec object is passed', () => {
		function embeddTest() {
			return embeddConstructor();
		}
		
		expect(embeddTest).to.throw('No spec object has been specified');
	});

	it('should throw an error if the spec object doesnt have a dataFmt method', () => {
		function embeddTest() {
			let testSpec = extend({}, embeddSpec);
			delete testSpec.dataFmt;
			
			return embeddConstructor(testSpec);
		}

		expect(embeddTest).to.throw('dataFmt method isnt defined');
	});

	it('should throw an error if the spec object doesnt have a submitUrl property', () => {
		function embeddTest() {
			let testSpec = extend({}, embeddSpec);
			delete testSpec.submitUrl;
			
			return embeddConstructor(testSpec);
		}

		expect(embeddTest).to.throw('submitUrl isnt defined');
	});
	
	it('should throw an error if the spec object doesnt have a commentFmt method', () => {
		function embeddTest() {
			let testSpec = extend({}, embeddSpec);
			delete testSpec.commentFmt;
			
			return embeddConstructor(testSpec);
		};
		
		expect(embeddTest).to.throw('commentFmt method isnt defined');
	});

	it('should throw an error if the spec object doesnt have a threadFmt method', () => {
		function embeddTest() {
			let testSpec = extend({}, embeddSpec);
			delete testSpec.threadFmt;
			
			return embeddConstructor(testSpec);
		};

		expect(embeddTest).to.throw('threadFmt method isnt defined');
	});
	
});

describe('redditConstructor', () => {

	let reddit = redditConstructor(spec);

	it('should throw an error if no url has been specified', () => {
		function redditTest() {
			return redditConstructor();
		}

		expect(redditTest).to.throw('The Reddit constructor requires a spec object');
	});

	it('should have a hasComments method that accepts a callback', () => {
		reddit.hasComments((err, data) => {
			expect(isBoolean(data)).to.equal(true);
		});
	});

	it('should have a getComments method that returns a valid data object', () => {
		reddit.getComments((err, data) => {
			expect(verifyComments(data)).to.equal(true);
		});
	});

});

describe('hnConstructor', () => {

	let hn = hnConstructor(spec);

	it('should throw an error if no url has been specified', () => {
		function hnTest() {
			return hnConstructor();
		}

		expect(hnTest).to.throw('The HN constructor requires a spec object');
	});

	it('should have a hasComments method that accepts a callback', () => {
		hn.hasComments((err, data) => {
			expect(isBoolean(data)).to.equal(true);
		});
	});

	it('should have a getComments method that returns a valid data object', () => {
		hn.getComments((err, data) => {
			expect(verifyComments(data)).to.equal(true);
		});
	});

});

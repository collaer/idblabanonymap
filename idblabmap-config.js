var YEAR = '2020';
var SMALLYEAR = '20';
var YEARO = '2019';
var SMALLYEARO = '19';

var OPERATIONS_GEOJSON = (window.location.href.indexOf("file:")==-1 || true ?
"https://raw.githubusercontent.com/collaer/idblabanonymap/master/DATA/operations-anonymized-2019.geojson"
:
"https://raw.githubusercontent.com/collaer/idblabanonymap/master/DATA/operations-anonymized-2019.geojson"
//"./DATA/operations-anonymized-2019.geojson"
);

var COUTRIES_GEOJSON = (window.location.href.indexOf("file:")==-1 || true ?
"https://raw.githubusercontent.com/collaer/idblabmap/master/DATA/countries2.geojson"
//"./DATA/countries2.geojson"
:
//"./DATA/countries2.geojson"
"https://raw.githubusercontent.com/collaer/idblabmap/master/DATA/countries2.geojson");

config = function() {
	//console.log('fix YEAR');
	
	//Get all text nodes in a given container
	//https://stackoverflow.com/questions/25109275/jquery-replace-all-occurrences-of-a-string-in-an-html-page
	//Source: http://stackoverflow.com/a/4399718/560114
	function getTextNodesIn(node, includeWhitespaceNodes) {
		var textNodes = [], nonWhitespaceMatcher = /\S/;

		function getTextNodes(node) {
			if (node.nodeType == 3) {
				if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
					textNodes.push(node);
				}
			} else {
				for (var i = 0, len = node.childNodes.length; i < len; ++i) {
					getTextNodes(node.childNodes[i]);
				}
			}
		}

		getTextNodes(node);
		return textNodes;
	}

	var textNodes = getTextNodesIn( $('body')[0], false );
	var i = textNodes.length;
	var node;
	while (i--) {
		node = textNodes[i];
		node.textContent = node.textContent.replace(/{YEAR}/g, YEAR);
		node.textContent = node.textContent.replace(/{YEARO}/g, YEARO);
		node.textContent = node.textContent.replace(/{SMALLYEAR}/g, SMALLYEAR);
		node.textContent = node.textContent.replace(/{SMALLYEARO}/g, SMALLYEARO);
	}
	
	$('[data-toggle="tooltip"]').each(function () {
		this.title = this.title.replace(/{YEAR}/g, YEAR);
		this.title = this.title.replace(/{YEARO}/g, YEARO);
		this.title = this.title.replace(/{SMALLYEAR}/g, SMALLYEAR);
		this.title = this.title.replace(/{SMALLYEARO}/g, SMALLYEARO);
	});

	//console.log('fixed');
};






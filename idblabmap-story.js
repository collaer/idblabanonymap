var operations;
var OPERATIONS_GEOJSON = (window.location.href.indexOf("file:")==-1 || true ?
"https://raw.githubusercontent.com/collaer/idblabanonymap/master/DATA/operations-anonymized-2019.geojson"
:
"./DATA/bidlab2019October.geojson");

function countryFilter(feature, layer) {
  if (feature.properties.ISO_A3 === ISO_A3_FILTER) return true;
};

var Filters;
var countryOperations;
var countryToUpdate;

var operationsSummary;

getEmptyOperationSummary = function() {
	var resume={
		U:0,
		A:0,
		C:0,
		D:0,
		AF:0,
		SI:0,
		EF:0,
		EL:0,
		DI:0,
		FD:0,
		CA:0,
		CO:0,
		CF:0
	};

	var operationsSummaryTemplate= {
		year:2019,
		country:'',
		TOTAL:0,
		WAS_CLOSED:0,
		WAS_OPEN:0,
		0 : {},
		12 : {},
		d : {},
		dp : {},
		dn : {},
		addOneOperation(operation){
			
			this["0"][operation.ST0] ++;
			this["12"][operation.ST12] ++;
			
			me=this;
			
			["A", "C", "U", "D"].forEach(function(val, idx) {
				
				me["0"][val] += getFloat(operation[val+"0"]);
				me["12"][val] += getFloat(operation[val+"12"]);
				
				var difference = getFloat(operation[val+"12"]) - getFloat(operation[val+"0"]);
				//console.log(getFloat('for this op, with ' + val + ': ' + operation[val+"12"]) + ' - ' + getFloat(operation[val+"0"]) + ' = ' + difference);
				
				me.d[val] += difference;
				
				if (difference > 0)
					me.dp[val] += difference;
				else
					me.dn[val] -= difference;
				
				//console.log(me.TOTAL + ' ops : Now for ' + val + ' : ' + me["0"][val] + 'as tot0, ' + me["12"][val] + ' as tot12,' + me["d"][val] + ' as diff global');
			});
			
		}
	};
	
	var newOperationsSummary ={};
	
	Object.assign(newOperationsSummary, operationsSummaryTemplate);
	Object.assign(newOperationsSummary["0"], resume);
	Object.assign(newOperationsSummary["12"], resume);
	Object.assign(newOperationsSummary["d"], resume);
	Object.assign(newOperationsSummary["dp"], resume);
	Object.assign(newOperationsSummary["dn"], resume);
	
	return newOperationsSummary;
};

var refreshOperationSummary=function(jsonOperations, Country) {
	operationsSummary = getEmptyOperationSummary();
	
	operationsSummary.year = '2019';
	operationsSummary.country = Country;
	
	jsonOperations.forEach(
		function(operation, index) {
			operationsSummary.TOTAL++;
			
			if (operation.WAS_CLOSED == 1 || operation.WAS_CLOSED == 'CO' || operation.WAS_CLOSED == 'CF' || operation.WAS_CLOSED == 'CA')
				operationsSummary.WAS_CLOSED++;
			
			if (operation.WAS_OPEN == 1)
				operationsSummary.WAS_OPEN++;
			
			operationsSummary.addOneOperation(operation);
			
	});
};

getReplacedTemplate = function(templateHTML, operationsSummary) {
	return templateHTML.replace(/{{OP_SUMMARY.year}}/g, operationsSummary["year"])
					  .replace(/{{OP_SUMMARY.country}}/g, operationsSummary["country"])
					  .replace(/{{OP_SUMMARY.TOTAL}}/g, operationsSummary["TOTAL"])
					  .replace(/{{OP_SUMMARY.WAS_CLOSED}}/g, operationsSummary["WAS_CLOSED"])
					  .replace(/{{OP_SUMMARY.0.AF}}/g, operationsSummary["0"]["AF"])
					  .replace(/{{OP_SUMMARY.0.SI}}/g, operationsSummary["0"]["SI"])
					  .replace(/{{OP_SUMMARY.0.EF}}/g, operationsSummary["0"]["EF"])
					  .replace(/{{OP_SUMMARY.0.EL}}/g, operationsSummary["0"]["EL"])
					  .replace(/{{OP_SUMMARY.0.DI}}/g, operationsSummary["0"]["DI"])
					  .replace(/{{OP_SUMMARY.0.FD}}/g, operationsSummary["0"]["FD"])
					  .replace(/{{OP_SUMMARY.12.AF}}/g, operationsSummary["12"]["AF"])
					  .replace(/{{OP_SUMMARY.12.SI}}/g, operationsSummary["12"]["SI"])
					  .replace(/{{OP_SUMMARY.12.EF}}/g, operationsSummary["12"]["EF"])
					  .replace(/{{OP_SUMMARY.12.EL}}/g, operationsSummary["12"]["EL"])
					  .replace(/{{OP_SUMMARY.12.DI}}/g, operationsSummary["12"]["DI"])
					  .replace(/{{OP_SUMMARY.12.FD}}/g, operationsSummary["12"]["FD"])
					  .replace(/{{OP_SUMMARY.12.CA}}/g, operationsSummary["12"]["CA"])
					  .replace(/{{OP_SUMMARY.12.CF}}/g, operationsSummary["12"]["CF"])
					  .replace(/{{OP_SUMMARY.12.CO}}/g, operationsSummary["12"]["CO"])
					  .replace(/{{OP_SUMMARY.0.U}}/g, "" + new Money(operationsSummary["0"]["U"]))
					  .replace(/{{OP_SUMMARY.12.U}}/g, "" + new Money(operationsSummary["12"]["U"]))
					  .replace(/{{OP_SUMMARY.d.U}}/g, "" + new Money(operationsSummary["d"]["U"]))
					  .replace(/{{OP_SUMMARY.dp.U}}/g, "" + new Money(operationsSummary["dp"]["U"]))
					  .replace(/{{OP_SUMMARY.dn.U}}/g, "" + new Money(operationsSummary["dn"]["U"]))								  
					  .replace(/{{OP_SUMMARY.0.C}}/g, "" + new Money(operationsSummary["0"]["C"]))
					  .replace(/{{OP_SUMMARY.12.C}}/g, "" + new Money(operationsSummary["12"]["C"]))
					  .replace(/{{OP_SUMMARY.dp.C}}/g, "" + new Money(operationsSummary["dp"]["C"]))
					  .replace(/{{OP_SUMMARY.dn.C}}/g, "" + new Money(operationsSummary["dn"]["C"]))
					  .replace(/{{OP_SUMMARY.d.C}}/g, "" + new Money(operationsSummary["d"]["C"]))
					  .replace(/{{OP_SUMMARY.0.D}}/g, "" + new Money(operationsSummary["0"]["D"]))
					  .replace(/{{OP_SUMMARY.12.D}}/g, "" + new Money(operationsSummary["12"]["D"]))
					  .replace(/{{OP_SUMMARY.dp.D}}/g, "" + new Money(operationsSummary["dp"]["D"]))
					  .replace(/{{OP_SUMMARY.dn.D}}/g, "" + new Money(operationsSummary["dn"]["D"]))
					  .replace(/{{OP_SUMMARY.d.D}}/g, "" + new Money(operationsSummary["d"]["D"]))
					  .replace(/{{OP_SUMMARY.0.A}}/g, "" + new Money(operationsSummary["0"]["A"]))
					  .replace(/{{OP_SUMMARY.12.A}}/g, "" + new Money(operationsSummary["12"]["A"]))
					  .replace(/{{OP_SUMMARY.dp.A}}/g, "" + new Money(operationsSummary["dp"]["A"]))
					  .replace(/{{OP_SUMMARY.dn.A}}/g, "" + new Money(operationsSummary["dn"]["A"]))
					  .replace(/{{OP_SUMMARY.d.A}}/g, "" + new Money(operationsSummary["d"]["A"]))
					  .replace(/{{OP_SUMMARY.d.C-OP_SUMMARY.d.A}}/g, "" + new Money(operationsSummary["d"]["C"] + operationsSummary["d"]["A"]))
								  ;
};

var updateStory = function(ISO_A3, Country) {
	countryToUpdate = ISO_A3;
	
	if (operations)
	{
		Filters.apply('ISO_A3',ISO_A3);
		Filters.apply('WAS_OPEN', '0');
		countryOperations = getFilteredOperations();
		idblabchart.drawOperationsYear(countryOperations, "chartCanvas_LEGACY"  );
		idblabchart.configureCustomChart("chartCanvas_LEGACY_MIF", "bar" , getTableJSONFromFeature(countryOperations.features), Country, 'U', 'FOCUS_CD', 'PRODUCT_CD', 'Undisbrused amounts for MIF taxonomy and Instrument for S starting or E ending the year');
		
		//Thx to https://jonsuh.com/blog/javascript-templating-without-a-library/
		// Cache of the templates
		var template1 = document.getElementById("template-1").innerHTML;
		refreshOperationSummary(getTableJSONFromFeature(countryOperations.features), Country);
		
		var html1 = getReplacedTemplate(template1, operationsSummary);
		
		// Replace the HTML of #list with final HTML
		document.getElementById("LEGACY_TEXT").innerHTML = html1;
		
		
		new Chart("chartCanvas_LEGACY_small1", {
			type: 'doughnut',
			data: {
				labels: ['Cancelled', 'Disbursed', "Approved amount delta (excl. CA)"], 
				"datasets":[{
					"label":"Legacy operations",
					"data":[-1*operationsSummary["d"]["C"],-1*operationsSummary["d"]["D"],(operationsSummary["d"]["C"] + operationsSummary["d"]["A"])],
					"backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
				}]
			},
			options: {
				responsive:true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'Pre-existing operation USD$ movements',
				},
				tooltips: {
					callbacks: {
					  label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label + " : " + (new Money(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]));
					  }
					}
				},
			}
		});
		
		
		
		Filters.apply('ISO_A3',ISO_A3);
		Filters.apply('WAS_OPEN', '1');
		countryOperations = getFilteredOperations();	
		idblabchart.drawOperationsYear(countryOperations, "chartCanvas_NEW"  );
		idblabchart.configureCustomChart("chartCanvas_NEW_MIF", "bar" , getTableJSONFromFeature(countryOperations.features), Country, 'A12', 'FOCUS_CD', 'PRODUCT_CD', 'New operations, focus areas.');
		
		var template2 = document.getElementById("template-2").innerHTML;
		refreshOperationSummary(getTableJSONFromFeature(countryOperations.features), Country);
		
		var html1 = getReplacedTemplate(template2, operationsSummary);
		
		// Replace the HTML of #list with final HTML
		document.getElementById("NEW_TEXT").innerHTML = html1;
		
		
		new Chart("chartCanvas_LEGACY_small2", {
			type: 'pie',
			data: {
				labels: ['Cancelled', 'Disbursed', "Undisbursed"], 
				"datasets":[{
					"label":"New operations",
					"data":[operationsSummary["12"]["C"], operationsSummary["12"]["D"], operationsSummary["12"]["U"]],
					"backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
				}]
			},
			options: {
				responsive:true,
				maintainAspectRatio: false,
				title: {
					display: true,
					display: true,
					text: 'Newly approved operations (USD$)',
				},
				tooltips: {
					callbacks: {
					  label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label + " : " + (new Money(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]));
					  }
					}
				},
			}
		});
		
		Filters.apply('ISO_A3',ISO_A3);
		Filters.apply('WAS_OPEN', '');
		countryOperations = getFilteredOperations();	
		idblabchart.drawOperationsYear(countryOperations, "chartCanvas_CONCLUSION"  );
		idblabchart.configureCustomChart("chartCanvas_CONCLUSION_MIF", "bar" , getTableJSONFromFeature(countryOperations.features), Country, 'U', 'FOCUS_CD', 'PRODUCT_CD', 'Undisbursed amounts by focus area and products.' );
		idblabchart.configureCustomChart("chartCanvas_CONCLUSION_1", "pie" , getTableJSONFromFeature(countryOperations.features), Country, 'U0', 'FOCUS_CD', null, 'Undisbursed amounts starting year by focus area');
		idblabchart.configureCustomChart("chartCanvas_CONCLUSION_2", "pie" , getTableJSONFromFeature(countryOperations.features), Country, 'U12', 'FOCUS_CD', null, 'Undisbursed amounts ending year by focus area'); 
		
		var template3 = document.getElementById("template-3").innerHTML;
		refreshOperationSummary(getTableJSONFromFeature(countryOperations.features), Country);
		
		var html1 = getReplacedTemplate(template3, operationsSummary);
		
		// Replace the HTML of #list with final HTML
		document.getElementById("TOTAL_TEXT").innerHTML = html1;
		
		
		new Chart("chartCanvas_LEGACY_small3", {
			type: 'pie',
			data: {
				labels: ['Cancelled', 'Disbursed', "Undisbursed"], 
				"datasets":[{
					"label":"IDB Lab operations",
					"data":[operationsSummary["12"]["C"], operationsSummary["12"]["D"], operationsSummary["12"]["U"]],
					"backgroundColor":["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
				}]
			},
			options: {
				responsive:true,
				maintainAspectRatio: false,
				title: {
					display: true,
					text: 'End of the year operations (USD$)',
				},
				tooltips: {
					callbacks: {
					  label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label + " : " + (new Money(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]));
					  }
					}
				},
			}
		});
		
		
	};
	
};

$(document).ready(function () {
	
	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
	});
	
	
	$('.dropdown-toggle').dropdown();	

	
	$.getJSON(OPERATIONS_GEOJSON)
	.done(function(data) {
		
		data.features.forEach(
			function(f,i) { 
			//Note: LON cancelleations are negatives but others are positive, needed for standardization to same sign accross all operations types/products
			if (f.properties.PRODUCT_CD == 'LON') {
				f.properties.CANCELLED_AMNT_USEQ_DIC *= -1;
				f.properties.CANCELLED_AMNT_USEQ_JAN *= -1;
				f.properties.C0 *= -1;
				f.properties.C1 *= -1;
				f.properties.C2 *= -1;
				f.properties.C3 *= -1;
				f.properties.C4 *= -1;
				f.properties.C5 *= -1;
				f.properties.C6 *= -1;
				f.properties.C7 *= -1;
				f.properties.C8 *= -1;
				f.properties.C9 *= -1;
				f.properties.C10 *= -1;
				f.properties.C11 *= -1;
				if (f.properties.C12)
					f.properties.C12 *= -1;
			}
		});
		
		operations = data;
		
		if (countryToUpdate) {
			var isoa3 = $.urlParam('ISO_A3') || 'ARG';
			var country = $.urlParam('country') || 'Argentina';
			updateStory(isoa3, country);			
		};
		
	});
	
	Filters = new FiltersClass({
		attributes  : [
			new FilterAttribute({attribute:'PRODUCT_CD',type:'='})
			,new FilterAttribute({attribute:'SECTOR_CD',type:'='})
			,new FilterAttribute({attribute:'REGION_CD',type:'='})
			,new FilterAttribute({attribute:'WAS_OPEN',type:'='})
			,new FilterAttribute({attribute:'WAS_CLOSED',type:'IN'})
			,new FilterAttribute({attribute:'SECTOR',type:'='})
			,new FilterAttribute({attribute:'NO_TRANSACTIONS',type:'='})
			,new FilterAttribute({attribute:'FOCUS_CD',type:'='})
			,new FilterAttribute({attribute:'STATUS_CD_DIC',type:'='})
			,new FilterAttribute({attribute:'LENDING_INSTRMNT_CD',type:'='})
			,new FilterAttribute({attribute:'STATUS_SELECT',type:'IN'})
			,new FilterAttribute({attribute:'ISO_A3',type:'='})
			,new FilterAttribute({attribute:'FINANCIAL_INSTRUMENT_CD',type:'='})
			,new FilterAttribute({attribute:'FUND_CD',type:'='})
		],
		infoSelector : '#filters_info'
	});
	
	$('#GSELECT_ISO_A3').change(function(e) {
		console.log($( "#GSELECT_ISO_A3 option:selected" ));
		var isoa3 = $( "#GSELECT_ISO_A3 option:selected" )[0].value;
		var country = $( "#GSELECT_ISO_A3 option:selected" )[0].innerHTML;
		updateStory(isoa3, country);
		$("#country-link").prop("href", "./geodashboard?skip=1&country="+isoa3)
	});

	var isoa3 = $.urlParam('ISO_A3') || 'ARG';
	var country = $.urlParam('country') || 'Argentina';
	$("#GSELECT_ISO_A3").val(isoa3);
	updateStory(isoa3, country);
	
});

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return (results ? (results[1] || 0) : 0);
};

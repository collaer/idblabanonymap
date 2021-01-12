var chartWindow = {
	active : false
	,isCustom:false
	,toggle:function(code) {
		switch(code) {
			case 'show' :
				return this.active || this.switch();
			break;
			case 'hide' :
				return !this.active || this.switch();
			break;
			default:
				return this.switch();
			break;
		}
	}
	,switch:function() {
		$('#downbar, #content').toggleClass('activeHeight');
		setTimeout(function(){ map.invalidateSize()}, 400);
		this.active = !this.active;
		return this.refresh();
	}
	,refresh:function() {
		return !this.active 
		|| 
		(
			this.isCustom 
			?
			this.refreshCustom()
			:
			idblabchart.configureCustomChart('chartCanvas','drawOperationsYear')
		);
	}
	
	,setCustom:function(var1, var2, type, value) {
		$( ".custom-select-chart" ).each(function() {
			var selectGraph = $(this);
			var firstOption = selectGraph.children("option")[0]; //$("#brol option:first");
			
			var prop = $(firstOption).data('att-1');
			var val = $(firstOption).data('val-1');	
			
			switch (prop) {
				case 'type':
					selectGraph.val(type?type:'bar');
				break;
				case 'value':
					
					selectGraph.val(value?(value=="drawOperationsYear"?0:value):0);
				break;
				case 'var1':
					selectGraph.val(var1?var1:0);
				break;
				case 'var2':
					selectGraph.val(var2?var2:0);
				break;
			};
		});
		
	}
	
	,refreshCustom:function() {
		var dirty = 0;
		var type;
		var value;
		var var1;
		var var2;

		$( ".custom-select-chart option:selected" ).each(function() {
			var option_selected = $(this);
			
			var prop = option_selected.data('att-1');
			var val = option_selected.data('val-1');	
			//console.log(prop + "=" + val);
			
			switch (prop) {
				case 'type':
					type=val;
				break;
				case 'value':
					value=val;
				break;
				case 'var1':
					var1=val;
				break;
				case 'var2':
					var2=val;
				break;
			};
		});

		if (var1 || type == "drawOperationsYear") {
			idblabchart.configureCustomChart('chartCanvas',type, mydatatablejson, Filters.getInfoText(), value, var1, var2);
		};		
	}
};

var graphFields = {
	'REGION_CD' : {
		label: 'Region',
		values: [{
			code : 'CSC',
			label : 'CSC'
		},{
			code : 'CID',
			label : 'CID'
		},{
			code : 'CAN',
			label : 'CAN'
		},{
			code : 'CCB',
			label : 'CCB'
		},{
			code : 'REG',
			label : 'REG'
		}]
	},
	'LENDING_INSTRMNT_CD' : {
		label: 'Instrument',
		values: [{
			code : 'MIF',
			label : 'MIF'
		},{
			code : 'SMP',
			label : 'SMP'
		}]
	},
	'PRODUCT_CD' : {
		label: 'Product',
		values: [{
			code : 'TCP',
			label : 'TCP'
		},{
			code : 'IGR',
			label : 'IGR'
		},{
			code : 'EQU',
			label : 'Equity'
		},{
			code : 'LON',
			label : 'Loan'
		}]
	},
	'FOCUS_CD' : {
		label: 'MIF Category',
		values: [{
			code : 'ICI',
			label : 'Inclusive City'
		},{
			code : 'KEC',
			label : 'Knowledge economy'
		},{
			code : 'CSA',
			label : 'Climate Smart Agriculture'
		},{
			code : 'NA',
			label : 'Not applicable'
		},{
			code : 'ND',
			label : 'Not defined'
		}]
	},
	'SECTOR_CD' : {
		label: 'LFM Sector',
		values: [{
			code : 'AG',
			label : 'Agriculture'
		},{
			code : 'AS',
			label : 'Water & Sanitation'
		},{
			code : 'DU',
			label : 'Urban Development'
		},{
			code : 'ED',
			label : 'Education'
		},{
			code : 'EN',
			label : 'Energy'
		},{
			code : 'FM',
			label : 'Financial Markets'
		},{
			code : 'IN',
			label : 'Industry'
		},{
			code : 'IS',
			label : 'Social Investment'
		},{
			code : 'OT',
			label : 'Other'
		},{
			code : 'PA',
			label : 'Climate Change'
		},{
			code : 'PS',
			label : 'Private Enterprise'
		},{
			code : 'RI',
			label : 'Regional Integration'
		},{
			code : 'RM',
			label : 'Modernization of the State'
		},{
			code : 'SA',
			label : 'Health'
		},{
			code : 'ST',
			label : 'Science & Technology'
		},{
			code : 'TD',
			label : 'Trade'
		},{
			code : 'TR',
			label : 'Transportation'
		}]
	},
	'ISO_A3' : {
		label: 'Beneficiary country',
		values: [
			{ code: "ARG", label: "ARGENTINA" },
			{ code: "BHS", label: "BAHAMAS" },
			{ code: "BLZ", label: "BELIZE" },
			{ code: "BOL", label: "BOLIVIA" },
			{ code: "BRA", label: "BRAZIL" },
			{ code: "BRB", label: "BARBADOS" },
			{ code: "CHL", label: "CHILE" },
			{ code: "COL", label: "COLOMBIA" },
			{ code: "CRI", label: "COSTA RICA" },
			{ code: "DOM", label: "DOMINICAN REPUBLIC" },
			{ code: "ECU", label: "ECUADOR" },
			{ code: "GTM", label: "GUATEMALA" },
			{ code: "GUY", label: "GUYANA" },
			{ code: "HND", label: "HONDURAS" },
			{ code: "HTI", label: "HAITI" },
			{ code: "JAM", label: "JAMAICA" },
			{ code: "MEX", label: "MEXICO" },
			{ code: "NIC", label: "NICARAGUA" },
			{ code: "PAN", label: "PANAMA" },
			{ code: "PER", label: "PERU" },
			{ code: "PRY", label: "PARAGUAY" },
			{ code: "REG", label: "REGIONAL" },
			{ code: "SLV", label: "EL SALVADOR" },
			{ code: "SUR", label: "SURINAME" },
			{ code: "TTO", label: "TRINIDAD AND TOBAGO" },
			{ code: "URY", label: "URUGUAY" },
			{ code: "VEN", label: "VENEZUELA" }]
	},
	'FUND_CD' : {
		label: 'Fund',
		values: [] //fundsList4Chart
	},
	'FINANCIAL_INSTRUMENT_CD' : {
		label: 'Finan. Instr.',
		values: [] //fin_instrumentsList4Chart
	}
};

var sumTypes = [
	'CANCELLED_AMNT_USEQ_DIC',
	'CANCELLED_AMNT_USEQ_JAN',
	'CURRENT_APPROVED_AMNT_USEQ_DIC',
	'CURRENT_APPROVED_AMNT_USEQ_JAN',
	'UNDISBURSED_AMNT_USEQ_DIC',
	'DISBURSED_AMNT_USEQ_JAN',
	'DELTA_CANCELLED_AMNT_USEQ',
	'DELTA_DISBURSED_AMNT_USEQ',
	'C0',
	'C12',
	'A0',
	'A12',
	'U0',
	'U12'
];

Chart.defaults.global.tooltips.callbacks.label = function(tooltipItem, data) {
    return tooltipItem.yLabel.toLocaleString("en-US");
};

function getFloat(val) {
	   if (isNaN(parseFloat(val))) {
		 return 0.0;
	   }
	   return parseFloat(val);
	};
	
var idblabchart = {
	datas: [],
	labels: [],
	filters: [],
	titleBase: "IDB Lab Ap. " + YEAR,
	title: "IDB Lab Ap. " + YEAR,
	suffixeStartOfYear: " (S)",
	suffixeEndOfYear: " (E)",
	charts:{},
	
	draw: function(chartCanvasId, chart_id, operations, filterLabels) {
		if (this.charts[chartCanvasId] && this.charts[chartCanvasId].canvas && this.charts[chartCanvasId].canvas.id == chartCanvasId)
			this.charts[chartCanvasId].destroy();
		
		chartWindow.isCustom = true;
		
		switch(chart_id) {
			case 'lifecycle_chart':
				this.drawOperationsYear(FilteredOperations, chartCanvasId);
			break;
			case 'MIFCategory_chart':
				chartWindow.setCustom('FOCUS_CD', null, 'bar', 0);
			break;
			case 'region_chart':
				chartWindow.setCustom('REGION_CD', null, 'bar', 0);
			break;
			case 'country_chart':
				chartWindow.setCustom('ISO_A3', null, 'bar', 0);
			break;
			case 'product_chart':
				chartWindow.setCustom('PRODUCT_CD', null, 'bar', 0);
			break;
			case 'instrument_chart':
				chartWindow.setCustom('LENDING_INSTRMNT_CD', null, 'bar', 0);
			break;
		};
		chartWindow.refreshCustom();
	}
	
	,configureCustomChart(chartCanvasId, type, operations, filterLabels, sumType, label1, label2, title) {

		if (this.charts[chartCanvasId] && this.charts[chartCanvasId].canvas && this.charts[chartCanvasId].canvas.id == chartCanvasId)
			this.charts[chartCanvasId].destroy();
		
		if (type == "drawOperationsYear") {
			this.drawOperationsYear(FilteredOperations, chartCanvasId);
			chartWindow.isCustom = false;
			return;
		};
		
		chartWindow.isCustom = true;
		
		
		
		//label2 = label2 || (type=="bar"?label1:"");
		
		this.filters=[label1, label2];
			
		this.title = this.titleBase + (!filterLabels || ' '+filterLabels);
		var total = 0;
		this.labels = [[],[]];
		this.codeLabels = [[],[]];
		var gField1 = graphFields[label1];
		var v1array = Array.from(Array(gField1.values.length), ()=>0);
		var gField2;
		//this.datas = [new Array(gField.values.length)];
		for (idx in gField1.values) {
			val=gField1.values[idx];
			this.codeLabels[0].push(val.code);
			this.labels[0].push(val.code);
		};
		
		if (label2) {
			this.labels.push([]);
			gField2 = graphFields[label2];
			this.datas = [Array.from(Array(gField2.values.length), ()=>v1array.slice(0)), Array.from(Array(gField2.values.length), ()=>v1array.slice(0))]; //slice 0 to clone array, otherwise getting a reference to it.

			for (idx in gField2.values) {
				val=gField2.values[idx];
				this.codeLabels[1].push(val.code);
				this.labels[1].push(val.code);
			};
		} else {
			this.datas = [[v1array.slice(0)], [v1array.slice(0)]];
		};
		
		var me=this;
		
		$.each(operations, function(i, operation) {
			total++;
			var position1 = me.labels[0].findIndex(function(a){ return a===operation[label1]; });
			var position2 = (me.labels[1].length > 0 ? me.labels[1].findIndex(function(a){ return a===operation[label2]; }):0);
			
			
			if (position1 != -1 && position2 != -1) {
				
				if (sumTypes.includes(sumType )) {
					me.datas[0][position2][position1] += getFloat(operation[sumType]);
				}
				else 
				{
					if (sumTypes.includes(sumType + "0")) {
						me.datas[0][position2][position1] += getFloat(operation[sumType + "0"]);
					} else {
						me.datas[0][position2][position1] += getFloat(operation["O0"]); //summing operations and 0 if was open during the year
						
					}

					if (sumTypes.includes(sumType + "12")) {
						me.datas[1][position2][position1] += getFloat(operation[sumType + "12"]);
					} else {
						me.datas[1][position2][position1] += getFloat(operation["O12"]); //summing operations and 0 if was closed during the year 
					}
				}

				if (total > 442 && total < 45) {
					console.log("****");
					console.log(sumType);
					console.log(position1);
					console.log(position2);
					console.log(me.datas[0][position2][position1]);
					console.log(operation);
					console.log(operation[sumType + "0"]);
					console.log(operation["O0"]);
					console.log(operation[sumType + "12"]);
					console.log(operation["O12"]);
					console.log(me.datas);
					console.log(me.datas[0]);
					console.log(me.datas[1]);
				}
			}
		
		});
		
		if (!label2) {
		//Replace labels codes by labels verbose text
			this.labels[0] = this.labels[0].map(function(elem, idx) { 
				var lb = graphFields[label1].values.find(obj => { return obj.code == elem; });
				return lb.label;
			});
		} else {
			var labeltouse;
			this.labels = this.labels.map(function(elem, idx) { 
				labeltouse = (idx==0?label1:label2);
				elem = elem.map(function(elem, idx) {
					var lb = graphFields[labeltouse].values.find(obj => { return obj.code == elem; });
					return lb.label;
				});
				

				return elem;
			});
		}
		this.drawCustomChart(chartCanvasId, type, sumTypes.includes(sumType), title);
	}
	
	,drawCustomChart(chartCanvasId, type, oneStack, title) {
		
		var datasets = [];
		
		if (this.labels[1].length > 0)
		{
			for (idx in this.labels[1]) {
				datasets.push(
					{
						//labels: 'Start ' + YEAR , //this.labels[0],
						label:  this.codeLabels[1][idx] + this.suffixeStartOfYear, //this.labels[1][idx],
						data: this.datas[0][idx],
						stack: 0
					}
				);
				if (!oneStack) {
					datasets.push(
						{
							//labels: 'End of ' + YEAR, //this.labels[0],
							label: this.codeLabels[1][idx] + this.suffixeEndOfYear, //this.labels[1][idx],
							data: this.datas[1][idx],
							stack: 1
						}
					);
				}
			};
		} else {
			if (!oneStack) {
				datasets = [{
							label: 'Start ' + YEAR, //this.labels[0],
							data: this.datas[0][0],
							stack: 0
						},{
							label: 'End of ' + YEAR, //this.labels[0],
							data: this.datas[1][0],
							stack: 1
						}];
			} else {
				datasets = [{
							label: YEAR,
							data: this.datas[0][0],
							stack: 0
						}];
			}
		};
		
		this.charts[chartCanvasId] = new Chart(chartCanvasId, {
			type: type,
			data: {
				labels: this.labels[0],
				datasets: datasets
			},
			options: {
				responsive:true,
				maintainAspectRatio: false,
				tooltips: {
				  displayColors: true,
				  callbacks:{
					mode: 'x',
				  },
				},
				scales: {
				  xAxes: [{
					stacked: true,
					gridLines: {
					  display: false,
					}
				  }],
				  yAxes: [{
					stacked: true,
					ticks: {
					  beginAtZero: true,
					},
					type: 'linear',
				  }]
				},
				legend: { position: 'bottom' },
				plugins: {
					colorschemes: {
						scheme: 'brewer.Paired12'
					}
				},
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							
							var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
							value = (Math.round(value*100)/100).toLocaleString();
							var label = data.datasets[tooltipItem.datasetIndex].label;
							return label + ' ' + value + '';

						}
					}
				},
				title: {
					display: (title?true:false),
					text: title
				},
				
			}
		});
		
		
		if (chartCanvasId == 'chartCanvas') {
			me = this;
			this.charts[chartCanvasId].canvas.onclick = function(evt){
				event=evt;
				var elem = me.charts[chartCanvasId].getElementAtEvent(evt);
				if (elem && elem.length >= 1) {
					var idx = elem[0]._index;
					var DSidx = elem[0]._datasetIndex;
					var l1 = me.charts[chartCanvasId].data.labels[idx].replace(new RegExp("[" + me.suffixeStartOfYear + "]+$"), "").replace(new RegExp("[" + me.suffixeEndOfYear + "]+$"), "");
					var l2 = me.charts[chartCanvasId].data.datasets[DSidx].label.replace(new RegExp("[" + me.suffixeStartOfYear + "]+$"), "").replace(new RegExp("[" + me.suffixeEndOfYear + "]+$"), "");

					var obj1 = graphFields[idblabchart.filters[0]].values.find(obj => { return obj.label == l1; }) ||
							   graphFields[idblabchart.filters[0]].values.find(obj => { return obj.code == l1; });
					var obj2;
					if (idblabchart.filters[1])
						obj2 = graphFields[idblabchart.filters[1]].values.find(obj => { return obj.label == l2; }) ||
								   graphFields[idblabchart.filters[1]].values.find(obj => { return obj.code == l2; });
					
					//console.log(idblabchart.filters[0] + ' = ' + obj1.code + ' (' + obj1.label + ')');
					//console.log(idblabchart.filters[1] + ' = ' + obj2.code + ' (' + obj2.label + ')');
					//$("GSELECT_"+idblabchart.filters[0]).val(obj1.code);
					if (obj2 && idblabchart.filters[0] != idblabchart.filters[1])
					{
						if($("#GSELECT_"+idblabchart.filters[0]).length == 1)
							$("#GSELECT_"+idblabchart.filters[0]).val(obj1.code);
						if($("#GSELECT_"+idblabchart.filters[1]).val(obj2.code).length ==1)
							$("#GSELECT_"+idblabchart.filters[1]).val(obj2.code);
					} else {
						if($("#GSELECT_"+idblabchart.filters[0]).length == 1)
							$("#GSELECT_"+idblabchart.filters[0]).val(obj1.code);
					}
					$('.custom-select').trigger('change');
					$("#chartModalWindow").modal("hide");
				};
			
			};
		};
	}
	
	
	,drawOperationsYear(operations, chartCanvasId) {
		chartWindow.isCustom = false;
		chartWindow.setCustom(null, null, null, 'drawOperationsYear');
		var colorsPaired12 = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];
		chartCanvasId= chartCanvasId || "chartCanvas";
		
		if (this.charts[chartCanvasId] && this.charts[chartCanvasId].canvas && this.charts[chartCanvasId].canvas.id == chartCanvasId)
			this.charts[chartCanvasId].destroy();
		
		this.labels = [
			['Apprvd', 'Undisb.', 'Disb.', 'Cancel.', 'Anomaly'],
			['31dec-' + YEARO,'Jan','Fev','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec-' + YEAR ]
		];
		
		this.data = [[],[],[],[],[]];
		this.datasets = [];
		me = this;

		var activesCODES = ['EL', 'FD', 'EF', 'DI', 'AF', 'SI'];
		var notActivesCODES = ['CF', 'DE', 'CA', 'CO' ];
		var CancelledCODES = ['CA'];
		var countActives = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var countNotActives = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		var countCancelled = [0,0,0,0,0,0,0,0,0,0,0,0,0];
		
		$.each(operations.features, function(key, featOperation ) {
			
			var operation = featOperation.properties;
		
			for (i=0;i<=12;i++)
			{
				if (me.data[0].length <= 12) {
					me.data[0].push(getFloat(operation["A"+i]));
					me.data[1].push(getFloat(operation["U"+i]));
					me.data[2].push(getFloat(operation["D"+i]));
					me.data[3].push(getFloat(operation["C"+i]));
					me.data[4].push(getFloat(operation["A"+i] - operation["U"+i] - operation["D"+i])); //anomaly, should be always 0 
				} else {
					me.data[0][i] += getFloat(operation["A"+i]);
					me.data[1][i] += getFloat(operation["U"+i]);
					me.data[2][i] += getFloat(operation["D"+i]);
					me.data[3][i] += getFloat(operation["C"+i]);
					me.data[4][i] += getFloat(operation["A"+i] - operation["U"+i] - operation["D"+i]); //anomaly, should be always 0 
				}
					//NOTE TO SELF: 
					//CURRENT APPRV = UNDISB + DISB 
					//ORIG APPRV = CANCELLED + CURRENT APPRV
				
				if (operation["ST"+i]) {
					if (new RegExp(activesCODES.join("|")).test(operation["ST"+i])) {
						// At least one match
						countActives[i]++;
					} else if (new RegExp(notActivesCODES.join("|")).test(operation["ST"+i])) {
						countNotActives[i]++;
						if (new RegExp(CancelledCODES.join("|")).test(operation["ST"+i])) {
							countCancelled[i]++;
						}
					};
				};
				
			}
		});
		
		for (i=0;i<=12;i++) 
			this.labels[1][i] = [this.labels[1][i], countActives[i] + ' act', (countNotActives[i]-countCancelled[i]) + ' clo', countCancelled[i] + ' can']; 
		//adding additional labels for monthly satus
		
		this.datasets.push({ 					//LINE disb
			type: 'line',
			label:this.labels[0][2],
			data:this.data[2],
			borderWidth: 2,
			fill: false,
			stack: 3,
			backgroundColor: colorsPaired12[0], 	// Pale blue
			borderColor : colorsPaired12[0], 	
			pointBackgroundColor: colorsPaired12[0], 	
			pointBorderColor: colorsPaired12[0],
			lineTension: 0,
		});
		
		this.datasets.push({ 					//LINE cancelled
			type: 'line',
			label:this.labels[0][3],
			data:this.data[3],
			borderWidth: 2,
			fill: false,
			stack: 3,
			backgroundColor: colorsPaired12[7], 	//Orange
			borderColor: colorsPaired12[7], 	
			pointBackgroundColor: colorsPaired12[7], 	
			pointBorderColor: colorsPaired12[7],
			lineTension: 0,
		});

		this.datasets.push({ // current apprv 
			type: 'bar',
			label:this.labels[0][0],
			data:this.data[0],
			stack:1,
			backgroundColor: colorsPaired12[2] //Light green
		});
		
		this.datasets.push({ //undisb 
			type: 'bar',
			label:this.labels[0][1],
			data:this.data[1],
			stack:2,
			backgroundColor: colorsPaired12[3] //GREEN
		});
		
		this.datasets.push({ // disb 
			type: 'bar',
			label:this.labels[0][2],
			data:this.data[2],
			stack:2,
			backgroundColor: colorsPaired12[1] //BLUE
		});
				
		this.datasets.push({ // cancelled
			type: 'bar',
			label:this.labels[0][3],
			data:this.data[3],
			stack:1,
			backgroundColor: colorsPaired12[6] //Light Orange
		});
		
		this.datasets.push({ // Anomaly
			type: 'bar',
			label:this.labels[0][4],
			data:this.data[4],
			stack:3,
			backgroundColor: colorsPaired12[5] //RED
		});

		this.charts[chartCanvasId] = new Chart(chartCanvasId, {
			type: 'bar',
			data: {
				labels: idblabchart.labels[1], //X labels : dates
				datasets: this.datasets
			},
			options: {
				responsive:true,
				maintainAspectRatio: false,				
				scales: {
				  yAxes: [{
					stacked: true,
				  }]
				},
				animation: {
				  duration: 750,
				},
				tooltips: {
					callbacks: {
					  label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label + " : " + (new Money(tooltipItem.yLabel));
					  }
					}
				},
				title: {
					display: true,
					text: YEAR + ' IDB Lab aggregated approvals (using currents filters).',
				},
			}
		});
		
	}

	,drawOperationYear(operation, chartCanvasId) {
		chartWindow.isCustom = false;
		chartWindow.setCustom(null, null, null, 'drawOperationsYear');
		/*var colors = {
			blue: "rgb(54, 162, 235)",
			green: "rgb(75, 192, 192)",
			grey: "rgb(201, 203, 207)",
			orange: "rgb(255, 159, 64)",
			purple: "rgb(153, 102, 255)",
			red: "rgb(255, 99, 132)",
			yellow: "rgb(255, 205, 86)"
		}*/
		var colorsPaired12 = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'];
		
		chartCanvasId= chartCanvasId || "chartCanvas";
		
		if (this.charts[chartCanvasId] && this.charts[chartCanvasId].canvas && this.charts[chartCanvasId].canvas.id == chartCanvasId)
			this.charts[chartCanvasId].destroy();
		
		this.labels = [
			['Apprvd', 'Undisb.', 'Disb.', 'Cancel.', 'Anomaly'],
			['31dec-'+YEARO,'Jan','Fev','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec-'+YEAR ]
		];
		
		this.data = [[],[],[],[],[]];
		this.datasets = [];
		
		for (i=0;i<=12;i++)
		{
			//console.log(i);
			this.data[0].push(operation["A"+i]);
			this.data[1].push(operation["U"+i]);
			this.data[2].push(operation["D"+i]);
			this.data[3].push(operation["C"+i]);
			this.data[4].push(operation["A"+i] - operation["U"+i] - operation["D"+i]); //anomaly, should be always 0
			if (operation["ST"+i])
				this.labels[1][i] = [this.labels[1][i], operation["ST"+i]]; //adding second labels for monthly satus
			//NOTE TO SELF: 
			//CURRENT APPRV = UNDISB + DISB 
			//ORIG APPRV = CANCELLED + CURRENT APPRV
		}
		//console.log(this.data);
		
		this.datasets.push({ 					//LINE disb
			type: 'line',
			label:this.labels[0][2],
			data:this.data[2],
			borderWidth: 2,
			fill: false,
			stack: 3,
			backgroundColor: colorsPaired12[0], 	// Pale Blue
			borderColor : colorsPaired12[0], 	
			pointBackgroundColor: colorsPaired12[0], 	
			pointBorderColor: colorsPaired12[0],
			lineTension: 0,			
		});
		
		this.datasets.push({ 					//LINE cancelled
			type: 'line',
			label:this.labels[0][3],
			data:this.data[3],
			borderWidth: 2,
			fill: false,
			stack: 3,
			backgroundColor: colorsPaired12[7], 	//Orange
			borderColor: colorsPaired12[7], 	
			pointBackgroundColor: colorsPaired12[7], 	
			pointBorderColor: colorsPaired12[7],
			lineTension: 0,
		});
		/*
		this.datasets.push({
			type: 'line',
			label:this.labels[0][2],
			data:this.data[2],
			borderWidth: 2,
			fill: false,
			stack: 3
		});
		
		for (i in this.labels[0])
		{
			if (i == 4) {
				this.datasets.push({
					type: 'bar',
					label:this.labels[0][i],
					data:this.data[i],
					stack:3
				});
			} else if (i == 0 || i == 3) { // current apprv + cancelled
				this.datasets.push({
					type: 'bar',
					label:this.labels[0][i],
					data:this.data[i],
					stack:1
				});
			} else {
				this.datasets.push({ //undisb + disb 
					type: 'bar',
					label:this.labels[0][i],
					data:this.data[i],
					stack:2
				});
			}
		};
		*/ 
		this.datasets.push({ // current apprv 
			type: 'bar',
			label:this.labels[0][0],
			data:this.data[0],
			stack:1,
			backgroundColor: colorsPaired12[2] //Light green
		});
		
		this.datasets.push({ //undisb 
			type: 'bar',
			label:this.labels[0][1],
			data:this.data[1],
			stack:2,
			backgroundColor: colorsPaired12[3] //GREEN
		});
		
		this.datasets.push({ // disb 
			type: 'bar',
			label:this.labels[0][2],
			data:this.data[2],
			stack:2,
			backgroundColor: colorsPaired12[1] //BLUE
		});
				
		this.datasets.push({ // cancelled
			type: 'bar',
			label:this.labels[0][3],
			data:this.data[3],
			stack:1,
			backgroundColor: colorsPaired12[6] //Light Orange
		});
		
		this.datasets.push({ // Anomaly
			type: 'bar',
			label:this.labels[0][4],
			data:this.data[4],
			stack:3,
			backgroundColor: colorsPaired12[5] //RED
		});		
		
		//console.log(this.datasets);
		
		/*
		this.charts[chartCanvasId] = new Chart("chartCanvas", {
			type: 'line',
			data: {
				labels: idblabchart.labels[1], //X labels : dates
				datasets: this.datasets
			},
			options: {
				plugins: {
					colorschemes: {
						scheme: 'brewer.Paired12'
					}
				},
				scales: {
				  yAxes: [{
					stacked: true,
				  }]
				},
				animation: {
				  duration: 750,
				},
			}
		});
		*/
		
		this.charts[chartCanvasId] = new Chart(chartCanvasId, {
			type: 'bar',
			data: {
				labels: idblabchart.labels[1], //X labels : dates
				datasets: this.datasets
			},
			options: {
				/*plugins: {
					colorschemes: {
						scheme: 'brewer.Paired12'
					}
				},*/
				responsive:true,
				maintainAspectRatio: false,
				scales: {
				  yAxes: [{
					stacked: true,
				  }]
				},
				animation: {
				  duration: 750,
				},
				tooltips: {
					callbacks: {
					  label: function (tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].label + " : " + (new Money(tooltipItem.yLabel));
					  }
					}
				},
				title: {
					display: true,
					text: YEAR + ' IDB Lab ' + operation.PROJECT_NUMBER + ', approval ' + operation.OPERATION_NUMBER,
				}
			}
		});
		
	}


}; 
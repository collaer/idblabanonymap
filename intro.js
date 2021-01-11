var intro_shown = false;

function startIntro(){
	var intro = introJs();
	
	intro.setOption('tooltipPosition', 'auto');
	intro.setOption('overlayOpacity', 0.75);
	intro.setOption('showProgress', true);
	intro.setOption('hidePrev', true);
	intro.setOption('hideNext', true);
	intro.setOption('exitOnOverlayClick', false);
	intro.setOption('disableInteraction', true);
	intro.setOption('showBullets', false);
	intro.setOption('positionPrecedence', ['bottom', 'right', 'top', 'left']);
	
	intro.onbeforechange(function(NextElem){
		
		switch (intro._currentStep) {
			case 0:
			break;
			case 1:
			break;
			case 2:
			break;
			case 3:
				countriesLayer.getLayers()[2].openPopup();
				//intro._introItems[4].element = $('#custom-table-id')[0];
			break;
			case 4:
				chartWindow.toggle('show');
				intro._introItems[5].element = $('#downbar')[0];
			break;
			case 5:
				idblabchart.drawOperationYear(operations.features[mydatatablejson[1].IDGEOJSON].properties);
			break;
			case 6:
				$('#downbar').modal('hide');
				//$('#sidebar, #content').toggleClass('active');
				//setTimeout(function(){ map.invalidateSize()}, 400);
		
				setTimeout(function(){
					$('#sidebar, #content').toggleClass('active');
					setTimeout(function(){ map.invalidateSize()}, 400);
				}, 1500);
				setTimeout(function(){
					$('#sidebar, #content').toggleClass('active');
					setTimeout(function(){ map.invalidateSize()}, 400);
				}, 2500);
	
				//$('#chartModalWindow').modal('hide');
				map.closePopup();
			break;
			case 8:
				$("#GSELECT_WAS_CLOSED").val(1);
				$('.custom-select').trigger('change');
				intro._introItems[10].element = $('#lifecycle_chart')[0];
			break;
			case 10:
				chartWindow.toggle('show');
				idblabchart.configureCustomChart('chartCanvas','drawOperationsYear');
				intro._introItems[11].element = $('#downbar')[0];
			break;
			case 11:
				$("#GSELECT_WAS_CLOSED").val(0);
				$("#FOCUS_CD").val('ICI');
				$("#PRODUCT_CD").val('TCP');
				$("#GSELECT_REGION_CD").val('CAN');
				$('.custom-select').trigger('change');
				idblabchart.configureCustomChart('chartCanvas','drawOperationsYear');
			break;
		};
	});
	
	intro.onafterchange(function(NextElem){
		
		switch (intro._currentStep) {
			case 12:
				$("#FOCUS_CD").val(0);
				$("#PRODUCT_CD").val(0);
				$("#GSELECT_REGION_CD").val(0);
				$('.custom-select').trigger('change');
				$('#chartModalWindow').modal('hide');
			break;
		};
	});

	
	intro.setOptions({
		steps: [{
				element: '#idblab-logo',
				intro: "Welcome to the IDB Lab map 2020 test page, let's have a tour of his main functionalities."
						+ "<br /><br /> You can skip this tutorial by clicking on the <b>Skip</b> button."
						+ "<br /> Use your <b>keyboard</b> arrows or the <b>Next</b> button to go throught the tutorial funcionalities tour."
			},{
				element: '#map',
				intro: "<span class=\"fas fa-map fa-xs\"></span> This is the <b>map</b> component.<br/> <br/>You can explore here the data, <b>zooming in</b> and <b>out</b> or paning the map."
					  + "<br /> The coutries with operations are shown using a green color scalerange indicating their relative operations numbers."
					  + "<br /> The numbers shown are the numbers of operations."
			},{
				element: '.leaflet-control-layers-toggle',
				intro: "You can deactivate thoose 2 layers here to remove them:"
				       +"<ul><li>coutries in greenscales: countries</li><li>number bullets: Numbers</li></ul>"
			},{
				element: '#map',
				intro: "By clicking on a green polygon country on the map, a pop-up (like this one I've just opened) containing details about the countries operations will be shown."
			},{
				element: '#map',
				intro: 'In this popup window, you may click on an operation number or a project number to open a new window and retrieve operation detail.'
			},{
				element: '#chartModalWindow',
				intro: 'Also, by clicking on an operation row of the coutry operation list, it will open this graph of his life cylce during the year 2020.'
			},{
				element: '#button-wrapper',
				intro: 'Thoose the 3 buttons are for:'
					   + '<ul><li><i class="fas fa-align-left"></i>&nbsp;Hide or show filter panel.</li>'
					   + '<li><i class="fas fa-clipboard-list"></i>&nbsp;Open a window of current datas in a tabular representation (Tip: you can <b>download</b> <span class="fas fa-download fa-xs"></span> the data in CSV or Excel format from there).</li>'
					   + '<li><span class="fas fa-chart-pie fa-xs"></span>&nbsp;Open a chart window to see current lifecycle operations chart and to build custom chart vizualization.</li></ul>'
			},{
				element: '#sidebar',
				intro: 'Here in the filters side bar, you can filter the operations using thoose combobox controls.'
				+ '<br /> The filtered operations will be reflected in all other vizualizations accordingly. In the map, in the data tables, XLS export and charts.'
				+ '<br /> <br/> Mixing filters will be done using a AND clause, only operations correponding to all filters will be selected.'
			},{
				element: '#GSELECT_WAS_CLOSED',
				intro: 'I\'ve just selected an option here and filtered the operations based on their <b>Lifecycle</b> "approved during 2020" in order to show only the operations that were approved during this year.'
				+ '<br />You may have noticed that the map was updated.'
		},{
				element: '#totalsTable',
				intro: 'A fast preview of differents totals of the filtered operations is shown in the table here.'
				+ '<br />You can hover your mouse on top of thoose values to see tooltips with a little bit more informations.'
		},{
				element: '#lifecycle_chart',
				intro: 'Also clicking here in the total will open this chart window visible now of aggregated lifelines of all filtered operations (in this case only the yearly created operations because of our previous filter).'
		},{
				element: '#chartModalWindow',
				intro: 'Another example, I\'ve updated the filters to show:'
						+ '<br /><br />- All IDB Lab operations that were actives at least one day in the year.'
						+ '<br />- and within <b>Inclusive cities</b> classification'
						+ '<br />- and within <b>CAN</b> region'
						+ '<br />- and of <b>TCP</b> product.'
		},{
				element: '#chartModalWindow',
				intro: 'Here is it, we finished this first tour of the test page dedicated to an IDB Lab 2020 operation footprint vizualization page\'s functionalities, there are still more. Feel free to try all of them.<br /><br />Note: I\'ve also resetted all the filters.'
		}]
	});
	
	intro.start();
};
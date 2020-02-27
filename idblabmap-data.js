
//INITIALISATION
//GET AJAX operations DATA
var operations;
var OPERATIONS_GEOJSON = (window.location.href.indexOf("file:")==-1 || true ?
"https://raw.githubusercontent.com/collaer/idblabanonymap/master/DATA/operations-anonymized-2019.geojson"
:
"./DATA/bidlab2019October.geojson");

//GET CNTRY LIST from all operations
var ISO_A3_list = [];
//GET AJAX countries polygons DATA
var countriesLayer;
var COUTRIES_GEOJSON = (window.location.href.indexOf("file:")==-1 || true ?
"https://raw.githubusercontent.com/collaer/idblabanonymap/master/DATA/countries2.geojson"
:
"./DATA/countries2.geojson");
//Filter countries by CNTRY LIST

//UPDATE
//USING JSON DATA ALREADY LOADED : COMPUTE MARKERS, GRADIENTS SCALES AND LIST POPUP with current filters
//GET FILTERED OPERATIONS FROM OPERATION JSON ALREADY LOADED
//REFRESH MAX AND TOTALS
//DELETE OLD MARKERS
//USING JSON CNTRY DATA ALREADY LOADED :
//  COMPUTE FOR EACH COUNTRY:
//    - CREATE MARKERS
//    - CREATE INFOBULLES TABLES
//SET STYLE FO CHOROPLETH


var operationsMarkers = L.markerClusterGroup({
	chunkedLoading: true,
	spiderfyOnMaxZoom: false,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: false
});

var choroplethScaler = {
	base:0
	,ratio:1
};

var ISO_A3_FILTER;

var markerOfOneIcon= new L.DivIcon({ html: '<div><span>1</span></div>', className: 'marker-cluster marker-cluster-small', iconSize: new L.Point(40, 40) });

var mydatatablejson = [];

//***********************************************************************

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
		
		loadCountryList(operations);
		loadCountriesLayer();
		
		operationsMarkers.on('clusterclick', function(clut) {

			map.removeLayer(operationsMarkers);

			var getted = map.getLayerAt(map.latLngToContainerPoint(clut.latlng));
			
			//console.log(getted);
			if (getted)
				getted.openPopup();
			
			//Mhhhhh
			setTimeout(function(){
				map.addLayer(operationsMarkers);
			},50);

		});
		
        countriesLayer.addTo(map);
        map.addLayer(operationsMarkers);
		L.control.layers(null, {'Numbers':operationsMarkers, 'Paises':countriesLayer}).addTo(map);	
		$('.custom-select').trigger('change');
	});

function loadCountryList(operations) {
	$.each(operations.features, function( key, operation ) {
		if (!ISO_A3_list.includes(operation.properties.ISO_A3)) {
			ISO_A3_list.push(operation.properties.ISO_A3);
		}
	});
};

function loadCountriesLayer(){
	countriesLayer = new L.GeoJSON.AJAX(COUTRIES_GEOJSON
	,{
		filter: function(feature, layer) {
			return ISO_A3_list.includes(feature.properties.ISO_A3);
		}
		,style: function(feature){
			var counter = 0;
			var fillColor;

			$.each(operations.features, function( key, operation ) {
				if (operation.properties.ISO_A3 == feature.properties.ISO_A3 && Filters.check(operation.properties)) {
					counter++;
				};
			});
			
			if ( counter - choroplethScaler.base >= 55*choroplethScaler.ratio ) fillColor = "#00441b";
			else if ( counter - choroplethScaler.base >= 34*choroplethScaler.ratio ) fillColor = "#006d2c";
			else if ( counter - choroplethScaler.base >= 21*choroplethScaler.ratio ) fillColor = "#238b45";
			else if ( counter - choroplethScaler.base >= 13*choroplethScaler.ratio ) fillColor = "#41ab5d";
			else if ( counter - choroplethScaler.base >= 8*choroplethScaler.ratio ) fillColor = "#74c476";
			else if ( counter - choroplethScaler.base >= 5*choroplethScaler.ratio ) fillColor = "#a1d99b";
			else if ( counter - choroplethScaler.base >= 3*choroplethScaler.ratio ) fillColor = "#c7e9c0";
			else if ( counter - choroplethScaler.base >= 2*choroplethScaler.ratio ) fillColor = "#e5f5e0";
			else if ( counter - choroplethScaler.base >= 1*choroplethScaler.ratio ) fillColor = "#f7fcf5";
			else fillColor = "#f7f7f7";  // no data

			return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .79 };
		}
	}).on('data:loaded', function() {
		joinData();
	});
};


function countryFilter(feature, layer) {
  if (feature.properties.ISO_A3 === ISO_A3_FILTER) return true;
};

var FilteredOperations;

function filter_country(ISO_A3) {
	$("#GSELECT_ISO_A3").val(ISO_A3);
	$('.custom-select').trigger('change');
};

//https://www.w3resource.com/javascript-exercises/javascript-string-exercise-16.php
text_truncate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

function joinData() {
	
	//var countriesGeoJson = countriesLayer.getGeoJSON();
	//**CLEANING STUFFF***
	mydatatablejson=[];
	totals.refresh();
	operationsMarkers.clearLayers();
	//countriesLayer.refresh();
	
	FilteredOperations = getFilteredOperations();
	
	mydatatablejson = getTableJSONFromFeature(FilteredOperations.features);
	
	var minCountry;
	var maxCountry;

	countriesLayer.eachLayer(function(feature){
		ISO_A3_FILTER = feature.feature.properties.ISO_A3;

		var countriesOperationsFeatures = FilteredOperations.features.filter(countryFilter);
		var counter = 0;
		var counterNew = 0;
		var counterClosed = 0;
		var popupTableContent = '';
		
		$.each(countriesOperationsFeatures, function(key, operation ) {

			var title = operation.properties.OPERATION_NUMBER;

			var marker = L.marker(new L.LatLng(feature.getBounds().getCenter().lat, feature.getBounds().getCenter().lng), 
			  { title: title, icon: markerOfOneIcon });

			operationsMarkers.addLayer(marker);

			totals.approved.add_one_operation(operation.properties.CURRENT_APPROVED_AMNT_USEQ_JAN,operation.properties.CURRENT_APPROVED_AMNT_USEQ_DIC);
			totals.cancelled.add_one_operation(operation.properties.CANCELLED_AMNT_USEQ_JAN,operation.properties.CANCELLED_AMNT_USEQ_DIC);
			totals.undisbursed.add_one_operation(operation.properties.UNDISBURSED_AMNT_USEQ_JAN,operation.properties.UNDISBURSED_AMNT_USEQ_DIC);
			totals.disbursed.add_one_operation(operation.properties.DISBURSED_AMNT_USEQ_JAN,operation.properties.DISBURSED_AMNT_USEQ_DIC);

			//********************************POPUP TABLE CONTENT********************
			counter++;
			styleFocus = '';

			if (operation.properties.WAS_OPEN == 1) {
				counterNew++;
				styleFocus = 'class="table-success"';
			}

			if (operation.properties.WAS_CLOSED == 1 || operation.properties.WAS_CLOSED == 'CF' || operation.properties.WAS_CLOSED == 'CO') {
				counterClosed++;
				styleFocus = 'class="table-secondary"';
			}

			undisbursed_dic = new Money(operation.properties.UNDISBURSED_AMNT_USEQ_DIC);
			delta_disb = new Money(operation.properties.DISBURSED_AMNT_USEQ_DIC - operation.properties.DISBURSED_AMNT_USEQ_JAN);
			delta_cancel = new Money(operation.properties.CANCELLED_AMNT_USEQ_DIC - operation.properties.CANCELLED_AMNT_USEQ_JAN);
			
			popupTableContent += '\n'+
			'<tr onclick="openChart(\'' + operation.properties.OPERATION_NUMBER + '\')">\n'+
			'<th ' + styleFocus + ' scope="row">' + linkProjectFormatter(counter, operation.properties) + '</th>\n'+
			'<td>' + linkProjectFormatter(operation.properties.OPERATION_NUMBER, operation.properties) + '</td>\n'+
			'<td>' + text_truncate("" + operation.properties.OPERATION_NAME,93,"...") + '</td>\n'+
			//'<td>' + linkProjectFormatter(operation.properties.PROJECT_NUMBER, operation.properties) + '</td>\n'+
			//'<td>' + operation.properties.SECTOR_CD + '</td>\n'+
			'<td>' + undisbursed_dic + '</td>\n'+
			'<td>' + delta_disb + '</td>\n'+
			'<td>' + delta_cancel + '</td>\n'+
			'</tr>';

		});

		popupTableContent = '<a href="#" onclick="filter_country(\''+ISO_A3_FILTER+'\');"><div class="custom-title" id="custom-title-id"><span class="fas fa-filter fa-xs"></span></a><a href="./story?country='+feature.feature.properties.ADMIN+'&ISO_A3='+feature.feature.properties.ISO_A3+'"> *Country page* </a>' + feature.feature.properties.ADMIN + ' : total ' + counter + ' (including ' + counterNew + ' newly approved and ' + counterClosed + ' closed)</div>\n'+
          '<table class="table table-striped table-dark table-popup" id="custom-table-id">\n'+
            '<thead>\n'+
              '<tr>\n'+
                '<th scope="col">#</th>\n'+
                '<th scope="col">Operation number</th>\n'+
                '<th scope="col">Title</th>\n'+
                //'<th scope="col">Project number</th>\n'+
                //'<th scope="col">Sector code</th>\n'+
                '<th scope="col">Undisbursed</th>\n'+
                '<th scope="col">Δ Disburs.</th>\n'+
                '<th scope="col">Δ Cancel</th>\n'+
              '</tr>\n'+
            '</thead>\n'+
            '<tbody>\n'+
        
		popupTableContent + '\n</tbody>\n</table>';
		
		feature.bindPopup(popupTableContent);
		
		if (counter != 0 && (!minCountry || counter < minCountry))
			minCountry = counter;
		if (!maxCountry || counter > maxCountry)
			maxCountry = counter;
		

	});
	
	//**CLOSING STUFFF***
	totals.updateHTML();
	$('#loadedAlert').show();
	$('#loadedMsg')[0].innerHTML = "A total of " + totals.approved.counter + " IDB Lab project / approvals / sub-operations were loaded.";
	
	//SCALE CHOROPLETH
	choroplethScaler.base = Math.max(0,minCountry -2);
	choroplethScaler.ratio = Math.max(0.067,(maxCountry-minCountry)/55);
	
	countriesLayer.resetStyle();
	setTimeout(function(){
			$('#loadedAlert').fadeOut();
	}, 3500);
	
	if (FilteredOperations.features.length > 0 && operationsMarkers.getLayers().length > 0)
		map.flyToBounds(operationsMarkers.getBounds(), {maxZoom:6});
	
	if (!intro_shown) {
		intro_shown = true;
		var skipIntro = $.urlParam('SKIP') || $.urlParam('skip') || false;
		if (!skipIntro) {
			setTimeout(function(){
				startIntro();
			}, 789);
		}
	};
	
	chartWindow.refresh();
	
};

$('.custom-select').change(function(e) {
	var dirty = 0;
	
	$('div.input-group label').removeClass('text-white');
	$('div.input-group select').removeClass('text-white');
	$('div.input-group label').removeClass('bg-dark');
	$('div.input-group select').removeClass('bg-dark');

	$( ".custom-select option:selected" ).each(function() {   //$(e.currentTarget)[0];
		var option_selected = $(this);
		for (i = 1; i < 4; i++) {
			var prop = option_selected.data('att-'+i);
			var val = option_selected.data('val-'+i);	
			//console.log(i + ') '+ prop + ' = ' + val + '?');
			dirty = Filters.apply(prop, val) || dirty;
		};

		if (0 != option_selected.val()) {
			var ig = $(this).parents("div.input-group");
			var label = ig.find('label');
			var slect = ig.find('select');
		
			slect.addClass('text-white');
			label.addClass('text-white');
			slect.addClass('bg-dark');
			label.addClass('bg-dark');
		};
	});

	if (dirty == 1) {
		Filters.updateInfoText();
		joinData();
	}
});

$('#GSELECT_SECTOR_CD').change(function() {
	$( "#GSELECT_SECTOR_CD option:selected" ).each(function() {

		var filter = $(this).data('val-1');
		
		$('#GSELECT_SECTOR option').each(function() {

		  if ($(this).data('sector-filter') == 'ALL' || $(this).data('sector-filter') == filter) {
			$(this).show();
		  } else {
			$(this).hide();
		  }
		 
		});

		if ($('#GSELECT_SECTOR').val() != 0 ) {

			setTimeout(function(){
				$('#GSELECT_SECTOR').val(0);
				$('#GSELECT_SECTOR').change()
			}, 800);
		}

	});

});

$('#GSELECT_SECTOR_CD').trigger('change');

$(function(){
    $('.table').each(function(){
        $(this).css('cursor','pointer').hover(
            function(){ 
                $(this).addClass('active'); 
            },  
            function(){ 
                $(this).removeClass('active'); 
            }).click( function(e){ 
                var target  = e.target;
				var index = $(target).parent().attr('data-index');
				if (index && mydatatablejson[index] && mydatatablejson[index].IDGEOJSON
					&& operations.features && operations.features[mydatatablejson[index].IDGEOJSON])
				{

					chartWindow.toggle('show');
					idblabchart.drawOperationYear(operations.features[mydatatablejson[index].IDGEOJSON].properties);
				}
            }
        );
    });
});

function operationFilter(feature, layer) {
  if (feature.properties.OPERATION_NUMBER === OPERATION_NUMBER_FILTER) return true;
};

var openChart = function(operation_number){
	
	var op = operations.features.filter(operation => operation.properties.OPERATION_NUMBER == operation_number);
	
	if (op && op.length && op.length >= 1) {
		chartWindow.toggle('show');
		idblabchart.drawOperationYear(op[0].properties);
	}
	
};
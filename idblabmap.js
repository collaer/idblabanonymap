        var IDBLabHQ = {lat: 38.89943694195807, lng: -77.03052163124086};
		
		var map = L.map('map',{
          zoomControl: false
        }).setView(IDBLabHQ,10);

		
		var total = function(id){
			var delta = function(me) {
				return me.delta_positif + me.delta_negatif;
			};
			
			var add_operation = function(me, v0, v1) {	
				v0 = (v0 == null || v0 == ""? 0.0 : parseFloat(v0));
				v1 = (v1 == null || v1 == ""? 0.0 : parseFloat(v1));
				
				me.val_year0 += v0;
				me.val_year1 += v1;
				var dlta = v1-v0;
				if (dlta > 0)
					me.delta_positif += dlta;
				else
					me.delta_negatif += dlta;
				me.counter++;
				return 1;
			}
			
			id=id;
			return {
				val_year0:0
				,val_year1:0
				,delta_positif:0
				,delta_negatif:0
				,delta: function() { return delta(this);}
				,add_one_operation:function(v0,v1) {
					return add_operation(this, v0, v1);
				}
				,counter:0
				,id:id
				,getId: function(i) { 
					return '#'+this.id+'-'+i;
				}
			}
			
		};
		
		var totals = {
			approved : new total('appvr')
			,undisbursed : new total('undisb')
			,disbursed : new total('disb')
			,cancelled : new total('cncl')
			,refresh: function() {
				this.approved = new total('appvr');
				this.undisbursed = new total('undisb');
				this.disbursed = new total('disb');
				this.cancelled = new total('cncl');
			}
			,updateHTML: function() {
				$('#nbTransactions').html(this.approved.counter);
				$(this.approved.getId(1)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current approved amounts in the End Of Month balance of last day of ' + YEARO + new Money(this.approved.val_year0) + ' USD.">' + new MoneyHumanReadable(this.approved.val_year0) + '</div>'));
				$(this.approved.getId(2)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current approved amounts in the End Of Month balance of last day of ' + YEAR + new Money(this.approved.val_year1) + ' USD.">' + new MoneyHumanReadable(this.approved.val_year1) + '</div>'));
				$(this.approved.getId(3)).html($('<div data-toggle="tooltip-dynamic" data-placement="right" title=" + ' + new Money(this.approved.delta_positif) + ' USD and ' + new Money(this.approved.delta_negatif) + ' USD.">' + new MoneyHumanReadable(this.approved.delta()) + ' <span class="fas fa-info-circle fa-xs"></span></div>'));

				$(this.undisbursed.getId(1)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current undisbursed amounts in the End Of Month balance of last day of ' + YEARO + new Money(this.undisbursed.val_year0) + ' USD.">' + new MoneyHumanReadable(this.undisbursed.val_year0) + '</div>'));
				$(this.undisbursed.getId(2)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current undisbursed amounts in the End Of Month balance of last day of ' + YEAR + new Money(this.undisbursed.val_year1) + ' USD.">' + new MoneyHumanReadable(this.undisbursed.val_year1) + '</div>'));
				$(this.undisbursed.getId(3)).html($('<div data-toggle="tooltip-dynamic" data-placement="right" title=" + ' + new Money(this.undisbursed.delta_positif) + ' USD and ' + new Money(this.undisbursed.delta_negatif) + ' USD.">' + new MoneyHumanReadable(this.undisbursed.delta()) + ' <span class="fas fa-info-circle fa-xs"></span></div>'));
				
				$(this.disbursed.getId(1)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current disbursed amounts in the End Of Month balance of last day of ' + YEARO + new Money(this.disbursed.val_year0) + ' USD.">' + new MoneyHumanReadable(this.disbursed.val_year0) + '</div>'));
				$(this.disbursed.getId(2)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current disbursed amounts in the End Of Month balance of last day of ' + YEAR + new Money(this.disbursed.val_year1) + ' USD.">' + new MoneyHumanReadable(this.disbursed.val_year1) + '</div>'));
				$(this.disbursed.getId(3)).html($('<div data-toggle="tooltip-dynamic" data-placement="right" title=" + ' + new Money(this.disbursed.delta_positif) + ' USD and ' + new Money(this.disbursed.delta_negatif) + ' USD.">' + new MoneyHumanReadable(this.disbursed.delta()) + ' <span class="fas fa-info-circle fa-xs"></span></div>'));
				
				$(this.cancelled.getId(1)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current cancelled amounts in the End Of Month balance of last day of ' + YEARO + '.">' + new MoneyHumanReadable(this.cancelled.val_year0) + '</div>'));
				$(this.cancelled.getId(2)).html($('<div data-toggle="tooltip-dynamic" data-placement="top" title="Sum of current cancelled amounts in the End Of Month balance of last day of ' + YEAR + ' or last one available (depend of current date).">' + new MoneyHumanReadable(this.cancelled.val_year1) + '</div>'));
				$(this.cancelled.getId(3)).html($('<div data-toggle="tooltip-dynamic" data-placement="right" title=" + ' + new Money(this.cancelled.delta_positif) + ' USD and ' + new Money(this.cancelled.delta_negatif) + ' USD.">' + new MoneyHumanReadable(this.cancelled.delta()) + ' <span class="fas fa-info-circle fa-xs"></span></div>'));
				
				$(function () {
					$('[data-toggle="tooltip-dynamic"]').tooltip()
				});

			}
		};



		var Filters = new FiltersClass({
			attributes  : [
				new FilterAttribute({attribute:'PRODUCT_CD',type:'IN'})
				,new FilterAttribute({attribute:'SECTOR_CD',type:'='})
				,new FilterAttribute({attribute:'REGION_CD',type:'='})
				,new FilterAttribute({attribute:'WAS_OPEN',type:'='})
				,new FilterAttribute({attribute:'WAS_CLOSED',type:'IN'})
				,new FilterAttribute({attribute:'SECTOR',type:'='})
				,new FilterAttribute({attribute:'NO_TRANSACTIONS',type:'='})
				,new FilterAttribute({attribute:'FOCUS_CD',type:'='})
				,new FilterAttribute({attribute:'STATUS_CD_DIC',type:'IN'})
				,new FilterAttribute({attribute:'LENDING_INSTRMNT_CD',type:'='})
				,new FilterAttribute({attribute:'STATUS_SELECT',type:'IN'})
				,new FilterAttribute({attribute:'ISO_A3',type:'='})
				,new FilterAttribute({attribute:'FINANCIAL_INSTRUMENT_CD',type:'='})
				,new FilterAttribute({attribute:'FUND_CD',type:'IN'})
				,new FilterAttribute({attribute:'OPERATION_SPECIALIST',type:'='})
				,new FilterAttribute({attribute:'PROJECT_NUMBER',type:'IN'})
			],
			infoSelector : '#filters_info'
		});


	/*
		function logResults(json){
		  console.log(1);
		}

		$.ajax({
		  url: "https://convergefnce.iadb.org/Mainframe/SearchOperations?q=hello",
		  dataType: "jsonp",
		  jsonpCallback: "logResults"
		});
	*/

	var WeHaveAccessToConvergence = true;
	
	var linkProjectFormatter = function (value, row, index) {
		return [
				'<a href="',
				(WeHaveAccessToConvergence?'https://convergence.iadb.org/Operation/':'https://www.iadb.org/en/project/'),
				row.PROJECT_NUMBER,
				'" title="Open operation details ',
				row.PROJECT_NUMBER,
				' in antoher window." target="_blank">',
				value,
				'</a>'].join('');
	};
	
	var moneyFormatter = function (value, row, index) {
		return new Money(value) + ' $';
	};


        var mapLink =
            '<a href="http://openstreetmap.org">OSM</a> | <a href="https://bidlab.org/en">IDB Lab</a> | <a href="https://github.com/collaer/idblabanonymap">code</a>';
        var baseMap = L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' ',
            maxZoom: 18,
            });
		
		baseMap.addTo(map);
		
		//L.control.layers(null, {'Numbers':numbers}).addTo(map);

        //FROM https://leafletjs.com/examples/extending/extending-3-controls.html

        L.Control.Watermark = L.Control.extend({
            onAdd: function(map) {
                var img = L.DomUtil.create('img');
                img.src = 'https://bidlab.org/sites/default/files/inline-images/animacion-IDB-Lab.gif';
                img.style.width = '200px';
				img.id = "idblab-logo";

                return img;
            },

            onRemove: function(map) {
                // Nothing to do here
            }
        });

        L.control.watermark = function(opts) {
            return new L.Control.Watermark(opts);
        };

        L.control.watermark({ position: 'bottomleft' }).addTo(map);

  
	  

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return (results ? (results[1] || 0) : 0);
};


$(document).ready(function () {
	
	//execute config defined in idblabmap-config.js
	config();
	
	$('#loadedAlert').hide();
	
	setTimeout(function(){
		$('#welcomeAlert').fadeOut();
	}, 2500);
				

	$('#inputGroupSelectSubSector option').each(function() {

	  if ($(this).data('sector-filter') == 'ALL') {
		$(this).show();
	  } else {
		$(this).hide();
	  }
	 
	});

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
		setTimeout(function(){ map.invalidateSize()}, 400);
    });
	
    $('#chartCollapse').on('click', function () {
		chartWindow.toggle();
    });
	
	$(function () {
	  $('[data-toggle="popover"]').popover();
	});
	
	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	});
	
	
	$(function () {
	  $('[data-toggle="chartWindow"]').on('click', function(e){
		chartWindow.toggle('show');
		chart_id = ($(e.target).is('A') ? e.target.id : ($(e.target).parent().is('A') ? $(e.target).parent()[0].id : "none"));
		idblabchart.draw("chartCanvas", chart_id, mydatatablejson, Filters.getInfoText());
	  })
	});
	
	$('#exampleModalCenter').on('show.bs.modal', function (e) {

		$('#datatable').bootstrapTable(
			'load', mydatatablejson
		);

	});
	
	var setDefault = $.urlParam('DEFAULT') || $.urlParam('default') || false;
	if (setDefault) {
		$("#GSELECT_FUND_CD_SELECT").val(-1);
		$("#GSELECT_WAS_CLOSED").val(1);
		$("#GSELECT_FINANCIAL_INSTRUMENT_CD_SELECT").val(-1);
		
	} else {
		$("#GSELECT_FUND_CD_SELECT").val(0);
		$("#GSELECT_WAS_CLOSED").val(0);
		$("#GSELECT_FINANCIAL_INSTRUMENT_CD_SELECT").val(0);
	}
	
	$("#GSELECT_STATUS_SELECT").val(0);
	$("#GSELECT_FOCUS_CD").val(0);
	$("#GSELECT_REGION_CD").val(0);
	$("#GSELECT_ISO_A3").val(0);
	$("#GSELECT_SECTOR_CD").val(0);
	$("#GSELECT_SECTOR").val(0);
	$("#GSELECT_PRODUCT_CD").val(0);
	$("#GSELECT_LENDING_INSTRMNT_CD").val(0);
	$("#GSELECT_STATUS_CD_DIC").val(0);
	$("#GSELECT_OPERATION_SPECIALIST").val(0);
	
	$('#removeAllFilter').on('click', function () {
		$("#GSELECT_STATUS_SELECT").val(0);
		$("#GSELECT_WAS_CLOSED").val(0);
		$("#GSELECT_FOCUS_CD").val(0);
		$("#GSELECT_REGION_CD").val(0);
		$("#GSELECT_ISO_A3").val(0);
		$("#GSELECT_SECTOR_CD").val(0);
		$("#GSELECT_SECTOR").val(0);
		$("#GSELECT_PRODUCT_CD").val(0);
		$("#GSELECT_LENDING_INSTRMNT_CD").val(0);
		$("#GSELECT_STATUS_CD_DIC").val(0);
		$("#GSELECT_FUND_CD_SELECT").val(0);
		$("#GSELECT_FINANCIAL_INSTRUMENT_CD_SELECT").val(0);		
		$("#GSELECT_OPERATION_SPECIALIST").val(0);		
		$('.custom-select').trigger('change');
		if (idblabchart.charts['chartCanvas']) 
			$('.custom-select-chart').trigger('change');
	});
	
	
	$(function () {
		var $table = $('#datatable');
		$('#toolbar-table').find('select').change(function () {
		$table.bootstrapTable('refreshOptions', {
		  exportDataType: $(this).val()
		});
	  });
	});

	$('.alert .close').on('click', function(e) {
		$(this).parent().hide();
	});
	
	$('.custom-select-chart').change(function(e) {
		chartWindow.refreshCustom();
	});
	
	//Filter by country by URL param
	$("#GSELECT_ISO_A3").val($.urlParam('country') || $.urlParam('ISO_A3'));

});

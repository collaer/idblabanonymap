/*
 * FilterAttribute Class
 */
var FilterAttribute = function(options){
 
    /*
     * Private
	 * Variables accessible
     * in the class
     */
	 var vars = {
		attribute:''
		,type:''
		,label:''
		,value:''
    };
	
	this.getAttribute = function() { return vars.attribute; };
	this.getLabel = function() { return vars.label; };
	this.getValue = function() { return vars.value; };
	this.setValue = function(val) { return vars.value=val; };

	
	var typeList = ['=', 'IN'];

    /*
     * Private method createLabel
     * Can only be called inside class
     */
    var createLabel = function(options) {
		return options.attribute + ' ' + options.type;
    };
	
 
    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;
 
    /*
     * Constructor
     */
    this.construct = function(options){
		
		options.label = options.label || 
			createLabel(options);
		
        $.extend(vars , options);
		
    };
 
     /*
     * getLabel Public method
     * Can be called outside class
     */
    this.getLabel = function(){
		if (vars.value !== '')
			return vars.label + ' ' + vars.value;
		return false;
	}


    /*
     * Check Public method
     * Can be called outside class
     */
    this.check = function(properties){
		//console.log('check if '+properties+ ' is okay agaisnt ' + vars.attribute + ' @ '+ vars.value);
		isOk = false;
		switch(vars.type){
			case '=':
				isOk = (vars.value === '' || properties[vars.attribute] == vars.value);
			break;
			case 'IN':
				isOk = (
					vars.value === '' || 
					vars.value.includes("" + properties[vars.attribute] + "") 
				);
				//console.log(vars.value + ' include ' + properties[vars.attribute]);
			break;
			default:
				console.log('Error: undefined filter type!');
		}
		return isOk;
    };
 

 
    /*
     * Pass options when class instantiated
     */
    this.construct(options);
 
};




/*
 * Filters Class
 */
var FiltersClass = function(options){
 
    var vars = {
        attributes  : []
		,infoSelector : '#filters_info'
		,noFilterMsg : 'No filters set'
    };
 
    /*
     * Can access this.method
     * inside other methods using
     * root.method()
     */
    var root = this;
 
    /*
     * Constructor
     */
    this.construct = function(options){
        $.extend(vars , options);
    };
 
    /*
     * Check Public method
     * Can be called outside class
     */
    this.check = function(properties){
		var isOk = true;
		//console.log(properties);
		$.each(vars.attributes, function( idx, attribute) {
			isOk = attribute.check(properties);
			return isOk; //if false go out from the each loop; if true continue the loop
		});
		
		return isOk;
    };

    /*
     * updateInfoText Public method
     * Can be called outside class
     */
    this.updateInfoText = function(){
		$(vars.infoSelector)[0].innerHTML = this.getInfoText();
    };
	
		
    /*
     * updateInfoText Public method
     * Can be called outside class
     */
    this.getInfoText = function(){

		var filterInfoArray = [];
		var separator = ' ';
		var filterInfoText = '';
		
		$.each(vars.attributes, function( idx, attribute) {
			var label = attribute.getLabel();
			if (label)
				filterInfoArray.push(label);
		});

		if (filterInfoArray.length == 0)
			filterInfoText = vars.noFilterMsg;
		else
			filterInfoText = filterInfoArray.join(separator);
		
		return filterInfoText;
	}
	

    /*
     * apply filter Public method
     * Can be called outside class
     */
    this.apply = function(prop, val){
		//console.log('apply ' + prop + ', '+ val);
		if (!prop)
			return false;
		
		var isDirty=false;
		//console.log('lets see if he will change the current filters?');

		$.each(vars.attributes, function(idx, attribute) {
			//console.log(attribute);
			if (attribute.getAttribute() == prop) {
				//console.log(attribute);
				if(attribute.getValue() !== val) {
					//console.log('new val ' + val + ' for ' + prop);
					attribute.setValue(val);
					isDirty = true;
					//console.log('changed---');
					//console.log(attribute);
				}
				return false; //break from each
			}
		});
		//console.log('return dirty ' + isDirty );
		return isDirty;
	}
 
    /*
     * Pass options when class instantiated
     */
    this.construct(options);
 
};

function sortByCountry(a,b) {
	if (a.properties.ISO_A3 === null) a.properties.ISO_A3 = "";
	if (b.properties.ISO_A3 === null) b.properties.ISO_A3 = "";
    return (a.properties.ISO_A3.toUpperCase() < b.properties.ISO_A3.toUpperCase()) ? -1 : ((a.properties.ISO_A3.toUpperCase() > b.properties.ISO_A3.toUpperCase()) ? 1 : 0);
};

function getFilteredOperations() {
	FilteredOperations = {
		"type": "FeatureCollection",
		"name": "Operations filtered",
		"features": []
	};
	$.each(operations.features, function(key, operation ) {
		if (Filters.check(operation.properties))
		{
			operation.properties.key = key;
			FilteredOperations.features.push(operation);
		}
	});
	
	FilteredOperations.features = FilteredOperations.features.sort(sortByCountry);
	
	return FilteredOperations
};

var Money = function(amount) {
	this.amount = amount;
};

Money.prototype.valueOf = function() {
	return (Math.round(this.amount*100)/100).toLocaleString();
};

function getTableJSONFromFeature(features) {
	
	var json = [];
	
	$.each(features, function(key, operation ) {
		var jsonoperation={
			PROJECT_NUMBER:operation.properties.PROJECT_NUMBER
			,OPERATION_NUMBER:operation.properties.OPERATION_NUMBER
			,BALANCE_DATE:operation.properties.BALANCE_DATE
			,STATUS: operation.properties.STATUS_CD_DIC
			,PRODUCT_CD:operation.properties.PRODUCT_CD
			,CURRENT_APPROVED_AMNT_USEQ_DIC:operation.properties.CURRENT_APPROVED_AMNT_USEQ_DIC
			,UNDISBURSED_AMNT_USEQ_DIC:operation.properties.UNDISBURSED_AMNT_USEQ_DIC
			,DISBURSED_AMNT_USEQ_DIC:operation.properties.DISBURSED_AMNT_USEQ_DIC
			,DELTA_DISBURSED_AMNT_USEQ:parseFloat(operation.properties.DISBURSED_AMNT_USEQ_DIC) - parseFloat(operation.properties.DISBURSED_AMNT_USEQ_JAN || 0.0)
			,CANCELLED_AMNT_USEQ_DIC:operation.properties.CANCELLED_AMNT_USEQ_DIC
			,DELTA_CANCELLED_AMNT_USEQ:parseFloat(operation.properties.CANCELLED_AMNT_USEQ_DIC) - parseFloat(operation.properties.CANCELLED_AMNT_USEQ_JAN || 0.0)
			,BENEFICIARY_COUNTRY_ENGL_NM:operation.properties.BENEFICIARY_COUNTRY_ENGL_NM
			,REGION_CD:operation.properties.REGION_CD
			,FOCUS_NM:operation.properties.FOCUS_NM
			,FOCUS_CD:operation.properties.FOCUS_CD
			,SECTOR_ENGL_NM:operation.properties.SECTOR_ENGL_NM
			,WAS_OPEN:operation.properties.WAS_OPEN
			,WAS_CLOSED:operation.properties.WAS_CLOSED
			,NO_TRANSACTIONS:operation.properties.NO_TRANSACTIONS
			,LENDING_INSTRMNT_CD:operation.properties.LENDING_INSTRMNT_CD
			,ISO_A3:operation.properties.ISO_A3
			,SECTOR_CD:operation.properties.SECTOR_CD
			,IDGEOJSON:operation.properties.key
			,O0:(operation.properties.WAS_OPEN == "1" ? 0 : 1)
			,O12:(operation.properties.WAS_CLOSED == "1" || operation.properties.WAS_CLOSED == "CO" || operation.properties.WAS_CLOSED == "CF" || operation.properties.WAS_CLOSED == "CA" ? 0 : 1)
			,A0:operation.properties.A0
			,A12:(operation.properties.A12?operation.properties.A12:operation.properties.A11)
			,C0:operation.properties.C0
			,C12:(operation.properties.C12?operation.properties.C12:operation.properties.C11)
			,U0:operation.properties.U0
			,U12:(operation.properties.U12?operation.properties.U12:operation.properties.U11)
			,D0:operation.properties.D0
			,D12:(operation.properties.D12?operation.properties.D12:operation.properties.D11)
			,ST0:operation.properties.ST0
			,ST12:(operation.properties.ST12?operation.properties.ST12:operation.properties.ST11)
		};
		
		json.push(jsonoperation);
	});
	
	return json;
};
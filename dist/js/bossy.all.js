function CalendarController($scope){function getStandardTime(date){return{raw:date,year:date.getFullYear(),monthName:getMonthName(date.getMonth()),month:date.getMonth(),day:getDayName(date),date:date.getDate(),time:date.getTime()}}function getTimeObjectIfDate(date){return angular.isDate(new Date(date))?getStandardTime(new Date(date)):!1}function setConfigOptions(){$scope.config=$scope.config||{},$scope.config.start=getTimeObjectIfDate($scope.config.start),$scope.config.end=getTimeObjectIfDate($scope.config.end),options=angular.extend({},defaults,$scope.config)}function dayIsOutOfRange(_date){var hasRange=options.start&&options.end;return hasRange&&(_date.time<options.start.time||_date.time>options.end.time)?!0:options.start&&_date.time<options.start.time?!0:options.end&&_date.time>options.end.time?!0:void 0}function setSelectedDate(date){$scope.selected=getStandardTime(date),$scope.ngModel=$scope.selected.raw}function setCurrentMonthAndYear(month,year){var date=new Date(void 0!==year?year:$scope.selected.year,void 0!==month?month:$scope.selected.month,1);$scope.current=getStandardTime(date)}function getMonthName(month){return $scope.months[month]}function getDayName(date){return $scope.days[date.getDay()]}function initialize(){setConfigOptions(),setSelectedDate($scope.ngModel||new Date),setCurrentMonthAndYear(),$scope.updateDateMap()}var options={},defaults={},universal={DAY:864e5,HOUR:36e5};$scope.days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],$scope.months=["January","February","March","April","May","June","July","August","September","October","November","December"],$scope.previousMonth=function(){var date=new Date($scope.current.year,$scope.current.month-1,1);setCurrentMonthAndYear(date.getMonth(),date.getFullYear()),$scope.updateDateMap()},$scope.nextMonth=function(){var date=new Date($scope.current.year,$scope.current.month+1,1);setCurrentMonthAndYear(date.getMonth(),date.getFullYear()),$scope.updateDateMap()},$scope.selectDate=function(time){var date=getStandardTime(new Date(time));dayIsOutOfRange(date)||(date.month!==$scope.current.month&&(setCurrentMonthAndYear(date.month,date.year),$scope.updateDateMap()),setSelectedDate(new Date(time)))},$scope.updateDateMap=function(){var rawCurrentDay=$scope.current.raw.getDay()*universal.DAY,firstWeekDay=new Date($scope.current.time-rawCurrentDay),isMonthComplete=!1;for($scope.dateMap=[];!isMonthComplete;){var week=[];5===$scope.dateMap.length&&(isMonthComplete=!0);for(var weekDay=0;7>weekDay;weekDay++){var rawThisDate=firstWeekDay.getTime()+weekDay*universal.DAY,thisDate=new Date(rawThisDate);23===thisDate.getHours()?thisDate=new Date(thisDate.getTime()+universal.HOUR):1===thisDate.getHours()&&(thisDate=new Date(thisDate.getTime()-universal.HOUR));var date=getStandardTime(thisDate);date.dayInMonth=thisDate.getMonth()===$scope.current.raw.getMonth()?"day-in-month":"",date.disabledDay=dayIsOutOfRange(date)?"disabled-day":"",week.push(date)}firstWeekDay=new Date(firstWeekDay.getTime()+7*universal.DAY),$scope.dateMap.push(week)}},initialize()}function Calendar(){var template='<table><tr><td ng-click="previousMonth()" title="Previous month" class="p">&lt;</td><td colspan="5">{{current.monthName}} {{current.year}}</td><td ng-click="nextMonth()" title="Next month" class="p">&gt;</td></tr><tr><td ng-repeat="day in days" title="{{day}}">{{day | limitTo : 2}}</td></tr><tr ng-repeat="week in dateMap"><td ng-repeat="current in week" ng-click="selectDate(current.time)" class="{{current.dayInMonth}} {{current.disabledDay}} p">{{current.date}}</td></tr><tr><td colspan="7">{{selected.day}}, {{selected.monthName}} {{selected.date}}, {{selected.year}}</td></tr></table>';return{restrict:"AE",scope:{config:"="},template:template,controller:CalendarController}}function Chart(){function _controller($scope,$filter){var config={max:0,height:200,width:200,xLabel:void 0,yLabel:void 0};$scope.config=angular.extend({},config,$scope.config),$scope.type=$scope.type||"bar",$scope.template=templates[$scope.type],"line"===$scope.type&&(config.max=$filter("orderBy")($scope.data,"-value")[0].value,angular.forEach($scope.data,function(line,index){line.x1=parseInt(index/$scope.data.length*config.width),line.y1=parseInt(($scope.data[index-1]?$scope.data[index-1].value:0)/config.max*config.height),line.x2=parseInt((index+1)/$scope.data.length*config.width),line.y2=parseInt(line.value/config.max*config.height)}))}var templates={base:'<div class="chart" style="width:{{width}}px; height:{{height}}px;">   <div class="y" style="width:{{height}}px;">{{yLabel}}</div>   <div class="x">{{xLabel}}</div></div>',line:'<svg style="width:{{config.width}}px; height:{{config.height}}px;">   <line        ng-repeat="line in data"        ng-attr-x1="{{line.x1}}"       ng-attr-y1="{{line.y1}}"       ng-attr-x2="{{line.x2}}"       ng-attr-y2="{{line.y2}}">   </line></svg>',dot:'<div   ng-repeat="dot in data"   class="dot"   style="bottom:{{dot.value / max * height}}px; left:{{($index + 0.5) / data.length * width}}px;"></div>',bar:'<svg style="width:{{config.width}}px; height:{{config.height}}px;">   <rect        ng-repeat="bar in data"       x="{{$index * (config.width / data.length)}}"       y="{{config.height - bar}}"       data-index="{{$index}}"       width="{{config.width / data.length}}"       height="{{bar}}"       style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"></svg>'};return _controller.$inject=["$scope","$filter"],{restrict:"E",replace:!0,scope:{type:"@",config:"=",data:"="},template:templates.base,compile:function(element,attrs){var type=attrs.type||"bar";element.html(templates[type])},controller:_controller}}var bossy=angular.module("bossy",["bossy.calendar","bossy.data","bossy.form","bossy.graph","bossy.input","bossy.schema"]);angular.module("bossy.data",[]).factory("$data",["$q","$http","$scope",function($q,$http,$scope){function _getData(data){return angular.isString(data)?_getRemoteData(data):angular.isObject(data)?data:angular.isFunction(data)?_getData(data.call($scope)):void console.error("directive.bossyForm: no data url or object given")}function _getRemoteData(data){var deferred=$q.defer();return $http.get(data,{responseType:"json"}).success(function(data){angular.isObject(data)?deferred.resolve(data):deferred.reject("directive.bossyForm: GET request to url did not produce data object")}).error(function(responseData,status){deferred.reject('directive.bossyForm: GET request to url "'+data+'" failed with status "'+status+'"')}),deferred.promise}return{getData:_getData}}]),angular.module("bossy.schema",[]).factory("$schema",["$q","$http",function($q,$http){function _getSchema(schema){return angular.isString(schema)?_getRemoteSchema(schema):angular.isObject(schema)?schema:void console.error("directive.bossyForm: no schema url or object given")}function _getRemoteSchema(schema){var deferred=$q.defer();return $http.get(schema).success(function(data){angular.isObject(data)?deferred.resolve(data):deferred.reject("directive.bossyForm: GET request to url did not produce schema object")}).error(function(data,status){deferred.reject('directive.bossyForm: GET request to url "'+schema+'" failed with status "'+status+'"')}),deferred.promise}return{getSchema:_getSchema}}]),Calendar.$inject=[],CalendarController.$inject=["$scope"],angular.module("bossy.calendar",[]).controller("bossyCalendarController",CalendarController).directive("bossyCalendar",Calendar),angular.module("bossy.form",[]).run(function($templateCache){$templateCache.put("bossy-input.html","templates/bossy-input.html")}).directive("bossyForm",["$compile","$http","$schema","$data",function($compile,$http,$schema,$data){function setData(data){var result=$data.getData(data);return angular.isFunction(result.then)&&angular.isFunction(result["catch"])&&angular.isFunction(result["finally"])?result:void(_data=result)}function setSchema(schema){_schema=$schema.getSchema(schema)}function buildTemplate(schemaPart,parentKey,required){var template="",fullKey="";return angular.forEach(schemaPart,function(value,key){if(value.type)switch(console.log(fullKey+" is "+value.type),value.type){case"object":var requiredList="undefined"!=typeof value.required?value.required:null;template+=buildTemplate(value.properties,fullKey,requiredList);break;case"array":template+=buildTemplate(value.items.properties,fullKey);break;case"number":template+=_itemTemplate.number(value);break;case"string":var isRequired=!1;required&&-1!==required.indexOf(key)&&(isRequired=!0),template+=_itemTemplate.text(value,key,isRequired);break;case"boolean":template+=_itemTemplate.checkbox(value)}},this),template}var _schema,_data,_options={showLabels:!0,header:"This is header",footer:"This is footer",theme:"green",button:"Save"},_itemTemplate={number:function(){return'<input type="number"/>'},text:function(obj,key,isRequired){return"<bossy-input title=\"'"+obj.title+"'\" type=\"'"+obj.inputType+"'\" value=\"'"+_data.address[key]+"'\""+(isRequired?" required":"")+"></bossy-input>"},textArea:function(){return"<textarea></textarea>"},checkbox:function(obj){return'<div class="checkbox"><label><input type="checkbox">'+obj.title+"</label></div>"}};return{restrict:"E",replace:!0,template:"",scope:{config:"=",title:"="},link:function(scope,element,attributes){scope.config.options=angular.extend(_options,scope.config.options);var promise=setData(scope.config.data);setSchema(scope.config.schema),promise?(promise.then(function(result){_data=result,element.html('<form novalidate class="{{config.options.theme}}"><div class="banner page-header"><h3>{{config.options.header}}</h3></div>'+buildTemplate(_schema)+'<button ng-if="config.options.button">{{config.options.button}}</button><div class="page-footer"><h3>{{config.options.footer}}</h3></div></form>'),$compile(element.contents())(scope)},function(reason){}),element.html('<form novalidate class="{{config.options.theme}}">LOADING...</form>'),$compile(element.contents())(scope)):(element.html('<form novalidate class="{{config.options.theme}}"><div class="banner page-header"><h3>{{config.options.header}}</h3></div>'+buildTemplate(_schema)+'<button ng-if="config.options.button">{{config.options.button}}</button><div class="page-footer"><h3>{{config.options.footer}}</h3></div></form>'),$compile(element.contents())(scope))}}}]),Chart.$inject=[],angular.module("bossy.graph",[]).directive("bossyGraph",Chart),function(){function Input($compile){function _controller($scope,$filter){var config={maxLength:0,height:200,width:200,type:"text",value:"",title:"title",currentLength:0};$scope.config=angular.extend({},config,$scope.config),$scope.data=$scope.config.value,$scope.valueChange=function(val){$scope.config.currentLength>=$scope.config.max&&($scope.config.value=$scope.config.value.substring(0,$scope.config.max-1)),$scope.config.currentLength=val.length}}var templateDefault='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> </div> </fieldset>',templatePrefix='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input class="prefix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> <span class="bossy-input-component bossy-input-prefix">{{config.prefixContent}}</span> </div> </fieldset>',templatePostfix='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <input class="postfix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}"/> <span></span> <span class="bossy-input-component bossy-input-postfix">{{config.postfixContent}}</span> </div> </fieldset>',templateCounter='<fieldset class="bossy-fieldset"> <legend class="bossy-legend">{{config.title}}</legend> <div class="bossy-input"> <span class="counter"><span class="inc">{{config.currentLength}}</span>/{{config.max}}</span> <input class="postfix" type="{{config.type}}" placeholder="{{config.placeholder}}" value="{{config.value}}" ng-model="config.value" ng-change="valueChange(config.value)"/> <span></span> <span class="bossy-input-component bossy-input-postfix">{{config.postfixContent}}</span> </div> </fieldset>',getTemplate=function(templateType){var template="";switch(templateType){case"prefix":template=templatePrefix;break;case"postfix":template=templatePostfix;break;case"counter":template=templateCounter;break;default:template=templateDefault}return template};return _controller.$inject=["$scope","$filter"],{restrict:"E",replace:!0,scope:{config:"="},link:function(scope,element,attrs){element.html(getTemplate(scope.config.templateType)),$compile(element.contents())(scope)},template:templateDefault,controller:_controller}}Input.$inject=["$compile"],angular.module("bossy.input",[]).directive("bossyInput",Input)}();
//# sourceMappingURL=../maps/bossy.all.js.map
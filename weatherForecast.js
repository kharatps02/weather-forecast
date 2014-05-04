/*
*  Author : Popat
*  Date   :4th May 2014
*  Desc   :created module for show the the weather forecast for the 14 days for each city .
*/

// Created module wfApp .
var wfApp=angular.module("wfApp",[]) ;

// Added service dataService .
wfApp.service('dataService',function($http){
  
      delete $http.defaults.headers.common['X-Requested-With'];
      // request for fetch forecast weather information from openweathermap domain .
      this.fetchData=function(iParam,fetchDataCB){
        
        $http({method:iParam.method, url:iParam.url}).
          success(function(data, status, headers, config) {
              //console.log("In fetchData, success .");
              //console.log(data);
              if(fetchDataCB)fetchDataCB(null,data);
          }).
          error(function(data, status, headers, config) {
              console.log("In fetchData, error .");
              if(fetchDataCB)fetchDataCB(status,null);
          });
    }
});

// Added controller weatherForecast on wfApp . 
wfApp.controller('weatherForecast',function($scope,APP_ID,dataService){
      
      var baseQueryStr    ="http://api.openweathermap.org/data/2.5/forecast/daily?APPID"+$scope.appId+"&cnt=14&mode=json&units=metric&type=accurate"; 
      $scope.dataArrayStore   =[];
      
      $scope.loadDataByCityNames=function(){
           
           var queryStr=null,cityNames=[],cityNameStr=null;   

           $scope.showMsg       = '';
           $scope.dataArrayStore= [];
           $scope.appId         = APP_ID;

           cityNameStr=$scope.cityName.toLowerCase();

           if(typeof cityNameStr === "string" && cityNameStr ===undefined){
                $scope.showshowMsg('Enter valid city name.')
                return;
           }else{
                // Convert city string into clity array .
                cityNames=cityNameStr.split(',');
                // Remove duplicate city name and any(pre/post)space with city name. 
                cityNames=cityNames.filter(function(elem, pos, self) {
                        elem=elem.trim();
                        self[pos]=elem;
                     return self.indexOf(elem) == pos;
                });
          }
          // iterate all city and load there data .
          cityNames.forEach(function(city){
                queryStr =baseQueryStr+"&q="+city;
                $scope.loadDataByUrl(queryStr);
          });
    };

    $scope.loadDataByUrl=function (iURL,iLoadDataByUrlCB)  {
          dataService.fetchData({method:'GET',url:iURL},function(error,data){
          //console.log('In fetchData callback');
            if(!error){
                  if($scope.dataArrayStore.length ===0 && data.message === '')
                      $scope.showshowMsg();
                  else{
                      $scope.dataArrayStore.push(data);
                      if(iLoadDataByUrlCB)iLoadDataByUrlCB();
                    }                      
            }
            else
              if($scope.dataArrayStore.length ===0) 
                 $scope.showshowMsg();
          });
    }

    $scope.showshowMsg=function(msg){
        $scope.showMsg=msg || "data not found !";
    }

    $scope.loadDataByCurrentCity=function(){
      console.log('In loadDataByCurrentCity .');
     if (window.navigator.geolocation) 
      window.navigator.geolocation.getCurrentPosition(function (location) {
        if(location.coords.latitude && location.coords.longitude){
              var queryStr =baseQueryStr+"&lat="+location.coords.latitude+"&lon="+location.coords.longitude; 
              console.log('request for queryStr :'+queryStr);
              $scope.loadDataByUrl(queryStr,function(){
                  $scope.cityName=$scope.dataArrayStore[0].city.name;                        
              });
        }
       },function(error){
          console.log('Error in getCurrentPosition');
          console.log(error);
       });
    };
    // get current city and loadData .
    $scope.loadDataByCurrentCity();
});

// Set Constant variable APP_ID on module wfApp
wfApp.constant('APP_ID','f572a0ee4ad1a72d08646d708bafb345');


//helper functions
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

Object.getDevicesByAlert = function(obj,key){
    var deviceArray = {high:[],low :[],medium :[]};
    for(var datakey in obj){
        //console.log(obj[datakey].aqi);
        for(var datakey1 in obj[datakey].aqi ){
            if(obj[datakey].aqi[datakey1].key == key && obj[datakey].aqi[datakey1].alert_code == 1){
                obj[datakey].aqi[datakey1]['deviceid'] = datakey;
                deviceArray.low.push(obj[datakey].aqi[datakey1]);
            }
            if(obj[datakey].aqi[datakey1].key == key && obj[datakey].aqi[datakey1].alert_code == 2){
                obj[datakey].aqi[datakey1]['deviceid'] = datakey;
                deviceArray.medium.push(obj[datakey].aqi[datakey1]);
            }
            if(obj[datakey].aqi[datakey1].key == key && obj[datakey].aqi[datakey1].alert_code == 3){
                obj[datakey].aqi[datakey1]['deviceid'] = datakey;
                deviceArray.high.push(obj[datakey].aqi[datakey1]);
            }
        }
    }
   return deviceArray;
}
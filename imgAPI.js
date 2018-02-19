// created by Josh
$(document).ready( initializeApp );
var ajaxOptions = {
    url: 'https://www.googleapis.com/customsearch/v1',
    method: "GET",
    dataType: "JSON",
    data: {
        q: 'carne asada',
        cx: '000707611873255015719:e0z9hyzysu4',
        searchType: 'image',
        key: 'AIzaSyBQWFoSuCzyIqJj0Kiyc_QEgPUcucNhImM'
    },
//   success: function(data) {
//     console.log(data);
// //     console.log(data.items[0].link);
//   },
    error: function(data) {
        console.log(data);
    }

};

function  initializeApp() {
$.ajax(ajaxOptions).then(bestTacoImg);
}

function bestTacoImg(data) {
    console.log(data);
    var qArray = data.items;

    for(var qI = 0; qI < qArray.length; qI++) {

        if(qArray[qI].title.indexOf("aco") !== -1) {
            console.log(qArray[qI].link);
            return;
        }
    }
}
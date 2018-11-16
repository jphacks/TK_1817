var params = [];

$(document).on('turbolinks:load', function () {

    // Getting params
    // (ref: https://www.tam-tam.co.jp/tipsnote/javascript/post9911.html )
    var urlParam = location.search.substring(1);

    if (urlParam) {
        var param = urlParam.split('&');

        for (i = 0; i < param.length; i++) {
            var paramItem = param[i].split('=');
            params[paramItem[0]] = paramItem[1];
        }
    }
});
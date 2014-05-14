/**
 * Created by Neher on 2014/5/14.
 */
function init(d) {
    $.get("/p/chart/data?k=" + d.k + "&t=" + d.t+"&s=" + d.start+"&e=" + d.end+"&f="+ d.flag, function (data) {
        data["c1"] = d.c1.replace(":", "_");
        data["c2"] = d.c2.replace(":", "_");
        data["cid"] = d.cid.replace(":", "_");
        data["t"] = d.t;
        insertData(data);
    });
}

function insertData(data) {
    var c1 = data.c1;
    var c2 = data.c2;
    var cid = data.cid;

    var t = data.t;
    var dateFormat = {period: "hh", format: "YYYY-MM-DD JJ:NN:SS"};
    if (t == "b") {
        dateFormat = {period: "hh", format: "YYYY-MM-DD JJ:NN:SS"};
    }
    else if (t == "c") {
        dateFormat = {period: "DD", format: "YYYY-MM-DD JJ:NN:SS"};
    }
    $("#" + cid).html("");

    var chartData = generateChartData(data);
    var callChartData = generateCallChartData(data);
    $("#" + cid).append('<div id="' + c1 + '" style="width: 900px; height: 400px;"></div>');
    $("#" + cid).append('<div id="' + c2 + '" style="width: 900px; height: 400px;"></div>');
    chart = AmCharts.makeChart(c1, {
        "type": "serial",
        "theme": "none",
        "pathToImages": "http://www.amcharts.com/lib/3/images/",
        "legend": {
            "equalWidths": false,
            "useGraphSettings": true,
            "valueAlign": "left",
            "valueWidth": 50
        },
        "dataProvider": chartData,
        "valueAxes": [
            {
                "id": "tp99Axis",
                "axisColor": "#B0DE09",
                "axisThickness": 2,
                "axisAlpha": 1,
                "gridAlpha": 0,
                "offset": 0,
                "position": "left",
                "title": "time"
            }
        ],
        "graphs": [
            {
                "valueAxis": "tp50Axis",
                "lineColor": "#FCD202",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 10,
                "title": "tp50",
                "valueField": "tp50",
                "balloonText": "tp50:<b>[[value]]</b><br>tp90:<b>[[tp90]]</b><br>tp99:<b>[[tp99]]</b><br>tp999:<b>[[tp999]]</b>",
                "tp90Field": "tp90",
                "tp99Field": "tp99",
                "tp999Field": "tp999",
                "urlField": "url",
                "legendValueText": "[[value]] s",
                "labelPosition": "bottom"
            },
            {
                "valueAxis": "tp90Axis",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 10,
                "title": "tp90",
                "valueField": "tp90",
                "showBalloon": false,
                "legendValueText": "[[value]] s"
            },
            {
                "valueAxis": "tp99Axis",
                "lineColor": "#B0DE09",
                "bullet": "triangleUp",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 10,
                "title": "tp99",
                "valueField": "tp99",
                "showBalloon": false,
                "legendValueText": "[[value]] s"
            },
            {
                "valueAxis": "tp999Axis",
                "lineColor": "#FF6600",
                "bullet": "triangleDown",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 10,
                "title": "tp999",
                "valueField": "tp999",
                "showBalloon": false,
                "legendValueText": "[[value]] s"
            }
        ],
        "chartScrollbar": {},
        "chartCursor": {
            "cursorPosition": "mouse"
        },
        "categoryField": "date",
        "categoryAxis": {
            "dateFormats": [
                {period: 'hh', format: 'YYYY-MM-DD JJ:NN:SS'}
            ],
            "axisColor": "#555555",
            "minorGridEnabled": true,
            "labelRotation": 30
        }
    });

    callChart = AmCharts.makeChart(c2, {
        "type": "serial",
        "theme": "none",
        "pathToImages": "http://www.amcharts.com/lib/3/images/",
        "legend": {
            "equalWidths": false,
            "useGraphSettings": true,
            "valueAlign": "left",
            "valueWidth": 50
        },
        "dataProvider": callChartData,
        "valueAxes": [
            {
                "id": "callAxis",
                "axisColor": "#B0DE09",
                "axisThickness": 2,
                "axisAlpha": 1,
                "gridAlpha": 0,
                "offset": 0,
                "position": "left",
                "title": "call"
            }
        ],
        "graphs": [
            {
                "valueAxis": "callAxis",
                "lineColor": "#B0DE09",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 10,
                "title": "call",
                "valueField": "call",
                "balloonText": "call:<b>[[value]]</b>",
                "legendValueText": "[[value]]",
                "labelPosition": "bottom"
            }
        ],
        "chartScrollbar": {},
        "chartCursor": {
            "cursorPosition": "mouse"
        },
        "categoryField": "date",
        "categoryAxis": {
            "dateFormats": [
                dateFormat
            ],
            "axisColor": "#555555",
            "minorGridEnabled": true,
            "labelRotation": 30
        }
    });
}

function generateChartData(data) {
    var h = data.h;
    var d = data.d;
    var chartData = [];

    for (var i = 0; i < d.length; i++) {
        var tp50 = h["tp50"][i];
        var tp90 = h["tp90"][i];
        var tp99 = h["tp99"][i];
        var tp999 = h["tp999"][i];

        var date = d[i];
        //var newDate=AmCharts.stringToDate(date, "YYYY-MM-DD JJ:NN:SS")

        chartData.push({
            date: date,
            tp50: tp50,
            tp90: tp90,
            tp99: tp99,
            tp999: tp999
        });
    }
    return chartData;
}

function generateCallChartData(data) {
    var h = data.h;
    var d = data.d;
    var chartData = [];

    for (var i = 0; i < d.length; i++) {
        var call = h["call"][i];
        var date = d[i];
        chartData.push({
            date: date,
            call: call
        });
    }
    return chartData;
}

function reloadData(k, ck, type,starttime,endtime,flag) {
    init({k: k, cid: ck + '_c', c1: ck + '_c1', c2: ck + '_c2', t: type,start:starttime,end:endtime,flag:flag});
}
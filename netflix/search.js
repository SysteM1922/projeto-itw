// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.titleRecords = ko.observableArray([]);
    self.titleTotalRecords = ko.observable(0);
    self.movieRecords = ko.observableArray([]);
    self.movieTotalRecords = ko.observable(0);
    self.serieRecords = ko.observableArray([]);
    self.serieTotalRecords = ko.observable(0);
    self.catRecords = ko.observableArray([]);
    self.catTotalRecords = ko.observable(0);
    self.catRecords = ko.observableArray([]);
    self.catTotalRecords = ko.observable(0);
    self.actorRecords = ko.observableArray([]);
    self.actorTotalRecords = ko.observable(0);
    self.dirRecords = ko.observableArray([]);
    self.dirTotalRecords = ko.observable(0);
    self.countryRecords = ko.observableArray([]);
    self.countryTotalRecords = ko.observable(0);

    //--- Page Events
    self.activate = function (searchtype, search) {
        showLoading();
        console.log('CALL: getInfo...');
        switch (searchtype) {
            case ("0"):
                titlesearch(search);
                moviesearch(search);
                seriesearch(search);
                catsearch(search);
                actorsearch(search)
                dirsearch(search);
                countrysearch(search);
                hideLoading();
                break;
            case ("1"):
                titlesearch(search);
                hideLoading();
                break;
            case ("2"):
                moviesearch(search);
                hideLoading();
                break;
            case ("3"):
                seriesearch(search);
                hideLoading();
                break;
            case ("4"):
                catsearch(search);
                hideLoading();
                break;
            case ("5"):
                actorsearch(search);
                hideLoading();
                break;
            case ("6"):
                dirsearch(search);
                hideLoading();
                break;
            case ("7"):
                countrysearch(search);
                hideLoading();
                break;
        }
    };

    titlesearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/titles?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.titleRecords(data);
            self.titleTotalRecords(data.length);
        });
    }

    moviesearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/movies?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.movieRecords(data);
            self.movieTotalRecords(data.length);
        });
    }

    seriesearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/series?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.serieRecords(data);
            self.serieTotalRecords(data.length);
        });
    }

    catsearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/categories?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.catRecords(data);
            self.catTotalRecords(data.length);
        });
    }

    actorsearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/actors?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.actorRecords(data);
            self.actorTotalRecords(data.length);
        });
    }

    dirsearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/directors?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.dirRecords(data);
            self.dirTotalRecords(data.length);
        });
    }

    countrysearch = function (search) {
        var composedUri = 'http://192.168.160.58/netflix/api/search/countries?name=' + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.countryRecords(data);
            self.countryTotalRecords(data.length);
        });
    }

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }
    function showLoading() {
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        });
    }
    function noResults() {
        $('#resultsModal').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }
    //--- start ....
    var searchtype= getUrlParameter('searchtype');
    console.log(searchtype);
    var search = getUrlParameter('search');
    console.log(search);
    self.activate(searchtype, search);

    $(document).keypress(function (key) {
        if (key.which == 13) {
            click();
        }
    });

};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());

    $("#href").click(function click() {
        var opt = $("#select").val();
        var inp = $("#input1").val();
        var search = './search.html?searchtype=' + opt + '&search=' + inp;
        console.log(search);
        $("#href").attr("href", search);
    });
});

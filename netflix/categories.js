// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/netflix/api/categories');
    self.displayName = 'Categories List';
    self.error = ko.observable('');
    self.search = ko.observable();
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    $("#href").click(function click() {
        var opt = $("#select").val();
        var inp = $("#input1").val();
        var search = './search.html?searchtype=' + opt + '&search=' + inp;
        console.log(search)
        $("#href").attr("href", search);
    });
    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCategory...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Categories);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCategories);
        });
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=9999999";
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            var tags = [];
            for (var x = 0; x<data.Categories.length; x++) {
                var c = data.Categories[x];
                tags.push(c.Name);
            }
            $("#input2").autocomplete({
                source: tags
            });
        });
    };

    search = function () {
        console.log("CALL: Searching...");
        var changeUri = 'http://192.168.160.58/netflix/api/search/categories?name=' + $("#input2").val();
        ajaxHelper(changeUri, 'GET').done(function (data) {
            console.log(data);
            showLoading();
            self.records(data);
            self.totalRecords(data.length);
            $("#pagination").addClass("d-none");
            $("#line").addClass("d-none");
            $("#p").removeClass("d-none");
            $("#f1").addClass("d-none");
            $("#f2").removeClass("d-none");
            if (data.length == 0)
                hideLoading(),
                noResults();
            else
                hideLoading();
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
        })
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
    };
    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    $(document).keypress(function (key) {
        if (key.which == 13) {
            search();
        }
    });
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});


// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/netflix/api/ratings');
    self.displayName = 'Ratings List';
    self.error = ko.observable('');
    self.search = ko.observable();
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.totalRecords = ko.observable('');
    //--- Page Events
    self.activate = function () {
        console.log('CALL: getRating...');
        var composedUri = self.baseUri()
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data);
            self.totalRecords(data.length);
        });
    };

    $("#href").click(function click() {
        var opt = $("#select").val();
        var inp = $("#input1").val();
        var search = './search.html?searchtype=' + opt + '&search=' + inp;
        console.log(search)
        $("#href").attr("href", search);
    });
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

    //--- start ....
    showLoading();
    self.activate();
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});


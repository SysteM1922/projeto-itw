// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.displayName = 'Titles List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.actors = ko.observableArray([]);
    self.actor = ko.observable('');
    self.title = ko.observable('');
    self.id = ko.observable('');
    self.list = ko.observable([]);
    self.a = ko.observableArray([]);
    self.a0 = ko.observable('');
    self.a1 = ko.observable('');
    self.a2 = ko.observable('');
    self.a3 = ko.observable('');
    self.l = ko.observableArray([]);
    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getTitle...');
        var composedUri = 'http://192.168.160.58/netflix/api/titles' + "?page=" + id + "&pageSize=999999";
        ajaxHelper(composedUri, 'GET').done(function (data) {
            self.records(data.Titles);
            var t = data.Titles[Math.floor(Math.random() * data.Titles.length)];
            self.title(t.Name);
            console.log(t.Name);
            self.id(t.Id);
            var titleUri = 'http://192.168.160.58/netflix/api/titles/' + self.id();
            ajaxHelper(titleUri, 'GET').done(function (data) {
                if (data.Actors.length == 0)
                    self.activate(1);
                else
                    var ac = data.Actors[Math.floor(Math.random() * data.Actors.length)];
                    self.a(ac.Name);
                    console.log(ac.Name);
                    self.list(data.Actors.Name);
                    self.actors.push(ac.Name);
                    var actorsUri = 'http://192.168.160.58/netflix/api/actors' + "?page=" + id + "&pageSize=999999";
                    ajaxHelper(actorsUri, 'GET').done(function (data) {
                        for (var x = 0; x < 3; x++) {
                            var actor = data.Actors[Math.floor(Math.random() * data.Actors.length)];
                            console.log(actor.Name);
                            if (actor.Name in self.list)
                                console.log('in');
                            else
                                self.actors.push(actor.Name);
                        }
                        var y = self.actors()
                        y.sort();
                        console.log(y)
                        self.a0(y[0]);
                        self.a1(y[1]);
                        self.a2(y[2]);
                        self.a3(y[3]);
                        self.l(y);
                    });
            });
        });

    };
    

    submit = function () {
        var val = $('input[name=actor]:checked').val();
        console.log(self.a())
        if (self.a() == self.l()[val])
            $('#correct').modal({
                backdrop: 'static',
                keyboard: false
            });
        else
            $('#wrong').modal({
                backdrop: 'static',
                keyboard: false
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
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    hideLoading();
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});
// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    $("#href").click(function click() {
        var opt = $("#select").val();
        var inp = $("#input1").val();
        var search = './search.html?searchtype=' + opt + '&search=' + inp;
        console.log(search)
        $("#href").attr("href", search);
    });

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
    };

    $(document).keypress(function (key) {
        if (key.which == 13) {
            click();
        }
    });
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

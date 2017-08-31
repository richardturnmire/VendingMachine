$(document).ready(function () {
    loadItems();
});

function clearTable() {
    $('#product-group').empty();

}

function loadItems() {

    var contentRows = $('#product-group');
    clearTable();

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                var itemId = item.id;
                var name = item.name;
                var price = item.price;
                var qty = item.quantity;

                row = '<div class="col-md-4">'
                row += '<td>';
                row += '<button id="item-btn" class="btn btn-square warning" ';
                row += 'onclick=\'selectItem(' + itemId + ')\'>';
                row += '<p class="pull-left">' + itemId + '</p>';
                row += '<br/>';
                row += '<p>' + name + '</p>';
                row += '<p id="itemPrice">' + price.toFixed(2) + '</p>';

                row += '<p id="itemQty">Quantity Left: ' + qty + '</p>';

                row += '</button>';
                row += '</td></div>';

                contentRows.append(row);

            });

        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                    .attr({
                        class: 'list-group-item list-group-item-danger'
                    }))
                .text('Error calling web service. Please try again later').show();
        }
    });
}


function selectItem(itemId) {
    $('#itemNumber').val(itemId);

}

function addMoney(amt) {
    var totalquarters = $('#total-quarters').val();
    var totaldimes = $('#toal-dimes').val();
    var totalnickels = $('#total-nickels').val();

    var currentAmt = ($('#money-in').val() * 100 + amt) / 100;

    if (amt == 100)
        totalquarters += ((amt * 4) / 100);
    if (amt == 25)
        totalquarters += 1;
    if (amt == 10)
        totaldimes += 1;
    if (amt == 5)
        totalnickels += 1;

    $('#total-quarters').val(totalquarters);
    $('#total-dimes').val(totaldimes);
    $('#total-nickels').val(totalnickels);

    $('#money-in').val(currentAmt.toFixed(2));
}

function makePurchase() {

    var id = $('#itemNumber').val();
    var amt = $('#money-in').val();

      

    







    $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/money/' + amt + '/item/' + id
        })
        .done(function (change, status) {
            $('#itemNumber').val('');
            $('#money-in').val('');
            $('#messages').val('Thank you!!!');
            getChange(change);
            loadItems();
        })
        .fail(function (xhr, status, err) {

            showErrorMessage(xhr, status, err);

        });

}

function showErrorMessage(xhr, status, error) {
    if (xhr.responseText != "") {

        var jsonResponseText = $.parseJSON(xhr.responseText);
        var jsonResponseStatus = '';
        var message = jsonResponseText.message;

        $('#messages').val(message);
    }
}



function getChange(change) {
    var quarters = 0;
    var dimes = 0;
    var nickels = 0;


    $.each(change, function (index, numCoins) {

        if (index == 'quarters') quarters += numCoins;
        if (index == 'dimes') dimes += numCoins;
        if (index == 'nickels') nickels += numCoins;


    });

    var totalchange = (quarters * 25 + dimes * 10 + nickels * 5) / 100;


    $('#money-in').val(totalchange.toFixed(2));
    $('#total-quarters').val(quarters);
    $('#total-dimes').val(dimes);
    $('#total-nickels').val(nickels);



}


function returnChange() {
    var totalquarters = $('#total-quarters').val();
    var totaldimes = $('#total-dimes').val();
    var totalnickels = $('#total-nickels').val();

    var totalamt = $('#money-in').val();
    if (totalamt > 0) {
        var message = "Dispensing " + totalamt + " in the form of ";

        if (totalquarters > 0) {
            message += totalquarters;
            if (totalquarters == 1) {
                message += ' quarter';
            } else {
                message += ' quarters';
            }
            message += ', ';
        }


        message += totaldimes;
        if (totaldimes == 1) {
            message += ' dime';
        } else {
            message += ' dimes';
        }
        message += ', \n';



        message += ' and ' + totalnickels;
        if (totalnickels == 1) {
            message += ' nickel';
        } else {
            message += ' nickels';
        }
        message += '\n';




        $('#changeAmt').val(message);
    }
    $('#moneyin').val('');
    $('#total-quarters').val('');
    $('#total-dimes').val('');
    $('#total-nickels').val("");
    $('#total-pennies').val("");

}
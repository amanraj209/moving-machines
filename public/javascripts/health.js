$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: 'health/findmotors',
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                addMotors(result[i]);
            }
        },
        error: function (error) {
            if (error.status === 500) {
                alert("Some internal error occurred. Try again.");
            }
        }
    });


    setInterval(function () {
        $.ajax({
            type: 'POST',
            url: 'health/motorupdates',
            success: function (result) {
                if (result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        if (result.data[i].operation === 'I') {
                            addMotors(result.data[i].obj);
                        } else if (result.data[i].operation === 'U') {
                            let obj = result.data[i].obj;
                            if (obj.speed <= 10) {
                                if ($(`#circle${obj.mno}`).hasClass('redMotor')) {
                                    $(`#circle${obj.mno}`).removeClass('redMotor').addClass('greenMotor');
                                    $(`#fix${obj.mno}`).addClass('disabled');
                                }
                            } else {
                                if ($(`#circle${obj.mno}`).hasClass('greenMotor')) {
                                    $(`#circle${obj.mno}`).removeClass('greenMotor').addClass('redMotor');
                                    $(`#fix${obj.mno}`).removeClass('disabled');
                                }
                            }
                        }
                    }
                }
            },
            error: function (error) {
                console.log("Some internal error occurred. Try again.");
            }
        });
    }, 1000);

    function addMotors(result) {
        let mno = 'Motor';
        if (result.mno > 99) {
            mno += result.mno;
        } else if (result.mno > 9) {
            mno += ('0' + result.mno);
        } else {
            mno += ('00' + result.mno);
        }
        $("#healthTableBody").append(`
                            <tr>
                                <td scope="row">${mno}</td>
                                <td><div id="circle${result.mno}" class="circleBase"></div></td>
                                <td><button id="fix${result.mno}" class="btn btn-primary disabled" type="button" onclick="fixMotor(this)">Fix the Motor</button></td>
                            </tr>`);
        if (result.speed <= 10) {
            $(`#circle${result.mno}`).addClass('greenMotor');
            $(`#fix${result.mno}`).addClass('disabled');
        } else {
            $(`#circle${result.mno}`).addClass('redMotor');
            $(`#fix${result.mno}`).removeClass('disabled');
        }
    }

    fixMotor = function (event) {
        let id = $(event).attr('id').substring(3);
        $.ajax({
            type: 'POST',
            url: 'health/fixmotor',
            data: {mno: id},
            success: function (result) {
                $(`#circle${result.mno}`).removeClass('redMotor').addClass('greenMotor');
                $(`#fix${result.mno}`).addClass('disabled');
            },
            error: function (error) {
                if (error.status === 500) {
                    alert("Some internal error occurred. Try again.");
                }
            }
        });
    }
});
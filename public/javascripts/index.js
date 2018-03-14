$(document).ready(function () {

    const speeds = [];

    $.ajax({
        type: 'GET',
        url: 'findmotors',
        success: function (result) {
            for (let i = 0; i < result.length; i++) {
                addMotors(result[i]);
                if (result[i].speed === 0) {
                    $(`#off${result[i].mno}`).addClass('disabled');
                    $(`#on${result[i].mno}`).removeClass('disabled');
                }
            }
        },
        error: function (error) {
            if (error.status === 500) {
                alert("Some internal error occurred. Try again.");
            }
        }
    });

    setInterval(function () {
    //     $.ajax({
    //         type: 'POST',
    //         url: 'updatecapturespeeds',
    //         data: {speeds: speeds},
    //         success: function (result) {
    //             console.log(result.status);
    //         },
    //         error: function (error) {
    //             if (error.status === 500) {
    //                 alert("Some internal error occurred. Try again.");
    //             }
    //         }
    //     });
        $.ajax({
            type: 'POST',
            url: 'motorupdates',
            success: function (result) {
                if (result.data.length > 0) {
                    for (let i = 0; i < result.data.length; i++) {
                        if (result.data[i].operation === 'U') {
                            let obj = result.data[i].obj;
                            if (obj.speed === 5) {
                                $(`#speed${obj.mno}`).text(obj.speed);
                                speeds[obj.mno - 1] = obj.speed;
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

    $("#addmotor").click(function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'addmotor',
            success: function (result) {
                addMotors(result);
            },
            error: function (error) {
                if (error.status === 500) {
                    alert("Some internal error occurred. Try again.");
                }
            }
        });
    });

    function addMotors(result) {
        let mno = 'Motor';
        if (result.mno > 99) {
            mno += result.mno;
        } else if (result.mno > 9) {
            mno += ('0' + result.mno);
        } else {
            mno += ('00' + result.mno);
        }
        $("#motorsTableBody").append(`
                <tr>
                    <td scope="row">${mno}</td>
                    <td><button id="on${result.mno}" class="btn btn-success disabled" type="button" onclick="motorOn(this)">ON</button></td>
                    <td><button id="off${result.mno}" class="btn btn-danger" type="button" onclick="motorOff(this)">OFF</button></td>
                    <td><div id="speed${result.mno}" class="container">${result.speed}</div></td>
                    <td>
                        <button id="inc${result.mno}" class="btn btn-warning" type="button" onclick="motorInc(this)"><i class="fas fa-arrow-up text-white"></i></button>
                        <button id="dec${result.mno}" class="btn btn-warning" type="button" onclick="motorDec(this)"><i class="fas fa-arrow-down text-white"></i></button>
                    </td>
                </tr>`);
        speeds.push(result.speed);
    }

    motorOn = function (event) {
        let id = $(event).attr('id').substring(2);
        $.ajax({
            type: 'POST',
            url: 'onmotor',
            data: {mno: id},
            success: function (result) {
                $(event).addClass('disabled');
                $(`#off${id}`).removeClass('disabled');
                $(`#speed${id}`).text(result.speed);
                speeds[result.mno - 1] = result.speed;
            },
            error: function (error) {
                if (error.status === 500) {
                    alert("Some internal error occurred. Try again.");
                }
            }
        });
    };

    motorOff = function (event) {
        let id = $(event).attr('id').substring(3);
        $.ajax({
            type: 'POST',
            url: 'offmotor',
            data: {mno: id},
            success: function (result) {
                $(event).addClass('disabled');
                $(`#on${id}`).removeClass('disabled');
                $(`#speed${id}`).text(result.speed);
                speeds[result.mno - 1] = result.speed;
            },
            error: function (error) {
                if (error.status === 500) {
                    alert("Some internal error occurred. Try again.");
                }
            }
        });
    };

    motorInc = function (event) {
        let id = $(event).attr('id').substring(3);
        if (!$(`#off${id}`).hasClass('disabled')) {
            let speed = parseInt($(`#speed${id}`).text());
            $.ajax({
                type: 'POST',
                url: 'incmotor',
                data: {mno: id, speed: speed},
                success: function (result) {
                    $(`#speed${id}`).text(result.speed);
                    speeds[result.mno - 1] = result.speed;
                },
                error: function (error) {
                    if (error.status === 500) {
                        alert("Some internal error occurred. Try again.");
                    }
                }
            });
        }
    };

    motorDec = function (event) {
        let id = $(event).attr('id').substring(3);
        if (!$(`#off${id}`).hasClass('disabled')) {
            let speed = parseInt($(`#speed${id}`).text());
            if (speed > 0) {
                $.ajax({
                    type: 'POST',
                    url: 'decmotor',
                    data: {mno: id, speed: speed},
                    success: function (result) {
                        if (result.speed <= 0) {
                            result.speed = 0;
                        }
                        $(`#speed${id}`).text(result.speed);
                        speeds[result.mno - 1] = result.speed;
                        if (result.speed === 0) {
                            $(`#off${id}`).addClass('disabled');
                            $(`#on${id}`).removeClass('disabled');
                        }
                    },
                    error: function (error) {
                        if (error.status === 500) {
                            alert("Some internal error occurred. Try again.");
                        }
                    }
                });
            }
        }
    };
});
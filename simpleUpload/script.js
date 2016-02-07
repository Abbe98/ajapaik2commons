$(document).ready(function() {
    // load filename from url
    var urlFilename = getURLParameter('ajapaik');
    if (urlFilename) {
        $('#ajapaik_id').val(urlFilename);
        processFilename();  // lookup directly if filename
    }
    // responsive buttons
    $('.btn').hover(
        function() {
            if (!$(this).prop("disabled")) {
                $(this).addClass('active');
            }
        },
        function() {
            $(this).removeClass('active');
        }
    );
    // on enter or clicking button, look up info on Ajapaik
    $('#ajapaik_id').keypress(function(e) {
        if(e.which == 13) {
            processFilename();
        }
    });
    $('#button').click(function() {
        processFilename();
    });

});

// Validate filename and request info from Commons
function processFilename() {
    // reset later fields
    $('#reflect').empty();
    $('#button').prop('disabled', true);
    $('#thumbDiv').addClass('hidden');
    $('#ajapaik_id').removeClass('highlighted');

    // test filename
    var run = true;
    // if empty
    var input = $('#ajapaik_id').val();
    if (input === ''){
        $('#ajapaik_id').addClass('highlighted');
        run = false;
    // if not numeric
    } else if (!$.isNumeric(input)) {
        run = false;
    }
    // run if mapillary_id is likely to be valid
    if (run) {
        $('#pre_info').addClass('hidden');
        queryAjapaik(input);
        $('#button').prop('disabled', false);
    }
    else {
        $('#button').prop('disabled', false);
    }
}

// query ajapaik and process response
function queryAjapaik(id) {
    var url = 'http://api.ajapaik.ee/api-v1.php?action=photo&photo_id=1811' + id;

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            // check if the image is valid
            if (data.result.rephoto_of_id != null) {
                var date = data.result.created;
                var imageDescription = '#TODO Template goes here';
                var fileName = 'Ajapaik_' + id + '.jpg';
                var imageUrl = data.result.image_large;

                var magnusurl = '//tools.wmflabs.org/url2commons/index.html?' +
                                'run=1&' +
                                'urls=' + imageUrl.replace( /_/g , "$US$" ) + ' ' +
                                fileName + '|' +
                                encodeURIComponent(imageDescription).replace( /_/g , "$US$" ) +
                                '&desc=$DESCRIPTOR$';

                $('#thumb').attr("src", imageurl);
                $('#submit_button').attr("href", magnusurl);
                $('#submit_button').html('<big>Upload as</big><br/>' + destFile);
                $('#thumbDiv').removeClass('hidden');
            } else {
                $('#reflect').text('This image is not a rephotograph and can\'t be uploaded to commons!');
            }
        },
        error: function (jqxhr, textStatus, errorThrown) {
            if (errorThrown === 'Not Found') {
                $('#reflect').text('Ajapaik could not find any information on that id. Sure it is right?');
            } else {
                $('#reflect').text('The ajax call failed: ' + textStatus + ' : ' + errorThrown);
            }
        }
    });
}

// returns the named url parameter
function getURLParameter(param) {
    var pageURL = decodeURIComponent(window.location.search.substring(1));
    var urlVariables = pageURL.split('&');
    for (var i = 0; i < urlVariables.length; i++) {
        var parameterName = urlVariables[i].split('=');
        if (parameterName[0] == param) {
            return parameterName[1];
        }
    }
}

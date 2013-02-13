$(function() {
    $('#doHits').click(function() {
        var contentId = $('#contentId').val();
        var contentType = $('#contentType').val();
        var section = $('#section').val();
        var contentTag = $('#contentTag').val();
        var numHits = $('#numHits').val();

        $('#hitCounter').text(0);

        for (i = 0; i < numHits; ++i) {
            $.ajax({
                type: "POST",
                url: "/hit/",
                data: JSON.stringify({
                    contentId: contentId, 
                    type: contentType,
                    breadcrum: section,
                    tags: contentTag
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data) {
                    $('#hitCounter').text(parseInt($('#hitCounter').text()) + 1);
                },
                error: function(err) {
                    var msg = "Status: " + err.status + ": " + err.responseText;
                    alert(msg);
                }
            });
        }

        return false;
    });

    $('#find').click(function() {
        var contentType = $('#findByType').val();
        var section = $('#findBySection').val();
        var tag = $('#findByTag').val();
        var days = $('#days').val();
        var numResults = $('#numResults').val();

        $.ajax({
            type: 'GET',
            url: '/hit/' + section + '/' + contentType + '/' + days + '/' + tag + '/' + numResults,
            success: function(data) {
                alert(data);
            },
            error: function(err) {
                var msg = "Status: " + err.status + ": " + err.responseText;
                alert(msg);
            }
        });
    });
});
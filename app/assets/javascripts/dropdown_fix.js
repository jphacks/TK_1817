$(function(){
    $('.dropdown-menu .dropdown-item').click(function(){
        var toggle = $('#playlist_toggle');
        var hiddenInput = $('#playlist_id_form');
        toggle.text($(this).text());
        console.log($(this).attr('value'));
        console.log(hiddenInput.attr('value'));
        hiddenInput.attr('value', $(this).attr('value'));
    });
});

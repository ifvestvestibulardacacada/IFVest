$(function() {
    $('ul.left-menu li > ul').hide();
    $('ul.left-menu li').click(function(e){
      e.stopPropagation();
      $(this).children('ul').slideToggle();
    });
    $('ul.left-menu a').click(function(e){
      //e.stopPropagation();
    });
  });
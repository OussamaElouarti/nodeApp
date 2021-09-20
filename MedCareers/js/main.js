const token  = '';
const data = {};
$(document).ready(function(){
    $('.slicker').slick({
    dots :true,
    arrows :false,
    autoplay : true,
    slidesToShow: 2,
    slidesToScroll:2,
    autoplaySpeed : 2000,
    responsive : [
        {
            breakpoint :841,
            settings: {
                slidesToShow:1,
                slidesToScroll :1,
            }
        }
    ]
    });
    $('#prv').click(function(){
        $('.slicker').slick('slickPrev');
      })
      
    $('#nxt').click(function(){
        $('.slicker').slick('slickNext');
    })
    //menu
    var menu = $('#menu');
    menu.click(function(){
        if ($("#head ul").is(":hidden")) {
            $("#head ul").show(); 
        }
        else {
            $("#head ul").hide();
        }
    })
    //subscribe button
    var counter = $('#subscribers div h3').length;
    var button = $('#subscribe button');
    button.click(function(){
        window.setTimeout(function(){
            if ($('#subscribers div h3').length == counter)
                alert('email already used or bad syntax');
        }, 500)
    })
    // alert close
    var but= $('.alerthide button');
    but.click(function()  {
        $(this).parent().remove();
    })
});

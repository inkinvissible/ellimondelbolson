$(function() {
    
    "use strict";
    
    //===== Prealoder
    
    $(window).on('load', function(event) {
        $('.preloader').delay(500).fadeOut(500);
    });
    
    
    //===== Sticky

    $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 20) {
            $(".header_navbar").removeClass("sticky");
            $(".header_navbar img").attr("src", "assets/images/logo.png");
        } else {
            $(".header_navbar").addClass("sticky");
            $(".header_navbar img").attr("src", "assets/images/logo.png");
        }
    });
    
    
    //===== Section Menu Active

    var scrollLink = $('.page-scroll');
    // Active link switching
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {

            var sectionOffset = $(this.hash).offset().top - 73;

            if (sectionOffset <= scrollbarLocation) {
                $(this).parent().addClass('active');
                $(this).parent().siblings().removeClass('active');
            }
        });
    });
    
    //===== close navbar-collapse when a  clicked

    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });

    $(".navbar-toggler").on('click', function () {
        $(this).toggleClass("active");
    });

    $(".navbar-nav a").on('click', function () {
        $(".navbar-toggler").removeClass('active');
    });
    
    
    //===== Counter Up
    
    $('.counter').counterUp({
        delay: 10,
        time: 3000
    });
    
    
    
    //===== Back to top
    
    // Show or hide the sticky footer button
    $(window).on('scroll', function(event) {
        if($(this).scrollTop() > 600){
            $('.back-to-top').fadeIn(200)
        } else{
            $('.back-to-top').fadeOut(200)
        }
    });
    
    
    //Animate the scroll to yop
    $('.back-to-top').on('click', function(event) {
        event.preventDefault();
        
        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });
    
    
    //===== Nice Select
    
    $('select').niceSelect();
    
    
    //=====  WOW active
    
    var wow = new WOW({
        boxClass: 'wow', //
        mobile: false, // 
    })
    wow.init();



});
// Inicializar PhotoSwipe
$(document).ready(function() {
    var initPhotoSwipeFromDOM = function(gallerySelector) {

        var parseThumbnailElements = function(el) {
            var thumbElements = el.getElementsByTagName('a'),
                numNodes = thumbElements.length,
                items = [],
                figureEl,
                linkEl,
                size,
                item;

            for(var i = 0; i < numNodes; i++) {
                linkEl = thumbElements[i];
                size = linkEl.getAttribute('data-size').split('x');

                item = {
                    src: linkEl.getAttribute('href'),
                    w: parseInt(size[0], 10),
                    h: parseInt(size[1], 10)
                };

                if(linkEl.children.length > 0) {
                    item.title = linkEl.children[0].getAttribute('alt');
                }

                items.push(item);
            }

            return items;
        };

        var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
            var pswpElement = document.querySelectorAll('.pswp')[0],
                items = parseThumbnailElements(galleryElement),
                options = {
                    index: index,
                    bgOpacity: 0.8,
                    showHideOpacity: true
                };

            var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
            gallery.init();
        };

        var galleryElements = document.querySelectorAll(gallerySelector);

        for(var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i+1);
            galleryElements[i].onclick = function(e) {
                e = e || window.event;
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);

                var eTarget = e.target || e.srcElement;

                var clickedListItem = eTarget.closest('a');

                if(!clickedListItem) {
                    return;
                }

                var clickedGallery = clickedListItem.closest('.gallery'),
                    childNodes = clickedGallery.getElementsByTagName('a'),
                    numChildNodes = childNodes.length,
                    nodeIndex = 0,
                    index;

                for (var j = 0; j < numChildNodes; j++) {
                    if(childNodes[j] === clickedListItem) {
                        index = j;
                        break;
                    }
                }

                if(index >= 0) {
                    openPhotoSwipe(index, clickedGallery);
                }
                return false;
            };
        }
    };

    initPhotoSwipeFromDOM('.gallery');
});
const responsive = {
    0: {
        items: 1
    },
    320: {
        items: 1
    },
    560: {
        items: 2
    },
    960: {
        items: 3
    }
}
$(document).ready(function () { // Đoạn mã này sẽ chạy khi trang web đã hoàn toàn tải xong và sẵn sàng để tương tác

    $nav = $('.nav');
    $toggleCollapse = $('.toggle-collapse');

    /** click event on toggle menu */
    $toggleCollapse.click(function () {
        $nav.not('.site-background').toggleClass('collapse'); // Khi phần tử có class "toggle-collapse" được click, phần tử có class "nav" sẽ thay đổi thêm class "collapse"
        // $('html, body').animate({ scrollTop: $(".nav-link").offset().top }, 300);
        $('.site-title').toggleClass('show');
    }) 
    $('.owl-carousel').owlCarousel({
    loop: true,
    autoplay: false,
    autoplayTimeout: 3000,
    dots: false,
    nav: true,
    navText: [$('.owl-navigation .owl-nav-prev'), $('.owl-navigation .owl-nav-next')],
    responsive: responsive
    
});
    // Khởi tạo một carousel với các tuỳ chọn như lặp lại vô hạn (loop), không tự động chạy (autoplay: false),
   // thời gian chờ giữa các slide là 3000ms (autoplaytimeout: 3000), không hiển thị điểm tương tác (dots),
   // có nút điều hướng (nav: true), các nút điều hướng được tạo ra từ các phần tử có class "owl-nav-prev" và "owl-nav-next",
   // và tuỳ chỉnh độ phản hồi (responsive) được định nghĩa ở nơi khác trong đoạn mã.

   // click để cuộn lên trên
$('.move-up span').click(function () {
    $('html, body').animate({
        scrollTop: 0
    }, 1000); // Khi phần tử có class "move-up span" được click, trang web sẽ được cuộn lên đầu trang trong 1000ms (1 giây).
})

// document.querySelector('.toggle-icons').addEventListener('click', function() {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: 'smooth'
//     });
//   });
// const btns = document.querySelectorAll(".nav-btn");
// const slides = document.querySelectorAll(".video-slide");
// const contents = document.querySelectorAll(".content");
// var sliderNav = function(manual){
//     btns.forEach((btn) =>{
//         btn.classList.remove("active");
// });
//     slides.forEach((slide)=>{
//         slide.classList.remove("active");
//     });
//     contents.forEach((content)=>{
//         content.classList.remove("active");
//     });
//     btns[manual].classList.add("active");
//     slides[manual].classList.add("active");
//     contents[manual].classList.add("active");
// }
//     btns.forEach((btn,i)=>{
//         btn.addEventListener("click",()=>{
//             sliderNav(i);
//         });
//     });
  
// // AOS Instance
 AOS.init();
//Khởi tạo thư viện AOS để thực hiện hiệu ứng cuộn.
   


});
// const sliderNav = document.querySelector(".nav-btn");
// const videoSlides = document.querySelectorAll(".video-slide");

// // Thêm sự kiện click cho các nút điều hướng
// sliderNav.addEventListener("click", function(event) {
//   // Kiểm tra xem phần tử bị nhấn có đúng là một nút điều hướng không
//   if (event.target.classList.contains("nav-btn")) {
//     // Xóa lớp "active" cho tất cả các phần tử video-slide
//     videoSlides.forEach(function(videoSlide) {
//       videoSlide.classList.remove("active");
//     });

//     // Lấy chỉ số của nút điều hướng bị nhấn
//     const navIndex = Array.from(event.target.parentNode.children).indexOf(event.target);

//     // Thêm lớp "active" cho phần tử video-slide tương ứng
//     videoSlides[navIndex].classList.add("active");
//   }
// });
// const videos = ["./assets/video/tiger.mp4", "./assets/video/leopard.mp4", "./assets/video/wolf.mp4","./assets/video/lion.mp4","./assets/video/swimming_with_shark.mp4"];
// let currentvideo = 0;

// function changevideo() {
//   const videoelement = document.querySelector('.video-slide');
//   currentvideo = (currentvideo + 1) % videos.length;
//   videoelement.src = videos[currentvideo];
// }

// document.addEventListener('DOMContentLoaded', () => {
//   setInterval(changevideo, 15000);
// });
// const viewBtns = document.querySelectorAll(".btn-share"),
//     popup = document.querySelector(".popup"),
//     close = popup.querySelector(".close"),
//     field = popup.querySelector(".field"),
//     input = field.querySelector("input"),
//     copy = field.querySelector("button");

//     viewBtns.forEach(function(viewBtn) {
//         viewBtn.addEventListener("click", function() {
//           popup.classList.toggle("show");
//         });
//       });
    // close.onclick = ()=>{
    //   viewBtns.click();
    // }
    // close.addEventListener("click", function() {
    //     popup.classList.remove("show");
    //   });
    // close.addEventListener("click", function() {
    //     viewBtns.forEach(function(viewBtn) {
    //       viewBtn.click();
    //     });
    //   });
    // chúng ta sử dụng `document.querySelectorAll(".btn-share")` để lấy tất cả các phần tử có lớp `btn-share`. Sau đó, chúng ta sử dụng phương thức `forEach`
    // để lặp qua danh sách các phần tử và thêm sự kiện click cho mỗi phần tử. Bên trong hàm click, chúng ta sử dụng `popup.classList.toggle("show")` để thêm hoặc xóa class `show` của phần tử popup.

//     copy.onclick = ()=>{
//     navigator.clipboard.writeText(input.value)
//     .then(() => {
//         field.classList.add("active");
//         copy.innerText = "Copied";
//         setTimeout(() => {
//         window.getSelection().removeAllRanges();
//         field.classList.remove("active");
//         copy.innerText = "Copy";
//         }, 3000);
//     })

//     .catch((error) => {
//         console.error("Copy failed:", error);
//     });
    
// }
// var btnShare = document.querySelector(".btn-share");
//         btnShare.addEventListener("click", function() {
//             alert("Bạn đã click vào nút Share!");
//         });
// const viewBtns = document.querySelectorAll(".btn-share"),
$(document).ready(function() {
    $('.close1').click(function() {
     // $('.container1').hide(); // or you can use
      $('.comments-container').fadeOut(); //for a fade effect
    });
  });
//   const viewBtnCmts = document.querySelectorAll(".btn-cmt"),
//     comment = document.querySelector(".comments-container")
    // viewBtnCmts.forEach(function(viewBtnCmt) {
    //     viewBtnCmt.addEventListener("click", function() {
    //         alert("cccc");
    //       comment.classList.toggle("show");
    //     });
    //   });

    // close.onclick = ()=>{
    //   viewBtns.click();
    // }
    // close.addEventListener("click", function() {
    //     popup.classList.remove("show");
    //   });

// Lấy tất cả các button có class .btn-cmt
const buttons = document.querySelectorAll('.btn-cmt');
 container = document.querySelector('.comments-container');
 buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (container.style.display === 'none') {
                  // Nếu đã ẩn thì hiển thị .container-comment
                  container.style.display = 'block';
                } else {
                  // Nếu đã hiển thị thì ẩn .container-comment
                  container.style.display = 'none';
                }

    });
  });
  
  /* ===================================================================
 * Abstract 2.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */ 

(function($) {

  "use strict";

  const cfg = {
      scrollDuration : 800, // smoothscroll duration
      mailChimpURL   : 'https://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e6957d85dc' // MailChimp URL
  }


 /* preloader
  * -------------------------------------------------- */
  const ssPreloader = function() {

      const preloader = document.querySelector('#preloader');
      if (!preloader) return;

      document.querySelector('html').classList.add('ss-preload');
      
      window.addEventListener('load', function() {
          
          document.querySelector('html').classList.remove('ss-preload');
          document.querySelector('html').classList.add('ss-loaded');

          preloader.addEventListener('transitionend', function(e) {
              if (e.target.matches("#preloader")) {
                  this.style.display = 'none';
              }
          });
      });

      // force page scroll position to top at page refresh
      // window.addEventListener('beforeunload' , function () {
      //     window.scrollTo(0, 0);
      // });

  }; // end ssPreloader



 /* alert boxes
  * ------------------------------------------------------ */
  const ssAlertBoxes = function() {

      const boxes = document.querySelectorAll('.alert-box');
      if (!boxes) return;

      boxes.forEach(function(box) {

          box.addEventListener('click', function(e){
              if (e.target.matches(".alert-box__close")) {
                  e.stopPropagation();
                  e.target.parentElement.classList.add("hideit");

                  setTimeout(function() {
                      box.style.display = "none";
                  }, 500)
              }    
          });

      })

  }; // end ssAlertBoxes


 /* Mobile Menu
  * ---------------------------------------------------- */ 
  const ssMobileMenu = function() {

      const $navWrap = $('.s-header__nav-wrap');
      const $closeNavWrap = $navWrap.find('.s-header__overlay-close');
      const $menuToggle = $('.s-header__toggle-menu');
      const $siteBody = $('body');
      
      $menuToggle.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          $siteBody.addClass('nav-wrap-is-visible');
      });

      $closeNavWrap.on('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
      
          if($siteBody.hasClass('nav-wrap-is-visible')) {
              $siteBody.removeClass('nav-wrap-is-visible');
          }
      });

      // open (or close) submenu items in mobile view menu. 
      // close all the other open submenu items.
      $('.s-header__nav .has-children').children('a').on('click', function (e) {
          e.preventDefault();

          if ($(".close-mobile-menu").is(":visible") == true) {

              $(this).toggleClass('sub-menu-is-open')
                  .next('ul')
                  .slideToggle(200)
                  .end()
                  .parent('.has-children')
                  .siblings('.has-children')
                  .children('a')
                  .removeClass('sub-menu-is-open')
                  .next('ul')
                  .slideUp(200);

          }
      });

  }; // end ssMobileMenu


 /* search
  * ------------------------------------------------------ */
  const ssSearch = function() {

      const searchWrap = document.querySelector('.s-header__search');
      const searchTrigger = document.querySelector('.s-header__search-trigger');

      if (!(searchWrap && searchTrigger)) return;

      const searchField = searchWrap.querySelector('.s-header__search-field');
      const closeSearch = searchWrap.querySelector('.s-header__overlay-close');
      const siteBody = document.querySelector('body');

      searchTrigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          siteBody.classList.add('search-is-visible');
          setTimeout(function(){
              searchWrap.querySelector('.s-header__search-field').focus();
          }, 100);
      });

      closeSearch.addEventListener('click', function(e) {
          e.stopPropagation();

          if(siteBody.classList.contains('search-is-visible')) {
              siteBody.classList.remove('search-is-visible');
              setTimeout(function(){
                  searchWrap.querySelector('.s-header__search-field').blur();
              }, 100);
          }
      });

      searchWrap.addEventListener('click', function(e) {
          if( !(e.target.matches('.s-header__search-field')) ) {
              closeSearch.dispatchEvent(new Event('click'));
          }
      });

      searchField.addEventListener('click', function(e) {
          e.stopPropagation();
      })

      searchField.setAttribute('placeholder', 'Type Keywords');
      searchField.setAttribute('autocomplete', 'off');

  }; // end ssSearch


 /* masonry
  * ------------------------------------------------------ */
  const ssMasonry = function() {
      const containerBricks = document.querySelector('.bricks-wrapper');
      if (!containerBricks) return;

      imagesLoaded(containerBricks, function() {

          const msnry = new Masonry(containerBricks, {
              itemSelector: '.entry',
              columnWidth: '.grid-sizer',
              percentPosition: true,
              resize: true
          });

      });

  }; // end ssMasonry


 /* animate bricks
  * ------------------------------------------------------ */
  const ssBricksAnimate = function() {

      const animateEl = document.querySelectorAll('.animate-this');
      if (!animateEl) return;

      window.addEventListener('load', function() {

          setTimeout(function() {
              animateEl.forEach(function(item, ctr) {
                  let el = item;
                      
                  setTimeout(function() {
                      el.classList.add('animated', 'fadeInUp');
                  }, ctr * 200);
              });
          }, 200);
      });

      window.addEventListener('resize', function() {
          // remove animation classes
          animateEl.forEach(function(item) {
              let el = item;
              el.classList.remove('animate-this', 'animated', 'fadeInUp');
          });
      });

  }; // end ssBricksAnimate


 /* slick slider
  * ------------------------------------------------------ */
  const ssSlickSlider = function() {

      function ssRunFeaturedSlider() {

          const $fSlider = $('.featured-post-slider').slick({
              arrows: false,
              dots: false,
              speed: 1000,
              fade: true,
              cssEase: 'linear',
              slidesToShow: 1,
              centerMode: true
          });

          $('.featured-post-nav__prev').on('click', function() {
              $fSlider.slick('slickPrev');
          });

          $('.featured-post-nav__next').on('click', function() {
              $fSlider.slick('slickNext');
          });
      
      } // end ssRunFeaturedSlider

      function ssRunGallerySlider() {

          const $gallery = $('.slider__slides').slick({
              arrows: false,
              dots: true,
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              adaptiveHeight: true,
              pauseOnFocus: false,
              fade: true,
              cssEase: 'linear'
          });
          
          $('.slider__slide').on('click', function() {
              $gallery.slick('slickGoTo', parseInt($gallery.slick('slickCurrentSlide')) + 1);
          });
          
      } // end ssRunGallerySlider

      ssRunFeaturedSlider();
      ssRunGallerySlider();

  }; // end ssSlickSlider


 /* Smooth Scrolling
  * ------------------------------------------------------ */
  const ssSmoothScroll = function() {

      $('.smoothscroll').on('click', function (e) {
          let target  = this.hash,
              $target = $(target);
      
          e.preventDefault();
          e.stopPropagation();

          $('html, body').stop().animate({
          'scrollTop': $target.offset().top
          }, cfg.scrollDuration, 'swing').promise().done(function () {

          window.location.hash = target;
          });
      });

  }; // endSmoothScroll


 /* AjaxChimp
  * ------------------------------------------------------ */
  const ssAjaxChimp = function() {

      $('#mc-form').ajaxChimp({
          language: 'es',
          url: cfg.mailChimpURL
      });

      // Mailchimp translation
      //
      //  Defaults:
      //	 'submit': 'Submitting...',
      //  0: 'We have sent you a confirmation email',
      //  1: 'Please enter a value',
      //  2: 'An email address must contain a single @',
      //  3: 'The domain portion of the email address is invalid (the portion after the @: )',
      //  4: 'The username portion of the email address is invalid (the portion before the @: )',
      //  5: 'This email address looks fake or invalid. Please enter a real email address'

      $.ajaxChimp.translations.es = {
          'submit': 'Submitting...',
          0: '<i class="fa fa-check"></i> We have sent you a confirmation email',
          1: '<i class="fa fa-warning"></i> You must enter a valid e-mail address.',
          2: '<i class="fa fa-warning"></i> E-mail address is not valid.',
          3: '<i class="fa fa-warning"></i> E-mail address is not valid.',
          4: '<i class="fa fa-warning"></i> E-mail address is not valid.',
          5: '<i class="fa fa-warning"></i> E-mail address is not valid.'
      } 

  }; // end ssAjaxChimp
  
  
 /* back to top
  * ------------------------------------------------------ */
  const ssBackToTop = function() {

      const pxShow = 800;
      const goTopButton = document.querySelector(".ss-go-top");

      if (!goTopButton) return;

      // Show or hide the button
      if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

      window.addEventListener('scroll', function() {
          if (window.scrollY >= pxShow) {
              if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
          } else {
              goTopButton.classList.remove("link-is-visible")
          }
      });

  }; // end ssBackToTop


 /* Initialize
  * ------------------------------------------------------ */
  (function ssInit() {

      ssPreloader();
      ssAlertBoxes();
      ssSearch();
      ssMobileMenu();
      ssMasonry();
      ssBricksAnimate();
      ssSlickSlider();
      ssSmoothScroll();
      ssAjaxChimp();
      ssBackToTop();

  })();

})(jQuery);
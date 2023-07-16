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
const videos = ["./assets/video/tiger.mp4", "./assets/video/leopard.mp4", "./assets/video/wolf.mp4","./assets/video/lion.mp4","./assets/video/swimming_with_shark.mp4"];
let currentvideo = 0;

function changevideo() {
  const videoelement = document.querySelector('.video-slide');
  currentvideo = (currentvideo + 1) % videos.length;
  videoelement.src = videos[currentvideo];
}

document.addEventListener('DOMContentLoaded', () => {
  setInterval(changevideo, 15000);
});
const viewBtn = document.querySelector(".container.btn-share"),
    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    copy = field.querySelector("button");

    viewBtn.onclick = ()=>{
      popup.classList.toggle("show");
    }
    close.onclick = ()=>{
      viewBtn.click();
    }

    copy.onclick = ()=>{
    navigator.clipboard.writeText(input.value)
    .then(() => {
        field.classList.add("active");
        copy.innerText = "Copied";
        setTimeout(() => {
        window.getSelection().removeAllRanges();
        field.classList.remove("active");
        copy.innerText = "Copy";
        }, 3000);
    })

    .catch((error) => {
        console.error("Copy failed:", error);
    });
}
// var btnShare = document.querySelector(".btn-share");
//         btnShare.addEventListener("click", function() {
//             alert("Bạn đã click vào nút Share!");
//         });
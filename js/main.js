$(document).ready(function () { // Đoạn mã này sẽ chạy khi trang web đã hoàn toàn tải xong và sẵn sàng để tương tác

    $nav = $('.nav');
    $toggleCollapse = $('.toggle-collapse');

    /** click event on toggle menu */
    $toggleCollapse.click(function () {
        $nav.toggleClass('collapse'); // Khi phần tử có class "toggle-collapse" được click, phần tử có class "nav" sẽ thay đổi thêm class "collapse"
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

// AOS Instance
AOS.init();
//Khởi tạo thư viện AOS để thực hiện hiệu ứng cuộn.

});
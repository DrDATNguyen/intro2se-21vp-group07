const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
        document.querySelector(".logo-image").style.display = "none";
    }else{
        localStorage.setItem("status", "open");
        document.querySelector(".logo-image").style.display = "block";
    }
})
function showDashboard() {
    document.querySelector(".dash-content").style.display = "block";
    document.querySelector(".bookmark").style.display = "none";
}

function showBookmark() {
    document.querySelector(".bookmark").style.display = "block";
    document.querySelector(".dash-content").style.display = "none";
}
// function showBookmark() {
//     var bookmarkElement = document.querySelector(".bookmark");  

//     var children = bookmarkElement.querySelectorAll("*"); // Lấy tất cả các thẻ con của phần tử .bookmark
    
//     children.forEach(function(child) {
//         // document.querySelector(".bookmark").style.display = "block";
//         child.style.display = "block"; // Bật hiển thị cho từng thẻ con
//     });
//     // document.querySelector(".bookmark").style.display = "none";

//     document.querySelector(".bookmark").style.display = "block"; 
//     document.querySelector(".dash-content").style.display = "none";
// }
// function showBookmark() {
//     var bookmarkElement = document.querySelector(".bookmark");
//     var children = bookmarkElement.querySelectorAll("*"); 
    
//     children.forEach(function(child) {
//       child.style.display = "initial"; 
//     });
  
//     document.querySelector(".dash-content").style.display = "none";
//   }
  
// function showBookmark() 
// {
//     // document.getElementById('showw').innerHTML = document.getElementById('dash board bookmark').innerHTML;
//     // document.getElementById('showw').innerHTML = document.getElementById('dash board dash-content').innerHTML;
//     document.querySelector(".dashboard.bookmark").style.display = "block";
//     document.querySelector(".dashboard.dash-content").style.display = "none";
// }
// function showDashboard() {
//     document.querySelector(".dash-content").style.visibility = "visible";
//     document.querySelector(".bookmark").style.visibility = "hidden";
// }
// function showBookmark() {
//     document.querySelector(".bookmark").style.visibility = "visible";
//     document.querySelector(".dash-content").style.visibility = "hidden";
// }

// function showBookmark() {
//     var bookmarkElements = document.getElementsByClassName("bookmark");
//     var dashContentElements = document.getElementsByClassName("dash-content");

//     for (var i = 0; i < bookmarkElements.length; i++) {
//         bookmarkElements[i].style.display = "block";
//     }

//     for (var j = 0; j < dashContentElements.length; j++) {
//         dashContentElements[j].style.display = "none";
//     }
// }
// function showDashboard() {
//     var bookmarkElements = document.getElementsByClassName("bookmark");
//     var dashContentElements = document.getElementsByClassName("dash-content");

//     for (var i = 0; i < bookmarkElements.length; i++) {
//         bookmarkElements[i].style.display = "none";
//     }

//     for (var j = 0; j < dashContentElements.length; j++) {
//         dashContentElements[j].style.display = "block";
//     }
// }
const paginationLinks = document.querySelectorAll('.pgn__num');
const prevButton = document.querySelector('.pgn__prev');
const nextButton = document.querySelector('.pgn__next');
const postsPerPage = 2; // Số lượng bài viết hiển thị trên mỗi trang
let currentPage = 1;
const blogsDataElement = document.getElementById('blogsData');
const parsedBlogs = JSON.parse(blogsDataElement.value);
const totalPages = Math.ceil(parsedBlogs.length / postsPerPage);

// Hàm để hiển thị danh sách bài viết
function displayPosts(pageNumber) {
  const startIndex = (pageNumber - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  const blogList = document.querySelector('.blog-list');
  blogList.innerHTML = ''; // Xóa nội dung cũ

  for (let i = startIndex; i < Math.min(endIndex, parsedBlogs.length); i++) {
    const post = parsedBlogs[i];
    const postElement = document.createElement('article'); // Tạo phần tử bài viết
    postElement.className = 'brick entry format-standard animate-this';

    // Tạo phần tử hình ảnh
    const entryThumb = document.createElement('div');
    entryThumb.className = 'entry__thumb';
    const thumbLink = document.createElement('a');
    thumbLink.href = `/blogs/${post.slug}`;
    thumbLink.className = 'thumb-link';
    const img = document.createElement('img');
    img.src = `data:${post.img.contentType};base64,${post.img.data.toString('base64')}`;
    img.className = 'card-img';
    img.alt = '...';
    thumbLink.appendChild(img);
    entryThumb.appendChild(thumbLink);
    postElement.appendChild(entryThumb);

    // Tạo phần tử văn bản
    const entryText = document.createElement('div');
    entryText.className = 'entry__text';
    const entryHeader = document.createElement('div');
    entryHeader.className = 'entry__header';
    const entryMeta = document.createElement('div');
    entryMeta.className = 'entry__meta';
    const entryCatLinks = document.createElement('span');
    entryCatLinks.className = 'entry__cat-links';
    entryCatLinks.textContent = post.author;
    entryMeta.appendChild(entryCatLinks);
    entryHeader.appendChild(entryMeta);
    const entryTitle = document.createElement('h1');
    entryTitle.className = 'entry__title';
    const titleLink = document.createElement('a');
    titleLink.href = `/blogs/${post.slug}`;
    titleLink.textContent = post.title;
    entryTitle.appendChild(titleLink);
    entryHeader.appendChild(entryTitle);
    entryText.appendChild(entryHeader);

    const entryExcerpt = document.createElement('div');
    entryExcerpt.className = 'entry__excerpt';
    const p = document.createElement('p');
    p.textContent = post.introduction;
    entryExcerpt.appendChild(p);
    entryText.appendChild(entryExcerpt);

    postElement.appendChild(entryText);

    blogList.appendChild(postElement);
  }
}

// Sự kiện click trang số
paginationLinks.forEach(link => {
  link.addEventListener('click', function (event) {
    event.preventDefault();

    const pageNumber = parseInt(link.getAttribute('data-page'));
    currentPage = pageNumber;
    displayPosts(pageNumber);
  });
});

// Sự kiện click nút prev
prevButton.addEventListener('click', function (event) {
  event.preventDefault();
  if (currentPage > 1) {
    currentPage--;
    displayPosts(currentPage);
  }
});

// Sự kiện click nút next
nextButton.addEventListener('click', function (event) {
  event.preventDefault();
  if (currentPage < totalPages) {
    currentPage++;
    displayPosts(currentPage);
  }
});

// Ban đầu hiển thị trang đầu tiên
displayPosts(currentPage);

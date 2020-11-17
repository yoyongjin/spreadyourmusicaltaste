let posts = [];

const $mainBoard = document.querySelector('.main-board');
const $mainMain = document.querySelector('.main-main');

// functions
const renderPost = () => {
  $mainBoard.innerHTML = '';
  $mainBoard.innerHTML += posts.map((post, i) => `<li class="main-post">
      <span class="main-post-image image${i}"><span class="main-post-image-hole"></span></span>
      <div class="main-post-contents">
      </div>
      <div class="main-post-like main-post-scrap" >
        <span class="main-post-postTitle">${post.title}</span>
        <span class="main-post-songTitle">${post.content}</span>
      </div>
      <img class="record-needle" src="https://static.thenounproject.com/png/1892806-200.png" alt="바늘" />
  </li>`).join('');
};

const applyThumbnail = () => {
  const items = [...document.querySelectorAll('.main-post-image')];
  items.forEach((item, i) => {
    console.log(item, posts[i]);
    item.classList.add(`image${i}`);
    item.style.backgroundImage = `url('${posts[i].music.thumbnail}')`;
  });
};

const request = {
  get(url) {
    return fetch(url);
  }
};

const displayLoading = () => {
  const $imgContainer = document.createElement('div');
  const $img = document.createElement('img');
  const imgUrl = '../image/record.png';
  $imgContainer.classList.add('loading-container');
  $img.classList.add('loading-img');
  $img.setAttribute('src', imgUrl);
  $imgContainer.appendChild($img);
  $mainMain.appendChild($imgContainer);
};

const loadNextPosts = () => {
  const { scrollY } = window;
  console.log(scrollY);
  if (scrollY + document.body.getBoundingClientRect().height + 10 >= $mainMain.scrollHeight) {
    displayLoading();
    setTimeout(async () => {
      const res = await request.get('/posts');
      const _posts = await res.json();
      posts = [...posts, ..._posts];
      renderPost();
      applyThumbnail();
      document.querySelector('.loading-container').remove();
    }, 800);
  }
};

// events
window.onload = () => {
  (async () => {
    const res = await request.get('/posts');
    posts = await res.json();
    renderPost();
    applyThumbnail();
  })();
};

document.onscroll = _.throttle(loadNextPosts, 500);
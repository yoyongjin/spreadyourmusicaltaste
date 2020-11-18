let posts = [];
let userInfo; // 로그인한 회원정보

const $userName = document.querySelector('.main-nav-top-username');
const $mainBoard = document.querySelector('.main-board');
const $mainMain = document.querySelector('.main-main');
const $icon = document.querySelector('.scroll-icon');

// functions
const renderPost = () => {
  $mainBoard.innerHTML = '';
  $mainBoard.innerHTML += posts.map(post => `<li class="main-post ${post.id}">
      <span class="main-post-image"><span class="main-post-image-hole"></span></span>
      <div class="main-post-contents">
      </div>
      <div class="main-post-like main-post-scrap" >
        <span class="main-post-postTitle">${post.title}</span>
        <span class="main-post-songTitle">${post.content}</span>
      </div>
      <img class="record-needle" src="https://static.thenounproject.com/png/1892806-200.png" alt="바늘" />
  </li>`).join('');
};

const displayUserName = userInfo => {
  $userName.textContent = `${userInfo.nickname}님 안녕하세요.`;
};

const applyThumbnail = () => {
  const items = [...document.querySelectorAll('.main-post-image')];
  items.forEach((item, i) => {
    item.classList.add(`${posts[i].id}`);
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
  if (scrollY + document.body.getBoundingClientRect().height >= $mainMain.scrollHeight + 50) {
    displayLoading();
    setTimeout(async () => {
      const res = await request.get('/posts');
      const _posts = await res.json();
      posts = [...posts, ..._posts];
      renderPost();
      applyThumbnail();
      document.querySelector('.loading-container').remove();
    }, 700);
  }
};

const displayBtn = () => {
  const { scrollY } = window;
  console.log(scrollY);
  $icon.style.display = scrollY >= 450 ? 'block' : 'none';
};

// events
window.onload = () => {
  (async () => {
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);
    const res = await request.get('/posts');
    posts = await res.json();
    renderPost();
    applyThumbnail();
    displayBtn();
  })();
};

document.onscroll = _.throttle(() => {
  loadNextPosts();
  displayBtn();
}, 500);

$mainBoard.onclick = e => {
  if (e.target.matches('ul')) return;

  console.log(e.target.closest('li').classList[1]);
  sessionStorage.setItem('post-id', e.target.closest('li').classList[1]);
  window.location.assign('./posted-page.html');
};

$icon.onclick = () => {
  window.scroll({ top: 0, left: 0, behavior: 'smooth' });
};
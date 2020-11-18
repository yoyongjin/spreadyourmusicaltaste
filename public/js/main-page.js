let posts = [];
let userInfo; // 로그인한 회원정보
let pageCount = 1;
let isLastPage = false;
let orderState = 'recent';
let sortBy = 'Date';

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

const isEqualArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
    return true;
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
  if (scrollY + document.body.getBoundingClientRect().height >= $mainMain.scrollHeight + 50 && !isLastPage) {
    displayLoading();
    setTimeout(async () => {
      sortBy = orderState === 'recent' ? 'date'
       : orderState === 'like' ? 'like' : 'scrap';
      const res = await request.get(`/posts?_page=${pageCount + 1}&_limit=6&_sort=${sortBy}&_order=asc`);
      const _posts = await res.json();

      if (_posts.length < 6) { // 마지막페이지인 경우
        console.log('마지막페이지 입니다.');
        console.log(_posts);
        posts = [...posts, ..._posts];
        renderPost();
        applyThumbnail();
        document.querySelector('.loading-container').remove();
        isLastPage = true;
        return;
      }
      pageCount++;
      posts = [...posts, ..._posts];
      renderPost();
      applyThumbnail();
      document.querySelector('.loading-container').remove();
      isLastPage = false;
    }, 700);
  }
};

const displayBtn = () => {
  const { scrollY } = window;
  $icon.style.display = scrollY >= 450 ? 'block' : 'none';
};

// events
window.onload = () => { 
  (async () => {
    sortBy = orderState === 'recent' ? 'date'
       : orderState === 'like' ? 'like' : 'scrap';
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);
    const res = await request.get(`/posts?_page=1&_limit=6&_sort=${sortBy}&_order=desc`);
    posts = await res.json();
    console.log(posts);
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

$sortBtn.onclick = () => {
  if ($orderPanel.classList.contains('slide-up')) {
    $orderPanel.classList.add('slide-down');
    $orderPanel.classList.remove('slide-up');
    return;
  }
  $orderPanel.classList.remove('slide-down');
  $orderPanel.classList.add('slide-up');
};

$orderPanel.onclick = e => {
  console.log(e.target.classList[1]);
  orderState = e.target.classList[1];
  document.querySelector('.selected').classList.remove('selected');
  e.target.classList.add('selected');
  $orderPanel.classList.remove('slide-up');
  $orderPanel.classList.add('slide-down');
  (async () => {
    sortBy = orderState === 'recent' ? 'date'
       : orderState === 'like' ? 'like' : 'scrap';
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);
    const res = await request.get(`/posts?_page=1&_limit=6&_sort=${sortBy}&_order=desc`);
    posts = await res.json();
    console.log(posts);
    renderPost();
    applyThumbnail();
    displayBtn();
  })();
};

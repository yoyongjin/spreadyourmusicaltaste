let posts = [];
let userInfo; // 로그인한 회원정보
let pageCount = 1;
let isLastPage = false;
let orderState = 'recent';
let sortBy = 'date';

const $userName = document.querySelector('.main-nav-top-username');
const $mainBoard = document.querySelector('.main-board');
const $mainMain = document.querySelector('.main-main');
const $icon = document.querySelector('.scroll-icon');

// 포스팅 노래 렌더 함수
const renderPost = () => {
  $mainBoard.innerHTML = '';
  $mainBoard.innerHTML += posts.map(post => `<li class="main-post ${post.id}">
      <span class="main-post-image"><span class="main-post-image-hole"></span></span>
      <div class="main-post-contents">
      </div>
      <div class="main-post-like" >
        <span class="main-post-postTitle">${post.title}</span>
        <span class="main-post-songTitle">${post.content}</span>
      </div>
      <img class="record-needle" src="https://static.thenounproject.com/png/1892806-200.png" alt="바늘" />
  </li>`).join('');
};
// 상단에 로그인 유저 아이디 출력
const displayUserName = userInfo => {
  $userName.textContent = `${userInfo.nickname}님 안녕하세요.`;
};
// 유튜브 api에서 가져온 썸네일 렌더해주는 함수
const applyThumbnail = () => {
  const items = [...document.querySelectorAll('.main-post-image')];
  items.forEach((item, i) => {
    item.classList.add(`${posts[i].id}`);
    item.style.backgroundImage = `url('${posts[i].music.thumbnail}')`;
  });
};

const addNewWrite = () => {
  
};

const request = {
  get(url) {
    return fetch(url);
  }
};
// 로딩화면
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
// 다음 데이터 확인해서 출력
const loadNextPosts = () => {
  const { pageYOffset } = window;
  if (pageYOffset + document.body.getBoundingClientRect().height >= $mainMain.scrollHeight + 50 && !isLastPage) {
    displayLoading();
    setTimeout(async () => {
      sortBy = (orderState === 'recent') ? 'date'
        : (orderState === 'like' ? 'like.length' : 'scrap.length');
      const res_length = await request.get('/posts');
      const _posts_length = await res_length.json();
      
      const pageNum = Math.ceil(_posts_length.length / 6);
      const res = await request.get(`/posts?_page=${pageCount + 1}&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
      const _posts = await res.json();
      pageCount++;
      if (_posts.length < 6 || pageNum === pageCount) { // 마지막페이지인 경우
        posts = [...posts, ..._posts];
        renderPost();
        applyThumbnail();
        document.querySelector('.loading-container').remove();
        isLastPage = true;
        return;
      }
      posts = [...posts, ..._posts];
      renderPost();
      applyThumbnail();
      document.querySelector('.loading-container').remove();
      isLastPage = false;
    }, 300);
  }
};
// 스크롤 상단으로 옮겨주는 버튼 출력
const displayBtn = () => {
  const { scrollY } = window;
  $icon.style.display = scrollY >= 450 ? 'block' : 'none';
};

// events
window.onload = () => {
  (async () => {
    sortBy = orderState === 'recent' ? 'date'
      : orderState === 'like' ? 'like.length' : 'scrap.length';
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);
    const res = await request.get(`/posts?_page=1&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
    posts = await res.json();
    renderPost();
    applyThumbnail();
    displayBtn();
  })();
};
// 스크롤 이벤트 스로틀
document.onscroll = _.throttle(() => {
  loadNextPosts();
  displayBtn();
}, 500);

$mainBoard.onclick = e => {
  if (e.target.matches('ul')) return;
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
  window.scroll({ top: 0, left: 0 });
  orderState = e.target.classList[1];
  document.querySelector('.selected').classList.remove('selected');
  e.target.classList.add('selected');
  $orderPanel.classList.remove('slide-up');
  $orderPanel.classList.add('slide-down');
  (async () => {
    sortBy = orderState === 'recent' ? 'date'
      : orderState === 'like' ? 'like.length' : 'scrap.length';
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);
    pageCount = 1;
    isLastPage = false;
    const res = await request.get(`/posts?_page=1&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
    posts = await res.json();
    renderPost();
    applyThumbnail();
    displayBtn();
  })();
};

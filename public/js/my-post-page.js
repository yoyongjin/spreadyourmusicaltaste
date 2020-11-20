let posts = []; // 로드된 자료들을 담고있는 배열
let userInfo; // 로그인한 회원정보
let currPageNum = 1;
let orderState = 'recent';
let sortBy = 'date';
let totalPageNum = 0; // 페이지 갯수 구하기 위해서 선언한 변수

const $userName = document.querySelector('.main-nav-top-username');
const $mainBoard = document.querySelector('.main-board');
const $mainMain = document.querySelector('.main-main');
const $icon = document.querySelector('.scroll-icon');
const $sortBtn = document.querySelector('.sort');
const $orderPanel = document.querySelector('.order-panel');

// functions
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

const displayUserName = () => {
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

const determineSortBy = () => {
  sortBy = (orderState === 'recent') ? 'date' : (orderState === 'like' ? 'likeLength' : 'scrapLength');
}; //정렬기준 구하는 함수

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
  if (window.pageYOffset + window.innerHeight
    === document.body.scrollHeight) {
    if (posts.length < 6 || totalPageNum === currPageNum) return;

    displayLoading();

    setTimeout(async () => {
      determineSortBy();// 정렬기준 확인
      // 마이 포스팅 시작
      const res = await request.get(`/posts?_page=${++currPageNum}&_limit=6&_sort=${sortBy},id&_order=desc,desc&writter_like=\\b${userInfo.id}\\b`);
      const _posts = await res.json();
      // 마이 포스팅 끝
      posts = [...posts, ..._posts];
      renderPost();
      applyThumbnail();

      document.querySelector('.loading-container').remove();
    }, 300);
  }
};

const displayBtn = () => {
  $icon.style.display = window.scrollY >= 450 ? 'block' : 'none';
};

// events
window.onload = () => {
  (async () => {
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);

    // 마이 포스팅 시작
    const totalRes = await request.get(`/posts?writter_like=\\b${userInfo.id}\\b`);
    const _posts = await totalRes.json();
    totalPageNum = Math.ceil(_posts.length / 6); // 전체 데이터의 페이지 수 -> totalPageNum
    console.log(totalPageNum);

    const res = await request.get(`/posts?writter_like=\\b${userInfo.id}\\b&_page=1&_limit=6&_sort=${sortBy},id&_order=desc,desc`); // 첫번째 페이지 자료 요청
    posts = await res.json(); // 전역변수 posts에 첫번째 페이지를 위한 배열을 할당
    // 마이 포스팅 끝
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
    determineSortBy();

    userInfo = JSON.parse(sessionStorage.getItem('user'));
    displayUserName(userInfo);

    currPageNum = 1;

    const res = await request.get(`/posts?_page=1&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
    posts = await res.json();

    renderPost();
    applyThumbnail();
    displayBtn();
  })();
};
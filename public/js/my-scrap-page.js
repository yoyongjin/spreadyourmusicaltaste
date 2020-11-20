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

// 로딩화면 띄워주는 함수
const displayLoading = () => {
  const $imgContainer = document.createElement('div');
  const $img = document.createElement('img');
  const imgUrl = '../image/record.png'; // 이미지 경로

  $imgContainer.classList.add('loading-container'); // 클래스 부여
  $img.classList.add('loading-img');

  $img.setAttribute('src', imgUrl); // 이미지경로 설정

  $imgContainer.appendChild($img); // DOM요소들간의 연결
  $mainMain.appendChild($imgContainer);
};

// 다음 페이지를 확인해서 출력
const loadNextPosts = () => {
  // 문서가 수직으로 얼마나 스크롤되었는가를 픽셀단위로 반환하는 pageYOffset 저장

  if (window.pageYOffset + window.innerHeight
    === document.body.scrollHeight) { // 문서의 최하단에 닿으면 다음단계 진행
    if (posts.length < 6 || totalPageNum === currPageNum) return;
    // 현재 로드된 post의 갯수가 6개 미만이면 마지막 페이지로 간주, 아무 행동도 하지 않는다.
    // 현재 페이지 숫자가 전체 페이지 숫자와 같으면 아무 행동도 하지 않는다.
    displayLoading(); // 로딩화면 게시
    setTimeout(async () => { // 서버와 통신하여 다음 페이지 요청
      determineSortBy();// 정렬기준 확인

      const res = await request.get(`/posts?scrap_like=\\b${userInfo.id}\\b&_page=${++currPageNum}&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
      const _posts = await res.json(); // 다음 페이지 자료 요청

      posts = [...posts, ..._posts]; // posts 배열에 로드한 요소들 추가
      renderPost();
      applyThumbnail();

      document.querySelector('.loading-container').remove(); // 로딩화면 돔에서 제거
    }, 300);
  }
};

const displayBtn = () => {
  const { scrollY } = window;
  $icon.style.display = scrollY >= 450 ? 'block' : 'none';
};

// events
window.onload = () => {
  (async () => {
    determineSortBy(); // 정렬 기준 구하기

    userInfo = JSON.parse(sessionStorage.getItem('user')); // 세션스토리지에서 현재 로그인한 회원정보 저장
    displayUserName(userInfo); // 로그인한 회원정보를 출력

    const resForPages = await request.get('/posts'); // 전체 페이지 수를 구하기 위한 posts 라우트 전체 요청
    const _posts = await resForPages.json();
    totalPageNum = Math.ceil(_posts.length / 6); // 전체 데이터의 페이지 수 -> totalPageNum
    console.log(totalPageNum);

    const res = await request.get(`/posts?scrap_like=\\b${userInfo.id}\\b&_page=1&_limit=6&_sort=${sortBy},id&_order=desc,desc`);
    posts = await res.json(); // 전역변수 posts에 첫번째 페이지를 위한 배열을 할당
    renderPost(); // 현재까지 로드된 자료들을 담고있는 배열인 posts를 이용해서 렌더하는 함수 실행
    applyThumbnail(); // posts들에 썸네일 적용해주는 함수
    displayBtn(); // 스크롤링시 상단으로 한번에 이동시켜주는 이벤트 버튼 출력
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
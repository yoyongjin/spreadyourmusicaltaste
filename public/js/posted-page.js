// status
let posts;
let scrap;
let like;

// doms
const $postedPageWritterInfo = document.querySelector('.posted-page-writter-info');
const $postedPageTitle = document.querySelector('.posted-page-title');
const $postedPageWritter = document.querySelector('.posted-page-writter');
const $postedPageTime = document.querySelector('.posted-page-time');
const $postedPageContent = document.querySelector('.posted-page-content');
const $postedpageAlbum = document.querySelector('.posted-page-album');
const $postedpageYtTitle = document.querySelector('.posted-page-youtube-title');
const $postedPageStatus = document.querySelector('.posted-page-status');
const $postedPageLikeBtn = document.querySelector('.posted-page-likeBtn');
const $postedPageScrapBtn = document.querySelector('.posted-page-scrapBtn');

// functions
const request = {
  get(url) {
    return fetch(url);
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
};

const renderWritterInfo = post => {
  $postedPageTitle.textContent = post.title;
  $postedPageWritter.textContent = post.writter;
  $postedPageTime.textContent = post.date;
  $postedPageContent.textContent = post.content;
  $postedpageAlbum.style.backgroundImage = `url('${post.music.thumbnail}')`;
  $postedpageYtTitle.textContent = post.music.title;
  $postedPageScrapBtn.nextElementSibling.textContent = post.scrap.length;
  $postedPageLikeBtn.nextElementSibling.textContent = post.like.length;
};

const checkPressedLikeBtn = () => {
  like.filter(_like => _like === sessionStorage.getItem('user-id'));
};
const checkPressedScrapBtn = () => {

};

// Events
window.onload = () => {
  console.log(sessionStorage.getItem('post-id'));
  (async () => {
    const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
    const post = await res.json();
    console.log(post);
    renderWritterInfo(post);
  })();
  sessionStorage.setItem('user-id', 'kym'); // 나중에 삭제할 부분@@@@@@@@@@@@@
};

$postedpageAlbum.onmouseenter = e => {
  console.log(e.target);
};

$postedPageStatus.onclick = e => {
  if (!e.target.matches('button')) return;

  console.log(e.target);
  if (e.target.classList[1] === 'scrap') {
    (async () => {
      const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
      const post = await res.json();
      scrap = post.scrap;
      console.log(scrap);
      scrap.push(sessionStorage.getItem('post-id'));
      
      const res2 = await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap });
      //scrap의 프로퍼티값으로 현재 로그인된 사람 아이디 넣기
      const post2 = await res2.json();
      console.log(post2.scrap.length);
      $postedPageScrapBtn.nextElementSibling.textContent = post.scrap.length;
    })();
  } else if (e.target.classList[1] === 'like') {
    (async () => {
      const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
      const post = await res.json();
      like = post.like;
      console.log(like);
      like.push(sessionStorage.getItem('post-id'));
      
      const res2 = await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like });
      //like의 프로퍼티 값으로 현재 로그인된 사람 아이디 넣기.
      const post2 = await res2.json();
      console.log(post2.like.length);
      $postedPageLikeBtn.nextElementSibling.textContent = post.like.length;
    })();
  }
};
// status
let scrap;
let like;
let userInfo;

// doms
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
  if (like.find(_like => _like === userInfo.id)) {
    console.log('이미 좋아요 했습니다.');
    return true;
  }
  return false;
};
const checkPressedScrapBtn = () => {
  if (scrap.find(_scrap => _scrap === userInfo.id)) {
    console.log('이미 스크랩 했습니다.');
    return true;
  }
  return false;
};

const removeUserLike = () => like.filter(_like => _like !== userInfo.id);

const removeUserScrap = () => scrap.filter(_scrap => _scrap !== userInfo.id);

// Events
window.onload = () => {
  (async () => {
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    console.log(userInfo);
    const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
    const post = await res.json();
    console.log(post);
    renderWritterInfo(post);
  })();
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
      if (checkPressedScrapBtn()) {
        scrap = removeUserScrap();
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap: [...scrap] });
        $postedPageScrapBtn.nextElementSibling.textContent = scrap.length;
        return;
      }
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap: [userInfo.id, ...scrap] });
      scrap = [userInfo.id, ...scrap];

      $postedPageScrapBtn.nextElementSibling.textContent = scrap.length;
    })();
  } else if (e.target.classList[1] === 'like') {
    (async () => {
      const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
      const post = await res.json();

      like = post.like;
      if (checkPressedLikeBtn()) {
        like = removeUserLike();
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like: [...like] });
        $postedPageLikeBtn.nextElementSibling.textContent = like.length;
        return;
      }
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like: [userInfo.id, ...like] });
      like = [userInfo.id, ...like];

      $postedPageLikeBtn.nextElementSibling.textContent = like.length;
    })();
  }
};
// status
let scrap;
let like;
let userInfo;
let isSelected = false;

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
const $postedPageDelete = document.querySelector('.posted-page-delete');
const $postedPageEdit = document.querySelector('.posted-page-edit');
const $postedSongDetail = document.querySelector('.posted-page-song-detail');
const $postedPageYtlink = document.querySelector('.posted-page-youtube-link');

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
  },
  delete(url) {
    return fetch(url, {
      method: 'DELETE'
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
  $postedPageYtlink.setAttribute('href', post.music.url);
};

const checkPressedLikeBtn = arr => {
  if (arr.find(_like => _like === userInfo.id)) {
    console.log('이미 좋아요 했습니다.');
    return true;
  }
  return false;
};
const checkPressedScrapBtn = arr => {
  if (arr.find(_scrap => _scrap === userInfo.id)) {
    console.log('이미 스크랩 했습니다.');
    return true;
  }
  return false;
};

const removeUserLike = () => like.filter(_like => _like !== userInfo.id);
const removeUserScrap = () => scrap.filter(_scrap => _scrap !== userInfo.id);

const deletePost = url => {
  request.delete(url);
};

const checkIfWritter = postWritter => {
  if (userInfo.id !== postWritter) {
    $postedPageEdit.style.display = 'none';
    $postedPageDelete.style.display = 'none';
  }
};

// Events
window.onload = () => {
  (async () => {
    userInfo = JSON.parse(sessionStorage.getItem('user'));
    console.log(userInfo);
    const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
    const post = await res.json();
    console.log(post.writter);
    renderWritterInfo(post);
    checkIfWritter(post.writter);
    if (checkPressedLikeBtn(post.like)) $postedPageLikeBtn.classList.add('pressed');
    if (checkPressedScrapBtn(post.scrap)) $postedPageScrapBtn.classList.add('pressed');
  })();
};

$postedpageAlbum.onclick = e => {
  console.log(e.target);
  isSelected = true;
  e.target.classList.add('selected');
  $postedSongDetail.classList.add('selected');
  e.target.style.transform = 'translateX(-40%)';
};

document.onclick = e => {
  if (e.target === $postedpageAlbum) return;
  document.querySelector('.posted-page-album.selected').classList.remove('selected');
  document.querySelector('.posted-page-song-detail.selected').classList.remove('selected');
  $postedpageAlbum.style.transform = 'translateX(0%)';
  isSelected = false;
};

$postedPageStatus.onclick = e => {
  if (!e.target.matches('button')) return;

  console.log(e.target);
  if (e.target.classList[1] === 'scrap') {
    (async () => {
      const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
      const post = await res.json();

      scrap = post.scrap;
      if (checkPressedScrapBtn(scrap)) {
        scrap = removeUserScrap();
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap: [...scrap] });
        $postedPageScrapBtn.nextElementSibling.textContent = scrap.length;
        $postedPageScrapBtn.classList.remove('pressed');
        return;
      }
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap: [userInfo.id, ...scrap] });
      scrap = [userInfo.id, ...scrap];
      $postedPageScrapBtn.nextElementSibling.textContent = scrap.length;
      $postedPageScrapBtn.classList.add('pressed');
    })();
  } else if (e.target.classList[1] === 'like') {
    (async () => {
      const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
      const post = await res.json();

      like = post.like;
      if (checkPressedLikeBtn(like)) {
        like = removeUserLike();
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like: [...like] });
        $postedPageLikeBtn.nextElementSibling.textContent = like.length;
        $postedPageLikeBtn.classList.remove('pressed');
        return;
      }
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like: [userInfo.id, ...like] });
      like = [userInfo.id, ...like];

      $postedPageLikeBtn.nextElementSibling.textContent = like.length;
      $postedPageLikeBtn.classList.add('pressed');
    })();
  }
};

$postedPageDelete.onclick = () => {
  deletePost(`/posts/${sessionStorage.getItem('post-id')}`);
  window.location.assign('./main-page.html');
};

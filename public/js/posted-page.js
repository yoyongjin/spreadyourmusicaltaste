// status
let scrap;
let like;
let userInfo;
let isSelected = false;
// 페이크 프레임 확인 변수
let checkIndex = false;

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
const $postedProfileImage = document.querySelector('.posted-profile-image');
const $likeFakeThumbs = document.querySelectorAll('.like-fakethumbs');

// 페이크 프레임
const $fakeFrame = document.querySelector('.fake-frame');

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
  // 프로필 이미지 랜덤 추출
  const random = Math.floor((Math.random() * 20) + 1);
  // 프로필 이미지 추가
  $postedProfileImage.setAttribute('src', `./image/profile${random}.gif`);
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

document.addEventListener('DOMContentLoaded', async () => {
  userInfo = JSON.parse(sessionStorage.getItem('user'));
  console.log(userInfo);
  const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
  const post = await res.json();
  console.log(post.writter);
  renderWritterInfo(post);
  checkIfWritter(post.writter);
  if (checkPressedLikeBtn(post.like)) $postedPageLikeBtn.classList.add('pressed');
  if (checkPressedScrapBtn(post.scrap)) $postedPageScrapBtn.classList.add('pressed');
});

$postedpageAlbum.onclick = async e => {
  console.log(e.target);
  isSelected = true;
  e.target.classList.add('selected');
  $postedSongDetail.classList.add('selected');
  e.target.style.transform = 'translateX(-40%)';

  // 페이크 프레임 시작
  if (isSelected === true) {
    $fakeFrame.style.transform = 'translateX(-40%)';
  }
  if (checkIndex === false) {
    checkIndex = true;
    return;
  }
  if (checkIndex === true) {
    $fakeFrame.style.zIndex = '10';
  }

  try {
    const res = await request.get(`/posts/${sessionStorage.getItem('post-id')}`);
    const post = await res.json();
    const playmusic = await post.music.musicid;
    $fakeFrame.setAttribute('src', `https://www.youtube.com/embed/${playmusic}`);
  } catch (err) {
    console.error(err);
  }
  // 페이크 프레임 끝
};

document.onclick = e => {
  if (e.target === $postedpageAlbum) return;
  if (document.querySelector('.posted-page-album.selected')) document.querySelector('.posted-page-album.selected').classList.remove('selected');
  if (document.querySelector('.posted-page-song-detail.selected'))document.querySelector('.posted-page-song-detail.selected').classList.remove('selected');
  $postedpageAlbum.style.transform = 'translateX(0%)';
  isSelected = false;

  // 페이크 프레임 시작
  if (isSelected === false) {
    $fakeFrame.style.transform = 'translateX(0%)';
  }
  if (checkIndex === true) {
    checkIndex = false;
    $fakeFrame.style.zIndex = '-10';
    $fakeFrame.removeAttribute('src');
  }
  // 페이크 프레임 끝
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
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap: [...scrap], scrapLength: scrap.length });
        $postedPageScrapBtn.nextElementSibling.textContent = scrap.length;
        $postedPageScrapBtn.classList.remove('pressed');
        return;
      }
      scrap = [userInfo.id, ...scrap];
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { scrap, scrapLength: scrap.length });
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
        await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like: [...like], likeLength: like.length });
        $postedPageLikeBtn.nextElementSibling.textContent = like.length;
        $postedPageLikeBtn.classList.remove('pressed');
        return;
      }
      like = [userInfo.id, ...like];
      await request.patch(`/posts/${sessionStorage.getItem('post-id')}`, { like, likeLength: like.length });

      $postedPageLikeBtn.nextElementSibling.textContent = like.length;
      $postedPageLikeBtn.classList.add('pressed');
    })();
  }
};

$postedPageDelete.onclick = () => {
  deletePost(`/posts/${sessionStorage.getItem('post-id')}`);
  window.location.assign('./index.html');
};

// 좋아요 이벤트
$postedPageLikeBtn.onclick = e => {
  if (e.target.classList.contains('pressed')) {
    [...$likeFakeThumbs].forEach(fakethumb => fakethumb.classList.remove('thumbsup'));
    return;
  }
  [...$likeFakeThumbs].forEach(fakethumb => fakethumb.classList.add('thumbsup'));
};

// 게시물 수정 
$postedPageEdit.onclick = e => {
  window.location.assign('post-fixed-page.html');
};
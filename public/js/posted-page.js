// status
let posts;

// doms
const $postedPageWritterInfo = document.querySelector('.posted-page-writter-info');
const $postedPageTitle = document.querySelector('.posted-page-title');
const $postedPageWritter = document.querySelector('.posted-page-writter');
const $postedPageTime = document.querySelector('.posted-page-time');
const $postedPageContent = document.querySelector('.posted-page-content');
const $postedpageAlbum = document.querySelector('.posted-page-album');
const $postedpageYtTitle = document.querySelector('.posted-page-youtube-title');

// functions
const request = {
  get(url) {
    return fetch(url);
  }
};

const renderWritterInfo = post => {
  $postedPageTitle.textContent = post.title;
  $postedPageWritter.textContent = post.writter;
  $postedPageTime.textContent = post.date;
  $postedPageContent.textContent = post.content;
  $postedpageAlbum.style.backgroundImage = `url('${post.music.thumbnail}')`;
  $postedpageYtTitle.textContent = post.music.title;
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
};

$postedpageAlbum.onmouseenter = e => {
  console.log(e.target);
};
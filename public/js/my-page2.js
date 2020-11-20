// Doms
const $userNickName = document.querySelector(".user-nick-name");
const $profileImage = document.querySelector(".profile-image");

const $scrapNumber = document.querySelector(".scrap-number");
const $postingNumber = document.querySelector(".posting-number");

const userKey = "AIzaSyCkcVgTMMnc53VeCFxsSftqKBctr9WOf0U";

// 마이뮤직
const $addMusicBtn = document.querySelector('.add-mymusic-btn');
const $searchCoverContainer = document.querySelector('.search-cover-container');
const $searchMusicCancel = document.querySelector('.search-music-cancel');
const $searchMoreBtnWrapper = document.querySelector('.search-more-btn-wrapper');
const $inputSearchMusic = document.querySelector('.input-search-music');
const $musicLists = document.querySelector('.music-lists');
const $previousBtn = document.querySelector('.previous-page-btn');
const $nextBtn = document.querySelector('.next-page-btn');
const $myMusicBox = document.querySelector('.mymusic-box');
const $myMusic = document.querySelector('.my-music');
const $logOutBtn = document.querySelector('.log-out-btn');

let count;
let selectedData;
let musicItems;
let videoId;

const {
  id: currUserId,
  pw: currUserPw,
  nickname: currUserNickName,
} = JSON.parse(sessionStorage.getItem('user'));

// 로딩 이벤트
window.addEventListener("load", async () => {
  // 세션 스토리지 user 정보 받아올 변수
  // const {
  //   id: currUserId,
  //   pw: currUserPw,
  //   nickname: currUserNickName
  // } = JSON.parse(sessionStorage.getItem('user'));

  // 프로필 이미지 랜덤 추출
  const random = Math.floor(Math.random() * 20 + 1);
  // 프로필 이미지 추가
  $profileImage.setAttribute("src", `./image/profile${random}.gif`);
  // 유저 닉네임 추가
  $userNickName.textContent = `${currUserNickName}님`;

  try {
    // 게시물 정보 획득
    const res = await fetch("/posts");
    const newPosts = await res.json();
    const postCount = await newPosts.filter(
      (post) => post.writter === currUserId
    );
    const scraps = await newPosts.map((post) => post.scrap).flat();
    const scrapCount = await scraps.filter((scrap) => scrap === currUserId);

    $postingNumber.textContent = `${postCount.length}`;
    $scrapNumber.textContent = `${scrapCount.length}`;

    // 프로필 음악 정보 획득
    const result = await fetch(`/mymusic?id_like=\\b${currUserId}\\b`);
    const myMusic = await result.json();

    if (myMusic.length === 1) {
      $myMusicBox.innerHTML = "";
      $myMusicBox.innerHTML = `<a class="my-music" href="${myMusic["0"].url}" style="background-image: url(${myMusic["0"].thumbnail});"></a>`;
    }
  } catch (err) {
    console.error(err);
  }
});

// 프로필 음악 추가 버튼
$addMusicBtn.onclick = () => {
  $searchCoverContainer.classList.add("active");
  $musicLists.innerHTML = "";
  $inputSearchMusic.value = "";
};

// 검색창 닫기
$searchMusicCancel.onclick = () => {
  $searchCoverContainer.classList.remove("active");
  $searchMoreBtnWrapper.classList.remove("showBtn");
  $inputSearchMusic.value = "";
  [...$musicLists.children].forEach((musicList) =>
    $musicLists.removeChild(musicList)
  );
};

// 검색창 변경시 초기화
$inputSearchMusic.onchange = () => {
  $musicLists.innerHTML = "";
};

// 검색어 찾기
$inputSearchMusic.onkeyup = async (e) => {
  if (e.key !== "Enter" || $inputSearchMusic.value === "") return;

  count = 0;
  $previousBtn.style.display = "none";

  setTimeout(() => {
    $searchMoreBtnWrapper.classList.add("showBtn");
  }, 400);

  const musicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&key=${userKey}`;

  try {
    const res = await fetch(musicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;
    $musicLists.innerHTML = "";
    $musicLists.innerHTML += musicLists.items
      .map(
        (item) => `<li class='${item.id.videoId}'>
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class='search-music-radio' name='checking' type='radio'><label>
        </li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
};

// 선택된 음악 전송
const renderSelectedMusic = () => {
  selectedData = musicItems.items.find((item) => item.id.videoId === videoId);
  $myMusicBox.innerHTML = "";
  $myMusicBox.innerHTML = `<a class="my-music" href="https://www.youtube.com/watch?v=${selectedData.id.videoId}" style="background-image: url(${selectedData.snippet.thumbnails.medium.url});"></a>`;
};

// 검색된 음악 선택
$musicLists.onclick = async (e) => {
  if (!e.target.matches(".search-music-title")) return;

  videoId = e.target.parentNode.className;

  $searchCoverContainer.classList.remove("active");

  renderSelectedMusic();
  const newMusic = {
    id: `${currUserId}`,
    thumbnail: `${selectedData.snippet.thumbnails.medium.url}`,
    url: `https://www.youtube.com/watch?v=${selectedData.id.videoId}`,
  };
  console.log(newMusic);

  try {
    const res = await fetch(`/mymusic?id_like=\\b${currUserId}\\b`);
    const myMusicCheck = await res.json();

    // 프로필 음악을 설정하지 않은 유저라면 Post
    if (myMusicCheck.length === 0) {
      await fetch("/mymusic", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newMusic),
      });
    }

    // 프로필 음악을 설정한 유저라면 Patch
    if (myMusicCheck.length === 1) {
      await fetch(`/mymusic/${currUserId}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newMusic),
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// 다음 검색 결과 보기
$nextBtn.onclick = async () => {
  const nextMusicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&pageToken=${musicItems.nextPageToken}&key=${userKey}`;

  $previousBtn.style.display = "block";
  count++;

  setTimeout(() => {
    $searchMoreBtnWrapper.classList.add("showBtn");
  }, 400);

  try {
    const res = await fetch(nextMusicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;

    $musicLists.innerHTML = musicLists.items
      .map(
        (item) => `<li class='${item.id.videoId}'>
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class='search-music-radio' name='checking' type='radio'><label>
        </li>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
};

// 이전 검색 결과 보기
$previousBtn.onclick = async () => {
  const nextMusicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&pageToken=${musicItems.prevPageToken}&key=${userKey}`;

  try {
    const res = await fetch(nextMusicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;
    // console.log(musicLists);

    $musicLists.innerHTML = musicLists.items
      .map(
        (item) => `<li class='${item.id.videoId}'>
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class='search-music-radio' name='checking' type='radio'><label>
        </li>`
      )
      .join("");

    count--;
    setTimeout(() => {
      $searchMoreBtnWrapper.classList.add("showBtn");
    }, 400);

    if (count < 1) {
      $previousBtn.style.display = "none";
      return;
    }
  } catch (err) {
    console.error(err);
  }
};

$logOutBtn.onclick = () => {
  sessionStorage.clear();
  window.location.assign('login.html');
};

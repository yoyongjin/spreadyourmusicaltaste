let videoId;
let selectedData;
let musicItems;
let count;
let count1 = 0; // 유튜브 노래 선택여부
let count2 = 0; // 게시글 제목 작성 여부
let count3 = 0; // 게시글 내용 작성여부
const userKey = 'AIzaSyBHqXzcGxlePRMoN3A34Y93cIANHJkzxXc';

//DOMs
const $addMusic = document.querySelector(".add-music-btn");
const $searchCoverContainer = document.querySelector(".search-cover-container");
const $searchMusicCancel = document.querySelector(".search-music-cancel");
const $inputSearchMusic = document.querySelector(".input-search-music");
const $searchMoreBtnWrapper = document.querySelector(".search-more-btn-wrapper");
const $musicLists = document.querySelector(".music-lists");
const $selectedMusic = document.querySelector(".selected-music");
const $previousBtn = document.querySelector(".previous-page-btn");
const $nextBtn = document.querySelector(".next-page-btn");
const $completeBtn = document.querySelector(".complete-btn");
const $cancleBtn = document.querySelector(".cancel-btn");
const $postTitle = document.querySelector(".post-title");
const $postContent = document.getElementById("post-content");
const $contentShowError = document.querySelector(".content-show-error");
const $titleShowError = document.querySelector(".title-show-error");
const $searchMusicTitle = document.querySelector('.search-music-title');

// Event Handler
window.onload = () => {
  $postTitle.value = "";
  $postContent.value = "";
  $inputSearchMusic.value = "";
};

$addMusic.onclick = () => {
  $searchCoverContainer.classList.add("active");
};

// 검색창 닫기
$searchMusicCancel.onclick = () => {
  $searchCoverContainer.classList.remove("active");
  $searchMoreBtnWrapper.classList.remove("showBtn");
  $inputSearchMusic.value = "";
  [...$musicLists.children].forEach(musicList => $musicLists.removeChild(musicList));
};

$inputSearchMusic.onchange = () => {
  $musicLists.innerHTML = "";
};

// 검색어 찾기
$inputSearchMusic.onkeyup = async (e) => {
  if (e.key !== "Enter" || $inputSearchMusic.value === "") return;

  count = 0;
  $previousBtn.style.display = "none";
  count1 = 1;

  if (count1 + count2 + count3 === 3) $completeBtn.disabled = false;
  setTimeout(() => {
    $searchMoreBtnWrapper.classList.add("showBtn");
  }, 400);

  const musicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&key=${userKey}`;

  try {
    const res = await fetch(musicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;
    // console.log(musicLists);
    $musicLists.innerHTML = "";
    $musicLists.innerHTML += musicLists.items
      .map((item) => {
        return `<li class="${item.id.videoId}">
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class="search-music-radio" name='checking' type='radio'><label>
        </li>`;
      })
      .join("");
  } catch (err) {
    console.error(err);
  }
};

// 검색된 음악 선택
$musicLists.onclick = (e) => {
  if (!e.target.matches(".search-music-title")) return;

  // console.log(e.target);
  videoId = e.target.parentNode.className;

  $searchCoverContainer.classList.remove("active");

  renderSelectedMusic();
};

// 선택된 음악 랜더
const renderSelectedMusic = () => {
  selectedData = musicItems.items.find((item) => {
    return item.id.videoId === videoId;
  });

  $selectedMusic.innerHTML = "";
  $selectedMusic.innerHTML = `<img class='render-music-thumbnail' src="${selectedData.snippet.thumbnails.medium.url}" alt="${selectedData.snippet.title}"> <span class='render-music-title'>${selectedData.snippet.title}</span>`;
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
    // console.log(musicLists);

    $musicLists.innerHTML = musicLists.items
      .map((item) => {
        return `<li class="${item.id.videoId}">
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class="search-music-radio" name='checking' type='radio'><label>
        </li>`;
      })
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
      .map((item) => {
        return `<li class="${item.id.videoId}">
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class="search-music-radio" name='checking' type='radio'><label>
        </li>`;
      })
      .join("");

    count--;
    setTimeout(() => {
      $searchMoreBtnWrapper.classList.add("showBtn");
    }, 400);
    //console.log(musicItems.prevPageToken);

    if (count < 1) {
      $previousBtn.style.display = "none";
      return;
    }
  } catch (err) {
    console.error(err);
  }
};
// 제목 최대 입력 글자수 제한
$postTitle.oninput = () => {
  const titleLength = $postTitle.value.length;
  if (titleLength >= 30) {
    $postTitle.textContent = $postTitle.value.substring(0, 30);
    $titleShowError.textContent = "입력 가능한 글자수를 초과하였습니다.";
  } else {
    $titleShowError.textContent = "";
  }
};
// 게시물 최대 입력 글자수 제한
$postContent.oninput = () => {
  const contentLength = $postContent.value.length;
  if (contentLength >= 250) {
    $postContent.value = $postContent.value.substring(0, 250);
    $contentShowError.textContent = "입력 가능한 글자수를 초과하였습니다.";
  } else {
    $contentShowError.textContent = "";
  }
};

document.body.onkeyup = (e) => {
  if (!e.key === "Enter" || !$inputSearchMusic.value) return;

  if (e.target === $inputSearchMusic) count1 = 1;

  if ($postContent.value !== "") count3 = 1;
  else count3 = 0;

  if ($postTitle.value !== "") count2 = 1;
  else count2 = 0;

  if (count1 + count2 + count3 === 3 && $postContent.value.length < 250 && $postTitle.value.length < 30) {
    $completeBtn.disabled = false;
    $completeBtn.style["box-shadow"] = "0 0 4px 5px skyblue inset";
    $completeBtn.style.cursor = "pointer";
    $completeBtn.classList.add("satisfied");
  } else {
    $completeBtn.disabled = true;
    $completeBtn.style.cursor = "default";
    $completeBtn.style["box-shadow"] = "";
    $completeBtn.classList.remove("satisfied");
  }
};

// 작성 완료하기
$completeBtn.onclick = async () => {
  const loginUser = JSON.parse(sessionStorage.getItem("user"));
  const today = new Date();

  if ($postTitle.value === "" || $postContent.value === "") return;

  try {
    const res = await fetch("/posts");
    const posts = await res.json();
    // const postId = posts.length
    //   ? Math.max(...posts.map((post) => post.id)) + 1
    //   : 1;

    const postingData = {
      writter: loginUser.id,
      date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
      music: {
        thumbnail: selectedData.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${selectedData.id.videoId}`,
        title: selectedData.snippet.title,
        musicid: selectedData.id.videoId
      },
      content: $postContent.value,
      title: $postTitle.value,
      like: [],
      scrap: [],
      likeLength: 0,
      scrapLength: 0,
    };
    // console.log(postingData);
    await fetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postingData),
    });
    window.location.assign("/index.html");
  } catch (err) {
    console.error(err);
  }
};

// 작성 취소하기
$cancleBtn.onclick = () => {
  window.location.assign("index.html");
};

//게시물 없을 때 작성 완료 버튼 비활성화
if($postContent.textContent === '') {
  $completeBtn.setAttribute('disabled');
}

$searchMusicTitle.onmouseenter = e => {
  e.target.parentNode.style.background = 'linear-gradient(45deg, #ff0a6c, #4a3cdb)';
};

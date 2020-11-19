let videoId;
let selectedData;
let musicItems;
let count;

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

// 작성된 내용 DB에 보내기
const $completeBtn = document.querySelector(".complete-btn");
const $cancleBtn = document.querySelector(".cancel-btn");
const $postTitle = document.querySelector(".post-title");
const $postContent = document.getElementById("post-content");


// Event Handler
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

  setTimeout(() => {
    $searchMoreBtnWrapper.classList.add("showBtn");
  }, 400);

  const musicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&key=AIzaSyAc3Bpa6FdYzU_4MAk5IltowVJdbW8jlsU`;

  try {
    const res = await fetch(musicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;
    // console.log(musicLists);
    $musicLists.innerHTML = '';
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
  const nextMusicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&pageToken=${musicItems.nextPageToken}&key=AIzaSyAc3Bpa6FdYzU_4MAk5IltowVJdbW8jlsU`;

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
  const nextMusicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&pageToken=${musicItems.prevPageToken}&key=AIzaSyAc3Bpa6FdYzU_4MAk5IltowVJdbW8jlsU`;

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

$completeBtn.onclick = async () => {
  const loginUser = JSON.parse(sessionStorage.getItem("user"));
  const today = new Date();

  if ($postTitle.value === "" || $postContent.value === "") return;
  try {
    const res = await fetch("/posts");
    const posts = await res.json();
    const postId = posts.length
      ? Math.max(...posts.map((post) => post.id)) + 1
      : 1;

    const postingData = {
      id: postId,
      writter: loginUser.nickname,
      date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
      music: {
        thumbnail: selectedData.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${selectedData.id.videoId}`,
        title: selectedData.snippet.title,
      },
      content: $postContent.value,
      title: $postTitle.value,
      like: [],
      scrap: [],
    };
    // console.log(postingData);
    await fetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postingData),
    });
    window.location.assign("/main-page.html");
  } catch (err) {
    console.error(err);
  }
};

// 작성 취소하기
$cancleBtn.onclick = () => {
  window.location.assign("main-page.html");
};

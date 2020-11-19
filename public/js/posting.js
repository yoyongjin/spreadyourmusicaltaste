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

// Event Handler
$addMusic.onclick = () => {
  $searchCoverContainer.classList.add("active");
};

$searchMusicCancel.onclick = () => {
  $searchCoverContainer.classList.remove("active");
  $searchMoreBtnWrapper.classList.remove("showBtn");
  $inputSearchMusic.value = "";
  [...$musicLists.children].forEach(musicList => $musicLists.removeChild(musicList));
};

$inputSearchMusic.onchange = () => {
  $musicLists.innerHTML = "";
};

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

$musicLists.onclick = e => {
  if (!e.target.matches(".search-music-title")) return;

  // console.log(e.target);
  videoId = e.target.parentNode.className;

  $searchCoverContainer.classList.remove("active");

  renderSelectedMusic();
};

const renderSelectedMusic = () => {
  selectedData = musicItems.items.find((item) => {
    return item.id.videoId === videoId;
  });

  $selectedMusic.innerHTML = "";
  $selectedMusic.innerHTML = `<img class='render-music-thumbnail' src="${selectedData.snippet.thumbnails.medium.url}" alt="${selectedData.snippet.title}"> <span class='render-music-title'>${selectedData.snippet.title}</span>`;
};

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

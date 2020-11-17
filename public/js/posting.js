let videoId;
let selectedData;
let musicItems;

//DOMs
const $addMusic = document.querySelector(".add-music-btn");
const $searchCoverContainer = document.querySelector(".search-cover-container");
const $searchMusicCancel = document.querySelector(".search-music-cancel");
const $inputSearchMusic = document.querySelector(".input-search-music");
const $musicLists = document.querySelector(".music-lists");
const $selectedMusic = document.querySelector(".selected-music");

// Event Handler
$addMusic.onclick = () => {
  $searchCoverContainer.classList.add("active");
};

$searchMusicCancel.onclick = () => {
  $searchCoverContainer.classList.remove("active");
  $inputSearchMusic.value = "";
  [...$musicLists.children].forEach((musicList) =>
    $musicLists.removeChild(musicList)
  );
};

$inputSearchMusic.onkeyup = async (e) => {
  if (e.key !== "Enter" || $inputSearchMusic.value === "") return;

  const musicUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${$inputSearchMusic.value}&key=AIzaSyBmXKte4MYkU1dWxEOcSdTag5Ew0wXE0T0`;

  try {
    const res = await fetch(musicUrl);
    musicItems = await res.json();
    const musicLists = await musicItems;
    console.log(musicLists);

    $musicLists.innerHTML += musicLists.items
      .map((item) => {
        return `<li class="${item.id.videoId}">
          <img class='search-music-thumbnail' src='${item.snippet.thumbnails.medium.url}'><label class='search-music-title'>${item.snippet.title}<input class="search-music-radio" name='checking' type='radio'><label>
        </li>`;
      })
      .join("");
    // 여기에 함수
  } catch (err) {
    console.error(err);
  }
};

$musicLists.onclick = (e) => {
  if (!e.target.matches(".search-music-title")) return;

  console.log(e.target);
  videoId = e.target.parentNode.className;

  $searchCoverContainer.classList.remove("active");

  renderSelectedMusic();
};

const renderSelectedMusic = () => {
  selectedData = musicItems.items.filter((item) => {
    return item.id.videoId === videoId;
  });
  $selectedMusic.innerHTML = "";
  $selectedMusic.innerHTML = `<img src="${selectedData[0].snippet.thumbnails.medium.url}" alt="${selectedData[0].snippet.title}"> <span>${selectedData[0].snippet.title}</span>`;
};

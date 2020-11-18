// Doms
const $userNickName = document.querySelector('.user-nick-name');
const $profileImage = document.querySelector('.profile-image');

// 로딩 이벤트
window.addEventListener('DOMContentLoaded', () => {
  
  if (!sessionStorage.getItem('user')) {
    window.location.assign('login.html');
  }

  // 세션 스토리지 user 정보 받아올 변수
  const { id: currUserId, pw: currUserPw, nickname: currUserNickName } = JSON.parse(sessionStorage.getItem('user'));
  // 프로필 이미지 랜덤 추출
  const random = Math.floor((Math.random() * 20) + 1);
  // 프로필 이미지 추가
  $profileImage.setAttribute('src', `./image/profile${random}.gif`);
  // 유저 닉네임 추가
  $userNickName.textContent = `${currUserNickName}님`;
});
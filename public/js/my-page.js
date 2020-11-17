window.onload = e => {
  const $profileImage = document.querySelector('.profile-image');
  const random = Math.floor((Math.random() * 20) + 1);
  $profileImage.setAttribute('src', `./image/profile${random}.gif`);
}



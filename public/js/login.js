const $idInput = document.getElementById('idInput');
const $pwInput = document.getElementById('pwInput');
const $loginBtn = document.querySelector('.login-btn');
const $joinLink = document.querySelector('.join-link');
const $idError = document.querySelector('.id-error');
const $pwError = document.querySelector('.pw-error');
const $userError = document.querySelector('.user-error');


$loginBtn.onclick = async () => {
  $idError.textContent = '';
  $pwError.textContent = '';
  $userError.textContent = '';
  if(!$idInput.value) {
    $idError.textContent = '아이디를 입력해주세요';
    $idInput.focus();
    return;
  } else if(!$pwInput.value) {
    $pwError.textContent = '비밀번호를 입력해주세요';
    $pwInput.focus();
    return;
  }
  try {
    const res = await fetch('/users');
    const users = await res.json();
    const checkUser = await users.find(user => user.id === $idInput.value && user.pw === $pwInput.value);
    if(checkUser) {
      sessionStorage.setItem('user', JSON.stringify(users))
      location.assign('main-page.html')
    } else {
      $userError.textContent = '가입하지 않은 아이디이거나, 잘못된 비밀번호입니다';
      $pwInput.value = '';
      $pwInput.focus();
    }
  } catch(err) {
    console.error(err);
  }
}

$joinLink.onclick = () => {
  location.assign('signup.html');
}
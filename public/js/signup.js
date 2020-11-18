// DOMs
const $inputId = document.getElementById('inputId');
const $inputPw = document.getElementById('inputPw');
const $ckPassword = document.getElementById('ckPassword');
const $inputNickname = document.getElementById('input-nickname');
const $signupBtn = document.querySelector('.signup-btn');

const $idError = document.querySelector('.id-error');
const $pwError = document.querySelector('.pw-error');
const $checkPwError = document.querySelector('.check-pw-error');
const $nickNameError = document.querySelector('.nickname-error');

const $userInfo = document.querySelectorAll('.signup-items input');


// Event Handler

// 아이디 입력창 이벤트
$inputId.onblur = async () => {
  const idReg = /^[A-Za-z0-9+]{6,12}$/;

  $idError.textContent = '';

  if (!$inputId.value.trim()) {
    $idError.textContent = '필수 입력 항목입니다.';
    return;
  }
  if (!idReg.test($inputId.value)) {
    $idError.textContent = '6~12자의 영문자, 숫자만 사용가능합니다.';
    return;
  }

  try {
    const res = await fetch('/users');
    const users = await res.json();
    const checkId = await users.find(user => $inputId.value === user.id);

    if (checkId) {
      $idError.textContent = '이미 존재하는 아이디입니다.';
      return;
    }
  } catch (err) {
    console.error(err);
  }
};


// 비밀번호 입력 이벤트
$inputPw.onblur = () => {

  const pwReg = /^[A-Za-z0-9+]{8,12}$/;

  $pwError.textContent = '';

  if (!$inputPw.value.trim()) {
    $pwError.textContent = '필수 입력 항목입니다.';
    return;
  }
  if (!pwReg.test($inputPw.value)) {
    $pwError.textContent = '8~12자의 영문자, 숫자만 사용가능합니다.';
    // return;
  }
};

// 비밀번호 확인 이벤트
$ckPassword.onblur = () => {
  $checkPwError.textContent = '';

  if (!$ckPassword.value.trim()) {
    $checkPwError.textContent = '필수 입력 항목입니다.';
    return;
  }
  if ($ckPassword.value !== $inputPw.value) {
    $checkPwError.textContent = '비밀번호가 일치하지 않습니다.';
    // return;
  }

};

// 닉네임 확인 이벤트
$inputNickname.onblur = async () => {
  $nickNameError.textContent = '';

  if (!$inputNickname.value.trim()) {
    $nickNameError.textContent = '필수 입력 항목입니다.';
    return;
  }

  try {
    const res = await fetch('/users');
    const users = await res.json();
    const checkNickname = await users.find(user => user.nickname === $inputNickname.value);
    if (checkNickname) {
      $nickNameError.textContent = '이미 존재하는 닉네임 입니다.';
      return;
    } 
  } catch (err) {
    console.error(err);
  }
};

$signupBtn.onmouseenter = e => {
  // $inputNickname.focusout();
  const userCheck = [...$userInfo].filter(userInfo => userInfo.value.length);
  if (userCheck.length < 4) return;
  $signupBtn.classList.add('focus-btn');
};

// 가입하기 버튼 이벤트
$signupBtn.onclick = async () => {
  const userCheck = [...$userInfo].filter(userInfo => userInfo.value.length);
  if (userCheck.length !== 4) return;
  const newUser = {
    id: $inputId.value,
    pw: $inputPw.value,
    nickname: $inputNickname.value
  };
  try {
    await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    sessionStorage.setItem('user', JSON.stringify(newUser));
    window.location.assign('main-page.html');
  } catch (err) {
    console.error(err);
  }
};

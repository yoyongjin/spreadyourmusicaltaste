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

// 정규 표현식
const idReg = /^[A-Za-z0-9+]{6,12}$/;
const pwReg = /^[A-Za-z0-9+]{8,12}$/;

// 아이디 입력창 이벤트
$inputId.onblur = async () => {

  $idError.textContent = '';

  if (!$inputId.value.trim()) {
    $idError.textContent = '필수 입력 항목입니다.';
    $inputId.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }
  if (!idReg.test($inputId.value)) {
    $idError.textContent = '6~12자의 영문자, 숫자만 사용가능합니다.';
    $inputId.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }

  try {
    const res = await fetch('/users');
    const users = await res.json();
    const checkId = await users.find(user => $inputId.value === user.id);

    if (checkId) {
      $idError.textContent = '이미 존재하는 아이디입니다.';
      $inputId.style.boxShadow = '0 0 2pt 4pt red';
      return;
    }
    $inputId.style.boxShadow = '0 0 2pt 4pt yellowgreen';
  } catch (err) {
    console.error(err);
  }
};

// 비밀번호 입력 이벤트
$inputPw.onblur = () => {

  $pwError.textContent = '';

  if (!$inputPw.value.trim()) {
    $pwError.textContent = '필수 입력 항목입니다.';
    $inputPw.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }
  if (!pwReg.test($inputPw.value)) {
    $pwError.textContent = '8~12자의 영문자, 숫자만 사용가능합니다.';
    $inputPw.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }
  $inputPw.style.boxShadow = '0 0 2pt 4pt yellowgreen';
};

// 비밀번호 확인 이벤트
$ckPassword.onblur = () => {
  $checkPwError.textContent = '';

  if (!$ckPassword.value.trim()) {
    $checkPwError.textContent = '필수 입력 항목입니다.';
    $ckPassword.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }
  if ($ckPassword.value !== $inputPw.value) {
    $checkPwError.textContent = '비밀번호가 일치하지 않습니다.';
    $ckPassword.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }
  $ckPassword.style.boxShadow = '0 0 2pt 4pt yellowgreen';
};

// 닉네임 확인 이벤트
$inputNickname.onblur = async () => {
  $nickNameError.textContent = '';
  const userCheck = [...$userInfo].filter(userInfo => userInfo.value.length);

  if (!$inputNickname.value.trim()) {
    $nickNameError.textContent = '필수 입력 항목입니다.';
    $inputNickname.style.boxShadow = '0 0 2pt 4pt red';
    return;
  }

  try {
    const res = await fetch('/users');
    const users = await res.json();
    const checkNickname = await users.find(user => user.nickname === $inputNickname.value);
    if (checkNickname) {
      $nickNameError.textContent = '이미 존재하는 닉네임 입니다.';
      $inputNickname.style.boxShadow = '0 0 2pt 4pt red';
      $inputNickname.focus();
      return;
    } 
    $inputNickname.style.boxShadow = '0 0 2pt 4pt yellowgreen';
    $signupBtn.classList.add('focus-btn');
    if (userCheck < 4) return;
    $signupBtn.style.backgroundColor = 'yellowgreen';
  } catch (err) {
    console.error(err);
  }
};


// $signupBtn.onmouseenter = () => {
//   const userCheck = [...$userInfo].filter(userInfo => userInfo.value.length);
//   $signupBtn.style.backgroundColor = 'red';
//   if (userCheck.length < 4) return;
//   $signupBtn.style.backgroundColor = 'yellowgreen';
//   $signupBtn.classList.add('focus-btn');
// };

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
    const res = await fetch('/users');
    const users = await res.json();
    const checkId = await users.find(user => $inputId.value === user.id);
    if (checkId) {
      $signupBtn.style.backgroundColor = 'red';
      return;
    }
    $signupBtn.style.backgroundColor = 'yellowgreen';
    await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    sessionStorage.setItem('user', JSON.stringify(newUser));
    setTimeout(() => { window.location.assign('index.html')}, 1000);
  } catch (err) {
    console.error(err);
  }
};

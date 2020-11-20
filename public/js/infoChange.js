// Doms

const $displayId = document.querySelector('.display-id');
const $changeCompleteBtn = document.querySelector('.change-complete-btn');
const $changeCompleteBtn2 = document.querySelector('.change-complete-btn2');
const $checkPw = document.querySelector('.check-pw');
const $changePw = document.querySelector('.change-pw');
const $changingPw = document.querySelector('.changing-pw');
const $changedPw = document.querySelector('.changed-pw');
const $changePwInput = document.querySelector('.change-pw-input');
const $changingPwInput = document.querySelector('.changing-pw-input');
const $changedPwInput = document.querySelector('.changed-pw-input');
const $changeBtnWrapper = document.querySelector('.change-btn-wrapper');
const $changeBtnWrapper2 = document.querySelector('.change-btn-wrapper2');
const $myNick = document.querySelector('.my-nick');
const $myNickInput = document.querySelector('.my-nick-input');
const $pwError = document.querySelector('.pw-error');
const $changingPwError = document.querySelector('.changing-pw-error');
const $changedPwError = document.querySelector('.changed-pw-error');
const $changeCancleBtn = document.querySelector('.change-cancel-btn');
const $changeCancleBtn2 = document.querySelector('.change-cancel-btn2');
const $goodByeBtn = document.querySelector('.good-bye-btn');
const $caution = document.querySelector('.caution');
const $cautionCheck = document.querySelector('input[type=checkbox]');
const $cautionCheckBtn = document.querySelector('.caution-check-btn');
const $changeSuccess = document.querySelector('.change-success');
const $backGround = document.querySelector('.back-ground');
const $cautionCloseBtn = document.querySelector('.caution-close-btn');
const $backGround2 = document.querySelector('.back-ground2');
const $changeDone = document.querySelector('.change-done');
const $changeDoneText = document.querySelector('.change-done-text');



// 세션 스토리지 user 정보 받아올 변수
const {id: currId, pw:currPw, nickname: currNickName} = JSON.parse(sessionStorage.getItem('user'));


$displayId.textContent = `${currNickName}님`;

//비밀번호 확인 후 다음페이지
const request = {
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },
  delete(url) {
    return fetch(url, {method: 'DELETE'});
  }
};

const pwChecked = () => {
  if ($changePwInput.value !== currPw) {
    $pwError.textContent = '비밀번호가 일치하지 않습니다.'
  }
  if ($changePwInput.value === currPw) {
    $changePw.style.display = 'none';
    $changePwInput.style.display = 'none';
    $pwError.style.display = 'none';
    $changeBtnWrapper.style.display = 'none';
    $changingPw.style.display = 'block';
    $changeBtnWrapper2.style.display = 'block';
    $myNick.style.display = 'block';
    $changedPw.style.display = 'block';
    $goodByeBtn.style.display = 'block';
  }
}
$changeCompleteBtn.onclick = () => {
  pwChecked();
};

const finishChange = () => {
  const pwReg = /^[A-Za-z0-9+]{8,12}$/;
  $changingPwError.textContent = '';
  $changedPwError.textContent = '';

  if (!$changingPwInput.value) {
    $changingPwError.textContent = '필수 입력 항목입니다.';
    return;
  }
  if (!pwReg.test($changingPwInput.value)) {
    $changingPwError.textContent = '8~12자의 영문자, 숫자만 사용가능합니다.'
    return;
  }
  if ($changingPwInput.value !== $changedPwInput.value || !$changedPwInput.value) {
    $changedPwError.textContent = '비밀번호가 일치하지 않습니다.';
    return;
  }

  
  if ($changingPwInput.value === $changedPwInput.value) {
    const changeUserPw = { id: currId, pw: $changedPwInput.value, nickname: currNickName };
    sessionStorage.setItem('user', JSON.stringify(changeUserPw));

    request.patch(`/users/${sessionStorage.getItem('user.id')}`, {
      pw: `${currPw}`
    }).then(response => response.json())
      // .then(users => console.log(users))
      .then(_user => JSON.parse(_user))
      .then(patched_user => { console.log(patched_user); })
      .catch(err => console.error(err));
    window.location.assign('my-page.html');
  } 

  if ($changingPwInput.value === $changedPwInput.value && $myNickInput.value) {
    const changeUserInfo = { id: currId, pw: $changedPwInput.value, nickname: $myNickInput.value };
    sessionStorage.setItem('user', JSON.stringify(changeUserInfo));
    window.location.assign('my-page.html');

    const request = {
      patch(url, payload) {
        return fetch(url, {
          method: 'PATCH',
          headers: { 'content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    }

    request.patch(`/users/${JSON.parse(sessionStorage.getItem('user')).id}`, {
      pw: `${currPw}`, nickname: `${currNickName}`
    }).then(response => response.json())
      .then(users => console.log(users))
      .catch(err => console.error(err));
    request.patch(`/users/${sessionStorage.getItem('user.nickname')}`, {
      pw: `${currNickName}`
    }).then(response => response.json())
      .then(users => console.log(users))
      .catch(err => console.error(err));
  }

  else{
    $changeDoneText.textContent = '비밀번호가 일치하지 않습니다.';
    setTimeout(() => {
      history.go();
    }, 1500);
  }
}
$changeCompleteBtn2.onclick = () => {
  
  $backGround2.style.display = 'block';
  $changeDone.style.display = 'block';
  // $backGround2.style.display = 'block';
  

  const timerId = setTimeout(finishChange, 1500);
  // clearTimeout(timerId);

  
}
$changedPwInput.onkeyup = e => {
  if(e.key == 'Enter') {
    finishChange();
  }
}
$myNickInput.onkeyup = e => {
  if(e.key == 'Enter') {
    finishChange();
  }
}

//개인정보 변경을 위한 비밀번호 확인
$changePwInput.onkeyup = e => {
  if(e.key === 'Enter') {
    pwChecked();
  }
};



$changeCancleBtn.onclick = () => {
  window.location.assign('my-page.html');
};

$changeCancleBtn2.onclick = () => {
  window.location.assign('my-page.html');
};

//회원 탈퇴(good-bye) : db.json에서 삭제
$goodByeBtn.onclick = () => {
  $caution.style.display = 'block';
  $backGround.style.display = 'block';

  $cautionCloseBtn.onclick = () => {
    console.log(1);
    $caution.style.display = 'none';
    $backGround.style.display = 'none';
  }


  $cautionCheckBtn.onclick = () => {
    console.log(JSON.parse(sessionStorage.getItem('user')).id)
    
    request.delete(`/users/${JSON.parse(sessionStorage.getItem('user')).id}`)
      .then(users => users.json())
      .then(users_fixed => console.log(users_fixed))
      .catch(err => console.error(err));
    window.location.assign('login.html'); 
  };  
};






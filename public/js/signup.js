// DOMs
const $inputId = document.getElementById("inputId");
const $inputPw = document.getElementById("inputPw");
const $ckPassword = document.getElementById("ckPassword");
const $nickname = document.getElementById("nickname");
const $signupBtn = document.querySelector(".signup-btn");

const $idError = document.querySelector(".id-error");
const $pwError = document.querySelector(".pw-error");
const $checkPwError = document.querySelector(".check-pw-error");
const $nickNameError = document.querySelector(".nickname-error");

// const fetchUsers = () => {
//   fetch("/users")
//     .then((res) => res.json())
//     .then((_user) => (user = _user))
//     .catch(console.error);
// };

// Event Handler

$inputId.onblur = () => {
  let idReg = /^[A-Za-z0-9+]{6,12}$/;
  // !idReg.test($myId.value)
  // console.log($myId.value.length);
  if (!idReg.test($inputId.value)) {
    $idError.textContent = "6~12자의 영문자, 숫자만 사용가능합니다.";
  }
};

$inputPw.onblur = () => {
  let pwReg = /^[A-Za-z0-9+]{8,12}$/;
  if (!pwReg.test($inputId.value)) {
    $pwError.textContent = "8~12자의 영문자, 숫자만 사용가능합니다.";
  }
};

$ckPassword.onblur = () => {
  if ($ckPassword.value !== $inputPw.value) {
    $checkPwError.textContent = "비밀번호가 일치하지 않습니다.";
  }
};

$signupBtn.onclick = async (e) => {
  const newUser = { id: $inputId.value, pw: $inputPw.value };
  try {
    const res = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    todos = await res.json();
  } catch (err) {
    console.error(err);
  }
};

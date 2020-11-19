// 비정상적 접근 차단
if (!document.referrer) {
  location.assign('login.html');
}
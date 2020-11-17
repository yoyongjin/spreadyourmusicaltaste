const $displayId = document.querySelector('.display-id');

const request = {
  get (url) {
    return fetch(url);
  }
};

window.onload = e => {
  (async () => {
    const res = await request.get('/users');
    console.log(res);
    const users = await res.json();
    console.log(users);

    $displayId.textContent = users[0].id;
  })();
};


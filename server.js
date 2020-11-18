// server.js
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// db.json를 조작하기 위해 lowdb를 사용
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

function compare(key) {
  return (a, b) => (a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0));
}

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.delete('/todos/completed', (req, res) => {
  // lowdb를 사용해서 db.json에서 completed: true인 todo를 제거
  db.get('todos')
    .remove({ completed: true })
    .write();

  // todos를 응답
  res.send(db.get('todos').value());
});

// server.get('/posts?_page=:page&_limit=6&_sort=:sortBy&_order=desc', (req, res) => {
//   const { sortBy } = req.params;

//   if (sortBy === 'recent') {
//     db.get('posts')
//       .sort(compare('Date'))
//       .write();

//     res.send(db.get('posts').value());
//   }// 최신순 정렬경우
// });

// Use default router
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});

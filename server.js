const http = require('http');
const { parse } = require('url');

let posts = [];
let nextId = 1;

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function notFound(res) {
  sendJSON(res, 404, { error: 'Not Found' });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1e6) req.connection.destroy();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject();
      }
    });
  });
}

function validatePost(data, isUpdate = false) {
  const errors = [];
  if (!isUpdate || data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.length < 3 || data.title.length > 120)
      errors.push('Title is required (3–120 chars)');
  }
  if (!isUpdate || data.content !== undefined) {
    if (typeof data.content !== 'string' || data.content.length < 10)
      errors.push('Content is required (min 10 chars)');
  }
  if (!isUpdate || data.author !== undefined) {
    if (typeof data.author !== 'string' || !data.author.trim())
      errors.push('Author is required');
  }
  if (data.published !== undefined && typeof data.published !== 'boolean')
    errors.push('Published must be boolean');
  return errors;
}

function getPostById(id) {
  return posts.find(p => p.id === id);
}

const server = http.createServer(async (req, res) => {
  const urlObj = parse(req.url, true);
  const { pathname, query } = urlObj;
  const method = req.method;

  // GET /posts
  if (method === 'GET' && pathname === '/posts') {
    let result = posts;
    if (query.q) {
      const q = query.q.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }
    if (query.published === 'true' || query.published === 'false') {
      const pub = query.published === 'true';
      result = result.filter(p => p.published === pub);
    }
    return sendJSON(res, 200, result);
  }

  // GET /posts/:id
  if (method === 'GET' && /^\/posts\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[2]);
    const post = getPostById(id);
    if (!post) return notFound(res);
    return sendJSON(res, 200, post);
  }

  // POST /posts
  if (method === 'POST' && pathname === '/posts') {
    let data;
    try {
      data = await parseBody(req);
    } catch {
      return sendJSON(res, 400, { error: 'Invalid JSON' });
    }
    const errors = validatePost(data);
    if (errors.length) return sendJSON(res, 400, { errors });
    const now = new Date().toISOString();
    const post = {
      id: nextId++,
      title: data.title,
      content: data.content,
      author: data.author,
      published: typeof data.published === 'boolean' ? data.published : false,
      createdAt: now,
      updatedAt: now
    };
    posts.push(post);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(post));
    return;
  }

  // PUT /posts/:id
  if (method === 'PUT' && /^\/posts\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[2]);
    const post = getPostById(id);
    if (!post) return notFound(res);
    let data;
    try {
      data = await parseBody(req);
    } catch {
      return sendJSON(res, 400, { error: 'Invalid JSON' });
    }
    const errors = validatePost(data);
    if (errors.length) return sendJSON(res, 400, { errors });
    post.title = data.title;
    post.content = data.content;
    post.author = data.author;
    post.published = typeof data.published === 'boolean' ? data.published : false;
    post.updatedAt = new Date().toISOString();
    return sendJSON(res, 200, post);
  }

  // PATCH /posts/publish/:id
  if (method === 'PATCH' && /^\/posts\/publish\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[3]);
    const post = getPostById(id);
    if (!post) return notFound(res);
    let data;
    try {
      data = await parseBody(req);
    } catch {
      return sendJSON(res, 400, { error: 'Invalid JSON' });
    }
    if (typeof data.published !== 'boolean')
      return sendJSON(res, 400, { errors: ['Published must be boolean'] });
    post.published = data.published;
    post.updatedAt = new Date().toISOString();
    return sendJSON(res, 200, post);
  }

  // DELETE /posts/:id
  if (method === 'DELETE' && /^\/posts\/\d+$/.test(pathname)) {
    const id = Number(pathname.split('/')[2]);
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return notFound(res);
    posts.splice(idx, 1);
    res.writeHead(204);
    res.end();
    return;
  }

  notFound(res);
});

server.listen(3002, () => {
  console.log('Server running at http://localhost:3002');
});

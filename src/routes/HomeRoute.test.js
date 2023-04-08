import { render, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import HomeRoute from './HomeRoute';

const handlers = [
  // クエリストリングはAPIパスに書けない
  rest.get('/api/repositories', (req, res, ctx) => {
    const query = req.url.searchParams('q');
    console.log(query);

    return res(
      ctx.json({
        items: [
          { id: 1, full_name: 'hogehoge' },
          { id: 2, full_name: 'fugafuga' },
        ],
      })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

import { rest } from 'msw';
import { setupServer } from 'msw/node';

/**
 * 以下の問題を解決するため、関数の処理ごと外から引数で渡せるようwrap
 * - 通常、同一エンドポイントだと毎回同じ処理が呼ばれ、同じ値が返るので状況に応じて処理を制御できない
 * - 各テストファイルごとにhandlersを書いても良いが、冗長だし大変
 *
 * 本来の処理はファイル下部のコメントアウト部分を参照
 *
 * @param {Array} handerConfig handlerの配列
 */
export function createServer(handerConfig) {
  const handlers = handerConfig.map((config) => {
    return rest[config.method || 'get'](config.path, (req, res, ctx) => {
      return res(ctx.json(config.res(req, res, ctx)));
    });
  });
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
}

// wrapしない場合はこっちを使う
// const handlers = [
//   // クエリストリングはAPIパスに書けない
//   rest.get('/api/repositories', (req, res, ctx) => {
//     const language = req.url.searchParams.get('q').split(':').at(-1);

//     return res(
//       ctx.json({
//         items: [
//           { id: 1, full_name: `${language}_one` },
//           { id: 2, full_name: `${language}_two` },
//         ],
//       })
//     );
//   }),
// ];
// const server = setupServer(...handlers);

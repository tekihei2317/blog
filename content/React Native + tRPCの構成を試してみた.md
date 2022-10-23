---
title: React Native + tRPCの構成を試してみた
createdAt: 2022-10-23
---

仕事でモバイル+Web管理画面+バックエンドを一人で作ることになりました。バックエンドはLaravelで作ることが多いのですが、全部TypeScriptで書きたかったので、最近話題になっていたtRPCを使った構成を試してみました。

[tRPC - Move Fast and Break Nothing. End-to-end typesafe APIs made easy.](https://trpc.io/)

作ったアプリはこちら。メモの登録ができる簡易的なアプリです。

[tekihei2317/react-native-memo-app](https://github.com/tekihei2317/react-native-memo-app)

使ったライブラリははReact Native（Expo）、tRPC、Express、Prismaです。tRPCのサーバーのアダプタは、ExpressとFastifyから選べます。

## tRPCについて

tRPCは型安全なAPIを作るためのライブラリです。サーバー側とクライアント側を両方TypeScriptで実装する必要があります。

tRPCでは、サーバー側でtRPCのルーターを実装し、その型使ってAPIクライアントを初期化します。こうすることで、APIの呼び出し部分を、TypeScriptの型に守られた関数呼び出しとして書けます。

具体的には、tRPCのルーターは以下のように定義します。この例では、メモの一覧の取得処理と登録処理をもった`memoRouter`を作成し、それをおおもとの`appRouter`に登録しています。

```ts

// backend/src/trpc/router/_memo.ts
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

const createMemoSchema = z.object({
  text: z.string().max(50),
})

const getMemosProcedure = publicProcedure.query(async ({ ctx }) => {
  return await ctx.prisma.memo.findMany()
})

const createMemoProcedure = publicProcedure.input(createMemoSchema).mutation(async ({ ctx, input }) => {
  const memo = await ctx.prisma.memo.create({
    data: input,
  })

  return memo
})

export const memoRouter = router({
  getMemos: getMemosProcedure,
  createMemo: createMemoProcedure,
})

// backend/src/trpc/router/_app.ts
import { router } from '../trpc'
import { memoRouter } from './memo'

export const appRouter = router({
  memo: memoRouter,
})

export type AppRouter = typeof appRouter
```

クライアント側の実装は以下です。tRPCクライアントの実行は、ルーターに登録した関数をそのまま呼び出す感じです。これらの引数や戻り値の型は、サーバー側で定義したものになっています。

```ts
// mobile-app/utils/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { AppRouter } from '../../backend/src/trpc/router/_app'
import superjson from 'superjson'

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: 'http://192.168.1.6:4000/trpc',
    }),
  ],
})

// 使用側
await trpc.memo.createMemo.mutate({ text })
await trpc.memo.getMemos.query()
```

React Queryをラップしたクライアントがあるので、実際はそれを使うことになると思います。

## pnpmを使ってみた

ワークスペースの管理はpnpmを使ってみました。pnpmを使った理由は、npm workspacesとは違ってnode_modulesが各パッケージの中に作られるからです。これは、npmスクリプトを実行しやすいというメリットがあります（npmスクリプトを実行するときは、./node_modules/.binにパスが通る）。

しかし、Expoを使う場合はnode_modulesはプロジェクトルートにある必要があるらしく、npmrcでこの挙動を変える必要がありました。

[Working with Monorepos - Expo Documentation](https://docs.expo.dev/guides/monorepos/)

こうなるとpnpmのメリットが薄れるので、次はいつも通りnpmかyarnを使おうと思います。node_modulesがカレントディレクトリ配下にないときのnpmスクリプトの実行については、今度調べようと思います。

## モジュールの分割について

上記の実装では、サーバー側で定義した型をモバイル側で直接インポートしています。Webも作ることを考えるとちょっと治安が悪くなりそうなので、以下のようにモジュールを分割しようと思っています。

```text
.
├── memo-backend/ tRPCのサーバー側の実装。api-clientからのみ参照可能。
├── memo-mobile/
├── memo-web/
└── packages/
    └── api-client/ tRPCのクライアント。memo-mobileまたはmemo-webからのみ参照可能。
```

api-clientでは、Webやモバイルで使用するもののみ公開します。例えば、tRPCクライアントの初期化に必要なルーターの型や、プロシージャーの入力の型などです。

実際に試してみてから、良かったところや課題を書きたいと思います。

## まとめ

型安全なAPIクライアントには、他にaspidaやzodiosがあります。一応この2つも試してみましたが、zodiosはクライアント側がViteで動かせず、aspidaはコード生成が必要だったので、tRPCが一番使いやすかったです。

npm trendsを見た感じでも、この3つの中ではtRPCが頭ひとつ抜けていました。フルスタックフレームワーク事情にはあまり詳しくないのですが、RemixやNestJSが競合になるのでしょうか。

サーバーサイドTypeScriptが流行ってほしいので、自分も布教していきたいと思います。trpc/serverとPrismaはいいぞ！

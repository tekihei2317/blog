---
title: Prisma Clientを使ってみた感想
createdAt: 2022-10-29
---

## Prismaとは

[Prisma](https://www.prisma.io/)は、Node.jsとTypeScriptのためのデータベースの周辺ツールです。具体的には、データベースクライアントのPrisma Client、データベースのマイグレーションを行うPrisma Migrateなどがあります。この2つは、どちらもPrisma Schemaという独自のスキーマファイルを用います。

Prisma Schemaでは、例えば以下のようにスキーマを定義します。

```ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## やってみたこと

Prisma Clientの使い心地を試してみました。[Realworld](https://github.com/gothinkster/realworld)という記事投稿サービスのテーブルをお題として使いました。

コードはこちら: [https://github.com/tekihei2317/prisma-playground](https://github.com/tekihei2317/prisma-playground)

## 使ってみた感想

リレーション以外の部分は、型のついたSQLのように書けるのでとっつきやすかったです。一方で、ActiveRecord系のフレームワークと比較するとコードの記述量は多くなると感じました。

Prismaの非依存のリレーション（多対多など）には、中間テーブルのモデルを明示的に定義するExplicit relationと、定義しないImplicit relationの2つがあります。Implicit relationのほうが、ネストが1段階なのでクエリがシンプルに記述できます。

しかし、中間テーブルのカラム名が「A」「B」になったり、それ以外のカラムを追加できないなどの制約があります。そのため、例えば中間テーブルにタイムスタンプが必要な場合は、Explicit relationを使う必要があります。

### 参照系

記事とタグが多対多の関係です。これはImplicit relationで表現します。

```prisma
// 属性は省略
model Article {
  id   Int   @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id       Int       @id @default(autoincrement())
  articles Article[]
}
```

記事とタグを同時に取得するには、以下のようにincludesを使ってリレーションを取得します。

```ts
const articleAndTags = await prisma.article.findUnique({
  where: { id: 1 },
  include: { tags: true },
});
```

次はフォローの実装です。フォロー順に表示するためにフォロー日時を登録したいため、Explicit relationで表現します。同じモデル間に複数のリレーションを定義する場合は、リレーションにnameをつける必要があります。

```prisma
model User {
  id             Int      @id @default(autoincrement())
  followers      Follow[] @relation("Followee") // Followのうち、自分がフォローされているもの
  followingUsers Follow[] @relation("Follower") // Followのうち、自分がフォローしているもの
}

model Follow {
  id         Int  @id @default(autoincrement())
  followerId Int
  followeeId Int
  follower   User @relation(name: "Follower", fields: [followerId], references: [id])
  followee   User @relation(name: "Followee", fields: [followeeId], references: [id])

  @@unique([followerId, followeeId])
}
```

```ts
const user = await prisma.user.findFirstOrThrow({
  include: {
    followingUsers: {
      include: { followee: true },
    },
    followers: {
      include: { follower: true }
    }
  }
});
// userがフォローしているユーザー一覧
const followingUsers = user.followingUsers.map((follow) => follow.followee);
// userをフォローしているユーザー一覧
const followers = user.followers.map((follow) => follow.follower);
```

### 更新系

リレーション先を同時に作成したり、既存のデータに関連付けることができます。

```ts
// 記事を作成し、ユーザーと関連付ける
await prisma.article.create({
  data: {
    title: "Prismaを使ってみた",
    description: "Prismaを使ってみた",
    slug: "prisma-wo-tukatte-mita",
    body: "Prismaを使ってみました",
    author: {
      connect: { id: user.id },
    },
  },
});

// 記事に新しくタグを関連付ける
await prisma.article.update({
  where: { id: article.id },
  data: {
    tags: {
      connect: [{ id: tag1.id }, { id: tag2.id }],
    },
  },
});
```

Implicit relationの場合は、上記のようにconnectを使って関連付けるのがシンプルだと思います。Explicit relationで同じようにしようとすると、リレーションが2重になって分かりづらいです。そのため、以下のように素直に中間テーブルにInsertするのがよいと思います。

```ts
// userがanotherUserをフォローする
const follow = await prisma.follow.create({
  data: {
    followerId: user.id,
    followeeId: anotherUser.id,
  },
});
```

## LaravelのEloquentとの比較

Eloquentのほうがシンプルに書けます。コードは雰囲気で書いたので、間違っているところがあるかもしれません。

```ts
// 記事とタグを取得する
$articleAndTags = Article::with('tags')->findOrFail($articleId);

$user = User::findOrFail($userId);
// フォローしているユーザー一覧を取得する
$followingUsers = $user->followingUsers;
// フォローされているユーザー一覧を取得する
$followers = $user->followers;

// 記事に新しくタグを関連付ける
$article = Article::findOrFail($articleId);
$article->tags()->attach([$tag1, $tag2]);

// ユーザーをフォローする
$user->followingUsers()->attach($anotherUser);
```

帰ってくるオブジェクトがクラスのインスタンスなので、`obj->method`の記法を使って直感的に使うことができます。クラスを使うことにはデメリットもあると思います。例えばORMのAPIが肥大化することや、モデルクラスに色々詰め込まれがちなことです。

また、Eloquentではモデルにsetterが生えているので無法地帯だったり、SQLの戻り値に正確な型がつけにくいというデメリットがあります。

こう比較してみると、ActiveRecordとは一長一短だと思いました。Prismaを実践に投入してしばらく使ってみてから、また感想を書きたいと思います。

## これから調べること

シーダーとデータベーステスト周りを調べようと思います。シーダーはドキュメントに記述があるので、途中で失敗したときにロールバックしてくれるかなどを確認しようと思います。

データベースのテストで調べることは、テスト前にトランザクションを貼る方法、データベースのファクトリを使う方法などです。これらは以下の記事やライブラリを参考にしてみようと思います。

- [Quramy/jest-prisma: Jest environment for integrated testing with Prisma client](https://github.com/Quramy/jest-prisma)
- [Prisma で始める快適テストデータ生活](https://zenn.dev/seya/articles/5d384daafb1c24)

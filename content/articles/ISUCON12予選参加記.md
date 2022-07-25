---
title: ISUCON12予選参加記
createdAt: 2022-07-25
---

ISUCON12の予選にチームRakuで参加しました。メンバーは友人（同僚）のLeoと自分の2人です。最終スコアは3746で、278位でした。

まったく手が出なかった去年と比べると、なんとなくやることは分かって戦えた感じがしたのでうれしかったです。事前に練習したことと、当日の結果について書こうと思います。

去年の参加記はこちら: [ISUCON11予選参加記 - tecchaxn's blog](https://www.tekihei2317.com/articles/203b489fbfe9161982eba9e8403d988b/)

## 事前準備

- isucon11予選（合計2回分）
- private-isu（合計1回分）
- チェックリストとMakefileの作成
- ISUCON本をひととおり読む

練習は、isucon11予選とprivate-isuを使って合計3セットしました。コツをつかめたのはprivate-isuで練習していたときです。alpとpt-query-digestで計測して、alpで重たいエンドポイントを見つけ、アプリまたはDBを改善し、計測結果が改善したらスコアが伸びるという流れがつかめました。

チェックリストはNotionで作成しました。初動は意外とやることがたくさんあるので、作っておいてよかったです。

<img src="https://i.gyazo.com/9ebad2287b47a7ca0287099e683ecf4c.png" style="width: 50%" />

もう一つ便利だったのはMakefileです。サーバーのセットアップ、設定ファイルの取得・デプロイ、ベンチ前のログローテート、ログの解析などのコマンドを作成しました。MakefileはtraPさんのハンズオンを参考にさせていただきました。

- traPさんのハンズオン: [oribe1115/traP-isucon-newbie-handson2022](https://github.com/oribe1115/traP-isucon-newbie-handson2022)
- 作ったMakefile: [isucon-tools/Makefile at main · tekihei2317/isucon-tools](https://github.com/tekihei2317/isucon-tools/blob/main/Makefile)

## 当日の記録

リポジトリはこちらです。[tekihei2317/isucon12-qualify](https://github.com/tekihei2317/isucon12-qualify)

初動は以下のように分担しました。

- tekihei2317: サーバーのセットアップ、アプリの構成把握、計測準備、マニュアル読む
- Leo: アプリケーションマニュアル読む、アプリケーション動かして動作確認、コードを読む

dockerでアプリケーションが動いていることと、sqliteが使われていることに戸惑いつつ、初動は1hくらいで終わりました。

11:00過ぎに合流して、アプリケーションの仕様とスコアの計算方法について一緒に確認しました。今年のスコアの計算方法はリクエスト数ベースで分かりやすかったです。

その後は2人に分かれて改善していきました。改善できたのは主に以下の3つです。

- visit_historyのSELECTが重かったのでインデックスを追加
- id_generatorテーブルを使った採番が遅かったので、uuidに変更
    - 最初はREPLACEをINSERTに変えてみたのですが、相変わらず重かったのと連番である必要はなさそうだったので、uuidに変えてみました
- rankingのエンドポイントが重かったので、JOINに変更（Leo）

最初にMySQLの負荷が大きいことに気づいて、改善できたのが良かったです。sqliteのクエリログの分析をせずに、解析を進めたのがあんまり良くなかった気がします。SQLの改善をしたものの、講評を聞いたところボトルネックはクエリではなくDBのロックだったみたいです。

## 感想

まだまだ動きやスコアに伸びしろがあるものの、練習も含めて楽しめたので良かったです。なによりやりきった感があり満足しています。今年の問題が解けるようになったら再挑戦するのと、また来年も参加したいと思います。

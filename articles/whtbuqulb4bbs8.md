---
title: Macでカ行をCで入力できるようにする
createdAt: 2022-11-30
tags: ["タイピング"]
---

Google IMEからMacの標準のIME（日本語IM）に移行したのですが、か行（か・く・こ）がCで入力できなかったのでできるように設定しました。

日本語IMに移行した理由は、変換して確定する作業が面倒に感じてきたからです。ライブ変換を使った方が日本語の文章を効率的に入力できる気がしたので、日本語IMを試してみました。

か行をCで入力するのは、タイピングの最適化というテクニックです。タイピングの最適化とは、文字を入力しやすいようにホームポジションから崩して打つことをいいます。例えば、自分はNやMを親指で入力したり、B・Y・Hを右手と左手で打ち分けたりしています。

[タイピングの最適化と練習方法｜実践的な運指を考える](http://pasokatu.com/18762)

## Karabiner-Elementsを使って変更する

IMEのローマ字とかなの対応表みたいなのを直接変更できればよかったのですが、やり方がわかリませんでした。そこで少々無理やりですが、Karabiner-Elementsを使って日本語入力の時はCをKとして使うように変更しました。

Karabiner-Elementsの導入方法については省略します。Homebrewでインストールして、要求された権限を許可してあげればよいです。

Karabiner-Elementsの設定ファイルは、`~/.config/karabiner/karabiner.json`にあるので、これを変更してからKarabiner-Elementsを再起動します。

```json
{
  "profiles": [
    {
      "complex_modifications": {
        "rules": [
          // 追加
          {
            "description": "日本語入力の時はCをKにする（Cでかくこを入力できるようにする）",
            "manipulators": [
              {
                "conditions": [
                  {
                    "input_sources": [
                      {
                        "language": "ja"
                      }
                    ],
                    "type": "input_source_if"
                  }
                ],
                "from": {
                  "key_code": "c"
                },
                "to": [
                  {
                    "key_code": "k"
                  }
                ],
                "type": "basic"
              }
            ]
          }
        ]
      }
    }
  ]
}
```

ファイル全体はこちら: [https://github.com/tekihei2317/dotfiles/blob/main/karabiner/karabiner.json#L45-L70](https://github.com/tekihei2317/dotfiles/blob/main/karabiner/karabiner.json#L45-L70)

この方法では「ci」「ce」が「き」「け」になってしまう問題がありますが、この入力は使わないためとりあえずよしとします。

## まとめ

Google IMEでライブ変換に近い体験をするには、以下の質問の回答が参考になりそうです。Mac以外のOSではライブ変換が使えないため、そのときに参考にしようと思います。

[GoogleIMEのライブ変換について - Gboard コミュニティ](https://support.google.com/gboard/thread/7319536/googleime%E3%81%AE%E3%83%A9%E3%82%A4%E3%83%96%E5%A4%89%E6%8F%9B%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6?hl=ja)

上記の回答で紹介されている句読点を入力したときに変換する機能は、Macでもライブ変換をオフにすると使えます。

日本語のみの文章の場合はライブ変換で快適に入力できそうです。技術的な文章の場合は英単語を入力することが多く、英数入力に切り替えるときに変換が確定するため、変換の精度が下がって少し使いにくくなるのかなと思いました。

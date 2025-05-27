---
title: 月配列をはじめました & 練習開始10日目の記録
tags: ["タイピング"]
createdAt: 2025-05-27
---

月配列の練習を始めて10日経過したので、始めた動機や現時点の習熟度について書こうと思います。

前回の記事: [一行配列のその後 | tekiehei2317's blog](https://blog.tekihei2317.com/articles/c2217e305b148a)


## 月配列とは

[「月」 --- 中指シフト新JIS配列](https://jisx6004.client.jp/tsuki.html)

月配列は、前置シフト方式のかな入力配列です。キー範囲はローマ字に近い3行11列で、頻度の高いかなは単打で、それ以外のかなは中段中指（kとd）の前置で2打で打つことができます。

月配列の本家である、月配列2-263式の配列は以下のとおりです。

通常面:

|     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| そ  | こ  | し  | て  | ょ  | つ  | ん  | い  | の  | り  | ち  |
| は  | か  | ☆  | と  | た  | く  | う  | ★  | ゛  | き  | れ  |
| す  | け  | に  | な  | さ  | っ  | る  | 、  | 。  | ゜  | ・  |

シフト面:

|     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ぁ  | ひ  | ほ  | ふ  | め  | ぬ  | え  | み  | や  | ぇ  | 「  |
| ぃ  | を  | ら  | あ  | よ  | ま  | お  | も  | わ  | ゆ  | 」  |
| ぅ  | へ  | せ  | ゅ  | ゃ  | む  | ろ  | ね  | ー  | ぉ  |     |

具体的には、`q→そ`、`dj→お`、`kf→あ`のように入力できます。2-263式はクロスシフトなので、左手のキーをシフトさせる場合は右手のシフト（k）を、右手のキーをシフトさせる場合は左手のシフト（d）を使います。その影響もあり、交互打鍵が多い特長があります。

月配列は、かな入力ではJISかなに次いでタイピングの実績がある配列です。タイプウェルKではZFさんの総合ZG、e-typing 腕試しKでは んみょさんの475pt（擬音語擬態語、418回）の記録があります。

## タイピングゲーム用の月配列のセットアップ

まず、普段使いの文章を書く用の設定について少し書きます。Google日本語入力を使っている場合は、ローマ字テーブルの変更で実装できるので、以下から月配列のローマ字テーブルをダウンロードしてインポートすればOKです。

[syusui-s/keyboard-layouts: 様々なキーボード配列を公開しているリポジトリです](https://github.com/syusui-s/keyboard-layouts?tab=readme-ov-file)

私はMacのライブ変換を使いたくてMac標準のIMEを使っているので、他の方法でなんとかする必要があります。まだこの設定はできていないので、本題のタイピングゲーム用のセットアップの話に移ることにします。

### 月配列をローマ字に変換する

```
少し話がややこしいので要約:
Hammerspoonというツールを使って、月配列で入力したときにローマ字が出力されるように設定し、
ローマ字入力のタイピングゲームを遊べるようにしました。
```

新しい配列を練習する時は、いつもマイタイピングの「ひよこでもできるタイピング練習講座」を使っています。問題は、マイタイピングがローマ字入力にのみ対応していることです。そのため、月配列で入力した文字をローマ字に変換する必要がありました。

ローマ字の変換は例えば`あ→a`、`な→na`のように行えばよいです。難しい点は、月配列は濁点が後置のため`か→ka`のように即座に変換することができず、`か+゛→ga`、`か+他の文字→ka + 他の文字`のように変換する必要がある点です。このあたりの事情についてはあんもとさんの以下の記事に詳しいです。

[【AutoHotkey】かな入力のままローマ字用タイピングゲームをプレイする方法｜あんもと](https://note.com/kameo53/n/ne4a6db88489a)

いつも使っているKarabiner-Elementsでこの設定を行いたかったのですが、条件が複雑で設定ファイルに記述することが難しそう（無理）だったので、他のツールを使うことにしました。そこで、プログラムでキーマップなどを変更できる[Hammerspoon](https://www.hammerspoon.org/)というツールを使って実装しました。

gist: [月配列2-263でローマ字のタイピングゲームを遊べるようにする設定（Mac, hammerspoon）](https://gist.github.com/tekihei2317/cc4dc6967e52bb9cf4919e5747e6b356)

<details>
<summary>
設定ファイル（Lua）
</summary>

```lua
local keymap = {
  q = { default = "so", shift = "la", side = "left" },
  w = { default = "ko", shift = "hi", side = "left" },
  e = { default = "si", shift = "ho", side = "left" },
  r = { default = "te", shift = "hu", side = "left" },
  t = { default = "lyo", shift = "me", side = "left" },

  a = { default = "ha", shift = "li", side = "left" },
  s = { default = "ka", shift = "wo", side = "left" },
  d = { default = "", shift = "ra", side = "left" },
  f = { default = "to", shift = "a", side = "left" },
  g = { default = "ta", shift = "yo", side = "left" },

  z = { default = "su", shift = "lu", side = "left" },
  x = { default = "ke", shift = "he", side = "left" },
  c = { default = "ni", shift = "se", side = "left" },
  v = { default = "na", shift = "lyu", side = "left" },
  b = { default = "sa", shift = "lya", side = "left" },

  y = { default = "tu", shift = "nu", side = "right" },
  u = { default = "nn", shift = "e", side = "right" },
  i = { default = "i", shift = "mi", side = "right" },
  o = { default = "no", shift = "ya", side = "right" },
  p = { default = "ri", shift = "le", side = "right" },
  ['['] = { default = "ti", shift = "[", side = "right" },

  h = { default = "ku", shift = "ma", side = "right" },
  j = { default = "u", shift = "o", side = "right" },
  k = { default = "", shift = "mo", side = "right" },
  l = { default = "_dakuten", shift = "wa", side = "right" },
  [';'] = { default = "ki", shift = "yu", side = "right" },
  ['\''] = { default = "re", shift = "]", side = "right" },

  n = { default = "ltu", shift = "mu", side = "right" },
  m = { default = "ru", shift = "ro", side = "right" },
  [','] = { default = ",", shift = "ne", side = "right" },
  ['.'] = { default = ".", shift = "-", side = "right" },
  ['/'] = { default = "_handakuten", shift = "lo", side = "right" }
}

local voicableKanaMap = {
  ka = { type = "voicedOnly", voiced = "ga" },
  ki = { type = "voicedOnly", voiced = "gi" },
  ku = { type = "voicedOnly", voiced = "gu" },
  ke = { type = "voicedOnly", voiced = "ge" },
  ko = { type = "voicedOnly", voiced = "go" },
  sa = { type = "voicedOnly", voiced = "za" },
  si = { type = "voicedOnly", voiced = "zi" },
  su = { type = "voicedOnly", voiced = "zu" },
  se = { type = "voicedOnly", voiced = "ze" },
  so = { type = "voicedOnly", voiced = "zo" },
  ta = { type = "voicedOnly", voiced = "da" },
  ti = { type = "voicedOnly", voiced = "di" },
  tu = { type = "voicedOnly", voiced = "du" },
  te = { type = "voicedOnly", voiced = "de" },
  to = { type = "voicedOnly", voiced = "do" },
  ha = { type = "voicedAndSemi", voiced = "ba", semiVoiced = "pa" },
  hi = { type = "voicedAndSemi", voiced = "bi", semiVoiced = "pi" },
  hu = { type = "voicedAndSemi", voiced = "bu", semiVoiced = "pu" },
  he = { type = "voicedAndSemi", voiced = "be", semiVoiced = "pe" },
  ho = { type = "voicedAndSemi", voiced = "bo", semiVoiced = "po" }
}

local function convertToOutput(key, shiftState)
  local entry = keymap[key]
  assert(entry, "未定義のキーです: " .. key)

  if shiftState == "none" then
    return entry.default
  elseif shiftState ~= entry.side then
    return entry.shift
  else
    return entry.default
  end
end

local function processKeyInput(key, shiftState, buffer)
  local kana = convertToOutput(key, shiftState)

  if buffer == "" then
    if voicableKanaMap[kana] then
      return { outputs = {}, buffer = kana }
    elseif kana:sub(1, 1) == "_" then
      return { outputs = {}, buffer = "" }
    else
      return { outputs = { kana }, buffer = "" }
    end
  end

  if kana == "_dakuten" or kana == "_handakuten" then
    local entry = voicableKanaMap[buffer]
    assert(entry, "濁音化できないキーがバッファに入っています: " .. buffer)

    if kana == "_dakuten" then
      return { outputs = { entry.voiced }, buffer = "" }
    elseif entry.type == "voicedAndSemi" then
      return { outputs = { entry.semiVoiced }, buffer = "" }
    else
      return { outputs = {}, buffer = buffer }
    end
  end

  if voicableKanaMap[kana] then
    return { outputs = { buffer }, buffer = kana }
  else
    return { outputs = { buffer, kana }, buffer = "" }
  end
  return { outputs = { kana }, buffer = "" }
end

-- 無限ループ防止用
local suppressCount = 0
local shiftState = "none"
local buffer = ""

local handler = hs.eventtap.new({hs.eventtap.event.types.keyDown}, function(event)
  if suppressCount > 0 then
    suppressCount = suppressCount - 1
    return false
  end

  local key = hs.keycodes.map[event:getKeyCode()]

  if keymap[key] then
    -- 範囲外のキーはそのまま通す
    return false
  end

  if shiftState == "none" and (key == "d" or key == "k") then
    if key == "d" then
      shiftState = "left"
    else
      shiftState = "right"
    end
    print("shift: " .. shiftState)

    -- シフトを押したときに、バッファを出力する
    if buffer ~= "" then
      print("output buffer when shift pressed: " .. buffer)
      suppressCount = suppressCount + #buffer
      hs.eventtap.keyStrokes(buffer)
      buffer = ""
    end
    return true
  end

  local result = processKeyInput(key, shiftState, buffer)
  buffer = result.buffer
  shiftState = "none"

  print("buffer: " .. buffer)

  for _, output in ipairs(result.outputs) do
    print("output: " .. output)
    suppressCount = suppressCount + #output
    hs.eventtap.keyStrokes(output)
  end

  return true
end)

-- Ctrlでバッファを出力する（行末用）
local ctrlHandler = hs.eventtap.new({hs.eventtap.event.types.flagsChanged}, function(event)
  local flags = event:getFlags()
  if flags.ctrl then
    suppressCount = suppressCount + #buffer
    hs.eventtap.keyStrokes(buffer)
    buffer = ""
  end

  return false
end)

local tsukiEnabled = false

hs.hotkey.bind({"cmd"}, "escape", function()
  tsukiEnabled = not tsukiEnabled

  if tsukiEnabled then
    handler:start()
    ctrlHandler:start()
  else
    handler:stop()
    ctrlHandler:stop()
  end

  local status = tsukiEnabled and "月配列 ON" or "月配列 OFF"
  hs.alert.show(status)
end)
```
</details>

CtrlやCmdが乗っ取られてショートカットが使えなくなってしまいましたが、タイピングゲームを使うときだけオンにすればよいのでとりあえず諦めました。

## 現在の習熟度

今日で練習を始めて10日目で、練習時間は18時間が経過しました。今日でちょうどマイタイピングの「ひよこでもできるタイピング練習講座」をクリアしました。

![ひよこでもできるタイピング練習講座をクリア](https://i.gyazo.com/83fb21c22895d0c1f47e39dbbbfdfd51.png)

速度はローマ字換算で2.4key/sですが、実際の打鍵はおそらく1~1.5key/s程度で、e-typingかなの腕試しで60を出せるかどうかといったところだと思います。

まだかな入力のタイピングゲームをするための設定はできていないので、これからその設定をしてe-typingやタイプウェルで練習しようと思っています。

## 月配列を始めた動機や、目標について

月配列を始めた動機は、（タイパー的な基準で）より速い日本語入力の方法について探求するためです。月配列のホームページを見ると、ローマ字入力と比較して打鍵数は80%程度に済むというデータがあります。つまり、単純計算でローマ字入力の1.2倍~1.25倍程度の速度で打てる配列を、かな入力であれば作ることができるのではないかと考えました。

なので、かな入力の最終的な目標は、自分のローマ字タイピングに並ぶ速度を出すことです。具体的には、今のe-tyiping Rの自己ベストが腕試し612pt長文691ptなので、1.5で割って（かな→ローマ字のスコアの変換で1.5をかけることが多いため）腕試し400pt、長文460ptです。この目標をまずは月配列で目指します。

まだそこまで到達できる未来が見えていないので、当面は月配列を練習記録を残してくださった先人の方々の記録を参考にして目標設定します。

- orihさん: 月配列100日でタイプウェルK常用XG
  - [月配列2-263式(微変更版) 備忘録 | orihのタイピング雑記](https://typinggg.fc2.net/blog-entry-23.html)
- コジオンさん: 月配列3ヶ月でタイプウェルK常用XH、1年でタイプウェルK総合XD
  - [コジオニルク - タイプウェル国語 K が XD 到達](https://kojion.com/posts/754)

お二方ともとんでもない速度で成長しており、現時点では置いていかれているので、背中を追いかけます。

それと並行して、より効率のよい打鍵→ひらがなへの変換の方法について調べたり（例えば新下駄配列や薙刀式の同時押しや、月林檎配列の濁音のシフト省略など）、主にローマ字入力で高速打鍵が可能な配列の条件についても調べていきたいです。

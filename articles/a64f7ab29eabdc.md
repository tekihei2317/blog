---
title: TOPSIC SQL CONTEST第2回の解説
createdAt: 2022-12-14
tags: ["sql"]
---

SQLコンテストの第2回の問題を解いたので、解説を書いてみます。全部で4問あり、制限時間は60分です。

[TOPSIC - 第2回 SQLコンテスト](https://topsic-contest.jp/contests/contest002)

小ネタですが、ウィンドウを2つ開いて並べておくと文章を読む用とコードを書く用に分けられるのでやりやすいです。

![](https://i.gyazo.com/0257f3104e211bd251658f3a66c96bb0.png)

## 問題1. 地区名の更新

UPDATE文は、WHERE句で絞り込んだレコードを更新する文です。district_nameがnullまたは空文字列のレコードを更新するという条件があるので、それを書きます。

久しぶりにUPDATE文を書きました。

```sql
update population
set district_name = '不明'
where
    district_name is null
    or district_name = ''
;
```

提出: [https://topsic-contest.jp/contests/contest002/submissions/11851](https://topsic-contest.jp/contests/contest002/submissions/11851)

## 問題2. 曖昧検索

SQLで前方一致・後方一致・〜を含むなどの条件を表現するには、LIKE演算子を使います。LIKE演算子では、任意の文字列を%で表現するので、3つの条件は以下のようにかけます。

| 条件                        | 書き方                    |
| --------------------------- | ------------------------- |
| district_nameが東から始まる | district_name like ‘東%’  |
| district_nameが東で終わる   | district_name like ‘%東’  |
| district_nameが東を含む     | district_name like ‘%東%’ |

今回は東を含むという条件なので、3番目を使います。

また、複数のカラムでソートするためには、ORDER BY句にカンマ区切りでカラムを書きます。

```sql
select
    district_code as CODE,
    district_name as NAME,
    total_amt as TOTAL
from
    population
where
    total_amt >= 100000 and
    district_name like '%東%'
order by
    total_amt desc,
    district_code
;
```

提出: [https://topsic-contest.jp/contests/contest002/submissions/11853](https://topsic-contest.jp/contests/contest002/submissions/11853)

## 問題3. 飲酒率

少し問題文がわかりづらかったので、具体的な例を見てみます。都道府県コード05000（秋田県）のデータのみ表示してみました。

| CATEGORY_CODE | GENDER_CODE | PF_CODE | AMT |
| --- | --- | --- | --- |
| 110 | 2 | 05000 | 375 |
| 110 | 3 | 05000 | 427 |
| 120 | 2 | 05000 | 133 |
| 120 | 3 | 05000 | 31 |

CATEGOY_CODEの110が総数、120が毎日飲酒する人の数なので、(総数・男性, 総数・女性, 飲酒・男性, 飲酒・女性) = (375, 427, 133, 31)だということが分かります。なので答えは(133 + 31) / (375 + 427) * 100 = 20.4だと分かります。

これは都道府県で集約してCASE式で計算するとできます。PF_NAMEがないため後からJOINしています。

<details>
  <summary>コード</summary>

```sql
select
    prefecture.pf_code as CODE,
    prefecture.pf_name as NAME,
    round(100.0 * population.drink_amount / population.total_amount, 1) as PERCENTAGE
from
    (select
        pf_code,
        -- ある県の毎日飲酒する人数
        sum(case when category_code = '120' then amt else 0 end) as drink_amount,
        -- ある県の合計人数
        sum(case when category_code = '110' then amt else 0 end) as total_amount
    from
        drink_habits
    where
        gender_code in ('2', '3')
    group by
        pf_code
    ) population
    inner join prefecture
    using (pf_code)
order by
    percentage desc,
    prefecture.pf_code desc
;
```
</details>

提出: [https://topsic-contest.jp/contests/contest002/submissions/11857](https://topsic-contest.jp/contests/contest002/submissions/11857)

また、以下のようにも書けます。標準SQLでは、SELECT句には、GROUP BY句に指定した集約キーと集約関数しか書けないというルールがあった気がするのですが、SQLiteではそうでないクエリも動くようです（prefecture.pf_nameの部分です）。

<details>
  <summary>コード</summary>

  ```sql
  select
      prefecture.pf_code as CODE,
      prefecture.pf_name as NAME,
      round(
          100.0 * sum(case when category_code = '120' then amt else 0 end) /
              sum(case when category_code = '110' then amt else 0 end),
          1
      ) as PERCENTAGE
  from
      drink_habits
      inner join prefecture
      using (pf_code)
  where
      gender_code in ('2', '3')
  group by
      pf_code
  order by
      percentage desc,
      prefecture.pf_code desc
  ;
  ```
</details>

提出: [https://topsic-contest.jp/contests/contest002/submissions/11856](https://topsic-contest.jp/contests/contest002/submissions/11856)

## 問題4. 就学状況の表示変換

まず、分かりやすいように以下のクエリで都道府県ごとに集計しておきます。

```sql
with population as (
    select
        pf_code,
        sum(elementary) as sum1,
        sum(middle) as sum2,
        sum(high) as sum3,
        sum(junior_clg) as sum4,
        sum(college) as sum5,
        sum(graduate) as sum6
    from
        enrollment_status
    where
        survey_year = 2020
    group by
        pf_code
)
select
	*
from
	population
;
```

WITH句は共通テーブル式（CTE）と呼ばれる機能で、クエリの結果を一時的なテーブルに保存する機能です。WITH句はSELECT文の一部なので、WITH句で定義したテーブルはそのSELECT文の中でのみ使えます。

あとは、これを縦持ちに変換すれば良いです。横持ちから縦持ちに変換するというのは、この場合は行を増やすということです。SQLで行を増やすには、JOINを使うか、UNIONを使って結果を結合するかのどちらかです。

| pf_code | sum1  | sum2  | sum3  | sum4 | sum5  | sum6 |
| ------- | ----- | ----- | ----- | ---- | ----- | ---- |
| 36000   | 32425 | null  | 17851 | 3315 | 11405 | null |
| 37000   | 48084 | 24906 | 26191 | 5344 | 11958 | 618  |

それぞれの方法を考えてみます。

### JOINを使う場合

以下のようなテーブルをCROSS JOINすると、目的の行を作れます。CROSS JOINは全ての組み合わせを作るので、N行のテーブルとM行のテーブルをCROSS JOINすると、N×M行になります。

| kind_id |
| ------- |
| 1       |
| 2       |
| 3       |
| 4       |
| 5       |
| 6       |

あとは必要な情報を頑張って整形して取り出します。

![](https://i.gyazo.com/96da02ab041c643749c110e8258b1dca.jpg)

<details>
  <summary>コード</summary>

```sql
with population as (
    select
        pf_code,
        sum(elementary) as sum1,
        sum(middle) as sum2,
        sum(high) as sum3,
        sum(junior_clg) as sum4,
        sum(college) as sum5,
        sum(graduate) as sum6
    from
        enrollment_status
    where
        survey_year = 2020
    group by
        pf_code
),
kind as (
    select 1 as kind_id, '小学校' as kind_name
    union all select 2, '中学校'
    union all select 3, '高校'
    union all select 4, '短大'
    union all select 5, '大学'
    union all select 6, '大学院'
)
select
    2020 as SV_YEAR,
    PR.pf_name as PREFECTURE,
    K.kind_name as KIND,
    (case K.kind_id
        when 1 then sum1
        when 2 then sum2
        when 3 then sum3
        when 4 then sum4
        when 5 then sum5
        when 6 then sum6
        else 0
    end) as AMT
from
    population P
    cross join kind K
    inner join prefecture PR
    on P.pf_code = PR.pf_code
where
    AMT is not null
order by
    P.pf_code,
    K.kind_id
;
```
</details>

提出: [https://topsic-contest.jp/contests/contest002/submissions/11882](https://topsic-contest.jp/contests/contest002/submissions/11882)

### UNIONを使う場合

縦持ちにしたいカラムたちを1つずつ選んで、最後にUNIONでマージします。縦持ちにしたいカラムはsum1, …, sum6なので、それらを1つずつ選ぶクエリを作ります。

縦持ちにしたテーブルをソートする必要があるので、最後にFROM句にサブクエリとして渡してソートします。

<details>
  <summary>コード</summary>

```sql
with population as (
    select
        survey_year,
        pf_code,
        sum(elementary) as sum1,
        sum(middle) as sum2,
        sum(high) as sum3,
        sum(junior_clg) as sum4,
        sum(college) as sum5,
        sum(graduate) as sum6
    from
        enrollment_status
    where
        survey_year = 2020
    group by
        pf_code
)
select
    survey_year as SV_YEAR,
    pf_name as PREFECTURE,
    kind_name as KIND,
    sum as AMT
from (
    select P.survey_year, PR.*, 1 as kind_id, '小学校' as kind_name, sum1 as sum
    from population P join prefecture PR using (pf_code)
    union all
    select P.survey_year, PR.*, 2, '中学校', sum2
    from population P join prefecture PR using (pf_code)
    union all
    select P.survey_year, PR.*, 3, '高校', sum3
    from population P join prefecture PR using (pf_code)
    union all
    select P.survey_year, PR.*, 4, '短大', sum4
    from population P join prefecture PR using (pf_code)
    union all
    select P.survey_year, PR.*, 5, '大学', sum5
    from population P join prefecture PR using (pf_code)
    union all
    select P.survey_year, PR.*, 6, '大学院', sum6
    from population P join prefecture PR using (pf_code)
)
where
    sum is not null
order by
    pf_code,
    kind_id
;
```
</details>

提出: [https://topsic-contest.jp/contests/contest002/submissions/11883](https://topsic-contest.jp/contests/contest002/submissions/11883)

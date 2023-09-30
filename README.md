# RTA in Japan Twitter Client を簡単に動くよう改変したやつ

<!-- TOC depthFrom:1 depthTo:3 insertAnchor:false orderedList:false -->

- [RTA in Japan Twitter Client を簡単に動くよう改変したやつ](#rta-in-japan-twitter-client-を簡単に動くよう改変したやつ)
  - [概要](#概要)
  - [Config](#config)
  - [ローカルで動かす](#ローカルで動かす)
  - [外部公開する](#外部公開する)
    - [ngrokの設定](#ngrokの設定)
    - [webpack.config.tsの設定](#webpackconfigtsの設定)
  - [走者情報APIサンプル](#走者情報apiサンプル)
  - [その他、変えたほうがよさそうなところ](#その他変えたほうがよさそうなところ)

<!-- /TOC -->

----

## 概要

主な変更点
- 固定サブドメインを2個立ち上げたりCORS設定する手間を嫌い、APIサーバーにはproxyでアクセスするようにした
- Twitter API関連の`foo.user.bar`を`foo.bar`に置換
- Tweet一覧の返信とハッシュタグが機能していないので削除
- fetchJson関数にngrok対策を追加(あんまり意味はない)

Windows 10 Home での動作を確認しています。

## Config

設定項目の定義: [js/types/global.d.ts](js/types/global.d.ts)

[本家の説明](https://github.com/RTAinJapan/rta-in-japan-twitter-client#config)が不足している分を勝手に追加した。

* `api` _Object_ RTA in Japan用APIに関する設定
    * `twitterBase` _String_ TwitterAPIのURL
    * `runner` _String_ 走者情報APIのURL
    * `webhook` _String_ **[Discord Webhook](https://support.discord.com/hc/ja/articles/228383668-%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB-Webhooks%E3%81%B8%E3%81%AE%E5%BA%8F%E7%AB%A0)のURL**
* `twitter` _Object_
    * `isAllowDeleteTweet` _Boolean_ ツイート削除の許可(APIサーバー起動後かつ本クライアントから投稿したツイートのみ削除可能)
* `discord` _Object_
    * `enable` _Boolean_ **Discord認証機能を有効にする**
    * `config` _Object_ DiscordAPI認証設定
      * `baseURL` _String_ **(使わない)**
      * `clientId` _String_  DiscordAPIのクライアントID
      * `clientSecret` _String_ (使わない)
      * `redirectUrl` _String_ **(使わない) ここで入力した値ではなく https://discord.com/developers/applications/ > OAuth2 > General > Redirects の値が使用される。 `https://<hostname>/login/discord/` と設定する。**
      * `scope` _String_ Scope **よくわからない**
    * `guild` _String_ サーバID **(IDは[開発者モード](https://support.discord.com/hc/ja/articles/206346498-)で取得可能)**
    * `roles` _String[]_ 権限ID **(使わない？)**
    * `users` _String[]_ この画面を操作できるユーザID
* `tweetTemplate` _Object_ テンプレート
  * `title` _String_ **テンプレ一覧に表示するタイトル**
  * `type` _'withCommentary' | 'withOutCommentary' | 'common'_
    * _withCommentary_ **解説がいる場合のテンプレ**
    * _withOutCommentary_ **解説がいない場合のテンプレ**
    * _common_ **共通するテンプレ**
* `tweetFooter` _String_ **全てのツイートの末尾に追加する文言**
* `link` _Object[]_ クライアントから見れるリンクの一覧。
  * `name` _String_ リンクの表示名
  * `url` _String_ リンクのURL
  * `iconUrl` _String_ アイコン画像のURL

## ローカルで動かす

[node.js](https://nodejs.org/ja/download)をインストールする。
(v17以上の場合、`set NODE_OPTIONS="--openssl-legacy-provider"`が必要になる)

[Twitter APIサーバー](https://github.com/pingval/rtainjapan-twitter-api-node)を起動しておく。

```
cd rta-in-japan-twitter-client-master
npm install
npm start
```

## 外部公開する

### ngrokの設定

[ngrok](https://ngrok.com/)のアカウントを作り、[固定サブドメイン](https://ngrok.com/blog-post/free-static-domains-ngrok-users)を作る。
固定サブドメインを使わないとngrokを立ち上げるたびにURLが変わって非常に不便。

固定サブドメインに任意の文字列を使うには有料アカウントにする必要がある。[類似のサービス](https://zenn.dev/teasy/articles/tcpexposer-intoroduction#%E9%A1%9E%E4%BC%BC%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%81%A8%E3%81%AE%E9%81%95%E3%81%84)を使えば無料でできるかもしれない。

#### 例1
```
ngrok config add-authtoken <authtoken>
```
と実行してauthtokenを登録し、以下のコマンドを実行する
```
ngrok http --domain <hostname> <port>
```
#### 例2
```
ngrok config edit
```
と実行して設定ファイルを開き
```
version: "2"
authtoken: <authtoken>
tunnels:
  twitter-client:
    proto: http
    addr: <port>
    domain: <hostname>
```
などと書いて保存し、以下のコマンドを実行する
```
ngrok start twitter-client
```

参考: [ngrokを使ってローカル環境上で実行するWebアプリケーションにインターネットからアクセスする - Qiita](https://qiita.com/rubytomato@github/items/3ffb51d60fec24863a5b)

### webpack.config.tsの設定

[webpack.config.ts](webpack.config.ts)

webpack-dev-serverの設定に最後の2行を追加する。
```
// webpack-dev-serverの設定
const devServerConfig: webpackDevServer.Configuration = {
  contentBase: 'docs',
  host: 'localhost',
  open: true,
  hot: true,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api': '' },
    },
  },
  port: <port>,
  public: '<hostname>',
};
```

## 走者情報APIサンプル

- [RTA in Japan Twitter Client 走者情報サンプル](https://docs.google.com/spreadsheets/d/1Afw8H0lJyi2XyKzYC7zJQ5GWtweBZ-tglOR17-8clac/edit#gid=1848202960)
  - [このシートの走者情報API URL](https://script.google.com/macros/s/AKfycbyzKksbnFuRyHy0-t30Td3vHUmMLpalGBrrKNPIgGP6EtsxTph-yRYj6IzWHdm7Gq_GKw/exec)
  - [このシートのApps Script](runner-api.gs)

参考: [GASでJSON形式データをJavaScriptで読み込む方法 | iwb.jp](https://iwb.jp/javascript-json-format-data-by-google-apps-script/)

## その他、変えたほうがよさそうなところ

- [static/index.html](static/index.html)
  - title要素
    - `RTA in Japan Twitter Client`となっている。
- [static/manifest.json](static/manifest.json)
  - short_name
  - name
  - icons
- [static/config.json](static/config.json)
  - tweetTemplate
    - 「次のタイムアタックは~」から始まるRiJのテンプレまんま。
  - tweetFooter
    - 初期設定ではRiJのTwitchチャンネルとハッシュタグになっている。
- [js/components/organisms/TweetForm/index.tsx](js/components/organisms/TweetForm/index.tsx)
  - テンプレに細かく手を加えたいなら。

----

あとはブラウザのデベロッパーツールとかと睨めっこしてがんばってね。

JSONは末尾カンマとコメントが使えないので注意してね。

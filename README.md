# costco-monitor

コストコオンラインに商品の価格をモニタリングし、変動（値下げ）したらメールで知らせるシステム。

## 環境変数の設定

`.env.sample`を`.env`にリネームし、中のパラメータを全部設定してください。

```
CostcoUser　→　コストコオンラインのログインメールアドレス
CostcoPass　→　コストコオンラインのログインパスワード
MailService　→　メール送信用のサービス（デフォルトGmail）
MailUser　→　メールアドレス
MailPassword　→　パスワード
MailTo　→　宛先のメールアドレス
Urls　→　監視商品のリンクリスト（JSON）
```

メールの２段階認証（2FA）が有効になった場合の設定方法について、下記の記事ご参考ください。

[https://thundermiracle.com/blog/2020-06-13-smtp-gmail-by-nodemailer/#gmail%E3%81%AE%E8%A8%AD%E5%AE%9A](https://thundermiracle.com/blog/2020-06-13-smtp-gmail-by-nodemailer/#gmail%E3%81%AE%E8%A8%AD%E5%AE%9A)

## 開発モード

```shell
yarn && yarn dev
```

## 製品版モード

```shell
yarn build
node ./dist/index.js
```

## Ubuntu で動かす

1. 必要なパッケージをインストール

   ```shell
   apt install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
   ```

1. --no-sandbox の指定

   `.env`に、`NO_SANDBOX=true`を追加

   ※非推奨、正しい対策はこちら：[https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)

## License

This project is licensed under the terms of the [MIT license](/LICENSE).

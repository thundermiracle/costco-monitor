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

## License

This project is licensed under the terms of the [MIT license](/LICENSE).

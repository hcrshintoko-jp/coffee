# HASABA COFFEE ROASTERS® LP

沖縄・宮古島の焙煎所「HASABA COFFEE ROASTERS®」のブランドハブLP。
GitHub Pages公開を前提とした、シンプルな静的1ファイル構成です。

---

## 概要

- **コンセプト**: 「珈琲は、生鮮飲料」
- **想定遷移**: コーヒー豆の購入（EC）／ワークショップ予約／実店舗誘導／LINE登録
- **対象ターゲット**: 30〜50代のスペシャルティコーヒー愛好家、ギフト需要、関東・沖縄の地域住民
- **デザイン基調**: Warm Vinyl Cafe（暖色系・クラフト感・少しレトロ）

## ファイル構成

```
/
├── index.html        # LP本体（HTML / CSS / JS が1ファイル完結）
├── README.md         # 本ファイル
└── images/           # 画像・動画素材
    ├── favicon.png
    ├── logo.png
    ├── hero.mp4
    ├── hero.webm
    ├── hero-poster.png
    ├── ogp.jpg               (要作成 / 1200x630)
    ├── way-01.jpg            (要作成)
    ├── way-02.jpg            (要作成)
    ├── way-03.jpg            (要作成)
    ├── freshness.jpg         (要作成)
    ├── starter.jpg           (要作成)
    ├── product-01.jpg        (要作成)
    ├── product-02.jpg        (要作成)
    ├── product-03.jpg        (要作成)
    ├── product-04.jpg        (要作成)
    ├── subscription.jpg      (要作成)
    ├── workshop-drip.jpg     (要作成)
    ├── workshop-roast.jpg    (要作成)
    ├── store-miyakojima.jpg  (済 / 差し替え可)
    ├── store-shintoko.jpg    (要作成)
    ├── store-irabu.jpg       (要作成)
    ├── about.jpg             (要作成)
    ├── voice-01.jpg          (要作成)
    ├── voice-02.jpg          (要作成)
    ├── voice-03.jpg          (要作成)
    ├── column-01.jpg         (要作成)
    ├── column-02.jpg         (要作成)
    ├── column-03.jpg         (要作成)
    ├── media-01.png          (要作成)
    ├── media-02.png          (要作成)
    ├── media-03.png          (要作成)
    ├── media-04.png          (要作成)
    └── cta-bg.webp           (差し替え可)
```

> **画像が存在しない場合**は、画面に `[ FALLBACK LABEL ]` のプレースホルダーが自動表示されます。完成を待たずに公開可能です。

---

## 公開方法（GitHub Pages）

### 1. リポジトリの初期化と push

```bash
cd /path/to/this/directory
git init
git add index.html README.md images/
git commit -m "Initial commit: HASABA COFFEE LP"
git branch -M main
git remote add origin https://github.com/[USER]/[REPO].git
git push -u origin main
```

### 2. GitHub Pages を有効化

1. GitHubのリポジトリページを開く
2. `Settings` → `Pages`
3. **Source**: `Deploy from a branch`
4. **Branch**: `main` / `/ (root)` を選択 → `Save`
5. 数分後に `https://[USER].github.io/[REPO]/` で公開

### 3. 公開URL確定後の必須更新

`index.html` 上部の以下の `https://hasabacoffee.com/` を**実際の公開URLに書き換え**してください：

| 種別 | 該当タグ |
|---|---|
| Canonical | `<link rel="canonical">` |
| OGP | `<meta property="og:url">` |
| OGP画像 | `<meta property="og:image">` |
| Twitter画像 | `<meta name="twitter:image">` |
| 構造化データ | JSON-LD 内の `url` / `logo` / `image` |

### 4. (任意) 独自ドメインを設定する場合

リポジトリのSettings → Pages → Custom domain で `hasabacoffee.com` 等を入力。
DNSで `CNAME` レコードを `[USER].github.io` に向ける。

---

## 画像差し替え一覧

すべて `images/` ディレクトリ配下に配置。**ファイル名を変えずに同名で上書き**するだけで反映されます。

### 必須画像（公開前に用意）

| ファイル | 用途 | 推奨サイズ | アスペクト |
|---|---|---|---|
| `images/ogp.jpg` | **OGP/SNSシェア画像** | **1200×630** | 1.91:1 |
| `images/favicon.png` | ファビコン（済） | 32×32〜64×64 | 1:1 |
| `images/logo.png` | ロゴ（済） | 横長・透過PNG | - |
| `images/hero.mp4` / `images/hero.webm` | ヒーロー背景動画（済） | 1920×1080 | 16:9 |
| `images/hero-poster.png` | 動画読込前の表示（済） | 1920×1080 | 16:9 |

### 推奨画像（順次差し替え）

| ファイル | 用途 | 推奨サイズ | アスペクト |
|---|---|---|---|
| `images/way-01.jpg` | 3つの楽しみ方 #1 「買う」 | 800×600 | 4:3 |
| `images/way-02.jpg` | 3つの楽しみ方 #2 「淹れる」 | 800×600 | 4:3 |
| `images/way-03.jpg` | 3つの楽しみ方 #3 「焙煎する」 | 800×600 | 4:3 |
| `images/freshness.jpg` | 鮮度のこだわり（縦長） | 600×800 | 3:4 |
| `images/starter.jpg` | 3種お試しセット | 1200×900 | 4:3 |
| `images/product-01.jpg` | パプアニューギニア | 600×600 | 1:1 |
| `images/product-02.jpg` | タンザニア | 600×600 | 1:1 |
| `images/product-03.jpg` | インドネシア マンデリン | 600×600 | 1:1 |
| `images/product-04.jpg` | コスタリカ サンタルシア | 600×600 | 1:1 |
| `images/subscription.jpg` | 定期便ライフスタイル | 1200×900 | 4:3 |
| `images/workshop-drip.jpg` | ハンドドリップWS風景 | 1280×800 | 16:10 |
| `images/workshop-roast.jpg` | 珈琲焙煎WS風景 | 1280×800 | 16:10 |
| `images/store-miyakojima.jpg` | 宮古島本店外観（済） | 800×600 | 4:3 |
| `images/store-shintoko.jpg` | 新所沢店外観 | 800×600 | 4:3 |
| `images/store-irabu.jpg` | 伊良部島店外観 | 800×600 | 4:3 |
| `images/about.jpg` | 創業者ポートレート（縦長） | 800×1000 | 4:5 |
| `images/voice-01.jpg` ~ `voice-03.jpg` | お客様の声 アバター | 200×200 | 1:1 |
| `images/column-01.jpg` ~ `column-03.jpg` | コラムサムネイル | 400×400 | 1:1 |
| `images/media-01.png` ~ `media-04.png` | メディア掲載ロゴ | 480×160 | 3:1 |

> 画像差し替え時は **JPG/WebP** を推奨（容量削減）。透過が必要な場合のみPNG。

---

## CTAリンク差し替え一覧

`href="#"` または仮設定の状態。本番公開時に書き換えてください。

### 🔴 必須差し替え

| 場所 | 現在値 | 差し替え先 |
|---|---|---|
| Footer SNS Instagram | `href="#"` | 公式InstagramアカウントURL |
| Footer SNS Facebook | `href="#"` | 公式FacebookページURL |
| Footer SNS X (Twitter) | `href="#"` | 公式XアカウントURL |
| Footer 特定商取引法表記 | `href="#"` | 表記ページURL |
| Footer プライバシーポリシー | `href="#"` | ポリシーページURL |
| 店舗カード「宮古島本店 詳細を見る」 | `href="#"` | 宮古島本店詳細ページURL |
| 店舗カード「伊良部島店 詳細を見る」 | `href="#"` | 伊良部島店詳細ページURL |
| Column 各記事 (3件) | `href="#"` | 各コラム記事URL |
| News 各記事 (4件) | `href="#"` | 各お知らせ記事URL |
| Column / News 「View All →」 (2件) | `href="#"` | 一覧ページURL |

### 🟢 設定済み（変更不要）

| 場所 | URL |
|---|---|
| EC（オンラインショップ） | `https://hasabacoffee.theshop.jp/` |
| LINE公式アカウント | `https://lin.ee/oGAqwMo` |
| 新所沢店 詳細 | `https://shintoko.hasabacoffee.com/` |
| ドリップWS予約 | `https://dripws.hasabacoffee.com/` |
| 焙煎WS予約 | `https://workshop.hasabacoffee.com/` |
| Footer SNS LINE | `https://lin.ee/oGAqwMo` |

---

## 更新時の注意点

### コンテンツ更新

| 更新箇所 | 編集対象 |
|---|---|
| お知らせ追加 | `<section id="column">` 内の `.news-list` を編集 |
| お客様の声 | `<section id="voices">` 内の `.voice-card` を編集 |
| 商品情報 | `<section id="products">` 内の `.product-card` を編集（価格は税込で揃える） |
| FAQ追加 | `<section id="faq">` の `.faq-item` を追加。**JSON-LDのFAQPageも同期更新**すること |
| ワークショップ料金 | `.workshop-meta` の `dd` を編集 |

### 画像更新

- ファイル名を変えずに `images/` 内で上書きすると即反映
- 反映されない場合はブラウザキャッシュをクリア（Mac: `⌘+Shift+R` / Win: `Ctrl+Shift+R`）
- WebP/AVIFなど別フォーマットを使う場合は `index.html` 内の `src` も更新が必要
- 画像が無くても **fallback プレースホルダー** が表示されるため、ページ自体は崩れない

### SEO更新時の同期ルール

`title` / `description` を変更したら、以下も**必ず同期**してください：

- `<meta name="description">`
- `<meta property="og:title">` / `og:description`
- `<meta name="twitter:title">` / `twitter:description`
- 構造化データ（JSON-LD）の `description`

### 構造化データの整合性

- FAQ の質問・回答を編集／追加した場合は、`<script type="application/ld+json">` の `FAQPage` ブロックも編集
- 店舗情報（住所・営業時間）を変更した場合は `CafeOrCoffeeShop` ブロックも更新
- 不一致のままだとGoogleのリッチリザルトから除外される可能性あり

### 動作確認チェックリスト

公開後に以下のツールで検証推奨：

| 確認項目 | ツール |
|---|---|
| OGP表示 | https://developers.facebook.com/tools/debug/ |
| Twitter Card | https://cards-dev.twitter.com/validator |
| 構造化データ | https://search.google.com/test/rich-results |
| モバイルフレンドリー | https://search.google.com/test/mobile-friendly |
| Core Web Vitals | Chrome DevTools → Lighthouse |
| LINE OGP | LINEで自分にURL送信して表示確認 |

### パフォーマンス上の注意

- **動画ファイルが大きい**: `hero.mp4` 約18MB / `hero.webm` 約2.4MB。可能なら `hero.webm` のみで運用検討（ブラウザ対応 95%+）
- **Google Fonts への外部依存**: オフライン環境では英文フォントが代替に。重要な顧客環境がオフライン中心ならローカル配信も検討
- **画像最適化**: 公開前に各画像を [Squoosh](https://squoosh.app/) 等で圧縮推奨

### 既知の制約

- 動画自動再生は iOS Safari でも動作（`muted` `playsinline` 指定済）
- `backdrop-filter` は古いブラウザで効かないが、フォールバック背景色あり
- Sticky Mobile CTA は 880px未満で表示

### バージョン管理運用例

```bash
# コンテンツ更新フロー
git pull
# index.html を編集
git add index.html
git commit -m "feat: 5月のお知らせ追加"
git push
# → GitHub Pages が自動でビルド・公開（約1分）
```

---

## ライセンス・帰属

© HASABA COFFEE ROASTERS®. All Rights Reserved.

デザインシステム参考: Little Amps Coffee (Warm Vinyl Cafe スタイル)

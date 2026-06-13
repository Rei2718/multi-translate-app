# 多言語労働文書翻訳アプリ

外国人労働者の「言語バリア」をなくす、翻訳 × AI補助ツール。

労働契約書や職場マニュアルを **DeepL** で自動翻訳し、訳が不自然なときは
ユーザー自身の **Claude / ChatGPT** で再翻訳するための最適なプロンプトを自動生成します。
アプリ側で AI API は呼ばないため、AI の費用は発生しません。入力した文書はサーバーに保存されません。

## 主な機能

- **自動翻訳**: DeepL API（無料枠）で日本語 → ベトナム語 / 中国語（簡体字）/ 英語 など
- **原文と並列表示**: 原文と訳文を左右に並べて確認
- **再翻訳プロンプト生成**: 文書種別・翻訳先言語・原文・DeepL下訳を組み合わせ、AI向けプロンプトを自動生成
- **ワンクリックコピー**: 生成したプロンプトをそのまま AI に貼り付け
- **入力方法**: テキスト貼り付け / `.txt` / PDF（PDFはブラウザ内で抽出。サーバーに送られません）

## 技術スタック

Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / DeepL API / Vercel

## セットアップ

```bash
npm install
cp .env.example .env.local   # DeepL キーを設定（任意。未設定でもモック動作）
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認します。

### DeepL API キーの取得（任意）

`DEEPL_API_KEY` を設定しなくても、アプリは「モック翻訳」で動作します（デモ用）。
実際の翻訳を使うには無料キーを取得してください。

1. [DeepL API Free](https://www.deepl.com/ja/pro-api) にアクセスし、無料登録する
2. アカウント設定の「認証キー（Authentication Key for DeepL API）」をコピーする
   - 無料版のキーは末尾が `:fx` で、`api-free.deepl.com` を使います（本アプリの既定）
3. `.env.local` に設定する

```bash
DEEPL_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx
```

4. dev サーバーを再起動する

> Pro 版を使う場合は `.env.local` に
> `DEEPL_API_URL=https://api.deepl.com/v2/translate` を追加してください。

## 使い方

1. 文書を入力（貼り付け / `.txt` / PDF）
2. 文書の種類・翻訳先の言語を選ぶ
3. 「DeepLで翻訳する」で翻訳し、原文と並べて確認
4. 不自然なら「再翻訳プロンプトを生成」→ コピーして自身の Claude / ChatGPT に貼り付け

## 注意事項

- DeepL API 無料枠の上限は月 500,000 文字です。
- AI（Claude / ChatGPT）はユーザー自身のアカウントを使用します。
- 入力された文書内容はサーバーに保存されません（セッション内のみで処理）。

---

_CSV（Creating Shared Value）をテーマとしたハッカソン出展作品_

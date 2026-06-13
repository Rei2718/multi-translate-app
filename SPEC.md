# 多言語労働文書翻訳アプリ — 仕様書

最終更新: 2026-06-13 / 対象バージョン: MVP

---

## 1. 概要

日本で働く外国人労働者が、労働契約書・職場マニュアルなどの日本語文書を
**母国語で正しく理解できる**ようにする Web アプリ。

- **DeepL API** で日本語文書を自動翻訳し、原文と並べて表示する。
- 翻訳が不自然なときは、ユーザー自身の **Claude / ChatGPT** で再翻訳するための
  プロンプトを自動生成・コピーできる。
- アプリ側で AI API は呼ばない（コスト 0）。入力文書はサーバーに保存しない。

CSV（Creating Shared Value）をテーマとしたハッカソン出展作品（開発期間 2 週間 / 3 名）。

---

## 2. 技術スタック

| 項目 | 採用技術 |
|------|----------|
| フレームワーク | Next.js 16.2.9（App Router / Turbopack） |
| UI | React 19.2.4 |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| 翻訳エンジン | DeepL API（Free 枠） |
| PDF 抽出 | pdfjs-dist（クライアント側） |
| AI 補助 | Claude / ChatGPT（ユーザー自身のアカウント。アプリからは呼ばない） |
| デプロイ想定 | Vercel |

---

## 3. 画面と利用フロー

単一ページ構成（`/`）。上から「ヘッダー → 入力 → 翻訳結果 → プロンプト」と縦に展開する。

```
1. 文書を入力（テキスト貼り付け / .txt / PDF アップロード）
2. 文書の種類・翻訳先の言語を選択
3. 「DeepLで翻訳する」を押す → 原文と訳文を並列表示
4. 訳が不自然なら「再翻訳プロンプトを生成」を押す
5. 生成されたプロンプトをワンクリックでコピー
6. 自身の Claude / ChatGPT に貼り付けて再翻訳
```

翻訳結果・プロンプトは、対応する操作を行うまで画面に表示されない（段階的に出現する）。

---

## 4. ファイル構成

```
app/
  layout.tsx              ルートレイアウト（lang="ja"・メタデータ）
  page.tsx                トップページ（ヘッダー / 注意書き / <TranslatorApp/>）
  globals.css             Tailwind v4 のテーマ
  api/translate/route.ts  翻訳 API（DeepL プロキシ / モック）
components/
  TranslatorApp.tsx       状態管理オーケストレーター（Client Component）
  DocumentInput.tsx       入力欄（textarea / ファイル / 種別・言語選択 / 翻訳ボタン）
  TranslationView.tsx     原文・訳文の並列表示
  PromptPanel.tsx         プロンプト表示とコピー
lib/
  types.ts                共有型
  constants.ts            言語・文書種別の定義と補助関数
  deepl.ts                サーバー専用 DeepL 呼び出し
  prompt.ts               再翻訳プロンプト生成（純関数）
  pdf.ts                  クライアント側 PDF テキスト抽出
.env.example              DEEPL_API_KEY のひな形
```

---

## 5. 機能仕様

### 5.1 文書の入力（`DocumentInput.tsx`）

- **テキスト貼り付け**: textarea に直接入力・貼り付け。
- **ファイル読み込み**: `accept=".txt,.pdf,text/plain,application/pdf"`。
  - `.txt` など: ブラウザの `File.text()` で読み込む。
  - PDF: `lib/pdf.ts` の `extractTextFromPdf` で全ページのテキストを抽出。
  - 読み込んだ本文は textarea に反映される（その後の編集も可能）。
  - ファイルはサーバーに送信されず、ブラウザ内で処理される。
- **文書の種類**: 労働契約書 / 職場マニュアル / 就業規則 / その他（`DOC_TYPES`）。
- **翻訳先の言語**: 後述の対応言語から選択。
- 入力文字数を表示。`ファイル読み込み中` / `翻訳中` はボタンが無効化される。

### 5.2 自動翻訳（`/api/translate` + `lib/deepl.ts`）

- 翻訳元は **日本語固定**（`source_lang=JA`）。
- `DEEPL_API_KEY` が設定されていれば DeepL で翻訳し `mock: false` を返す。
- 未設定なら**モック翻訳**（原文に注記を添えた文字列）を `mock: true` で返す。
  - キーがなくても UI のデモが可能。画面には「モック（DeepL未接続）」バッジを表示。

### 5.3 翻訳結果の表示（`TranslationView.tsx`）

- 原文（日本語）と訳文を左右 2 カラムで並列表示（モバイルは縦積み）。
- モック時はバッジを表示。
- 「再翻訳プロンプトを生成」への導線を持つ。

### 5.4 再翻訳プロンプト生成（`lib/prompt.ts`）

- AI API は呼ばず、文字列を組み立てる純関数 `buildRetranslationPrompt`。
- プロンプトに含める情報:
  - 文書の種類（ラベル）
  - 翻訳先の言語（ラベル）
  - 原文（日本語）
  - DeepL の下訳
- 「プロの翻訳者として、専門/法律用語を正確に、直訳でなく自然な表現に、
  下訳を参考に不自然箇所を修正し、訳のみを出力」という指示文を生成する。

### 5.5 コピー（`PromptPanel.tsx`）

- `navigator.clipboard.writeText` でクリップボードにコピー。
- コピー成功時は 2 秒間「コピーしました ✓」を表示。

---

## 6. API 仕様

### `POST /api/translate`

**リクエスト（JSON）**

| フィールド | 型 | 必須 | 説明 |
|-----------|----|----|------|
| `text` | string | ✓ | 翻訳する日本語テキスト |
| `targetLang` | string | ✓ | 翻訳先言語コード（対応言語のみ） |

**レスポンス（JSON, `TranslateResponse`）**

| フィールド | 型 | 説明 |
|-----------|----|------|
| `translatedText` | string | 翻訳結果（エラー時は空文字） |
| `mock` | boolean | モック翻訳を返したか |
| `error` | string?（任意） | エラーメッセージ |

**ステータスコード**

| コード | 条件 |
|-------|------|
| 200 | 成功（実翻訳 / モックいずれも） |
| 400 | ボディ不正 / 空文字 / 文字数超過 / 言語コード不正 |
| 502 | DeepL API 呼び出し失敗 |

**バリデーション**

- `text` が空 → 400。
- `text` が `MAX_TEXT_LENGTH`（30,000 文字）超過 → 400。
- `targetLang` が対応言語以外 → 400。

---

## 7. 対応言語・文書種別

### 翻訳先言語（`TARGET_LANGUAGES`、すべて DeepL 対応）

| 表示名 | ネイティブ表記 | DeepL コード |
|-------|---------------|-------------|
| ベトナム語 | Tiếng Việt | `VI` |
| 中国語（簡体字） | 简体中文 | `ZH-HANS` |
| 英語 | English | `EN-US` |
| 韓国語 | 한국어 | `KO` |
| ポルトガル語（ブラジル） | Português | `PT-BR` |
| インドネシア語 | Bahasa Indonesia | `ID` |

翻訳元は常に日本語（`SOURCE_LANG = "JA"`）。

### 文書の種類（`DOC_TYPES`）

労働契約書 / 職場マニュアル / 就業規則 / その他

---

## 8. 環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `DEEPL_API_KEY` | 任意 | DeepL 認証キー。未設定ならモック動作。**`NEXT_PUBLIC_` を付けない**（サーバー専用）。 |
| `DEEPL_API_URL` | 任意 | エンドポイント上書き。既定は `https://api-free.deepl.com/v2/translate`（Free 枠）。 |

`.env.example` を `.env.local` にコピーして設定する。`.env.local` は Git 管理外。

---

## 9. セキュリティ・プライバシー方針

- **文書をサーバーに保存しない**: セッション内のみで処理。DB・ファイル保存なし。
- **DeepL 呼び出しはサーバー側 Route Handler 経由**にし、API キーをブラウザに露出させない。
  `lib/deepl.ts` はクライアントから import しない。
- **PDF はクライアント側で抽出**し、ファイル自体はサーバーへ送らない。
- DeepL 呼び出しは `cache: "no-store"`。
- AI（Claude / ChatGPT）はユーザー自身のアカウントを使うため、アプリは AI に文書を送らない。

---

## 10. 制約・既知の制限

- DeepL API 無料枠の上限は月 500,000 文字。
- 1 リクエストの文字数上限は 30,000 文字（`MAX_TEXT_LENGTH`）。長文の段落分割送信は未実装（将来対応）。
- PDF はテキストとして埋め込まれている文書のみ抽出可能（画像スキャンPDFの OCR は非対応）。
- PDF の Worker は `import.meta.url` で解決。Turbopack 環境で解決できない場合は
  Worker を `public/` に配置する方式へ切り替える必要がある（フォールバック）。

---

## 11. 開発・検証コマンド

```bash
npm install        # 依存インストール（pdfjs-dist 含む）
npm run dev        # 開発サーバー（http://localhost:3000）
npm run build      # 本番ビルド
npm run start      # 本番サーバー
npm run lint       # ESLint
```

### 動作確認の観点

1. モック確認（キー未設定）: 翻訳 → モックバッジ付きで並列表示。
2. プロンプト生成 → 必要情報が埋め込まれた文面が表示され、コピーできる。
3. `.txt` / PDF を読み込み、textarea に本文が入る。
4. 実連携（任意）: `.env.local` にキー設定 → 実翻訳（`mock:false`）。
5. `npm run build` が通る。

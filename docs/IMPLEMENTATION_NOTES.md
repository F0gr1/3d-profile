# 実装解説: 3d-profile

このドキュメントは、今回の改善で何を変えたか、なぜその設計にしたか、次に自分で拡張するときにどこを触ればよいかを整理したものです。

## 今回のゴール

元のアプリは「3Dプロフィール」という見た目のアイデアは良い一方で、Create React Appの初期構成が残っていて、テスト、SEO、アクセシビリティ、連絡先のplaceholderが弱点でした。

今回の改善では、見た目だけではなく、採用担当者やエンジニアがコードを読んだときに「責務分離」「品質確認」「フォールバック設計」が伝わる状態を目指しました。

## 主な変更

- CRAからViteへ移行しました。
- `src/data/profile.ts` にプロフィール情報を集約しました。
- `Profile3D.tsx` は表示と3Dシーンの責務に寄せました。
- WebGLが使えない環境でも読めるfallbackを追加しました。
- Canvas初期化エラーとWebGL context lossを検出してfallbackへ切り替えるようにしました。
- `prefers-reduced-motion` を見て自動回転やアニメーションを止めるようにしました。
- Dreiの3Dテキストを使わず、外部フォント/CDNに依存しない構成にしました。
- Vitest + React Testing Libraryでユーザーに見える内容をテストするようにしました。
- npm ci、npm audit、Docker multi-stage build、nginxのSPA fallback/health checkを追加しました。
- OpenSpecで今回の変更理由、設計、受け入れ条件を残しました。

## なぜデータを `src/data/profile.ts` に分けたのか

3Dシーンのコードに名前、スキル、リンク、プロジェクトを直接書くと、プロフィールを更新するだけでもmeshやanimationのコードを触ることになります。

今回のようにデータを分けると、以下のメリットがあります。

- 表示内容の変更が安全になる。
- テストで期待するプロフィール内容を追いやすい。
- 将来CMSやGitHub APIからデータを取る形に変えやすい。
- 3D表現とプロフィール情報の責務が混ざらない。

次にスキルやプロジェクトを増やす場合は、まず `src/data/profile.ts` を編集してください。3D上に表示する数だけを変えたい場合は `Profile3D.tsx` の `skillPositions` と `profile.skills.slice(...)` を見ます。

## WebGLは主役ではなく拡張表現

ポートフォリオでは、派手なCanvasが表示されることよりも、誰が何を作れるのかが伝わることが重要です。

そのため、3Dシーンは `aria-hidden="true"` にして、意味のある情報はHTMLのheading、paragraph、list、linkで表示しています。

Canvasの初期化で例外が発生した場合や、表示後にWebGL context lossが起きた場合も、sceneをfallbackに切り替えます。これにより、以下の環境でも内容が伝わります。

- WebGLが無効なブラウザ
- jsdomのようなテスト環境
- スクリーンリーダー
- 低スペック端末
- reduced motionを指定しているユーザー

3D上のプロフィール文字列は外部フォント読み込みを避けるため描画していません。アイデンティティ、スキル名、プロジェクト名はDOM側が持ちます。

## reduced motion対応の考え方

`prefers-reduced-motion: reduce` は、ユーザーがOSやブラウザで「動きを減らしたい」と設定している状態です。

この設定が有効な場合、`useFrame` の中で早期returnし、`OrbitControls` の `autoRotate` も止めています。

実装上のポイントは、CSSだけでなくJavaScript側のanimation loopも止めることです。Canvas内の動きはCSSでは止まらないため、React Three Fiberの更新処理で制御する必要があります。

## テスト方針

今回のテストでは、meshの座標や回転角度は検証していません。理由は、そこを固定するとリファクタリングしづらくなるからです。

代わりに、ユーザーにとって重要な以下を確認しています。

- `Ishigami Yuki` と `F0gr1` が表示される。
- placeholderの連絡先が残っていない。
- WebGLが使えない環境でfallbackが表示される。
- reduced motion状態がUIに表示される。

このように、実装詳細ではなくユーザーに見える振る舞いをテストすると、壊れやすいテストになりにくいです。

## 次に自分で実装するなら

1. `src/data/profile.ts` に新しいプロジェクトやスキルを追加する。
2. `Profile3D.tsx` の `ProfileScene` に3D表現を追加する。
3. `App.test.tsx` に「ユーザーが見える内容」のテストを追加する。
4. `npm ci`、`npm run lint`、`npm run typecheck`、`npm run test:run`、`npm run build`、`npm audit` を通す。
5. 変更が仕様として残るなら `openspec/changes/` に新しいchangeを追加する。

## 注意点

Three.js系の依存はbundle sizeが大きくなりやすいです。初期表示のJavaScriptを軽くするlazy loadingは将来の改善候補ですが、現状はシンプルな単一ページ構成を優先しています。

Docker runtimeはnginxの非rootユーザーで動作し、`/healthz`とSPA deep linkを提供します。

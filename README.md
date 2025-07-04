# ポモドーロタイマーアプリ

シンプルで使いやすいポモドーロタイマーアプリケーションです。作業と休憩を交互に切り替えて、効率的に集中して作業することをサポートします。

## 機能

- **ポモドーロタイマー**: 25分の作業時間と5分の短い休憩時間、15分の長い休憩時間を自動で切り替え
- **視覚的なフィードバック**: 円形のプログレスバーで残り時間を視覚的に表示
- **セッション管理**: 完了したポモドーロの数を記録し表示
- **作業メモ**: 現在のセッションで行う作業内容をメモできる機能
- **通知設定**: 音とバイブレーションの通知をオン/オフ可能
- **ダークモード**: 目に優しいダークモードに切り替え可能
- **カレンダー表示**: 過去28日間のポモドーロ達成履歴を表示
- **習慣化サポート**: 1日4ポモドーロ達成でスタンプを獲得

## 使い方

1. 「スタート」ボタンをクリックしてタイマーを開始します
2. 作業中に一時停止したい場合は「一時停止」ボタンをクリックします
3. タイマーをリセットしたい場合は「リセット」ボタンをクリックします
4. 作業内容メモ欄に現在のセッションでやるべきことを記入できます
5. 設定セクションで音とバイブレーションの通知をオン/オフできます
6. 右上のボタンでダークモードとライトモードを切り替えられます

## ローカルストレージ

このアプリはブラウザのローカルストレージを使用して以下の情報を保存します：

- テーマ設定（ダーク/ライト）
- 通知設定（音/バイブレーション）
- 今日のポモドーロ達成数
- 過去のポモドーロ履歴

## 開始方法

1. `index.html` ファイルをブラウザで開くだけで使用できます
2. インターネット接続が必要なのは、フォントとアイコンの読み込み、および通知音のみです

## 技術仕様

- HTML5, CSS3, JavaScript (ES6+)
- レスポンシブデザイン - モバイルデバイスでも使用可能
- ローカルストレージAPIを使用したデータ保存
- SVGを使用したアニメーション

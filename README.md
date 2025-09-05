# Gravity Controllable Connect 4

重力操作可能なコネクト4ゲームです。従来のコネクト4に重力操作の要素を加えた、戦略性の高いゲームです。

## 🎮 ゲームの特徴

- **重力操作**: 自分のターンで重力の方向を変更できます
- **4つの重力方向**: 下向き、上向き、左向き、右向き
- **対戦モード**: 人間対人間、人間対CPU
- **CPU難易度**: 弱い、普通、強いの3段階
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 🎯 遊び方

1. **基本ルール**: 縦・横・斜めのいずれかに4つのコマを並べると勝利
2. **重力操作**: 自分のターンでは以下のいずれかを行えます
   - 空いている列にコマを挿入する（現在の重力方向にコマが落下）
   - 重力方向を変更する
3. **勝利条件**: 4つのコマを一直線に並べる

## 🚀 セットアップ

### 必要な環境
- Node.js (v16以上)
- npm または yarn

### インストール
```bash
# リポジトリをクローン
git clone https://github.com/arad166/gravity-controllable-connect4.git
cd gravity-controllable-connect4

# 依存関係をインストール
npm install
```

### 開発サーバーの起動
```bash
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてゲームをプレイできます。

## 📦 ビルドとデプロイ

### プロダクションビルド
```bash
npm run build
```

### GitHub Pagesへのデプロイ
```bash
npm run deploy
```

## 🏗️ プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Board.tsx        # ゲームボード
│   ├── GameInfo.tsx     # ゲーム情報表示
│   └── GravityControls.tsx # 重力操作コントロール
├── hooks/               # カスタムフック
│   └── useGame.ts       # ゲームロジック
├── ai/                  # AI実装
│   ├── cpuWeak.ts       # 弱いCPU
│   ├── cpuNormal.ts     # 普通のCPU
│   └── cpuStrong.ts     # 強いCPU
├── types/               # TypeScript型定義
│   └── game.ts          # ゲーム関連の型
└── App.tsx              # メインアプリケーション
```

## 🎮 ゲームモード

### Human vs Human
- 2人の人間プレイヤーが対戦
- 交互にコマを配置または重力を変更

### Human vs CPU
- 人間プレイヤーとCPUが対戦
- CPUの難易度を選択可能
  - **Weak (🐇)**: 簡単なランダム戦略
  - **Normal (🐑)**: 基本的な戦略
  - **Strong (🦁)**: 高度な戦略とミニマックスアルゴリズム

## 🧠 AI実装

### CPU難易度の詳細
- **Weak**: ランダムな手を選択
- **Normal**: 基本的な攻撃・防御戦略
- **Strong**: ミニマックスアルゴリズムを使用した高度な戦略

### 重力操作の戦略
AIは重力操作も考慮して最適な手を選択します。重力変更により盤面の状況が大きく変わるため、より深い読みが必要になります。

## 🎨 技術スタック

- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **CSS3** - スタイリング
- **GitHub Pages** - デプロイメント

## 📱 対応ブラウザ

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 リンク

- [デモサイト](https://arad166.github.io/gravity-controllable-connect4/)
- [GitHub リポジトリ](https://github.com/arad166/gravity-controllable-connect4)

---

楽しいゲームをお楽しみください！🎉
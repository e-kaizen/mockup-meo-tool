/**
 * このサービスは、Googleビジネスプロフィール（GBP）の登録状況を確認するためのものです。
 * 本来この処理は、Puppeteerなどのライブラリをサーバーサイドで実行して行う必要があります。
 * このファイルでは、そのサーバーサイドAPI呼び出しをシミュレートします。
 */

/**
 * GoogleマップのURLをチェックしてGBP登録状況を判定します。
 * @param uri - GoogleマップのURL
 * @returns GBPが登録済みと判定されればtrue
 *
 * @note
 * ブラウザのセキュリティ制約（同一オリジンポリシー）により、クライアントサイドから
 * 外部URLのコンテンツを直接読み取ることはできません。
 * したがって、この機能はバックエンドにAPIを構築して実装する必要があります。
 *
 * この関数は、そのAPI呼び出しをシミュレートするものです。
 * 現状は、モックデータ内のURIに 'unclaimed' という文字列が含まれているかでダミーの判定を行っています。
 */
export const checkGbpRegistration = async (uri: string | undefined): Promise<boolean> => {
  if (!uri) {
    return false; // URIがなければ未登録とみなす
  }

  // ここから下はシミュレーションです。
  // 本来は、以下のような処理をバックエンドで行い、そのAPIを呼び出します。

  // console.log(`[Simulation] Checking GBP registration for: ${uri}`);
  // const response = await fetch('/api/check-gbp', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ mapUri: uri })
  // });
  // if (!response.ok) {
  //   console.error("API call to check GBP failed");
  //   return false; // エラー時は安全側に倒し、未登録扱いにする
  // }
  // const { isVerified } = await response.json();
  // return isVerified;

  // シミュレーションのための擬似的な遅延
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  // デモ用の単純なチェックロジック
  return !uri.includes('unclaimed');
};


/*
================================================================================
【参考】Puppeteerを使ったバックエンド（Node.js）の実装サンプル
================================================================================

以下は、ExpressフレームワークとPuppeteerを使用して、
GBP登録状況を確認するAPIサーバーを構築する場合のコードサンプルです。

--------------------------------------------------------------------------------
// 1. 必要なライブラリをインストール
// npm install express puppeteer

// 2. server.js などのファイルを作成
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/check-gbp', async (req, res) => {
  const { mapUri } = req.body;

  if (!mapUri || !mapUri.startsWith('https://maps.google.com')) {
    return res.status(400).json({ error: 'Invalid Google Maps URI provided.' });
  }

  let browser = null;
  try {
    // Puppeteerを起動
    // Note: サーバー環境によっては '--no-sandbox' オプションが必要な場合があります。
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Googleマップのページに移動
    await page.goto(mapUri, { waitUntil: 'networkidle2' });

    // "ビジネスオーナーですか？" というテキストが含まれる要素を探す
    const ownerClaimSelector = 'span[aria-label="このビジネスのオーナーですか？"], div.iS1jMb.k48I1d'; // セレクタは変更される可能性あり
    const element = await page.$(ownerClaimSelector);

    // 要素が見つかれば「未登録」、見つからなければ「登録済み」と判断
    const isVerified = element === null;

    res.json({ isVerified });

  } catch (error) {
    console.error('Puppeteer scraping failed:', error);
    res.status(500).json({ error: 'Failed to check GBP status.' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
--------------------------------------------------------------------------------
*/

(function() {
  'use strict';

  // 定数
  const clearBtn = document.getElementById('clearBtn');
  const calcBtn = document.getElementById('calcBtn');
  let calced = false;

  // 計算処理
  function calSysOdds() {
    // オッズ取得
    const oddsStr = $('textarea#odds').val();

    // 改行単位で分割
    const oddsArray = oddsStr.split('\n');
    let odds = [];
    let denomi = 0.0;   // 分母
    let oddsNum = 0;

    // もうちょっとカッコイイ書き方があるが、とりあえずこれ
    for (let i=0; i<oddsArray.length; i++) {
      // 暫定空行回避
      if (oddsArray[i] !== "") {
        odds[oddsNum] = parseFloat(oddsArray[i]);

        // 数字ではない
        if (isNaN(odds[oddsNum])) {
          alert(`${oddsArray[i]}:数字ではありません`);
          return;
        }

        // 1未満
        if (odds[oddsNum] < 1) {
          alert(`${oddsArray[i]}:1未満の値はオッズではありません。`);
          return;
        }

        // チェックを抜けたら合成オッズの分母として計算
        denomi += 1.0 / odds[oddsNum];
        oddsNum++;
      }
    }

    // オッズ無し
    if (oddsNum == 0) {
      alert("有効なオッズがありません！");
      return;
    }

    // 演算結果が残っているままなら一度消す
    if (calced) {
      clearResult();
    }

    // 合成オッズを計算
    let sysOdds = 1.0 / denomi;
    $('p#calcResultMes').html(`合成オッズは<strong class=\"text-primary\">${sysOdds}</strong>です。`);

    // 資金取得
    let fund = parseInt($('input#fundEdit').val());
    
    // 資金があれば購入額を計算する
    if (fund > 0) {
      let allocFunds = [];
      let returns = [];
      let sysReturn = fund * sysOdds;
      let totalFund = 0;
      let tableCode = "<table id=\"resTable\" class=\"table\">\n";

      // table
      tableCode += "  <thead>\n";
      tableCode += "    <tr>\n";
      tableCode += "      <th>オッズ</th><th>購入金額[円]</th><th>払い戻し[円]</th>\n";
      tableCode += "    </tr>\n";
      tableCode += "  <thead>\n";
      tableCode += "  <tbody>\n";

      // 購入額計算
      for (let i=0; i<oddsNum; i++) {
        // 各オッズの購入額 = (合成オッズ / 各オッズ)
        // 10の位以下は切り上げ
        allocFunds[i] = Math.ceil(sysReturn / odds[i] / 100.0) * 100;

        // 総購入額に加算
        totalFund += allocFunds[i];

        // 払い戻し額を計算
        returns[i] = Math.floor(allocFunds[i] * odds[i]);
        tableCode += "  <tr>\n"
        tableCode += `    <td>${odds[i]}</td><td><strong class=\"text-info\">${allocFunds[i]}</td><td>${returns[i]}</td>\n`
        tableCode += "  </tr>\n"
      }
      tableCode += "  </tbody>\n"
      tableCode += "</table>\n"

      $('div#calcResult').append('<h3 id=\"fund_title\">資金配分</h3>');
      $('div#calcResult').append(tableCode);

      // 最終購入額を表示
      $('p#calcAlloc').html(`合成オッズを考慮した結果、資金は<strong class=\"text-primary\">${totalFund}円</strong>必要です。`);

      calced = true;
    }
  }

  /**
   * 計算ボタンクリック時のイベント
   */
  calcBtn.onclick = (event) => {
    calSysOdds();
  }

  /**
   * クリアボタンクリック時のイベント
   */
  clearBtn.onclick = (event) => {
    $('textarea#odds').val("");
    $('input#fundEdit').val("");
    $('p#calcResultMes').text("(ここに結果が表示されます)");
    clearResult();
  }

  /**
   * 結果クリア
   */
  function clearResult() {
    $('p#calcAlloc').text("");
    $('h3#fund_title').remove();
    $('table#resTable').remove();
    calced = false;
  }

})();


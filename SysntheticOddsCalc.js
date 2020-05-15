(function() {
    'use strict';

    // 定数
    const oddsEdit = document.getElementById('odds');
    const calcResult = document.getElementById('calcResult');
    const calcAlloc = document.getElementById('calcAlloc');
    const calcBtn = document.getElementById('calcBtn');
    const fundEdit = document.getElementById('fundEdit');

    // 計算処理
    function calSysOdds() {
        // オッズ取得
        const oddsStr = oddsEdit.value;

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

        // 合成オッズを計算
        let sysOdds = 1.0 / denomi;
        calcResult.innerHTML = `合成オッズは<strong>${sysOdds}</strong>です。`;

        // 資金取得
        let fund = parseInt(fundEdit.value);
        calcAlloc.innerHTML = "";
        
        // 資金があれば購入額を計算する
        if (fund > 0) {
            let allocFunds = [];
            let returns = [];
            let sysReturn = fund * sysOdds;
            let totalFund = 0;
            
            // 購入額計算
            for (let i=0; i<oddsNum; i++) {
                // 各オッズの購入額 = (合成オッズ / 各オッズ)
                // 10の位以下は切り上げ
                allocFunds[i] = Math.ceil(sysReturn / odds[i] / 100.0) * 100;

                // 総購入額に加算
                totalFund += allocFunds[i];

                // 払い戻し額を計算
                returns[i] = Math.floor(allocFunds[i] * odds[i]);
                calcAlloc.innerHTML += `${odds[i]}倍のオッズに<strong class="text-info">${allocFunds[i]}円</strong>購入ください。払い戻しは${returns[i]}円になります。<br>`
            }
            // 最終購入額を表示
            calcAlloc.innerHTML += `合成オッズを考慮した結果、資金は<strong class="text-primary">${totalFund}円</strong>必要です。`
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
        oddsEdit.value = "";
        fundEdit.value = "";
        calcResult.innerHTML = "(ここに結果が表示されます)";
        calcAlloc.innerHTML = "";
    }

})();


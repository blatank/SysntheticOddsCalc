(function() {
    'use strict';

    // 定数
    const oddsEdit = document.getElementById('odds');
    const calcResult = document.getElementById('calcResult');
    const calcAlloc = document.getElementById('calcAlloc');
    const calcBtn = document.getElementById('calcBtn');
    const fundEdit = document.getElementById('fundEdit');

    // 読み込み時の処理
    // const regex = RegExp(`(?:(?:^|.*;\s*)${cookieName}\s*\=\s*([^;]*).*$)|^.*$`);
    // const cookieValue = document.cookie.replace(regex, "$1");

    // cookieがあるなら表示する
    // if (cookieValue.length > 0) {
    //     maxStaminaEdit.value = cookieValue;
    //     calcStamina();    
    // }
    // else {
    //     ;
    // }

    /**
     * 計算したスタミナを出力する
     */
    function calSysOdds() {
        // オッズ取得
        const oddsStr = oddsEdit.value;

        // 改行単位で分割
        const oddsArray = oddsStr.split('\n');
        let odds = [];
        let denomi = 0.0;   // 分母

        // もうちょっとカッコイイ書き方があるが、とりあえずこれ
        for (let i=0; i<oddsArray.length; i++) {
            odds[i] = parseFloat(oddsArray[i]);
            denomi += 1.0 / odds[i];
        }

        let sysOdds = 1.0 / denomi;
        calcResult.innerHTML = `合成オッズは<strong>${sysOdds}</strong>です。`;

        // 資金取得
        let fund = parseInt(fundEdit.value);

        let allocFunds = [];
        let returns = [];
        let sysReturn = fund * sysOdds;
        let totalFund = 0;

        for (let i=0; i<oddsArray.length; i++) {
            allocFunds[i] = Math.ceil(sysReturn / odds[i] / 100.0) * 100;
            totalFund += allocFunds[i];
            returns[i] = Math.floor(allocFunds[i] * odds[i]);
            calcAlloc.innerHTML += `${odds[i]}倍のオッズに<strong class="text-info">${allocFunds[i]}円</strong>購入ください。払い戻しは${returns[i]}円になります。<br>`
        }
        calcAlloc.innerHTML += `合成オッズを考慮した結果、資金は<strong class="text-primary">${totalFund}円</strong>必要です。`
    }

    /**
     * エディットボックス変更時のイベント
     */
    calcBtn.onclick = (event) => {
        calSysOdds();
    }

})();


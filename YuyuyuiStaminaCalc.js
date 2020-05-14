(function() {
    'use strict';

    // 定数
    const maxStaminaEdit = document.getElementById('maxStamina');
    const calcResult = document.getElementById('calcResult');
    const cookieName = "CalYuyuiStamina";
    const recoverPerMin = 5;                // 5分で1回復する
    const cookieLife = 60 * 60 * 24 * 20;   // 20日(Sec*Min*Hour*Day)


    // 読み込み時の処理
    const regex = RegExp(`(?:(?:^|.*;\s*)${cookieName}\s*\=\s*([^;]*).*$)|^.*$`);
    const cookieValue = document.cookie.replace(regex, "$1");

    // cookieがあるなら表示する
    if (cookieValue.length > 0) {
        maxStaminaEdit.value = cookieValue;
        calcStamina();    
    }
    else {
        ;
    }

    /**
     * 計算したスタミナを出力する
     */
    function calcStamina() {
        const recoverPerHour = 60 / recoverPerMin;      // 1時間の回復量
        const maxStamina = parseInt(maxStaminaEdit.value);
        
        calcResult.innerText = "";
        for (let i = 1; i <= 24; i++) {
            const targetStamina = maxStamina - recoverPerHour * i;
            if (targetStamina > 0) {
                let p = document.createElement('p');
                p.classList.add('result');
                p.innerHTML = `${i}時間放置するとしたら、${targetStamina}以下に減らしておいてください。`;
                calcResult.appendChild(p);
            }
            else {
                break;
            }
        }

        // スタミナ回復量を計算
        // まずはMAX / 1時間の回復量で何時間かかるか
        const hour = Math.floor(maxStamina / recoverPerHour);
        // 残り分を出す
        const min = (maxStamina - recoverPerHour * hour) * recoverPerMin;

        // HTML出力
        const p = document.createElement('p');
        p.innerHTML = `全開するまでに、<strong class="recover">${hour}時間 ${min}分</strong>掛かります。`;
        calcResult.appendChild(p);
    }

    /**
     * エディットボックス変更時のイベント
     */
    maxStaminaEdit.onchange = (event) => {
        calcStamina();

        // cookie更新
        // グローバル変数にすれば別に再取得いらんのやけど
        // そのうちクラス化する
        document.cookie = `${cookieName}=${parseInt(maxStaminaEdit.value)};max-age=${cookieLife}`;
    }

})();


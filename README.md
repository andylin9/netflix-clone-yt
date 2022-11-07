# 錯誤發生紀錄
1. Uncaught SyntaxError: Unexpected token 'export' at /node_modules/ (stripe/firestore-stripe-payments/lib/index.js:16)  
Error 原因： 瀏覽器不認得 stripe/firestore-stripe-payments 這個模塊使用的 es6 的 export 語法
2. 解決辦法： 安裝 next-transpile-modules 並在 next.config.js 寫入新的配置
    ```js
    // next.config.js
    const withTM = require("next-transpile-modules")([
      "這邊填入要被轉譯的模塊名，以這次的例子就是@stripe/firestore-stripe-payments",
    ]); // pass the modules you would like to see transpiled

    module.exports = withTM({});
    ```

3. 參考： https://stackoverflow.com/questions/65936222/next-js-syntaxerror-unexpected-token-export

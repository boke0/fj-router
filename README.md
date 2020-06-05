fj-router
===
History APIベースのルーティングライブラリです。

## 使い方
<fj-router>タグをHTML内に設置すると、その中でHTMLでURLに合わせてコンポーネントが書き換わります。
ルーティング情報は次のように設定します。
``` javascript
const router = document.querySelector("fj-router");
router.add([
    {
        path: "/",
        component: (params)=> document.createElement("sample-index")
    },
    {
        path: "/about",
        component: document.createElement("sample-about")
    }
])
```

componentに関数を指定した場合は、ページ遷移の度にコンポーネントを生成します。

パスにプレースホルダを埋め込むことで、パラメータを利用したコンポーネント生成も可能です。
プレースホルダのパラメータはcomponentメソッドの引数、または、ルーティング時にcomponent生成直後、設置前に実行されるsetup()メソッドの第二引数から利用することができます。

``` javascript
router.add([
    {
        path: "/a/:user",
        component: (params)=> {
            const comp = document.createElement("sample-user-a");
            comp.setAttribute("data-uid", params.user);
            return comp;
        }
    },
    {
        path: "/b/:user",
        component: ()=> document.createElement("sample-user-b"),
        setup: (comp, params) => {
            comp.setAttribute("data-uid", params.user);
            return comp;
        }
    }
])
```

コンポーネントをDOMツリーに追加したあと、一度だけafter()メソッドが実行されます。

``` javascript
router.add([
    {
        path: "/b/:user",
        component: ()=> document.createElement("sample-user-b"),
        setup: (comp, params) => {
            comp.setAttribute("data-uid", params.user);
            return comp;
        },
        after: (comp) => {
            document.title = comp.getTitle();
        }
    }
])
```

## 使用例
``` html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <header>
            <fj-link href="/">ホーム</fj-link>
            <fj-link href="/about">自己紹介</fj-link>
            <fj-link href="/link">リンク</fj-link>
        </header>
        <fj-router></fj-router>
        <script src="../dist/index.js"></script>
        <script src="./main.js"></script>
    </body>
</html>
```
``` javascript
window.onload=()=>{
    const router = document.querySelector("fj-router");
    router.setBase("/demo");
    router.add([
        {
            path: "/",
            component: ()=>{
                var con = document.createElement("div")
                con.innerHTML="ホームページです。ようこそ";
                return con;
            }
        },
        {
            path: "/about",
            component: ()=>{
                var con = document.createElement("div")
                con.innerHTML="自己紹介です。こんにちは";
                return con;
            }
        },
        {
            path: "/link",
            component: ()=>{
                var con = document.createElement("div")
                con.innerHTML="リンクです。出てけ";
                return con;
            }
        }
    ]);
    router.page();
}
```


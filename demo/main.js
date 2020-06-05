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

import {customElement, html, LitElement} from "lit-element";

var _wr = function(type) {
    var orig = history[type];
    return function() {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

window.addEventListener('replaceState', function(e) {
    console.warn('THEY DID IT AGAIN!');
});

@customElement("fj-link")
export default class Link extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: "closed"});
        this.shadow.innerHTML="<slot></slot>";
        this.onclick=()=>{
            history.pushState(null, null, window.fj_base_uri+this.getAttribute("href"));
            window.dispatchEvent(new Event("pushstate"));
        }
    }
}

class Leaf {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.children = {};
        this.data = null;
    }
    register(arr, data) {
        arr.shift();
        if (arr.length==0) {
            this.data = data;
        }else{
            let key, name, type;
            if (arr[0].charAt(0)==":") {
                key = "*";
                name = arr[0].slice(1);
                type = 1;
            }else if (arr[0]=="**"){
                key = "**";
                name = "**";
                type = 2;
            }else{
                key = arr[0];
                name = arr[0];
                type = 0;
            }
            if (!(key in this.children)) {
                this.children[key] = new Leaf(type, name)
            }
            this.children[key].register(arr, data)
        }
    }
    route(arr) {
        let key = arr.shift();
        let data;
        if(this.type==2) {
            data = this.data;
            data.params = {};
            return data;
        }
        let params = {};
        if(this.type==1){
            params[this.name] = key;
        }
        if(arr.length!=0) {
            let node;
            if (arr[0] in this.children) {
                node = this.children[arr[0]];
            }else if ("*" in this.children){
                node = this.children["*"];
            }else if ("**" in this.children){
                node = this.children["**"];
            }else{
                return false;
            }
            data = node.route(arr);
            params = Object.assign(params, data.params);
        }else{
            data = this.data;
        }
        data.params = params;
        return data;
    }
}

@customElement("fj-router")
class Router extends LitElement {
    constructor() {
        super();
        this.root_node = new Leaf(0, "");
        window.fj_base_uri = "";
        window.addEventListener("pushstate", ()=>this.page());
        window.addEventListener("popstate", ()=>this.page());
        window.addEventListener("replacestate", ()=>this.page());
    }
    setBase(path){
        window.fj_base_uri = path;
    }
    render(){
        return html`<slot></slot>`;
    }
    page() {
        let path = location.pathname.slice(fj_base_uri.length);
        let data = this.route(path);
        var comp = typeof data.component === "function"
            ? data.component(data.params)
            : data.component;
        if("setup" in data) data.setup(comp, data.params);
        this.innerHTML = "";
        this.appendChild(comp);
        if("after" in data) data.after(comp);
    }
    add(arr) {
        arr.forEach(e => {
            this.register(e);
        });
    }
    register(data) {
        let arr = data.path.split("/");
        this.root_node.register(arr, data);
    }
    route(path) {
        let arr = path.split("/");
        return this.root_node.route(arr);
    }
}


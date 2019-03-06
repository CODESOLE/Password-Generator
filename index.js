const {remote} = require('electron');

var aud = new Audio('./res/ES_Juarez 1 - Niklas Ahlstrom.mp3');
aud.volume = 0;
aud.loop = true;

var splash = document.createElement("div");
var content = document.getElementById("content");
var heart = document.createElement("div");
document.getElementById("close").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.close();
})

document.getElementById("max").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.maximize();
})

document.getElementById("min").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.minimize();
})

function blur() {
    document.getElementById("close").setAttribute("style", "background-color: rgb(56, 56, 56)");
    document.getElementById("max").setAttribute("style", "background-color: rgb(56, 56, 56)");
    document.getElementById("min").setAttribute("style", "background-color: rgb(56, 56, 56)");
}

function focus() {
    document.getElementById("close").setAttribute("style", "background-color: red");
    document.getElementById("max").setAttribute("style", "background-color: yellow");
    document.getElementById("min").setAttribute("style", "background-color: rgb(0, 255, 0)");
}

function gen() {
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("gen").innerHTML.toUpperCase();
    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        content.removeChild(splash);
        content.removeChild(heart);
    },500);
    setTimeout(() => {
        var gen_but = document.createElement("div");
        gen_but.style.height = 10 + "px";
        gen_but.style.width = 100 + "px";
        gen_but.style.backgroundColor = "Red";
        gen_but.style.margin = "auto";
        gen_but.style.borderRadius = 5 + "px";
        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(gen_but);

    },600);
        
        //document.getElementById("stack").onclick = true;
        //document.getElementById("about").onclick = true;
        //this.onclick = false;
    
}

function stack() {
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("stack").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("stack").innerHTML.toUpperCase();



    
        //document.getElementById("gen").onclick = true;
        //document.getElementById("about").onclick = true;
        //this.onclick = false;
    
}

function about() {
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("about").innerHTML.toUpperCase();



    
        //document.getElementById("gen").onclick = true;
        //document.getElementById("stack").onclick = true;
        //this.onclick = false;
    
}

function exit() {
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    var window = remote.getCurrentWindow();
    window.close();
}
var toggle = 0;

function slide() {
    toggle++;
    if (toggle % 2 == 1 && aud.volume == 0) {
        document.getElementById("btn").setAttribute("style", "transform:translateX(20px);; background-color: #2e2d4d");
        document.getElementById("cont").setAttribute("style", "background-color: #028690");
        aud.play();
        document.getElementById('switch').innerHTML = "Turn off Music";
        var fin = setInterval(() => {
            if (aud.volume < 1.0) {
                aud.volume += 0.05;
                //console.log(aud.volume);
            }
            if (aud.volume >= 1.0 || aud.volume == 0.9500000000000003) {
                aud.volume = 1;
                clearInterval(fin);
            }
        }, 100);

    } else if (toggle % 2 == 0 && aud.volume == 1) {
        document.getElementById("btn").setAttribute("style", "transform:translateX(0px);; background-color: rgba(5, 5, 5, 0.432)");
        document.getElementById("cont").setAttribute("style", "background-color: rgba(255, 255, 255, 0.623)");
        var fout = setInterval(() => {
            aud.volume -= 0.05;
            //console.log(aud.volume);
            if (aud.volume <= 0.0 || aud.volume == 0.049999999999999684) {
                aud.volume = 0;
                clearInterval(fout);
            }
        }, 100);

        document.getElementById('switch').innerHTML = "Turn on Music";

    }
}
window.onload = () => {
    splash.style.backgroundImage = "url('./res/welcome_screen.png')";
    splash.style.width = '150px';
    splash.style.height = '216px';
    splash.style.backgroundSize = 'cover';
    splash.style.opacity = '0';
    splash.style.margin = '0px';
    splash.style.left = '25%';
    splash.style.top = '400px';
    splash.style.position = 'relative';
    splash.style.transition = '1s';

    heart.style.backgroundImage = "url('./res/heart.png')";
    heart.style.backgroundSize = 'cover';
    heart.style.width = '50px';
    heart.style.height = '50px';
    heart.style.margin = '0px';
    heart.style.top = '100px';
    heart.style.left = '10%';
    heart.style.position = 'relative';
    heart.style.opacity = '0';
    heart.style.transition = '1s';

    content.appendChild(splash);
    content.appendChild(heart);

    setTimeout(() => {

        splash.style.transform = 'translateY(-400px)';
        splash.style.opacity = '1';

    }, 200);


    setTimeout(() => {

        heart.style.transform = 'translateY(-100px)';
        //heart.style.transform = 'rotate(365deg)';
        heart.style.transform = 'scale(1.5)';
        heart.style.opacity = '1';

    }, 500);

};
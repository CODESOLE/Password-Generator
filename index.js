/*jshint esversion: 6 */
const crypto = require("crypto");
const {
    remote
} = require("electron");
const fs = require("fs");

var UID = {
	_current: 0,
	getNew: function(){
		this._current++;
		return this._current;
	}
};

HTMLElement.prototype.pseudoStyle = function(element,prop,value){
	var _this = this;
	var _sheetId = "pseudoStyles";
	var _head = document.head || document.getElementsByTagName('head')[0];
	var _sheet = document.getElementById(_sheetId) || document.createElement('style');
	_sheet.id = _sheetId;
	var className = "pseudoStyle" + UID.getNew();
	
	_this.className +=  " "+className; 
	
	_sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
	_head.appendChild(_sheet);
	return this;
};

const lower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const upper = lower.map((letter) => {
    return letter.toUpperCase();
});
const number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbols = `!"#$%&'()*+,-./:;<=>?@[\]^_{|}~`.split('');

var aud = new Audio('./res/ES_Juarez 1 - Niklas Ahlstrom.mp3');
aud.volume = 0;
aud.loop = true;

var splash = document.createElement("div");
var content = document.getElementById("content");
var heart = document.createElement("div");

document.getElementById("close").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("max").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.maximize();
});

document.getElementById("min").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.minimize();
});

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
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
    }, 500);
    setTimeout(() => {
        var checkb = document.createElement("div");
        checkb.innerHTML = `<div class="container">
        <ul class="ks-cboxtags">
          <li><input type="checkbox" id="upperCase" value="Capital Letters"><label for="upperCase">Capital Letters (A-Z)</label></li>
          <li><input type="checkbox" id="lowerCase" value="Lower Letters" checked><label for="lowerCase">Lower Letters (a-z)</label></li>
          <li><input type="checkbox" id="symbols" value="Symbols" checked><label for="symbols">Symbols (&%+/...)</label></li>
          <li><input type="checkbox" id="numbers" value="Numbers"><label for="numbers">Numbers (0123...)</label></li>
          <input type="number" placeholder="Enter the character count(4-99)" id="number" max="99" min="4"><label for="numbers"></label>
          </ul>
          <button class="button" onclick="generate()" style="vertical-align:left"><span>GENERATE </span></button>
          <button id="save" class="button" onclick="save()" style="vertical-align:left"><span>SAVE </span></button>
          <div id="pass"><div id="caution"></div></div>
      </div>`;

        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(checkb);

    }, 500);
    document.getElementById("pass").textContent = "";
    document.getElementById("pass").style.opacity = 1;
    document.getElementById("pass").style.marginLeft = '100px';
    //document.getElementById("stack").onclick = true;
    //document.getElementById("about").onclick = true;
    //this.onclick = false;

}

function generate() {
    const c_upper = document.getElementById("upperCase");
    const c_lower = document.getElementById("lowerCase");
    const c_symbols = document.getElementById("symbols");
    const c_number = document.getElementById("numbers");
    let iteration = document.getElementById("number").value;
    let boundry = [];
    var chars = [];
    if (c_upper.checked == true) {
        boundry.push(...upper);
    }
    if (c_lower.checked == true) {
        boundry.push(...lower);
    }
    if (c_symbols.checked == true) {
        boundry.push(...symbols);
    }
    if (c_number.checked == true) {
        boundry.push(...number);
    }
    if (iteration < 4 || iteration == "" || iteration > 99) {
        document.getElementById("pass").style.borderLeft = '5px solid rgb(255, 0, 0)';
        document.getElementById("pass").style.color = 'rgb(255, 0, 0)';
        document.getElementById("pass").textContent = "Please doesnt set character count value to empty or out of 4-99!";
        document.getElementById("pass").style.opacity = '1';
        document.getElementById("pass").style.marginLeft = '5px';
    } else {
        document.getElementById("pass").style.opacity = '1';
        document.getElementById("pass").style.marginLeft = '5px';
        document.getElementById("pass").style.borderLeft = '5px solid rgb(0, 255, 21)';
        document.getElementById("pass").style.color = 'rgb(0, 255, 21)';

       var pass12 = document.getElementById("pass");
       pass12.pseudoStyle("before", "content", "url('./res/caution.svg')");
        if (boundry == "") {
            chars = `abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ!"#$%&'()*+,-./:;<=>?@[]^_{|}~0123456789`;
        } else {
            chars = boundry.join('');
        }

        var rnd = crypto.randomBytes(parseInt(iteration, 10));
        var value = new Array(parseInt(iteration, 10));
        var len = Math.min(256, chars.length);
        var d = 256 / len;

        for (var i = 0; i < parseInt(iteration, 10); i++) {
            value[i] = chars[Math.floor(rnd[i] / d)];
        }
        document.getElementById("pass").textContent = value.join('');
    }

    document.getElementById("save").setAttribute("style", "display: inline;");
}

function save() {

}

function stack() {
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("stack").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("stack").innerHTML.toUpperCase();

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
    }, 500);

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

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
    }, 500);

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
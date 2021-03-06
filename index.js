/*jshint esversion: 9 */
const crypto = require("crypto");
const {
    remote,
    clipboard
} = require("electron");
const fs = require("fs");
const {
    dialog
} = require('electron').remote;
let passwords = {
    passw: [],
    PIN: '160150'
};
var isStack = false;
let isFocus;
const lower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const upper = lower.map((letter) => {
    return letter.toUpperCase();
});
const number = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbols = `!#$%&()*+,-./:;<=>?@[]^_{|}~`.split('');

var aud = new Audio('./res/ES_Juarez 1 - Niklas Ahlstrom.mp3');
aud.volume = 0;
aud.loop = true;

var splash = document.createElement("div");
var content = document.getElementById("content");

document.getElementById("close").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("max").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
});

document.getElementById("min").addEventListener('click', () => {
    var window = remote.getCurrentWindow();
    window.minimize();
});

function blur() {
    document.getElementById("close").setAttribute("style", "background-color: rgb(56, 56, 56)");
    document.getElementById("max").setAttribute("style", "background-color: rgb(56, 56, 56)");
    document.getElementById("min").setAttribute("style", "background-color: rgb(56, 56, 56)");
    isFocus = false;
}

function focus() {
    document.getElementById("close").setAttribute("style", "background-color: red");
    document.getElementById("max").setAttribute("style", "background-color: yellow");
    document.getElementById("min").setAttribute("style", "background-color: rgb(0, 255, 0)");
    isFocus = true;
}

function gen() {
    isStack = false;
    content.style.overflow = 'hidden';
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("PIN").setAttribute("style", "border-left: 0px solid rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("gen").innerHTML.toUpperCase();

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
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
          <input type="text" id="label" aria-multiline="false" autofocus = true placeholder="Label for Password">
          <div id="labelC"><b>Please enter Label for Password</b></div>
          <div id="pass"></div>
      </div>`;

        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(checkb);
    }, 500);

    setTimeout(() => {
        document.getElementById("pass").textContent = "";
        document.getElementById("pass").style.opacity = 0;
        document.getElementById("pass").style.marginLeft = '100px';
        document.getElementById("label").setAttribute("style", "display: none;");
        document.getElementById("label").style.marginLeft = '100px';
        document.getElementById("label").style.opacity = 0;
    }, 500);

}

function generate() {
    document.getElementById("pass").style.opacity = 0;
    document.getElementById("pass").style.marginLeft = '100px';
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
        document.getElementById("pass").style.opacity = 1;
        document.getElementById("pass").style.marginLeft = '5px';
        document.getElementById("save").setAttribute("style", "display: none;");
        document.getElementById("label").style.display = 'none';
        document.getElementById("labelC").style.display = 'none';
    } else {
        document.getElementById("pass").style.opacity = 1;
        document.getElementById("pass").style.marginLeft = '5px';
        document.getElementById("pass").style.borderLeft = '5px solid rgb(0, 255, 21)';
        document.getElementById("pass").style.color = 'rgb(0, 255, 21)';

        if (boundry == "") {
            chars = `abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ!#$%&()*+,-./:;<=>?@[]^_{|}~0123456789`;
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
        document.getElementById("save").setAttribute("style", "display: inline;");
        document.getElementById("label").setAttribute("style", "display: block;");
        document.getElementById("label").style.marginLeft = '5px';
        document.getElementById("label").style.opacity = 1;
    }
}

function encrypt(text) {
    var cipher = crypto.createCipheriv('aes-256-ctr', new Buffer.from('g./34rEdg%6yf~l?g./34ryUh%6yf~l?'), new Buffer.from('gR45ax=!ydF%/#$~'));
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipheriv('aes-256-ctr', new Buffer.from('g./34rEdg%6yf~l?g./34ryUh%6yf~l?'), new Buffer.from('gR45ax=!ydF%/#$~'));
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function save() {
    let same = '';
    passwords.passw = [];
    if (document.getElementById("label").value.trim() == "" || document.getElementById("label").value[0] == ' ') {
        document.getElementById("labelC").style.display = "block";
        document.getElementById("label").value = "";
        document.getElementById("label").focus();
    } else {
        document.getElementById("labelC").style.display = "none";

        try {
            if (fs.existsSync('./pass_Stack.json')) {
                let data = fs.readFileSync('./pass_Stack.json', 'utf-8');
                passwords = JSON.parse(data);
                same = passwords.passw.find(el => decrypt(el.label) == document.getElementById("label").value);
                setTimeout(() => {
                    if (same == undefined) {
                        passwords.passw.push({
                            label: encrypt(document.getElementById("label").value),
                            pass: encrypt(document.getElementById("pass").textContent)
                        });
                        fs.writeFileSync('./pass_Stack.json', JSON.stringify(passwords), 'utf-8');
                        document.getElementById("label").value = '';
                    } else {
                        dialog.showMessageBox({
                            type: 'info',
                            buttons: ['OK'],
                            message: 'Your entered label name is already exist! Please enter a diffrent label name!'
                        });
                    }

                }, 500);

            } else {
                passwords.passw = [{
                    label: encrypt(document.getElementById("label").value),
                    pass: encrypt(document.getElementById("pass").textContent)
                }];
                fs.appendFileSync('./pass_Stack.json', JSON.stringify(passwords), 'utf-8');
                document.getElementById("label").value = '';
            }
        } catch (err) {
            throw err;
        }
    }
}

function stack() {
    content.style.overflow = 'hidden';
    isStack = true;
    let pinn = [];
    passwords.passw = [];
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("PIN").setAttribute("style", "border-left: 0px solid rgba(0, 255, 0, 0);");
    document.getElementById("stack").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("stack").innerHTML.toUpperCase();

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        let pin = document.createElement('div');
        let row = document.createElement('div');
        let numeros = document.createElement('div');
        numeros.classList.add('numeros');
        row.id = "row";
        pin.id = "pin";
        pin.style.justifyContent = 'center';
        row.innerHTML = `
        <div class = "numeros" id = "numeros0"></div>
        <div class = "numeros" id = "numeros1"></div>
        <div class = "numeros" id = "numeros2"></div>
        <div class = "numeros" id = "numeros3"></div>
        <div class = "numeros" id = "numeros4"></div>
        <div class = "numeros" id = "numeros5"></div>`;
        let sayac = 0;
        pin.appendChild(row);
        var t = setInterval(() => {
            if (!isStack) {
                clearInterval(t);
            }
            if (isFocus && isStack) {
                document.body.onkeypress = (e) => {
                    console.log(e.key);
                    if (e.key == '0' || e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5' || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9') {
                        pinn.push(e.key);
                        sayac = sayac % 6;
                        console.log(sayac);
                        document.getElementById(`numeros${sayac}`).setAttribute("style", "background-color: rgba(255, 255, 255, 0.5);");
                        if (pinn.length == 6 && pinn.join('') == `${passwords.PIN}`) {
                            document.getElementById(`numeros0`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");
                            document.getElementById(`numeros1`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");
                            document.getElementById(`numeros2`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");
                            document.getElementById(`numeros3`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");
                            document.getElementById(`numeros4`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");
                            document.getElementById(`numeros5`).setAttribute("style", "background-color: rgba(2, 255, 36, 0.5);;");

                            setTimeout(() => {
                                document.getElementById(`numeros0`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros1`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros2`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros3`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros4`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros5`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                setTimeout(() => {
                                    pin.removeChild(row);
                                    setTimeout(() => {
                                        if (fs.existsSync('./pass_Stack.json')) {
                                            pin.style.justifyContent = 'flex-start';
                                            let data = fs.readFileSync('./pass_Stack.json', 'utf-8');
                                            passwords = JSON.parse(data);
                                            for (let index = 0; index < passwords.passw.length; index++) {
                                                content.style.overflow = 'auto';
                                                let list = document.createElement('div');
                                                list.classList.add("list");
                                                list.id = `list${index}`;
                                                list.innerHTML = `
                                                <div style="
                                                width: fit-content;
                                                height: 10px;
                                                display: flex;
                                                margin: 5px;
                                                padding: 10px;
                                                color:green;
                                                user-select: none;
                                                border-radius: 15px;
                                                align-items: center;
                                                justify-content: center;
                                                background-color: rgba(25, 25, 25, 0.5);
                                                ">${decrypt(passwords.passw[index].label)}</div>
                                                <div style="
                                                    height: 15px;
                                                    width: inherit;
                                                    display: flex;
                                                    background-color: rgba(25, 25, 25, 0.5);
                                                    color: green;
                                                    margin: 5px;
                                                    border-radius: 20px;
                                                    align-items: center;
                                                    justify-content: left;
                                                    overflow: hidden;
                                                    user-select:none;
                                                    padding: 10px;
                                                ">${decrypt(passwords.passw[index].pass)}</div>

                                                <div style="
                                                display: inline-block;
                                                margin: 3px;
                                                width: fit-content;
                                                height: fit-content;
                                                ">

                                                <div class="copy" id="CtC${index}" style="
                                                width: fit-content;
                                                height: 20px;
                                                display: inline-block;
                                                float: left;
                                                user-select: none;
                                                padding: 5px;
                                                border-radius: 15px;
                                                margin: 3px;
                                                overflow:hidden;
                                                transition:500ms;
                                                background-color: rgba(25, 25, 25, 0.5);
                                                ">Copy to Clipboard</div>
                                                <div class="delete" id="dlt${index}" style="
                                                width: fit-content;
                                                height: 20px;
                                                display: inline-block;
                                                float: left;
                                                user-select: none;
                                                padding: 5px;
                                                transition:500ms;
                                                border-radius: 15px;
                                                margin: 3px;
                                                overflow:hidden;
                                                background-color: rgba(25, 25, 25, 0.5);
                                                ">Delete</div>
                                                <div class="regen" id="RGP${index}" style="
                                                width: fit-content;
                                                height: 20px;
                                                display: inline-block;
                                                float: left;
                                                user-select: none;
                                                padding: 5px;
                                                transition:500ms;
                                                border-radius: 15px;
                                                margin: 3px;
                                                overflow:hidden;
                                                background-color: rgba(25, 25, 25, 0.5);
                                                ">Re-Generate Password</div>

                                                </div>
                                                `;
                                                pin.appendChild(list);
                                            }
                                            let dltbtns = document.getElementsByClassName("delete");
                                            let ctcbtns = document.getElementsByClassName("copy");
                                            let rgpbtns = document.getElementsByClassName("regen");
                                            for (let ind = 0; ind < ctcbtns.length; ind++) {
                                                rgpbtns[ind].onclick = () => {
                                                    var chrs = `abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ!#$%&()*+,-./:;<=>?@[]^_{|}~0123456789`;
                                                    var rnd = crypto.randomBytes(parseInt(decrypt(passwords.passw[ind].pass).length, 10));
                                                    var value = new Array(parseInt(decrypt(passwords.passw[ind].pass).length, 10));
                                                    var len = Math.min(256, chrs.length);
                                                    var d = 256 / len;

                                                    for (let i = 0; i < parseInt(decrypt(passwords.passw[ind].pass).length, 10); i++) {
                                                        value[i] = chrs[Math.floor(rnd[i] / d)];
                                                    }

                                                    document.getElementById(`list${ind}`).children[1].textContent = value.join('');
                                                    let data1 = fs.readFileSync('./pass_Stack.json', 'utf-8');
                                                    passwords = JSON.parse(data1);
                                                    passwords.passw[ind] = {
                                                        label: encrypt(document.getElementById(`list${ind}`).children[0].textContent),
                                                        pass: encrypt(document.getElementById(`list${ind}`).children[1].textContent)
                                                    };
                                                    fs.writeFileSync("./pass_Stack.json", JSON.stringify(passwords), "utf-8");
                                                };
                                            }
                                            for (let ind = 0; ind < ctcbtns.length; ind++) {
                                                ctcbtns[ind].onclick = () => {
                                                    clipboard.writeText(decrypt(passwords.passw[ind].pass));
                                                    let a = setTimeout(() => {
                                                        clipboard.clear();
                                                    }, 10000);
                                                    clearTimeout(a);
                                                };
                                            }

                                            for (let ind = 0; ind <= dltbtns.length; ind++) {
                                                dltbtns[ind].onclick = () => {
                                                    let data1 = fs.readFileSync('./pass_Stack.json', 'utf-8');
                                                    passwords = JSON.parse(data1);
                                                    passwords.passw.splice(ind, 1);
                                                    fs.writeFileSync("./pass_Stack.json", JSON.stringify(passwords), "utf-8");
                                                    pin.removeChild(document.getElementById(`list${ind}`));
                                                    gen();
                                                };
                                            }
                                        } else if (fs.existsSync('./pass_Stack.json') && passwords.passw == []) {
                                            row.innerHTML = `<p style = "font-size:20px;font-family: sans-serif;
                                                                    font-weight: 800;
                                                                    color: rebeccapurple;">Ooops! Looks like no Saved Password!</p>`;
                                            pin.appendChild(row);
                                        } else if (!fs.existsSync('./pass_Stack.json')) {
                                            row.innerHTML = `<p style = "font-size:20px;font-family: sans-serif;
                                                                    font-weight: 800;
                                                                    color: rebeccapurple;">Ooops! Looks like no Saved Password!</p>`;
                                            pin.appendChild(row);
                                        }
                                    }, 100);
                                }, 500);
                            }, 500);
                            pinn = [];
                            sayac = -1;
                        } else if (pinn.length == 6 && pinn.join('') != `${passwords.PIN}`) {
                            let errr = document.createElement('div');
                            errr.id = 'errr';
                            errr.innerText = "Wrong PIN!";
                            pin.appendChild(errr);
                            document.getElementById(`numeros0`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            document.getElementById(`numeros1`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            document.getElementById(`numeros2`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            document.getElementById(`numeros3`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            document.getElementById(`numeros4`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            document.getElementById(`numeros5`).setAttribute("style", "background-color: rgba(248, 1, 1, 0.5);");
                            setTimeout(() => {
                                document.getElementById(`numeros0`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros1`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros2`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros3`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros4`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                document.getElementById(`numeros5`).setAttribute("style", "background-color: rgba(255, 255, 255, 0);");
                                setTimeout(() => {
                                    pin.removeChild(errr);
                                }, 1000);
                            }, 1000);

                            pinn = [];
                            sayac = -1;
                        }
                        sayac++;
                    }
                };
            }
        }, 100);

        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(pin);
    }, 500);
}

function PIN() {
    isStack = false;
    content.style.overflow = 'hidden';
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("stack").setAttribute("style", "border-left: 0px solid rgba(0, 255, 0, 0);");
    document.getElementById("PIN").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("PIN").innerHTML.toUpperCase();

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        let cPIN = document.createElement('div');
        cPIN.innerHTML = `
        <input type="number" id="label1" maxlength="6" class="label" aria-multiline="false" autofocus= true placeholder="CURRENT 6 CHARACTER PIN">
        <input type="number" id="label2" maxlength="6" class="label" aria-multiline="false" autofocus= true placeholder="NEW 6 CHARACTER PIN">
        <input type="number" id="label3" maxlength="6" class="label" aria-multiline="false" autofocus= true placeholder="VERIFY 6 CHARACTER NEW PIN">
        <button id="set" class="source" onclick="setPIN()" style="color: black;
            border-radius: 20px;
            border-width: 1px;
            border-color: rgba(255, 255, 255, 0.2);
            border-style: solid;
            display:flex;
            justify-content:center;
            flex-direction:row;
            width:250px;
            height:36px;
            align-item:center;
            margin:auto;
            transition: 250ms;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font: 900;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            background-color: rgba(255, 255, 255, 0.1);"><span style= "text-align: center;margin: auto;">SET NEW PIN</span></button>
        `;

        cPIN.style.display = 'flex';
        cPIN.style.justifyContent = 'center';
        cPIN.style.alignItems = 'center';
        cPIN.style.flexDirection = 'column';
        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(cPIN);
        document.getElementById('set').onclick = () => {
            if (document.getElementById('label1').value == passwords.PIN && document.getElementById('label2').value == document.getElementById('label3').value && document.getElementById('label1').value.length == 6 && document.getElementById('label2').value.length == 6 && document.getElementById('label3').value.length == 6) {

                if (fs.existsSync('./pass_Stack.json')) {
                    let data = fs.readFileSync("./pass_Stack.json", "utf-8");
                    passwords = JSON.parse(data);
                    passwords.PIN = document.getElementById('label2').value;
                    fs.writeFileSync('./pass_Stack.json', JSON.stringify(passwords), 'utf-8');
                } else {
                    passwords.PIN = document.getElementById('label2').value;
                }

                document.getElementById('label1').value = '';
                document.getElementById('label2').value = '';
                document.getElementById('label3').value = '';
                let errr2 = document.createElement('div');
                errr2.id = 'errr2';
                errr2.style.color = 'rgb(0, 255, 0)';
                errr2.innerText = "PIN successfully changed!";
                cPIN.appendChild(errr2);
                setTimeout(() => {
                    cPIN.removeChild(errr2);
                }, 3000);
            } else {
                let errr2 = document.createElement('div');
                errr2.id = 'errr2';
                errr2.style.color = 'red';
                errr2.innerText = "Your entered PIN didn't current PIN or your new PIN couldn't match or you didn't enter 6 character PIN!";
                cPIN.appendChild(errr2);
                setTimeout(() => {
                    cPIN.removeChild(errr2);
                }, 10000);
            }
        };
    }, 500);
}

function about() {
    content.style.overflow = 'hidden';
    isStack = false;
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("exit").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("PIN").setAttribute("style", "border-left: 0px solid rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 10px solid rgba(0, 255, 0, 1);");
    document.getElementById("header").innerHTML = document.getElementById("about").innerHTML.toUpperCase();

    content.style.opacity = 0;
    content.style.transform = 'scale(0.5)';
    setTimeout(() => {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        let abt_text = document.createElement("div");
        abt_text.style.margin = 'auto';
        abt_text.style.width = '100%';
        abt_text.style.height = '100%';
        abt_text.innerHTML = `<div id="content" style="width:100%; height: 100%; text-align: center; user-select: none;">
        <h1>Pass_Gen</h1> <hr>
        <h3><p style="color: #202020">
            Password Generator with nice UI. <br> <br>
            Version: ${document.getElementById('ver').innerText} <br>
            License: GPL-3.0 <br>
            <button id="source" onclick="source_code()" style="color: black;
            border-radius: 5px;
            border-width: 1px;
            border-color: rgba(255, 255, 255, 0.2);
            border-style: solid;
            display:flex;
            justify-content:center;
            flex-direction:row;
            align-item:center;
            margin:auto;
            transition: 250ms;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            font: 900;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            background-color: rgba(255, 255, 255, 0.1);"><span style= "text-align: center;margin: auto;">View Source Code on Github</span></button> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br> <br>
            <h6 style="color: #b0b4b485">Developed by caner selcuk</h6>
        </p>
    </h3>
    </div>`;

        content.style.transform = 'scale(1.0)';
        content.style.opacity = 1;
        content.appendChild(abt_text);

    }, 500);

}

function source_code() {
    require('electron').shell.openExternal("https://github.com/CODESOLE/Password-Generator");
}

function exit() {
    document.getElementById("stack").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("about").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("gen").setAttribute("style", "border-left: 0px rgba(0, 255, 0, 0);");
    document.getElementById("PIN").setAttribute("style", "border-left: 0px solid rgba(0, 255, 0, 0);");
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
            if (aud.volume <= 0.0 || aud.volume == 0.049999999999999684) {
                aud.volume = 0;
                clearInterval(fout);
            }
        }, 100);

        document.getElementById('switch').innerHTML = "Turn on Music";

    }
}
window.onload = () => {
    if (fs.existsSync('./pass_Stack.json')) {
        passwords = JSON.parse(fs.readFileSync('./pass_Stack.json', 'utf-8'));
    }

    splash.style.backgroundImage = "url('./res/welcome_screen.png')";
    splash.style.width = 'auto';
    splash.style.height = '100%';
    splash.style.backgroundSize = 'contain';
    splash.style.opacity = '0';
    splash.style.margin = '0px';
    splash.style.backgroundRepeat = 'no-repeat';
    splash.style.left = '-0.5%';
    splash.style.top = '530px';
    splash.style.position = 'relative';
    splash.style.transition = '1s';

    content.appendChild(splash);

    setTimeout(() => {
        splash.style.transform = 'translateY(-400px)';
        splash.style.opacity = '1';

    }, 200);

};
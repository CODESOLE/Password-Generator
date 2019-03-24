function gen_but() {
    var gen_but = document.createElement("div");
    gen_but.style.height = 10 + "px";
    gen_but.style.width = 100 + "px";
    gen_but.style.backgroundColor = "Red";
    gen_but.style.margin = "auto";
    gen_but.style.borderRadius = 5 + "px";
    return gen_but;
}

module.exports = gen_but;
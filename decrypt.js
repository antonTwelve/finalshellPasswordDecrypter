function decrypt(s) {
    var decode_s = CryptoJS.enc.Base64.parse(s);
    var head = decode_s.words.slice(0, 2);
    var data = decode_s.words.slice(2);


    var head_5 = (head[1] >> 16) & 0xff;
    var head_0 = (head[0] >> 24) & 0xff;
    var ks = ks_head[head_5];
    var seq = random_seq[head_0][ks];

    var ld = [(head[1] >> 24) & 0xff, seq[0], head[1] & 0xff, head[0] & 0xff, seq[1], (head[0] >> 16) & 0xff, seq[2], (head[0] >> 8) & 0xff];

    function int_to_hex(n) {
        str = "";
        for (let i = 0; i < 4; i++) {
            let t = n & 0xff;
            str = t.toString(16) + str;
            if (t < 16) str = "0" + str;
            n >>= 8;
        }
        return str;
    }

    function bigint_to_hex(n) {
        str = "";
        for (let i = 0; i < 8; i++) {
            let t = n & 0xffn;
            str = t.toString(16) + str;
            if (t < 16) str = "0" + str;
            n >>= 8n;
        }
        return str;
    }

    var ld_hex_str = "";
    for (let i = 0; i < ld.length; i++) {
        if (typeof (ld[i]) == "bigint") {
            ld_hex_str += bigint_to_hex(ld[i]);
        }
        else {
            ld_hex_str += "00000000";
            ld_hex_str += int_to_hex(ld[i]);
        }
    }
    var key_data = CryptoJS.enc.Hex.parse(ld_hex_str);
    key_data = CryptoJS.enc.Hex.stringify(CryptoJS.MD5(key_data));

    var key_hex_str = key_data.slice(0, 16);
    var data_hex_str = ""
    for (let i = 0; i < data.length; i++)
        data_hex_str += int_to_hex(data[i]);

    var x = CryptoJS.DES.decrypt(
        {
            ciphertext: CryptoJS.enc.Hex.parse(data_hex_str)
        },
        CryptoJS.enc.Hex.parse(key_hex_str),
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    if (x.sigBytes <= 0) {
        throw new Error("decrypt fail");
    }
    return x.toString(CryptoJS.enc.Utf8);
}

function btn_click() {
    let password = document.getElementById("passwordInput").value;
    let result = "";
    try {
        result = decrypt(password);
    } catch (error) {
        document.getElementById("result").textContent = "";
        document.getElementById("errorText").textContent = "未知输入";
        return;
    }
    document.getElementById("result").textContent = result;
    document.getElementById("errorText").textContent = "";
}
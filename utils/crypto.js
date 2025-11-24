const CryptoJS = require('crypto-js');

function aesEncryptECB(plaintext, keyStr) {
    try {
        const key = CryptoJS.enc.Utf8.parse(keyStr);
        const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString(); // base64 string
    } catch (err) {
        console.error("AES encryption error:", err);
        return null;
    }
}

function aesDecryptECB(encryptedBase64, keyStr) {
    try {
        const key = CryptoJS.enc.Utf8.parse(keyStr);
        const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Utf8.stringify(decrypted);
    } catch (err) {
        console.error("AES decryption error:", err);
        return null;
    }
}

module.exports = {
    aesEncryptECB,
    aesDecryptECB
};
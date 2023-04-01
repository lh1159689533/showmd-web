import cryptoJs from 'crypto-js';

const keyHex = cryptoJs.enc.Utf8.parse('lanis');

/**
 * 加密
 * @param data 加密的数据
 * @returns 加密后数据
 */
const encrypt = (data: string): string => {
  const encrypted = cryptoJs.DES.encrypt(data, keyHex, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
};

/**
 * 解密
 * @param encryptData 解密的数据
 * @returns 解密后数据
 */
const decrypt = (encryptData: string): string => {
  return cryptoJs.DES.decrypt({
    ciphertext: cryptoJs.enc.Hex.parse(encryptData)
  }, keyHex, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.Pkcs7,
  }).toString(cryptoJs.enc.Utf8);
};

export {
  encrypt,
  decrypt
};
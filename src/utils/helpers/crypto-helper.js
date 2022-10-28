/**
 * Classe para criptografia
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configurações globais
 */
const crypto = require('crypto')

/**
 * Classe Crypto
 * 
 * @package  src\utils\helpers
 */
module.exports = class Crypto {
    /**
     * Função para gerar string criptografada
     * 
     * @function encrypt
     * 
     * @param string sString
     * @param string sChave
     * 
     * @return string Retorna uma string criptografada
     */
    static encrypt(sString, sChave) {
        /**
         * Criptografa a string
         *
         * @var string sEncrypt
         */
        try {
            /**
             * Define as variaveis da criptografia
             *
             * @var string sIv
             * @var string sKey
             * @var string sCipher
             * @var string sEncrypt
             */
            const sIv = crypto.randomBytes(16)
            const sKey = crypto.createHash('sha256').update(sChave).digest('base64').substr(0, 32)
            const sCipher = crypto.createCipheriv('aes-256-cbc', sKey, sIv)
            let sEncrypt = sCipher.update(sString)
            sEncrypt = Buffer.concat([sEncrypt, sCipher.final()])
            return sIv.toString('hex') + ':' + sEncrypt.toString('hex')
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para descriptografar
     * 
     * @function decrypt
     * 
     * @param string sString
     * @param string sChave
     * 
     * @return string Retorna a string descriptografada
     */
    static decrypt(sString, sChave) {
        try {
            /**
             * Define as variaveis da descriptografia
             *
             * @var string sTextParts
             * @var string sIv
             * @var string sEncryptedData
             * @var string sKey
             * @var string sDecipher
             * @var string sDecrypted
             * @var string sDecryptedText
             */
            const sTextParts = sString.split(':')
            const sIv = Buffer.from(sTextParts.shift(), 'hex')
            const sEncryptedData = Buffer.from(sTextParts.join(':'), 'hex')
            const sKey = crypto.createHash('sha256').update(sChave).digest('base64').substr(0, 32)
            const sDecipher = crypto.createDecipheriv('aes-256-cbc', sKey, sIv)
            const sDecrypted = sDecipher.update(sEncryptedData)
            const sDecryptedText = Buffer.concat([sDecrypted, sDecipher.final()])
            return sDecryptedText.toString()
        } catch (error) {
            console.log(error)
        }    
    }
}
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
 * Classe Chave
 * 
 * @package  src\utils\helpers
 */
module.exports = class CryptString {
    /**
     * Função para gerar string criptografada
     * 
     * @function gerar
     * 
     * @param string sTipoHash Tipo da criptografia
     * @param string sString String a ser criptografada
     * @param string sTipoEncode Tipo do encode
     * 
     * @return string Retorna uma string criptografada
     */
    static gerar(sTipoHash, sString, sTipoEncode, iRandom = 1) {
        /**
         * Criptografa a string
         *
         * @var string sEncrypt
         */
        let sEncrypt = crypto.createHash(sTipoHash).update(`${sString}`).digest(sTipoEncode)


        if(iRandom == 1){
            var sRandom = crypto.randomBytes(16)
            sEncrypt = crypto.createHash(sTipoHash).update(`${sString}${sRandom}`).digest(sTipoEncode)
        }

        return sEncrypt;
    }
}
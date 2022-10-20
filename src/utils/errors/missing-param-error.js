/**
 * Classe para geração do erro da falta de parâmetros
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
 * Classe MissingParamError
 * @package  src\utils\erros
 */
module.exports = class MissingParamError extends Error {
    constructor(paramName, code = 0) {
        super(`Parâmetro ausente: ${paramName}`)
        this.name = 'MissingParamError'
        this.code = code
    }
}
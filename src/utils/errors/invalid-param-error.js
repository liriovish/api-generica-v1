/**
 * Classe para geração do erro de parâmetro inválido
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
 * Classe InvalidParamError
 * @package  src\utils\erros
 */
module.exports = class InvalidParamError extends Error {
    constructor(paramName, code = 0) {
        super(`Parâmetro inválido: ${paramName}`)
        this.name = 'InvalidParamError'
        this.code = code
    }
}
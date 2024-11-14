/**
 * Classe para geração do erro customizado
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api Gen�rica
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  14/11/2024
 */

/**
 * Classe MissingParamError
 * @package  src\utils\erros
 */
module.exports = class CustomError extends Error {
    constructor(paramName, code = 0) {
        super(`${paramName}`)
        this.name = 'MissingParamError'
        this.code = code
    }
}
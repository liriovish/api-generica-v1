/**
 * Classe para realizar o export das classes de geração de erros
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
 * Configurações globais
 */
const MissingParamError = require('./missing-param-error')
const InvalidParamError = require('./invalid-param-error')
const CustomError = require('./custom-error')

/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = {
    MissingParamError,
    InvalidParamError,
    CustomError
}
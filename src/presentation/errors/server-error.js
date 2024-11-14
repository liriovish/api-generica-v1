/**
 * Classe para geração do erro inesperado (erro "genérico")
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
 * Classe ServerError
 * @package  src\presentation\erros
 */
module.exports = class ServerError extends Error {
    constructor(paramName) {
        super('Internal error')
        this.name = 'ServerError'
    }
}
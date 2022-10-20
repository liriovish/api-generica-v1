/**
 * Classe para criação do retorno HTTP ao usuário
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
const { ServerError } = require('../errors')

/**
 * Classe HttpResponse
 * @package  src\presentation\helpers
 */
module.exports = class HttpResponse {

    /**
     * Função para retornar status 200
     *
     * @param {*} body
     * @returns
     */
    static ok(body) {
            return {
                statusCode: 200,
                body
            }
        }
        /**
         * Função para retornar status 201
         *
         * @param {*} body
         * @returns
         */
    static created(body) {
        return {
            statusCode: 201,
            body
        }
    }

    /**
     * Função para retornar status 400
     *
     * @param {*} error
     * @returns
     */
    static badRequest(error) {
        return {
            statusCode: 400,
            body: {
                codigo: error.code,
                descricao: error.message
            }
        }
    }

    /**
     * Função para retornar status 422
     *
     * @param {*} error
     * @returns
     */
    static unprocessableEntity(error) {
        return {
            statusCode: 422,
            body: {
                codigo: error.code,
                descricao: error.message
            }
        }
    }

    /**
     * Função para retornar status 500
     *
     * @returns
     */
    static serverError(code = 0, message = 'Erro de sistema.') {
        return {
            statusCode: 500,
            body: {
                codigo: code,
                descricao: message
            }
        }
    }
}
/**
 * Classe para criação da rota de retorno para o usuário
 * 
 * Esse arquivo é responsável pelas validações básicas dos dados recebidos
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
const HttpResponse = require('../helpers/http-response')

/**
 * Classe WebhookVerificarRouter
 * @package  src\presentation\routers
 */
module.exports = class WebhookVerificarRouter {
    /**
     * Função para criação da rota
     *
     * @param {object} oBody
     * @param {string} sIp
     * @param {string} sChave
     * @param {object} oParams
     * @param {object} sChave
     * 
     * @returns {HttpResponse}
     */
    async route(oBody = null, sIp = null, sChave = null, oParams = null, oQuery) {
        try {
            /**
             * Variaveis para a verificação
             *
             * @param {string} sTokenVerificacao
             */
            const sTokenVerificacao = process.env.VERIFY_TOKEN_META;

            /**
             * Variaveis para a verificação
             *
             * @param {string} sMode
             * @param {string} sToken
             * @param {string} sHubChallenge
             */
            let sMode = oQuery.hub_mode;
            let sToken = oQuery.hub_verify_token;
            let sHubChallenge = oQuery.hub_challenge;

            // Valida se o token e mode foram enviados
            if (sMode && sToken) {

                // Check the mode and token sent are correct
                if (sMode === "subscribe" && sToken === sTokenVerificacao) {
                    /**
                     * Retorna dados
                     */
                    return HttpResponse.ok({retorno: sHubChallenge})
                } else {
                    /**
                     * Caso gere algum erro
                     * Retorna o erro
                     */
                    return HttpResponse.serverError()
                }
            }else{
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }
        } catch (error) {
            console.log(error)
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }
    }
}
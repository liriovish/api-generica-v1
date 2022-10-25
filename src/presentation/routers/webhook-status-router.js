/**
 * Classe para cria��o da rota de retorno para o usu�rio
 * 
 * Esse arquivo � respons�vel pelas valida��es b�sicas dos dados recebidos
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcart�rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configura��es globais
 */
const { CustomError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

/**
 * Classe WebhookStatusRouter
 * @package  src\presentation\routers
 */
module.exports = class WebhookStatusRouter {
    /**
     * Construtor
     * @param {whatsappUseCase}
     * @param {whatsappValidator}
     * @param {clienteFilter}
     */
    constructor({ whatsappUseCase, whatsappValidator } = {}) {
        this.whatsappUseCase = whatsappUseCase
        this.whatsappValidator = whatsappValidator
    }

    /**
     * Fun��o para cria��o da rota
     *
     * @param {object} oBody
     * @param {string} sChave
     * 
     * @returns {HttpResponse}
     */
    async route(oBody, sIp, sToken) {
        try {
            /**
             * Valida a requisi��o
             *
             * @var {object} oValidacao
             *
             * @UsaFuncao validarWebhookStatus
             */
            const oValidacao = await this.whatsappValidator.validarWebhookStatus(oBody)

            // Verifica se existe a requisi��o � valida
            if(oValidacao != null){
                return oValidacao
            }

            /**
             * Altera o status da mensagem
             *
             * @var {object} oDadosWebhookStatus
             *
             * @UsaFuncao webhookStatus
             */
            const oDadosWebhookStatus = await this.whatsappUseCase.webhookStatus(oBody)

            /**
             * Retorna dados
             */
            return HttpResponse.ok(oDadosWebhookStatus)
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
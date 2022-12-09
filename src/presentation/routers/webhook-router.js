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
 * Classe EnviarMensagemRouter
 * @package  src\presentation\routers
 */
module.exports = class Webhook {
    /**
     * Construtor
     * @param {whatsappUseCase}
     */
    constructor({ whatsappUseCase } = {}) {
        this.whatsappUseCase = whatsappUseCase
    }
    
    /**
     * Função para criação da rota
     *
     * @param {object} oBody
     * 
     * @returns {HttpResponse}
     */
    async route(oBody, sIp, sToken) {
        try {
            /**
             * Dispara o webhook de status
             *
             * @var {object} oDadosWebhookStatus
             *
             * @UsaFuncao webhookStatus
             */
            const oDadosWebhookStatus = await this.whatsappUseCase.webhookStatus(oBody)
            console.log(oDadosWebhookStatus)
            /**
             * Dispara o webhook de recebimento
             *
             * @var {object} oDadosWebhookRecebimento
             *
             * @UsaFuncao webhookRecebimento
             */
            const oDadosWebhookRecebimento = await this.whatsappUseCase.webhookRecebimento(oBody, sToken)
            console.log(oDadosWebhookRecebimento)

            /**
             * Retorna dados
             */
            return HttpResponse.ok({status: 'sucesso'})
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
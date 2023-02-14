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
const { CustomError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

/**
 * Classe WebhookRecebimentoRouter
 * @package  src\presentation\routers
 */
module.exports = class WebhookRecebimentoRouter {
    /**
     * Construtor
     * @param {whatsappUseCase}
     * @param {whatsappValidator}
     * @param {clienteFilter}
     */
    constructor({ whatsappUseCase, whatsappValidator, clienteFilter } = {}) {
        this.whatsappUseCase = whatsappUseCase
        this.whatsappValidator = whatsappValidator
        this.clienteFilter = clienteFilter
    }

    /**
     * Função para criação da rota
     *
     * @param {object} oBody
     * @param {string} sIp
     * @param {string} sToken
     * @param {string} oParams
     * 
     * @returns {HttpResponse}
     */
     async route(oBody, sIp, sToken, oParams, sTokenJwt) {
        try {
            /**
             * Valida a requisição
             *
             * @var {object} oValidacao
             *
             * @UsaFuncao validarWebhookRecebimento
             */
            const oValidacao = await this.whatsappValidator.validarWebhookRecebimento(oBody)

            // Verifica se existe a requisição é valida
            if(oValidacao != null){
                return oValidacao
            }

            /**
             * Altera o status da mensagem
             *
             * @var {object} oDadosWebhookRecebimento
             *
             * @UsaFuncao webhookRecebimento
             */
            const oDadosWebhookRecebimento = await this.whatsappUseCase.webhookRecebimento(oBody, sToken, sTokenJwt, oParams.identificadorCliente)

            // Verifica se houve erro
            if(oDadosWebhookRecebimento.statusCode != 201){
                return oDadosWebhookRecebimento
            }

            /**
             * Retorna dados
             */
            return oDadosWebhookRecebimento
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
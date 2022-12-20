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
      * Função para criação da rota
      *
      * @param {object} oBody
      * @param {string} sChave
      * 
      * @returns {HttpResponse}
      */
     async route(oBody, sIp, sTokens, oParams) {
         try {
             /**
              * Valida a requisição
              *
              * @var {object} oValidacao
              *
              * @UsaFuncao validarWebhookStatus
              */
             const oValidacao = await this.whatsappValidator.validarWebhookStatus(oBody)
 
             // Verifica se existe a requisição é valida
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
             const oDadosWebhookStatus = await this.whatsappUseCase.webhookStatus(oBody, oParams.identificadorCliente)
 
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
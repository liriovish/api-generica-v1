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
 * Classe EnviarMensagemRouter
 * @package  src\presentation\routers
 */
module.exports = class EnviarMensagemRouter {
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
     * @param {string} sChave
     * 
     * @returns {HttpResponse}
     */
    async route(oBody, sIp, sToken, oParams, sTokenJwt) {
        try {
            /**
             * Busca os dados do cliente
             *
             * @var {obejct} oCliente
             *
             * @UsaFuncao dadosCliente
             */
            const oCliente = await this.clienteFilter.dadosCliente(sToken, '', sTokenJwt)

            // Verifica se existe o cliente
            if(oCliente.statusCode != 200){
                return HttpResponse.badRequest(
                    new CustomError('Cliente não localizado', 2)
                )
            }

            /**
             * Define os dados do cliente
             *
             * @var {oDadosCliente}
             */
            const oDadosCliente = oCliente.body

            /**
             * Valida os dados
             *
             * @var {object} bValidaEnviarMensagem
             *
             * @UsaFuncao validarEnviarMensagem
             */
            const bValidaEnviarMensagem = await this.whatsappValidator.validarEnviarMensagem(oBody, oDadosCliente)

            // Verifica se retornou erro
            if(bValidaEnviarMensagem != null){
                return bValidaEnviarMensagem
            }

            /**
             * Envia a mensagem
             *
             * @var {object} oDadosEnviarMensagem
             *
             * @UsaFuncao enviarMensagem
             */
            const oDadosEnviarMensagem = await this.whatsappUseCase.enviarMensagem(oBody, oDadosCliente)

            /**
             * Retorna dados
             */
            return HttpResponse.ok(oDadosEnviarMensagem)
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
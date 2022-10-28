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
const { CustomError, InvalidParamError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

/**
 * Classe HistoricoMensagensRouter
 * @package  src\presentation\routers
 */
module.exports = class HistoricoMensagensRouter {
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
    async route(oBody, sIp, sToken, oParams) {
        try {
            /**
             * Busca os dados do cliente
             *
             * @var {obejct} oCliente
             *
             * @UsaFuncao dadosCliente
             */
            const oCliente = await this.clienteFilter.dadosCliente(sToken)

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
             * @var {object} bValidaHistoricoMensagens
             *
             * @UsaFuncao validarHistoricoMensagens
             */
            const bValidaHistoricoMensagens = await this.whatsappValidator.validarHistoricoMensagens(oParams, oBody, oDadosCliente)

            // Verifica se retornou erro
            if(bValidaHistoricoMensagens != null){
                return bValidaHistoricoMensagens
            }

            /**
             * Envia a mensagem
             *
             * @var {object} oDadosHistoricoMensagens
             *
             * @UsaFuncao historicoMensagens
             */
            const oDadosHistoricoMensagens = await this.whatsappUseCase.historicoMensagens(oParams, oBody, oDadosCliente)

            

            if(oBody.pagina && oDadosHistoricoMensagens.paginas < oBody.pagina){
                return HttpResponse.badRequest(
                    new InvalidParamError('pagina')
                )
            }

            /**
             * Retorna dados
             */
            return HttpResponse.ok(oDadosHistoricoMensagens)
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
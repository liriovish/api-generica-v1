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
 * @CriadoEm  09/02/2023
 */

/**
 * Configurações globais
 */
const { CustomError } = require('../../utils/errors')
const HttpResponse = require('../helpers/http-response')

/**
 * Classe ListarTemplatesRouter
 * @package  src\presentation\routers
 */
module.exports = class ListarTemplatesRouter {
    /**
     * Construtor
     * @param {whatsappUseCase}
     * @param {clienteFilter}
     */
    constructor({ whatsappUseCase, clienteFilter } = {}) {
        this.whatsappUseCase = whatsappUseCase
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
             * Lista os templates
             *
             * @var {object} oTemplates
             *
             * @UsaFuncao listarTemplates
             */
            const oTemplates = await this.whatsappUseCase.listarTemplates(oDadosCliente, oParams.template)

            /**
             * Retorna dados
             */
            return oTemplates
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
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
 * Classe CriarTemplateRouter
 * @package  src\presentation\routers
 */
module.exports = class CriarTemplateRouter {
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
             * @var {object} bValidaCriarTemplate
             *
             * @UsaFuncao validarCriarTemplate
             */
            const bValidaCriarTemplate = await this.whatsappValidator.validarCriacaoTemplate(oBody)

            // Verifica se retornou erro
            if(bValidaCriarTemplate != null){
                return bValidaCriarTemplate
            }

            /**
             * Cria o template
             *
             * @var {object} oDadosCriarTemplate
             *
             * @UsaFuncao criarTemplate
             */
            const oDadosCriarTemplate = await this.whatsappUseCase.criarTemplate(oBody, oDadosCliente)

            /**
             * Retorna dados
             */
            return oDadosCriarTemplate
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
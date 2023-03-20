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
 * Classe BaixarArquivoRouter
 * @package  src\presentation\routers
 */
module.exports = class BaixarArquivoRouter {
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
     * @param {string} sIp
     * @param {string} sToken
     * @param {string} oParams
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
             * Busca o arquivo e retorna o download
             *
             * @var {object} oArquivo
             *
             * @UsaFuncao webhookRecebimento
             */
            const oArquivo = await this.whatsappUseCase.baixarArquivo(oParams.id, oCliente)

            /**
             * Retorna dados
             */
            return oArquivo
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
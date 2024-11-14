/**
 * Classe para criação da rota de retorno para o usuário
 * 
 * Esse arquivo é responsável pelas validações básicas dos dados recebidos
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api Genérica
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-generica/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-generica
 * @CriadoEm  12/11/2024
 */

/**
 * Configurações globais
 */
const HttpResponse = require('../helpers/http-response')

/**
 * Classe ListagemRouter
 * @package  src\presentation\routers
 */
module.exports = class ListagemRouter {
    /**
     * Construtor
     * @param {apiUseCase}
     * @param {apiValidator}
     */
    constructor({ apiUseCase, apiValidator } = {}) {
        this.apiUseCase = apiUseCase
        this.apiValidator = apiValidator       
    }

    /**
     * Função para criação da rota
     *
     * @param {object} oBody
     * @param {string} sChave
     * 
     * @returns {HttpResponse}
     */
    async route(oHttp) {
        try {
            /**
             * Valida os dados da reuqisição
             *
             * @var {mixed} mValida
             */
            const mValida = await this.apiValidator.listagem(oHttp.query)

            if(mValida != null){
                return mValida
            }

            /**
             * Envia a mensagem
             *
             * @var {object} oDadoslistagem
             *
             * @UsaFuncao listagem
             */
            const oDadosListagem = await this.apiUseCase.listagem(oHttp.query)

            /**
             * Retorna dados
             */
            return HttpResponse.ok(oDadosListagem)
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
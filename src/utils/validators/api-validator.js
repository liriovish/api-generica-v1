/**
 * Classe para validação do cliente
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api Gen�rica
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  14/11/2024
 */

/**
 * Configurações globais
 */
const { CustomError, NotFoundError, InvalidRequestError, InvalidParamError } = require('../errors')
const HttpResponse = require('../../presentation/helpers/http-response')

/**
 * Classe ApiValidator
 * @package  src\presentation\routers
 */
module.exports = class ApiValidator {
    /**
     * Função responsável por fazer a validação
     *
     * @function validarEnviarMensagem
     *
     * @param  {object} oDados
     * @param  {object} oDadosCliente
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async tabelas(oDados) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.nomeTabela ||
            oDados.nomeTabela.length < 1
        ) {
            return HttpResponse.badRequest(
                new CustomError('Nome da tabela � obrigat�rio', 4)
            )
        }

        return null
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function listagem
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async listagem(oDados) {
        if (!oDados.nomeTabela || oDados.nomeTabela.length < 1) {
            return HttpResponse.badRequest(
                new CustomError('Nome da tabela � obrigat�rio', 4)
            )
        }

        // if(oDados.campo){
        //     if (oDados.campo.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Campo � obrigat�rio', 4)
        //         )
        //     }

        //     if (!oDados.tipoFiltro || oDados.tipoFiltro.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Tipo filtro � obrigat�rio', 4)
        //         )
        //     }

        //     if (!oDados.valor || oDados.valor.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Valor � obrigat�rio', 4)
        //         )
        //     }
        // }

        return null
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function exportacao
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async exportacao(oDados) {
        if (!oDados.nomeTabela || oDados.nomeTabela.length < 1) {
            return HttpResponse.badRequest(
                new CustomError('Nome da tabela � obrigat�rio', 4)
            )
        }
        return null
    }
}
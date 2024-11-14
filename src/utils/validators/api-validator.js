/**
 * Classe para valida√ß√£o do cliente
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api GenÈrica
 * @author    Equipe Webcart√≥rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  14/11/2024
 */

/**
 * Configura√ß√µes globais
 */
const { CustomError, NotFoundError, InvalidRequestError, InvalidParamError } = require('../errors')
const HttpResponse = require('../../presentation/helpers/http-response')

/**
 * Classe ApiValidator
 * @package  src\presentation\routers
 */
module.exports = class ApiValidator {
    /**
     * Fun√ß√£o respons√°vel por fazer a valida√ß√£o
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
                new CustomError('Nome da tabela È obrigatÛrio', 4)
            )
        }

        return null
    }

    /**
     * Fun√ß√£o respons√°vel por fazer a valida√ß√£o
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
                new CustomError('Nome da tabela È obrigatÛrio', 4)
            )
        }

        // if(oDados.campo){
        //     if (oDados.campo.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Campo È obrigatÛrio', 4)
        //         )
        //     }

        //     if (!oDados.tipoFiltro || oDados.tipoFiltro.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Tipo filtro È obrigatÛrio', 4)
        //         )
        //     }

        //     if (!oDados.valor || oDados.valor.length < 1) {
        //         return HttpResponse.badRequest(
        //             new CustomError('Valor È obrigatÛrio', 4)
        //         )
        //     }
        // }

        return null
    }

    /**
     * Fun√ß√£o respons√°vel por fazer a valida√ß√£o
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
                new CustomError('Nome da tabela È obrigatÛrio', 4)
            )
        }
        return null
    }
}
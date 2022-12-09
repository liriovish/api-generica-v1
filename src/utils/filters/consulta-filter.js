/**
 * Classe para os filtros da consulta
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
 * Classe ConsultaFilter
 * @package  src\presentation\routers
 */
module.exports = class ConsultaFilter {
    /**
     * Função responsavel por montar os filtros da consulta ao banco de dados
     * 
     * @param  {array} aFiltrosQuery Array de objetos, contendo campo, operacao e valor
     * @param  {int} iIdCliente ID do cliente
     * 
     * @return {object}
     */
    async filtrosConsulta(aFiltrosQuery, iIdCliente) {
        /**
         * Variavel contendo todos os filtros da consulta ao banco de dados
         * 
         * @var {object} oWhere
         */
        let oWhere = { idCliente: iIdCliente }

        /**
         * Verifica se foram informados campos para o retorno da busca
         */
        aFiltrosQuery.forEach(({ campo, operacao, valor }) => {
            /**
             * Valores dos filtros da operação a ser realizada
             * @var {object} oOperationProps
             */
            let oOperationProps = null

            /**
             * Valores que serão utilizados no where da consulta
             * @var {object} oValues
             */
            let oValues = null

            /**
             * Captura o tipo do valor recebido, se é array, objeto ou string
             * @var {string} sValueType
             */
            const sValueType = Object.prototype.toString.call(valor).toLowerCase()

            /**
             * Verifica o tipo do valor dos dados recebidos para organizar dentro
             *     de um array
             */
            if (sValueType === '[object string]') {
                oValues = [valor]
            } else if (sValueType === '[object array]') {
                oValues = [...valor]
            } else if (sValueType === '[object object]') {
                oValues = Object.keys(valor).map(k => valor[k])
            }

            /**
             * Verifica se o array com os valores tem conteudo
             */
            if (oValues.length) {
                if (campo == 'dataCadastro') {
                    /**
                     * Array para formatar as datas
                     * 
                     * @var {Array} oDates
                     */
                    const oDates = oValues.map(date => new Date(date).toISOString());

                    switch (operacao) {
                        case '=':
                            oOperationProps = {
                                $eq: oDates[0]
                            }
                            break
                        case '!=':
                            oOperationProps = {
                                $nin: oDates[0]
                            }
                            break
                        case 'in':
                            oOperationProps = {
                                $in: [...oDates]
                            }
                            break
                        case '&&':
                            if(oDates[0] >= oDates[1]){
                                oOperationProps = {
                                    $gte: oDates[1],
                                    $lte: oDates[0]
                                }
                            }else{
                                oOperationProps = {
                                    $gte: oDates[0],
                                    $lte: oDates[1]
                                }
                            }
                            break
                    }
                } else {
                    if (campo == 'statusMensagem')
                        campo = 'status'

                    switch (operacao) {
                        case '=':
                            oOperationProps = {
                                $eq: oValues[0]
                            }
                            break
                        case '!=':
                            oOperationProps = {
                                $nin: [...oValues]
                            }
                            break
                        case 'in':
                            oOperationProps = {
                                $in: [...oValues]
                            }
                            break
                        case '&&':
                            if(oValues[0] >= oValues[1]){
                                oOperationProps = {
                                    $gte: oValues[1],
                                    $lte: oValues[0]
                                }
                            }else{
                                oOperationProps = {
                                    $gte: oValues[0],
                                    $lte: oValues[1]
                                }
                            }
                            break
                    }
                }
            }
            /**
             * Insere logica do filtro ma variavel oWhere
             */
            if (oOperationProps) oWhere[campo] = {...oOperationProps }
        })

        return oWhere
    }
}
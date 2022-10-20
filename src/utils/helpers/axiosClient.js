/**
 * Helper para o Axios
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
const axios = require('axios')
require('dotenv').config()

/**
 * Classe AxiosClient
 * 
 * @package  src\main\composers
 */
module.exports = class AxiosClient {
    /**
     * Função para buscar os dados do token
     * 
     * @async
     * @function getToken_V2
     * 
     * @param string sHash
     * @param string sIp
     * 
     * @return object Retorna os dados do token ou erro
     */
    static async get(sEndpoint, oDados, sIp) {
        /**
         * Realiza a requisição com o axios para a API REST
         * 
         * @param object oDados
         */
        return axios.get(sEndpoint, {
            data: oDados,
            headers: {
                'x-forwarded-for': sIp
            }
        })
        .then((response) => {
            /**
             * Se não houver erro, retorna os dados do token
             */
            return response
        })
        .catch((error) => {
            /**
             * Monta o objeto de retorno para erro
             * 
             * @var object oError
             */
            const oError = {
                statusCode: error.response.status,
                error: error.response.data
            }
            
            /**
             * Retorna o erro
             */
            return oError
        })
    }
}
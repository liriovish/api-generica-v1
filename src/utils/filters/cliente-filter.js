/**
 * Classe para os filtros do cliente
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
const HttpResponse = require('../../presentation/helpers/http-response')
const { AxiosClient } = require('../helpers')

/**
 * Classe ClienteFilter
 * @package  src\presentation\routers
 */
module.exports = class ClienteFilter {
    /**
     * Função para o filtro
     *
     * @param {string} sChave
     * 
     * @returns {HttpResponse}
     */
    async dadosCliente(sToken, sIdCliente = '', sTokenJwt = '', sIdentificadorCliente = '') {
        try {
            /**
             * Define a URL
             *
             * @var {sUrl}
             */
            let sUrl = process.env.ENDPOINT_API_CLIENTE

            if (sIdCliente != '') {
                sUrl = `${sUrl}/${sIdCliente}`
            }

            if (sIdentificadorCliente != '') {
                sUrl = `${sUrl}/identificador/${sIdentificadorCliente}`
            }

            /**
             * Busca os dados do cliente
             *
             * @var {oDadosCliente}
             */
            const oDadosCliente = await AxiosClient.get(sUrl, {}, {'X-API-TOKEN': sToken, 'Authorization': sTokenJwt})

            /**
             * Retorna dados
             */
            return oDadosCliente
        } catch (error) {
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }
    }
}
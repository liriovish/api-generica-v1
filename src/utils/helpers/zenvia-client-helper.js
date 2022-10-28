/**
 * Helper para a API ZENVIA
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcart�rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configura��es globais
 */
const HttpResponse = require('../../presentation/helpers/http-response')
const AxiosClient = require('./axios-client-helper')
const Crypto = require('./crypto-helper')

/**
 * Classe ZenviaClient
 * 
 * @package  src\main\composers
 */
module.exports = class ZenviaClient {
    /**
     * Fun��o para enviar mensagem
     * 
     * @async
     * @function enviarMensagem
     * 
     * @param object oDados
     * @param object oCliente
     * 
     * @return object Retorna os dados da api ou erro
     */
    static async enviarMensagem(oDados, oCliente) {
        try {
            /**
             * Descriptografa o token
             *
             * @var {string} sTokenDecrypted
             */
            const sTokenDecrypted = await Crypto.decrypt(oCliente.whatsapp.tokenIntegracao, oCliente._id)

            /**
             * Busca os dados do cliente
             *
             * @var {oDadosCliente}
             */
            const oDadosCliente = await AxiosClient.post(
                'https://api.zenvia.com/v2/channels/whatsapp/messages', 
                {
                    from: oCliente.whatsapp.numero,
                    to: oDados.numeroDestinatario.toString(),
                    contents: oDados.mensagem
                }, 
                '', 
                sTokenDecrypted
            )

            /**
             * Retorna dados
             */
            return oDadosCliente
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
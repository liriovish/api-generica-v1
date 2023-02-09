/**
 * Helper para a API META
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
const AxiosClient = require('./axios-client-helper')
const Crypto = require('./crypto-helper')

/**
 * Classe ZenviaClient
 * 
 * @package  src\main\composers
 */
module.exports = class ZenviaClient {
    /**
     * Função para enviar mensagem
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
            const sTokenDecrypted = await Crypto.decrypt(oCliente.whatsapp.metaTokenIntegracao, oCliente._id)  
            
            /**
             * Define os dados da mensagem
             *
             * @var {object} oMensagem
             */
            let oMensagem = {}

            if(oDados.tipo == 'texto'){
                oMensagem = {
                    messaging_product: 'whatsapp',
                    recipient_type: "individual",
                    to: oDados.numeroDestinatario.toString(),
                    type: "text",
                    text: {
                        "preview_url": true,
                        "body": oDados.parametros.conteudo
                    }
                }
            }

            if(oDados.tipo == 'template'){
                /**
                 * Define os parametros da mensagem
                 *
                 * @var {object} oParametros
                 */
                const oParametros = Object.values(oDados.parametros).map((sValor) => {
                    return {
                        "type": "text",
                        "text": sValor
                    }
                })
                
                oMensagem = {
                    messaging_product: 'whatsapp',
                    to: oDados.numeroDestinatario.toString(),
                    type: "template",
                    template: {
                        name: oDados.template,
                        language: {
                            code: "pt_BR"
                        },
                        components: [
                            {
                                type: "body",
                                parameters: oParametros
                            }
                        ]
                    }
                }

                if(oDados?.botao?.urlLogin){
                    oMensagem.template.components.push(
                        {
                            type: "button",
                            sub_type: "url",
                            index: "0",
                            parameters: [
                                {                    
                                    type: "text",
                                    text: oDados.botao.urlLogin
                                }
                            ]
                        }
                    )
                }
            }
            
            /**
             * Busca os dados do cliente
             *
             * @var {oDadosCliente}
             */
            const oDadosCliente = await AxiosClient.post(
                `https://graph.facebook.com/v15.0/${oCliente.whatsapp.metaIdNumeroTelefone}/messages`, 
                oMensagem, 
                '', 
                `Bearer ${sTokenDecrypted}`
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
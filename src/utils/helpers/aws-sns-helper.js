/**
 * Helper para enviar a mesagem via SNS
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Cartoon
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configurações globais
 */
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns")
require('dotenv').config()

/**
 * Classe AWSSNS
 * 
 * @package  src\main\composers
 */
module.exports = class AWSSNS {
    /**
     * Função para notificação
     * 
     * @async
     * @function notificar
     * 
     * @param string sId
     * @param string sIdentificadorCliente
     * @param string sTipoNotificacao
     * 
     * @return object Retorna os dados
     */
    static async notificar(sId, sIdentificadorCliente, sTipoNotificacao) {
        // Retorna true se for ambiente de desenvolvimento
        if(process.env.environment == 'development'){
            return true
        }

        /**
         * Define o TopicArn da AWS
         * 
         * @var object oTopicArn
         */
        const oTopicArn = {
            status: process.env.topicArnNotificacaoStatus,
            recebimento: process.env.topicArnNotificacao
        }

        try {
            /**
             * Monta o JSON para o SNS para realizar a notificação
             *
             * @var object oDadosSNS
             */
            const oDadosSNS = {
                Message: `{
                    "id": "${sId}",
                    "identificadorCliente": "${sIdentificadorCliente}"
                }`,
                TopicArn: oTopicArn[sTipoNotificacao]
            }

            /**
             * Instancia o SNS
             * 
             * @var object oMensagemSNS
             */
            const oMensagemSNS = new SNSClient({ region: process.env.regionAws })

            /**
             * Envia uma mensagem com o SNS para realizar o processamento
             * 
             * @var object oEnviarSNS
             */
            const oEnviarSNS = await oMensagemSNS.send(new PublishCommand(oDadosSNS))

            return oEnviarSNS
        } catch (erro) {
            console.error(erro)
            return null
        }
    }

    /**
     * Função para enviar o arquivo para download
     * 
     * @async
     * @function downloadArquivo
     * 
     * @param string sId
     * 
     * @return object Retorna os dados
     */
    static async downloadArquivo(sId) {
        // Retorna true se for ambiente de desenvolvimento
        if(process.env.environment == 'development'){
            return true
        }

        try {
            /**
             * Monta o JSON para o SNS para realizar a notificação
             *
             * @var object oDadosSNS
             */
            const oDadosSNS = {
                Message: `{
                    "idArquivo": "${sId}"
                }`,
                TopicArn: process.env.topicArnDownload
            }

            /**
             * Instancia o SNS
             * 
             * @var object oMensagemSNS
             */
            const oMensagemSNS = new SNSClient({ region: process.env.regionAws })

            /**
             * Envia uma mensagem com o SNS para realizar o processamento
             * 
             * @var object oEnviarSNS
             */
            const oEnviarSNS = await oMensagemSNS.send(new PublishCommand(oDadosSNS))

            return oEnviarSNS
        } catch (erro) {
            console.error(erro)
            return null
        }
    }
}
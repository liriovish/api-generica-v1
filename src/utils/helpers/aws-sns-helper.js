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
const AWS = require('aws-sdk'),
      {
       SNS
      } = require("@aws-sdk/client-sns");
require('dotenv').config()

/**
 * Configurações AWS
 */
AWS.config.update({region: process.env.REGION_AWS, accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY})

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
        if(process.env.APP_ENV == 'development'){
            return true
        }

        /**
         * Define o TopicArn da AWS
         * 
         * @var object oTopicArn
         */
        const oTopicArn = {
            status: process.env.TOPIC_ARN_NOTIFICACAO_STATUS,
            recebimento: process.env.TOPIC_ARN_NOTIFICACAO
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
            const oMensagemSNS = new SNS({apiVersion: '2010-03-31'})

            /**
             * Envia uma mensagem com o SNS para realizar o processamento
             * 
             * @var object oEnviarSNS
             */
            const oEnviarSNS = await oMensagemSNS.publish(oDadosSNS)

            return oEnviarSNS
        } catch (erro) {
            console.error(erro)
            return null
        }
    }
}
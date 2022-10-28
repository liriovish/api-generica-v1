/**
 * Helper para enviar a mesagem via SNS
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Cartoon
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem
 * @CriadoEm  20/10/2022
 */

/**
 * Configurações globais
 */
const AWS = require('aws-sdk')
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
     * 
     * @return object Retorna os dados
     */
    static async notificar(sId, sTipoNotificacao) {
        // Retorna true se for ambiente de desenvolvimento
        if(process.env.APP_ENV == 'development'){
            return true
        }

        /**
         * Define o TopicArn da AWS
         * 
         * @var string sTopicArn
         */
         let sTopicArn = ''

        if(sTipoNotificacao == 'status'){
            sTopicArn = process.env.TOPIC_ARN_NOTIFICACAO_STATUS
        }

        if(sTipoNotificacao == 'recebimento'){
            sTopicArn = process.env.TOPIC_ARN_NOTIFICACAO
        }

        try {
            /**
             * Monta o JSON para o SNS para realizar a notificação
             *
             * @var object oDadosSNS
             */
            const oDadosSNS = {
                Message: `{"id": "${sId}"}`,
                TopicArn: sTopicArn
            }

            /**
             * Instancia o SNS
             * 
             * @var object oMensagemSNS
             */
            const oMensagemSNS = new AWS.SNS({apiVersion: '2010-03-31'})

            /**
             * Envia uma mensagem com o SNS para realizar o processamento
             * 
             * @var object oEnviarSNS
             */
            const oEnviarSNS = await oMensagemSNS.publish(oDadosSNS).promise()

            return oEnviarSNS
        } catch (erro) {
            console.error(erro)
            return null
        }
    }
}
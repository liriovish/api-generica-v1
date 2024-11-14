/**
 * Classe para realizar a comunicação com o RabbitMQ
 *
 * NodeJS version 16
 *
 * @category  JavaScript
 * @package   cori-br
 * @author    Equipe Webcartórios <mailto:contato@webcartorios.com.br>
 * @copyright 2024 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://gitlab.com/cori-br/editais/api-editais/licence.txt BSD Licence
 * @link      https://gitlab.com/cori-br/editais/api-editais.git
 * @CriadoEm  16/08/2024
 */

/**
 * Configurações globais
 */
const amqp = require('amqplib')
const envFile = require('../../main/config/env')

/**
 * Classe RabbitMQ
 * 
 * @package  src\utils\helpers
 */
module.exports = class RabbitMQ {
    /**
     * Função para enviar a mensagem para o RabbitMQ
     * 
     * @function enviarProcessamento
     * 
     * @param object oMensagem
     * 
     * @return bool
     */
    static async enviarProcessamento(oMensagem) {     
        try {
            /**
             * Define a senha do RabbitMQ
             * 
             * @var {string} sPassRabbitMq
             */
            const sPassRabbitMq = encodeURIComponent(env.passRabbitMq)

            /**
             * Define a conexão do RabbitMQ
             */
            const oConexaoRabbitMQ = await amqp.connect(
                `amqp://${env.userRabbitMq}:${sPassRabbitMq}@${env.hostRabbitMq}:${env.portRabbitMq}`
            )
            
            /**
             * Cria um canal
             */
            const channel = await oConexaoRabbitMQ.createChannel()

            /**
             * Define o nome da fila
             * 
             * @var {string} sFila
             */
            const sFila = env.processamentoWebhook

            /**
             * Declara uma fila
             */
            await channel.assertQueue(sFila, { durable: true })

            /**
             * Envia a mensagem para a fila
             */
            channel.sendToQueue(sFila, Buffer.from(JSON.stringify(oMensagem)))

            /**
             * Fecha o canal e a conexão após o envio
             */
            await channel.close()
            await oConexaoRabbitMQ.close()

            /**
             * Retorna true em caso de sucesso
             */
            return true
        } catch (e) {
            console.error('Erro ao enviar a mensagem:', e)

            /**
             * Retorna false em caso de erro
             */
            return false
        }
    }
}

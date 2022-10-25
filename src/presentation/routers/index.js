/**
 * Classe para realizar o export das classes das rotas de retorno para o usu�rio
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
const EnviarMensagem = require('./enviar-mensagem-router')
const WebhookStatus = require('./webhook-status-router')
const WebhookRecebimento = require('./webhook-recebimento-router')

/**
 * Realiza o export das classes de gera��o dos erros
 */
module.exports = {
    EnviarMensagem,
    WebhookStatus,
    WebhookRecebimento
}
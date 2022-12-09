/**
 * Classe para realizar o export das classes das rotas de retorno para o usuário
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
 const EnviarMensagem = require('./enviar-mensagem-router')
 const EnviarMensagemV2 = require('./enviar-mensagem-router-v2')
 const HistoricoMensagens = require('./historico-mensagens-router')
 const WebhookStatus = require('./webhook-status-router')
 const WebhookRecebimento = require('./webhook-recebimento-router')
 const WebhookVerificar = require('./webhook-verificar-router')
 const Webhook = require('./webhook-router')
 
 /**
  * Realiza o export das classes de geração dos erros
  */
 module.exports = {
     EnviarMensagem,
     EnviarMensagemV2,
     HistoricoMensagens,
     WebhookStatus,
     WebhookRecebimento,
     WebhookVerificar,
     Webhook
 }
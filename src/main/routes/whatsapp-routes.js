/**
 * Função para geração das rotas
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
const { adapt } = require('../adapters/express-router-adapter')
const WhatsappRouteComposer = require('../composers/whatsapp-composer')

/**
 * Realiza o export das rotas dos whatsapp
 */
module.exports = router => {
    /**
     * Rota POST para o envio da mensagem
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.enviarMensagem
     * @return {object}
     */
    router.post('/v1/enviarMensagem', adapt(WhatsappRouteComposer.enviarMensagem()))

    /**
     * Rota POST para o webhook de status
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhookStatus
     * @return {object}
     */
    router.post('/v1/webhookStatus', adapt(WhatsappRouteComposer.webhookStatus()))

    /**
     * Rota POST para o webhook de recebimento
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhookStatus
     * @return {object}
     */
    router.post('/v1/webhookRecebimento', adapt(WhatsappRouteComposer.webhookRecebimento()))
}
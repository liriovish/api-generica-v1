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
    router.post('/v1/whatsapp/enviarMensagem', adapt(WhatsappRouteComposer.enviarMensagem()))

    /**
     * Rota POST para o hitorico das mensagens 
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.historicoMensagens
     * @return {object}
     */
    router.post('/v1/whatsapp/historicoMensagens/:tipoMensagem', adapt(WhatsappRouteComposer.historicoMensagens()))

    /**
     * Rota POST para o webhook de status
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhookStatus
     * @return {object}
     */
    router.post('/v1/whatsapp/webhookStatus/:identificadorCliente?', adapt(WhatsappRouteComposer.webhookStatus()))

    /**
     * Rota POST para o webhook de recebimento
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhookStatus
     * @return {object}
     */
    router.post('/v1/whatsapp/webhookRecebimento/:identificadorCliente?', adapt(WhatsappRouteComposer.webhookRecebimento()))

    /**
     * Rota V2 POST para o envio da mensagem
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.enviarMensagemV2
     * @return {object}
     */
    router.post('/v2/whatsapp/enviarMensagem', adapt(WhatsappRouteComposer.enviarMensagemV2()))

    /**
     * Rota V2 GET para a verificação do webhook
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhookVerificar
     * @return {object}
     */
    router.get('/v2/whatsapp/webhook/:identificadorCliente?', adapt(WhatsappRouteComposer.webhookVerificar()))

    /**
     * Rota V2 POST para o webhook
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.webhook
     * @return {object}
     */
    router.post('/v2/whatsapp/webhook/:identificadorCliente?', adapt(WhatsappRouteComposer.webhook()))

    /**
     * Rota V3 POST para o envio da mensagem
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.enviarMensagemV3
     * @return {object}
     */
    router.post('/v3/whatsapp/enviarMensagem', adapt(WhatsappRouteComposer.enviarMensagemV3()))

    /**
     * Rota POST para criação do template
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.criarTemplate
     * @return {object}
     */
    router.post('/v1/whatsapp/templates', adapt(WhatsappRouteComposer.criarTemplate()))

    /**
     * Rota PUT para atualização do template
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.atualizarTemplate
     * @return {object}
     */
    router.put('/v1/whatsapp/templates/:template', adapt(WhatsappRouteComposer.atualizarTemplate()))

    /**
     * Rota GET para listar os templates
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.listarTemplates
     * @return {object}
     */
    router.get('/v1/whatsapp/templates/:template?', adapt(WhatsappRouteComposer.listarTemplates()))

    /**
     * Rota GET para listar os contatos
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.listarContatos
     * @return {object}
     */
    router.get('/v1/whatsapp/contatos/:numero?', adapt(WhatsappRouteComposer.listarContatos()))

    /**
     * Rota V3 GET para listar as mensagens
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.listarMensagens
     * @return {object}
     */
    router.get('/v3/whatsapp/historicoMensagens/contato/:numero?', adapt(WhatsappRouteComposer.listarMensagens()))

    /**
     * Rota V1 PUT para atualizar o contato
     *
     * @UsaFuncao adapt
     * @UsaFuncao WhatsappRouteComposer.atualizarContato
     * @return {object}
     */
    router.put('/v1/whatsapp/contatos/:numero', adapt(WhatsappRouteComposer.atualizarContato()))
}
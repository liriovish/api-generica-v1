/**
 * Classe para validação do cliente
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
const { CustomError, NotFoundError, InvalidRequestError } = require('../../utils/errors/')
const HttpResponse = require('../../presentation/helpers/http-response')

/**
 * Classe WhatsappValidator
 * @package  src\presentation\routers
 */
module.exports = class WhatsappValidator {
    /**
     * Construtor
     * @param {whatsappRepository}
     */
    constructor({ whatsappRepository } = {}) {
        this.whatsappRepository = whatsappRepository
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarEnviarMensagem
     *
     * @param  {object} oDados
     * @param  {object} oDadosCliente
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarEnviarMensagem(oDados, oDadosCliente) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.numeroDestinatario ||
            oDados.numeroDestinatario.length < 1
        ) {
            return HttpResponse.badRequest(
                new CustomError('Número do destinatário inválido', 4)
            )
        }

        /**
         * Valida se existe a mensagem
         */
        if (!oDados.mensagem ||
            oDados.mensagem.length < 1
        ) {
            return HttpResponse.badRequest(
                new CustomError('Mensagem não informada', 5)
            )
        }

        /**
         * Valida se o numero do destinatario é valido
         */
        if (!/^\d+$/.test(oDados.numeroDestinatario) || oDados.numeroDestinatario.toString().length != 13) {
            return HttpResponse.badRequest(
                new CustomError('Número do destinatário inválido', 4)
            )
        }

        /**
         * Valida se a estrutura da mensagem é valida
         */
        if (typeof oDados.mensagem !== 'object') {
            return HttpResponse.badRequest(
                new CustomError('Mensagem inválida1', 6)
            )
        }

        for (let [ iChave, oMensagem ] of Object.entries(oDados.mensagem)) {
            /**
             * Valida se a estrutura da mensagem é valida
             */
            if (!oMensagem.type || !oMensagem.text) {
                return HttpResponse.badRequest(
                    new CustomError('Mensagem inválida2', 6)
                )
            }
        }

        /**
         * Faz a contagem das mensagens enviadas
         *
         * @var int iContadorMensagens
         */
        const iContadorMensagens = await this.whatsappRepository.contarMensagens(oDadosCliente._id)

        // Verifica o limite de mensagens
        if(oDadosCliente.whatsapp.limiteMensagens >= oDadosCliente._id){
            return HttpResponse.badRequest(
                new CustomError('Limite de envio de mensagens atingido', 7)
            )
        }

        return null;
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarWebhookStatus
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarWebhookStatus(oDados) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.type 
            || oDados.type != 'MESSAGE_STATUS'
            || !oDados.messageStatus
        ) {
            return HttpResponse.badRequest(
                new CustomError('Request inválido', 1)
            )
        }

        return null;
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarWebhookRecebimento
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarWebhookRecebimento(oDados) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.type 
            || oDados.type != 'MESSAGE'
        ) {
            return HttpResponse.badRequest(
                new CustomError('Request inválido', 1)
            )
        }

        return null;
    }
}
/**
 * Esse arquivo é responsável pelas validações e tratamentos antes de enviar
 * a consulta ou cadastro ao banco de dados
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
const helpers = require('../../utils/helpers')

/**
 * Classe WhatsappUseCase
 * @package  src\domain\usecases
 */
module.exports = class WhatsappUseCase {
    /**
     * Construtor
     * @param {whatsappRepository}
     */
    constructor({ whatsappRepository, clienteFilter } = {}) {
        this.whatsappRepository = whatsappRepository
    }

    /**
     * Função responsável pelo envio da mensagem
     *
     * @param {object} oDados
     * @param {object} oDadosCliente
     *
     * @returns {object}
     */
    async enviarMensagem(oDados, oDadosCliente) {
        /**
         * Insere o contato
         *
         * @var {object} oDadosContato
         */
        const oDadosContato = await this.whatsappRepository.insereContato(oDadosCliente._id, oDados.numeroDestinatario)

        // Verifica se não houve cadastro
        if(oDadosContato == null){
            return HttpResponse.serverError()
        }

        /**
         * Insere o contato
         *
         * @var {object} oEnviaMensagem
         */
        const oEnviaMensagem = await helpers.ZenviaClient.enviarMensagem(oDados, oDadosCliente.whatsapp)

        // Verifica se não houve cadastro
        if(oEnviaMensagem.statusCode != null && oEnviaMensagem.statusCode != 200){
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }

        /**
         * Insere a mensagem enviada
         *
         * @var {object} oDadosMensagemEnviada
         */
        const oDadosMensagemEnviada = await this.whatsappRepository.insereMensagemEnviada(oDadosContato, oEnviaMensagem)

        // Verifica se não houve cadastro
        if(oDadosMensagemEnviada == null){
            return HttpResponse.serverError()
        }

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        const oRetorno = {
            _id: oDadosMensagemEnviada._id,
            idContato: oDadosMensagemEnviada.idContato,
            numeroDestinatario: oDadosMensagemEnviada.numeroDestinatario,
            mensagem: oDadosMensagemEnviada.mensagem,
            idMensagem: oDadosMensagemEnviada.idMensagem,
            dataCadastro: oDadosMensagemEnviada.dataCadastro,
            dataAtualizacao: oDadosMensagemEnviada.dataAtualizacao
        }

        return HttpResponse.created(oRetorno)
    }

    /**
     * Função responsável pelo webhook de status
     *
     * @param {object} oDados
     *
     * @returns {object}
     */
    async webhookStatus(oDados) {
        /**
         * Atualiza a mensagem
         *
         * @var {object} oAtualizaMensagem
         */
        const oAtualizaMensagem = await this.whatsappRepository.atualizaMensagem(oDados.messageId, oDados.messageStatus.code)

        // Verifica se não houve cadastro
        if(oAtualizaMensagem == null){
            return HttpResponse.serverError()
        }

        return HttpResponse.created({mensagem: 'Mensagem atualizada com sucesso!'})
    }

    /**
     * Função responsável pelo webhook de recebimento
     *
     * @param {object} oDados
     * @param {object} oCliente
     *
     * @returns {object}
     */
    async webhookRecebimento(oDados, oCliente) {
        /**
         * Busca os dados do contato na mensagem enviada
         *
         * @var {object} oDadosContato
         */
        const oDadosContato = await this.whatsappRepository.buscaMensagemEnviada(oDados.from, oDados.to)

        // Verifica se não houve contato
        if(oDadosContato == null){
            return HttpResponse.serverError()
        }

        /**
         * Insere a mensagem
         *
         * @var {object} oInsereMensagem
         */
        const oInsereMensagem = await this.whatsappRepository.insereMensagemRecebida(oDadosContato, oDados)

        // Verifica se não houve cadastro
        if(oInsereMensagem == null){
            return HttpResponse.serverError()
        }

        // Verifica se o cliente tem mensagem de retorno padrão
        if(oCliente.whatsapp.mensagemRetornoPadrao && oCliente.whatsapp.mensagemRetornoPadrao.toString().length > 0){
            /**
             * Dados da mensagem
             *
             * @var {object} oDadosMensagem
             */
            const oDadosMensagem = {
                numeroDestinatario: oDados.from,
                mensagem: [
                    {
                        type: "text",
                        text: oCliente.whatsapp.mensagemRetornoPadrao
                    }
                ]
            }

            /**
             * Envia a mensagem de retorno
             *
             * @var {object} oEnviaMensagem
             */
            const oEnviaMensagem = await this.enviarMensagem(oDadosMensagem, oCliente)

            // Verifica se houve erro
            if(oEnviaMensagem.statusCode != 201){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }
        }

        /**
         * Notifica via SNS
         *
         * @var {object} oSNS
         */
        const oSNS = await helpers.AWSSNS.notificar(oDados.id)

        // Verifica se houve erro
        if(oSNS == null){
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }

        return HttpResponse.created({mensagem: 'Mensagem inserida com sucesso!'})
    }
}
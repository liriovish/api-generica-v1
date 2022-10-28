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
const { CustomError } = require('../../utils/errors/')

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
        this.clienteFilter = clienteFilter
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
     * Função responsável pelo envio da mensagem
     *
     * @param {object} oDados
     * @param {object} oDadosCliente
     *
     * @returns {object}
     */
    async historicoMensagens(oParams, oDados, oDadosCliente) {
        /**
         * Define as funcões para buscar todas as mensagens para cada tipo de mensagem
         *
         * @var {object} oFuncoesTodasMensagensEnviadas
         */
        const oFuncoesTodasMensagensEnviadas = {
            enviada: this.whatsappRepository.buscaMensagensEnviadas(oDados.filtros, oDados.ordem, oDados.pagina, oDadosCliente._id, true),
            recebida: this.whatsappRepository.buscaMensagensRecebidas(oDados.filtros, oDados.ordem, oDados.pagina, oDadosCliente._id, true)
        }

        /**
         * Define as funcões para buscar as mensagens para cada tipo de mensagem
         *
         * @var {object} oFuncoesDadosMensagensEnviadas
         */
        const oFuncoesDadosMensagensEnviadas = {
            enviada: this.whatsappRepository.buscaMensagensEnviadas(oDados.filtros, oDados.ordem, oDados.pagina, oDadosCliente._id),
            recebida: this.whatsappRepository.buscaMensagensRecebidas(oDados.filtros, oDados.ordem, oDados.pagina, oDadosCliente._id)
        }

        /**
         * Busca todas as mensagens enviadas
         *
         * @var {object} oDadosMensagensEnviadas
         */
        const oTodasMensagensEnviadas = await oFuncoesTodasMensagensEnviadas[oParams.tipoMensagem]

        /**
         * Busca as mensagens enviadas
         *
         * @var {object} oDadosMensagensEnviadas
         */
        const oDadosMensagensEnviadas = await oFuncoesDadosMensagensEnviadas[oParams.tipoMensagem]

        /**
         * Define o total de mensagens
         *
         * @var {int} iResultados
         */
        const iResultados = oTodasMensagensEnviadas.length

        /**
         * Define o total de paginas
         *
         * @var {int} iPaginas
         */
        const iPaginas = Math.ceil(iResultados/100)
        
        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        const oRetorno = {}

        // Define as informações das mensagens
        oRetorno.data = oDadosMensagensEnviadas.map(oMensagem => 
            (
                { 
                    id: oMensagem._id, 
                    idContato: oMensagem.idContato,
                    numeroRemetente: oMensagem.numeroRemetente,
                    numeroDestinatario: oMensagem.numeroDestinatario,
                    mensagem: oMensagem.mensagem,
                    idMensagem: oMensagem.idMensagem,
                    idCliente: oMensagem.idCliente,
                    dataCadastro: oMensagem.dataCadastro,
                    dataAtualizacao: oMensagem.dataAtualizacao,
                    status: oMensagem.status ??  oMensagem.statusEntregaCliente,
                    tentativasEntregaCliente: oMensagem.tentativasEntregaCliente ?? 0,
                    idConversa: oMensagem.idConversa ?? ''
                }
            )
        );
        
        // Define as informações da busca
        oRetorno.resultados = iResultados
        oRetorno.paginas = iPaginas
        oRetorno.paginaAtual = oDados.pagina ?? 1

        return oRetorno
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

        /**
         * Notifica via SNS
         *
         * @var {object} oSNS
         */
        const oSNS = await helpers.AWSSNS.notificar(oDados.messageId, 'status')

        // Verifica se houve erro
        if(oSNS == null){
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }

        return HttpResponse.created({mensagem: 'Mensagem atualizada com sucesso!'})
    }

    /**
     * Função responsável pelo webhook de recebimento
     *
     * @param {object} oDados
     * @param {string} sToken
     *
     * @returns {object}
     */
    async webhookRecebimento(oDados, sToken) {
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
         * Busca os dados do cliente
         *
         * @var {obejct} oCliente
         *
         * @UsaFuncao dadosCliente
         */
        const oCliente = await this.clienteFilter.dadosCliente(sToken, oDadosContato.idCliente)

        // Verifica se existe o cliente
        if(oCliente.statusCode != 200){
            return HttpResponse.badRequest(
                new CustomError('Cliente não localizado', 2)
            )
        }

        /**
         * Busca os dados do cliente
         *
         * @var {obejct} oDadosCliente
         */
        const oDadosCliente = oCliente.body

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
        if(oDadosCliente.whatsapp.mensagemRetornoPadrao && oDadosCliente.whatsapp.mensagemRetornoPadrao.toString().length > 0){
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
                        text: oDadosCliente.whatsapp.mensagemRetornoPadrao
                    }
                ]
            }

            /**
             * Envia a mensagem de retorno
             *
             * @var {object} oEnviaMensagem
             */
            const oEnviaMensagem = await this.enviarMensagem(oDadosMensagem, oDadosCliente)

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
        const oSNS = await helpers.AWSSNS.notificar(oDados.id, 'recebimento')

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
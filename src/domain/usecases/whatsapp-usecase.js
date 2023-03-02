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
const moment = require('moment-timezone')
moment.tz.setDefault("America/Sao_Paulo")

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
        const oDadosContato = await this.whatsappRepository.insereContato(oDadosCliente._id, oDados.numeroDestinatario, oDados.nomeDestinatario)

        // Verifica se não houve cadastro
        if(oDadosContato == null){
            return HttpResponse.serverError()
        }

        /**
         * Insere o contato
         *
         * @var {object} oEnviaMensagem
         */
        const oEnviaMensagem = await helpers.ZenviaClient.enviarMensagem(oDados, oDadosCliente)

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
    async enviarMensagemV2(oDados, oDadosCliente) {
        /**
         * Insere o contato
         *
         * @var {object} oDadosContato
         */
        const oDadosContato = await this.whatsappRepository.insereContato(oDadosCliente._id, oDados.numeroDestinatario, oDados.nomeDestinatario)

        // Verifica se não houve cadastro
        if(oDadosContato == null){
            return HttpResponse.serverError()
        }

        /**
         * Insere o contato
         *
         * @var {object} oEnviaMensagem
         */
        let oEnviaMensagem = {}

        if(oDadosCliente.whatsapp.integrador == 'ZENVIA'){
            oEnviaMensagem = await helpers.ZenviaClient.enviarMensagemV2(oDados, oDadosCliente)

            // Verifica se não houve cadastro
            if(oEnviaMensagem.statusCode != null && oEnviaMensagem.statusCode != 200){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }
        }else if(oDadosCliente.whatsapp.integrador == 'META'){
            oEnviaMensagem = await helpers.MetaClient.enviarMensagem(oDados, oDadosCliente)

            // Verifica se não houve cadastro
            if(oEnviaMensagem.statusCode != null && oEnviaMensagem.statusCode != 200){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }

            // Atualiza o objeto recebido para salvar no banco
            oEnviaMensagem.id = oEnviaMensagem.messages[0].id
            oEnviaMensagem.from = oDadosCliente.whatsapp.metaIdNumeroTelefone
            oEnviaMensagem.to = oEnviaMensagem.contacts[0].input
            oEnviaMensagem.contents = oDados.parametros.conteudo ?? ''
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
    async enviarMensagemV3(oDados, oDadosCliente) {
        /**
         * Insere o contato
         *
         * @var {object} oDadosContato
         */
        const oDadosContato = await this.whatsappRepository.insereContato(oDadosCliente._id, oDados.numeroDestinatario, oDados.nomeDestinatario)

        // Verifica se não houve cadastro
        if(oDadosContato == null){
            return HttpResponse.serverError()
        }

        
        /**
         * Define o template vazio
         *
         * @var {object} oTemplate
         */
        let oTemplate = {}

        if(oDados.tipo == 'template'){
            /**
             * Busca o template
             *
             * @var {object} oTemplate
             */
            oTemplate = await this.whatsappRepository.buscaTemplate(oDadosCliente._id, oDados.template ?? '')

            if(oTemplate == null){
                return HttpResponse.badRequest(
                    new CustomError('Template não localizado', 3)
                )
            }
        }

        /**
         * Inicia o objeto da mensagem e o conteudo
         *
         * @var {object} oEnviaMensagem
         */
        let oEnviaMensagem = {}
        let sConteudo = '{{conteudo}}'

        if(oDadosCliente.whatsapp.integrador == 'ZENVIA'){
            oDados.template = oTemplate?.identificadorTemplateZenvia ?? ''

            oEnviaMensagem = await helpers.ZenviaClient.enviarMensagemV2(oDados, oDadosCliente)

            // Verifica se não houve cadastro
            if(oEnviaMensagem.statusCode != null && oEnviaMensagem.statusCode != 200){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }

            /**
             * Inicia o contador
             *
             * @var {int} iContador
             */
            let iContador = 1

            if(oTemplate.texto){
                sConteudo = oTemplate.texto                
            }

            /**
             * Itera os dados
             */
            await Promise.all(Object.keys(oDados.parametros).map(async (sChave) => {
                sConteudo = sConteudo.replace('{{'+sChave+'}}', oDados.parametros[sChave])
                sConteudo = sConteudo.replace('{{'+iContador+'}}', oDados.parametros[sChave])

                iContador++
            }))
        }else if(oDadosCliente.whatsapp.integrador == 'META'){
            oDados.template = oTemplate?.identificadorTemplateMeta ?? ''

            oEnviaMensagem = await helpers.MetaClient.enviarMensagem(oDados, oDadosCliente)

            // Verifica se não houve cadastro
            if(oEnviaMensagem.statusCode != null && oEnviaMensagem.statusCode != 200){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }

            // Atualiza o objeto recebido para salvar no banco
            oEnviaMensagem.id = oEnviaMensagem.messages[0].id
            oEnviaMensagem.from = oDadosCliente.whatsapp.metaIdNumeroTelefone
            oEnviaMensagem.to = oEnviaMensagem.contacts[0].input
            oEnviaMensagem.contents = oDados.parametros.conteudo ?? ''

            /**
             * Inicia o contador
             *
             * @var {int} iContador
             */
            let iContador = 1

            if(oTemplate.texto){
                sConteudo = oTemplate.texto                
            }

            /**
             * Itera os dados
             */
            await Promise.all(Object.keys(oDados.parametros).map(async (sChave) => {
                sConteudo = sConteudo.replace('{{'+sChave+'}}', oDados.parametros[sChave])
                sConteudo = sConteudo.replace('{{'+iContador+'}}', oDados.parametros[sChave])

                iContador++
            }))
        }        

        /**
         * Insere a mensagem enviada
         *
         * @var {object} oDadosMensagemEnviada
         */
        const oDadosMensagemEnviada = await this.whatsappRepository.insereMensagemEnviada(oDadosContato, oEnviaMensagem, sConteudo)

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
            numeroRemetente: oDadosMensagemEnviada.numeroRemetente,
            numeroDestinatario: oDadosMensagemEnviada.numeroDestinatario,
            mensagem: oDadosMensagemEnviada.mensagem,
            conteudo: oDadosMensagemEnviada.conteudo,
            idMensagem: oDadosMensagemEnviada.idMensagem,
            idCliente: oDadosMensagemEnviada.idCliente,
            dataEnvio: oDadosMensagemEnviada.dataEnvio,
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
    async webhookStatus(oDados, sIdentificadorCliente) {
        /**
         * Status da mensagem e id da mensagem
         *
         * @var {string} sStatus
         * @var {string} sIdMensagem
         */
        let sStatus = ''
        let sIdMensagem = ''

        // Verifica se o corpo do webhook foi enviado pela ZENVIA
        if(oDados.messageStatus && oDados.messageStatus.code){
            sStatus = oDados.messageStatus.code
            sIdMensagem = oDados.messageId
        }

        // Verifica se o corpo do webhook foi enviado pela META
        if(oDados.entry && oDados.entry[0].changes[0].value.statuses){
            sStatus = oDados.entry[0].changes[0].value.statuses[0].status
            sIdMensagem = oDados.entry[0].changes[0].value.statuses[0].id

            // Atualiza o status para deixar no padrão
            if(sStatus == 'sent'){
                sStatus = 'send'
            }

            // Atualiza o status para deixar no padrão
            if(sStatus == 'failed'){
                sStatus = 'not_delivered'
            }
        }

        // Verifica se encontrou algum integrador, senão, gera erro
        if(sStatus == ''){
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
             return HttpResponse.serverError()
        }

        /**
         * Atualiza a mensagem
         *
         * @var {object} oAtualizaMensagem
         */
        const oAtualizaMensagem = await this.whatsappRepository.atualizaMensagem(sIdMensagem, sStatus.toUpperCase())
        
        // Verifica se não houve cadastro
        if(oAtualizaMensagem == null){
            return HttpResponse.serverError()
        }

        /**
         * Notifica via SNS
         *
         * @var {object} oSNS
         */
        const oSNS = await helpers.AWSSNS.notificar(oDados.messageId, sIdentificadorCliente, 'status')

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
     * @param {object} oBody
     * @param {string} sToken
     *
     * @returns {object}
     */
    async webhookRecebimento(oBody, sToken, sTokenJwt, sIdentificadorCliente) {
        /**
         * Status da mensagem e id da mensagem
         *
         * @var {object} sStatus
         */
        let oDados = null

        // Verifica se o corpo do webhook foi enviado pela ZENVIA
        if(oBody.message){
            oDados = oBody.message

            oDados.conteudo = oBody.message.contents[0].text
        }

        // Verifica se o corpo do webhook foi enviado pela META
        if(oBody.object && oBody.entry[0].changes[0].value.messages){
            oDados = oBody.entry[0].changes[0].value.messages[0]

            // Atualiza o objeto para deixar no padrão
            oDados.id = oBody.entry[0].changes[0].value.messages[0].id
            oDados.to = oBody.entry[0].changes[0].value.metadata.phone_number_id
            // Atualiza o numero do remetente pois a meta envia sem o digito 9

            if(oDados.from.slice(0,2) == '55' && oDados.from.length == 12){
                oDados.from = `${oDados.from.slice(0,4)}9${oDados.from.slice(4)}`
            }

            oDados.conteudo = oBody.message.contents[0].text
        }

        // Verifica se encontrou algum integrador, senão, gera erro
        if(oDados == null){
            return HttpResponse.serverError()
        }

        /**
         * Busca os dados do cliente
         *
         * @var {obejct} oCliente
         *
         * @UsaFuncao dadosCliente
         */
        const oCliente = await this.clienteFilter.dadosCliente(sToken, '', sTokenJwt, sIdentificadorCliente)

        // Verifica se existe o cliente
        if(oCliente.statusCode != 200){
            return HttpResponse.badRequest(
                new CustomError('Cliente não localizado', 2)
            )
        }

        /**
         * Insere o contato
         *
         * @var {object} oDadosContato
         */
        const oDadosContato = await this.whatsappRepository.insereContato(oCliente.body._id, oDados.from, oDados.from)

        // Verifica se não houve cadastro
        if(oDadosContato == null){
            return HttpResponse.serverError()
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

        /**
         * Notifica via SNS
         *
         * @var {object} oSNS
         */
        const oSNS = await helpers.AWSSNS.notificar(oDados.id, sIdentificadorCliente, 'recebimento')

        // Verifica se houve erro
        if(oSNS == null){
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
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
                tipo: 'texto',
                parametros: {
                    conteudo: oDadosCliente.whatsapp.mensagemRetornoPadrao
                }
            }

            /**
             * Envia a mensagem de retorno
             *
             * @var {object} oEnviaMensagem
             */
            const oEnviaMensagem = await this.enviarMensagemV3(oDadosMensagem, oDadosCliente)

            // Verifica se houve erro
            if(oEnviaMensagem.statusCode != 201){
                /**
                 * Caso gere algum erro
                 * Retorna o erro
                 */
                return HttpResponse.serverError()
            }
        }

        return HttpResponse.created({mensagem: 'Mensagem inserida com sucesso!'})
    }

    /**
     * Função responsável pela criação do template
     *
     * @param {object} oDados
     * @param {object} oDadosCliente
     *
     * @returns {object}
     */
    async criarTemplate(oDados, oDadosCliente) {
        /**
         * Insere o contato
         *
         * @var {object} oTemplate
         */
        const oTemplate = await this.whatsappRepository.insereTemplate(oDadosCliente._id, oDados)

        // Verifica se não houve cadastro
        if(oTemplate == null){
            return HttpResponse.badRequest(
                new CustomError('Não foi possível criar o template', 2)
            )
        }

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        const oRetorno = {
            id: oTemplate._id,
            hashTemplateInterno: oTemplate.hashTemplateInterno,
            titulo: oTemplate.titulo,
            campos: oTemplate.campos ?? [],
            texto: oTemplate.texto,
            status: oTemplate.ativo == true ? 'Ativo' : 'Inativo',
            identificadorTemplateZenvia: oTemplate.identificadorTemplateZenvia ?? '',
            identificadorTemplateMeta: oTemplate.identificadorTemplateMeta ?? '',
            dataCadastro: moment(oTemplate.dataCadastro).format('YYYY-MM-DD HH:mm:ss'),
            dataAtualizacao: moment(oTemplate.dataAtualizacao).format('YYYY-MM-DD HH:mm:ss')
        }
        
        return HttpResponse.created(oRetorno)
    }

    /**
     * Função responsável pela atualização do template
     *
     * @param {object} oDados
     * @param {object} oDadosCliente
     * @param {string} sTemplate
     *
     * @returns {object}
     */
    async atualizarTemplate(oDados, oDadosCliente, sTemplate) {
        /**
         * Insere o contato
         *
         * @var {object} oTemplate
         */
        const oTemplate = await this.whatsappRepository.atualizaTemplate(oDadosCliente._id, oDados, sTemplate)

        // Verifica se não houve cadastro
        if(oTemplate == null){
            return HttpResponse.serverError()
        }

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        const oRetorno = {
            id: oTemplate._id,
            hashTemplateInterno: oTemplate.hashTemplateInterno,
            titulo: oTemplate.titulo,
            campos: oTemplate.campos ?? [],
            texto: oTemplate.texto,
            status: oTemplate.ativo == true ? 'Ativo' : 'Inativo',
            identificadorTemplateZenvia: oTemplate.identificadorTemplateZenvia ?? '',
            identificadorTemplateMeta: oTemplate.identificadorTemplateMeta ?? '',
            dataCadastro: moment(oTemplate.dataCadastro).format('YYYY-MM-DD HH:mm:ss'),
            dataAtualizacao: moment(oTemplate.dataAtualizacao).format('YYYY-MM-DD HH:mm:ss')
        }
        
        return HttpResponse.ok(oRetorno)
    }

    /**
     * Função responsável pela listagem dos templates
     *
     * @param {object} oDadosCliente
     * @param {string} sTemplate
     * @param {object} oDados
     *
     * @returns {object}
     */
    async listarTemplates(oDadosCliente, sTemplate, oDados) {
        /**
         * Insere o contato
         *
         * @var {object} oTemplates
         */
        const oTemplates = await this.whatsappRepository.listarTemplates(oDadosCliente._id, sTemplate, oDados)

        // Verifica se não houve cadastro
        if(oTemplates == null){
            return HttpResponse.serverError()
        }

        /**
         * Busca o total de templates
         *
         * @var {object} iTotalTemplates
         */
        const iTotalTemplates = await this.whatsappRepository.totalTemplates(oDadosCliente._id, sTemplate, oDados)

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        let oRetorno = {
            totalRegistros: iTotalTemplates,
            data: []
        }

        /**
         * Itera os dados
         */
        await Promise.all(oTemplates.map(async (oTemplate) => {
            /**
             * Adiciona no objeto de retorno
             */
            oRetorno.data.push({
                id: oTemplate._id,
                hashTemplateInterno: oTemplate.hashTemplateInterno,
                titulo: oTemplate.titulo,
                campos: oTemplate.campos ?? [],
                texto: oTemplate.texto,
                status: oTemplate.ativo == true ? 'Ativo' : 'Inativo',
                identificadorTemplateZenvia: oTemplate.identificadorTemplateZenvia ?? '',
                identificadorTemplateMeta: oTemplate.identificadorTemplateMeta ?? '',
                dataCadastro: moment(oTemplate.dataCadastro).format('YYYY-MM-DD HH:mm:ss'),
                dataAtualizacao: moment(oTemplate.dataAtualizacao).format('YYYY-MM-DD HH:mm:ss')
            })
        }))

        return HttpResponse.ok(oRetorno)
    }

    /**
     * Função responsável pela listagem dos contatos
     *
     * @param {object} oDadosCliente
     * @param {string} sNumero
     * @param {object} oDados
     *
     * @returns {object}
     */
    async listarContatos(oDadosCliente, sNumero, oDados) {
        /**
         * Lista os contatos
         *
         * @var {object} oContatos
         */
        const oContatos = await this.whatsappRepository.listarContatos(oDadosCliente._id, sNumero, oDados)

        // Verifica se não houve cadastro
        if(oContatos == null){
            return HttpResponse.serverError()
        }

        /**
         * Busca o total de contatos
         *
         * @var {object} iTotalContatos
         */
        const iTotalContatos = await this.whatsappRepository.totalContatos(oDadosCliente._id, sNumero, oDados)

        /**
         * Busca o total de contatos arquivados
         *
         * @var {object} iTotalContatosArquivados
         */
        const iTotalContatosArquivados = await this.whatsappRepository.totalContatosArquivados(oDadosCliente._id, sNumero, oDados)

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        let oRetorno = {
            totalRegistros: iTotalContatos,
            totalRegistrosArquivados: iTotalContatosArquivados,
            data: []
        }

        /**
         * Itera os dados
         */
        await Promise.all(oContatos.map(async (oContato) => {
            /**
             * Busca a ultima mensagem do contato
             *
             * @var {object} oMensagem
             */
            const oMensagem = await this.whatsappRepository.buscaUltimaMensagem(oContato.id)

            /**
             * Define o numero de mensagens nao lidas
             *
             * @var {int} iNaoLidas
             */
            const iNaoLidas = await this.whatsappRepository.contagemMensagensNaoLidas(oContato.id)

            /**
             * Adiciona no objeto de retorno
             */
            oRetorno.data.push({
                nome: oContato.nome,
                numero: oContato.numero,
                ultimaMensagem: oMensagem.conteudo ?? '',
                dataUltimaMensagem: moment(oMensagem.dataEnvio ?? oMensagem.dataCadastro).format('YYYY-MM-DD HH:mm:ss'),
                tipoUltimaMensagem: oMensagem.tipo ?? '',
                quantidadeNaoLidas: iNaoLidas,
                arquivado: oContato.arquivado ?? false
            })
        }))

        return HttpResponse.ok(oRetorno)
    }

    /**
     * Função responsável pela listagem dos contatos
     *
     * @param {object} oDadosCliente
     * @param {string} sNumero
     * @param {object} oDados
     *
     * @returns {object}
     */
    async listarMensagens(oDadosCliente, sNumero, oDados) {
        /**
         * Lista as mensagens
         *
         * @var {object} oMensagens
         */
        const oMensagens = await this.whatsappRepository.listarMensagens(oDadosCliente._id, sNumero, oDados)

        // Verifica se não houve cadastro
        if(oMensagens == null){
            return HttpResponse.serverError()
        }

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        let oRetorno = {
            data: []
        }

        /**
         * Itera os dados
         */
        oMensagens.map(async (oMensagem) => {
            /**
             * Adiciona no objeto de retorno
             */
            oRetorno.data.push({
                tipo: oMensagem.tipo,
                numero: oMensagem.numero,
                status: oMensagem.status ?? oMensagem.statusEntregaCliente ?? '',
                dataMensagem: moment(oMensagem.dataEnvio ?? oMensagem.dataCadastro).format('YYYY-MM-DD HH:mm:ss'),
                mensagem: oMensagem.conteudo ?? ''
            })
        })

        /**
         * Marcar as mensagens como lida
         */
        await this.whatsappRepository.marcarMensagensLidas(oDadosCliente._id, sNumero)

        return HttpResponse.ok(oRetorno)
    }

    /**
     * Função responsável pela atualização do contato
     *
     * @param {object} oDados
     * @param {object} oDadosCliente
     *
     * @returns {object}
     */
    async atualizarContato(oDados, oDadosCliente) {
        /**
         * Insere o contato
         *
         * @var {object} oContato
         */
        const oContato = await this.whatsappRepository.atualizarContato(oDadosCliente._id, oDados, oDados.numero)

        // Verifica se não houve cadastro
        if(oContato == null){
            return HttpResponse.badRequest(
                new CustomError('Contato não localizado', 1)
            )
        }

        /**
         * Define o retorno
         *
         * @var {object} oRetorno
         */
        const oRetorno = {
            id: oContato._id,
            nome: oContato.nome,
            numero: oContato.numero,
            arquivado: oContato.arquivado,
        }

        return HttpResponse.ok(oRetorno)
    }
}
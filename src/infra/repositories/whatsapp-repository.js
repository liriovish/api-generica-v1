/**
 * Arquivo do composer para montar a comunicação entre a rota, db e outros
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
const moment = require('moment-timezone')
moment.tz.setDefault("America/Sao_Paulo")
const crypto = require('crypto')
const db = require('../models')

/**
 * Classe WhatsappRepository
 * 
 * @package  src\infra\repositories
 */
module.exports = class WhatsappRepository {
    /**
     * Construtor
     * @param {consultaFilter}
     */
    constructor({ consultaFilter = '' } = {}) {
        this.consultaFilter = consultaFilter
    }

    /**
     * Função para inserir o contato no banco de dados
     * 
     * @async
     * @function insereContato
     * 
     * @param string sIdCliente
     * @param string sNumero
     * 
     * @return object Retorna os dados do contato ou null
     */
    async insereContato(sIdCliente, sNumero, sNome) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbWhatsapp
             */ 
            const dbContatos = await db.Contatos()

            if(sNome == null){
                sNome = sNumero
            }

            /**
             * Insere no banco de dados
             * 
             * @var object oInsereContato
             */
            const oInsereContato = await dbContatos.findOneAndUpdate(
                {
                    idCliente: sIdCliente,
                    numero: sNumero
                },
                {
                    $setOnInsert: {
                        idCliente: sIdCliente,
                        numero: sNumero,
                        arquivado: false,
                        nome: sNome
                    }
                },
                { 
                    upsert: true,
                    returnOriginal: false
                }
            )

            
            /**
             * Insere no banco de dados
             * 
             * @var object oAtualiza
             */
            const oAtualiza = await dbContatos.findOneAndUpdate(
                {
                    idCliente: sIdCliente,
                    numero: sNumero
                },
                {
                    $set: {
                        arquivado: false,
                        dataAtualizacao: moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            )

            if(sNome != sNumero){
                /**
                 * Insere no banco de dados
                 * 
                 * @var object oAtualizaNome
                 */
                const oAtualizaNome = await dbContatos.findOneAndUpdate(
                    {
                        idCliente: sIdCliente,
                        numero: sNumero
                    },
                    {
                        $set: {
                            nome: sNome
                        }
                    }
                )
            }
  
            return oInsereContato
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar o cliente no banco de dados
     * 
     * @async
     * @function buscaContato
     * 
     * @param string sChave
     * 
     * @return object Retorna os dados do cliente ou null
     */
    async buscaContato(sChave) {
        try {  
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbWhatsapp
             */ 
            const dbWhatsapp = await db.Whatsapp()

            /**
             * Insere no banco de dados
             * 
             * @var object oBuscaContato
             */
            const oBuscaContato = await dbWhatsapp.findOne(
                {
                    chaveAplicativo: sChave
                },
                {
                    "documento": 0,
                    "chaveAplicativo": 0,
                    "dataCadastro": 0,
                    "dataAtualizacao": 0,
                    "__v": 0
                }
            )

            return oBuscaContato
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar a mensagem enviada no banco de dados
     * 
     * @async
     * @function buscaMensagemEnviada
     * 
     * @param string sNumeroDestinatario
     * @param string sNumeroRemetente
     * 
     * @return object Retorna os dados da mensagem enviada ou null
     */
    async buscaMensagemEnviada(sNumeroDestinatario, sNumeroRemetente) {
        try {  
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemEnviada
             */
            const oBuscaMensagemEnviada = await dbMensagensEnviadas.findOne(
                {
                    numeroDestinatario: sNumeroDestinatario,
                    numeroRemetente: sNumeroRemetente
                },
                {
                    "idContato": 1,
                    "idCliente": 1
                }
            )

            return oBuscaMensagemEnviada
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para contar mensagens
     * 
     * @async
     * @function contarMensagens
     * 
     * @param string sIdCliente
     * 
     * @return object Retorna os dados do cliente ou null
     */
    async contarMensagens(sIdCliente) {
        try {  
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            /**
             * Conta as mensagens
             * 
             * @var int iContarMensagens
             */
            const iContarMensagens = await dbMensagensEnviadas.find(
                {
                    idCliente: sIdCliente
                }
            ).count()

            return iContarMensagens
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir a mensagem enviada no banco de dados
     * 
     * @async
     * @function insereMensagemEnviada
     * 
     * @param object oDadosContato
     * @param object oDadosMensagem
     * @param string sConteudo
     * 
     * @return object Retorna os dados da mensagem enviada ou null
     */
    async insereMensagemEnviada(oDadosContato, oDadosMensagem, sConteudo) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()
            
            /**
             * Insere no banco de dados
             * 
             * @var object oInsereMensagensEnviadas
             */
            const oInsereMensagensEnviadas = await dbMensagensEnviadas.create(
                {
                    idContato: oDadosContato._id,
                    numeroRemetente: oDadosMensagem.from,
                    numeroDestinatario: oDadosMensagem.to,
                    mensagem: oDadosMensagem,
                    idMensagem: oDadosMensagem.id,
                    conteudo: sConteudo,
                    idCliente: oDadosContato.idCliente,
                    dataEnvio: moment().format(),
                    dataCadastro: moment().format(),
                    dataAtualizacao: moment().format()
                }
            )

            return oInsereMensagensEnviadas
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para atualizar a mensagem no banco de dados
     * 
     * @async
     * @function atualizaMensagem
     * 
     * @param string sIdMensagem
     * @param string sStatus
     * 
     * @return object Retorna os dados da mensagem atualizada ou null
     */
    async atualizaMensagem(sIdMensagem, sStatus) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            /**
             * Atualiza no banco de dados
             * 
             * @var object oAtualizaMensagemEnviada
             */
            const oAtualizaMensagemEnviada = await dbMensagensEnviadas.updateOne(
                {
                    idMensagem: sIdMensagem
                },
                {
                    $set: {
                        status: sStatus
                    }
                }
            )

            return oAtualizaMensagemEnviada
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir a mensagem recebida no banco de dados
     * 
     * @async
     * @function insereMensagemRecebida
     * 
     * @param object oDadosContato
     * @param object oDadosMensagem
     * 
     * @return object Retorna os dados da mensagem recebida ou null
     */
    async insereMensagemRecebida(oDadosContato, oDadosMensagem) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            /**
             * Insere no banco de dados
             * 
             * @var object oInsereMensagensRecebidas
             */
            const oInsereMensagensRecebidas = await dbMensagensRecebidas.create(
                {
                    idContato: oDadosContato._id,
                    numeroRemetente: oDadosMensagem.from,
                    numeroDestinatario: oDadosMensagem.to,
                    mensagem: oDadosMensagem,
                    conteudo: oDadosMensagem.conteudo,
                    idMensagem: oDadosMensagem.id,
                    idCliente: oDadosContato.idCliente,
                    dataCadastro: moment().format(),
                    dataAtualizacao: moment().format()
                }
            )

            return oInsereMensagensRecebidas
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar as mensagens enviadas no banco de dados
     * 
     * @async
     * @function buscaMensagensEnviadas
     * 
     * @param object oFiltros
     * @param object oOrdem
     * @param int iPagina
     * @param string sIdCliente
     * @param bool bBuscaTodos
     * 
     * @return object Retorna os dados da mensagem enviada ou null
     */
    async buscaMensagensEnviadas(oFiltros, oOrdem, iPagina, sIdCliente, bBuscaTodos = false) {
        try {  
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            // Verifica se existe campo da ordenação
            if(!oOrdem.campo){
                oOrdem.campo = 'dataCadastro'
            }

            // Verifica se existe tipo da ordenação
            if(!oOrdem.ordem){
                oOrdem.ordem = 'DESC'
            }

            /**
             * Define os tipos da ordenação
             * 
             * @var {object} oOrdenacao
             */ 
            const oOrdenacao = {
                'asc': 1,
                'ASC': 1,
                'desc': -1,
                'DESC': -1,
            }

            /**
             * Criação de objeto com os dados para salvar
             * @var {object} dadosTratados
             */
            const oDadosWhere = await this.consultaFilter.filtrosConsulta(oFiltros, sIdCliente)

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemEnviada
             */
            const oBuscaMensagemEnviada = await dbMensagensEnviadas.find(
                oDadosWhere
            ).sort({[oOrdem.campo]: oOrdenacao[oOrdem.ordem]})
             .skip( iPagina > 0 && bBuscaTodos == false ? ( ( iPagina - 1 ) * 100 ) : 0 )
             .limit(bBuscaTodos == true ? null : 100)

            return oBuscaMensagemEnviada
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar as mensagens enviadas no banco de dados
     * 
     * @async
     * @function buscaMensagensRecebidas
     * 
     * @param object oFiltros
     * @param object oOrdem
     * @param int iPagina
     * @param string sIdCliente
     * @param bool bBuscaTodos
     * 
     * @return object Retorna os dados da mensagem enviada ou null
     */
    async buscaMensagensRecebidas(oFiltros, oOrdem, iPagina, sIdCliente, bBuscaTodos = false) {
        try {  
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            // Verifica se existe campo da ordenação
            if(!oOrdem.campo){
                oOrdem.campo = 'dataCadastro'
            }

            // Verifica se existe tipo da ordenação
            if(!oOrdem.ordem){
                oOrdem.ordem = 'DESC'
            }

            /**
             * Define os tipos da ordenação
             * 
             * @var {object} oOrdenacao
             */ 
            const oOrdenacao = {
                'asc': 1,
                'ASC': 1,
                'desc': -1,
                'DESC': -1,
            }

            /**
             * Criação de objeto com os dados para salvar
             * @var {object} dadosTratados
             */
            const oDadosWhere = await this.consultaFilter.filtrosConsulta(oFiltros, sIdCliente)

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemEnviada
             */
            const oBuscaMensagemEnviada = await dbMensagensRecebidas.find(
                oDadosWhere
            ).sort({[oOrdem.campo]: oOrdenacao[oOrdem.ordem]})
             .skip( iPagina > 0 && bBuscaTodos == false ? ( ( iPagina - 1 ) * 100 ) : 0 )
             .limit(bBuscaTodos == true ? null : 100)

            return oBuscaMensagemEnviada
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir o template no banco de dados
     * 
     * @async
     * @function insereTemplate
     * 
     * @param string sIdCliente
     * @param object oDados
     * 
     * @return object Retorna os dados do template ou null
     */
    async insereTemplate(sIdCliente, oDados) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbTemplates
             */ 
            const dbTemplates = await db.Templates()

            /**
             * Define o id do cliente nos dados
             */ 
            oDados.idCliente = sIdCliente

            /**
             * Define o hash do template do cliente nos dados
             */
            oDados.hashTemplateInterno = crypto.randomUUID()

            /**
             * Define as datas
             */
            oDados.dataCadastro = moment().format('YYYY-MM-DD HH:mm:ss')
            oDados.dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss')

            /**
             * Insere no banco de dados
             * 
             * @var object oInsere
             */
            const oInsere = await dbTemplates.create(oDados)

            return oInsere
        } catch (error) {
            console.error(error)

            return null
        }
    }

    /**
     * Função para inserir o template no banco de dados
     * 
     * @async
     * @function atualizaTemplate
     * 
     * @param string sIdCliente
     * @param object oDados
     * @param string sTemplate
     * 
     * @return object Retorna os dados do template ou null
     */
    async atualizaTemplate(sIdCliente, oDados, sTemplate) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbTemplates
             */ 
            const dbTemplates = await db.Templates()

            /**
             * Define as datas
             */
            oDados.dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss')

            /**
             * Insere no banco de dados
             * 
             * @var object oInsere
             */
            const oInsere = await dbTemplates.findOneAndUpdate(
                {
                    hashTemplateInterno: sTemplate,
                    idCliente: sIdCliente
                },
                {
                    $set: oDados
                },
                {
                    returnOriginal: false
                }
            )
  
            return oInsere
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para listar os template
     * 
     * @async
     * @function listarTemplates
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * @param object oDados
     * 
     * @return object Retorna os dados do template ou null
     */
    async listarTemplates(sIdCliente, sTemplate, oDados) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbTemplates
             */ 
            const dbTemplates = await db.Templates()

            /**
             * Define os dados da busca
             * 
             * @var {object} oBusca
             */ 
            const oBusca = {
                idCliente: sIdCliente
            }

            if(sTemplate != undefined){
                oBusca.hashTemplateInterno = sTemplate
            }   
            
            if(!oDados.registrosPorPagina){
                oDados.registrosPorPagina = 20
            }

            if(oDados.ativos && oDados.ativos == 1){
                oDados.ativo = true
            }

            /**
             * Insere no banco de dados
             * 
             * @var object oTemplates
             */
            const oTemplates = await dbTemplates.find(oBusca)
            .skip( oDados.pagina > 0 ? ( ( oDados.pagina - 1 ) * oDados.registrosPorPagina ) : 0 )
            .limit( oDados.registrosPorPagina )
  
            return oTemplates
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para contar os template
     * 
     * @async
     * @function totalTemplates
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * 
     * @return object Retorna os dados do template ou null
     */
    async totalTemplates(sIdCliente, sTemplate) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbTemplates
             */ 
            const dbTemplates = await db.Templates()

            /**
             * Define os dados da busca
             * 
             * @var {object} oBusca
             */ 
            const oBusca = {
                idCliente: sIdCliente
            }

            if(sTemplate != undefined){
                oBusca.hashTemplateInterno = sTemplate
            }   

            /**
             * Conta no banco de dados
             * 
             * @var int iTemplates
             */
            const iTemplates = await dbTemplates.count(oBusca)
  
            return iTemplates
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para listar os template
     * 
     * @async
     * @function buscaTemplate
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * 
     * @return object Retorna os dados do template ou null
     */
    async buscaTemplate(sIdCliente, sTemplate) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbTemplates
             */ 
            const dbTemplates = await db.Templates()    

            /**
             * Busca no banco de dados
             * 
             * @var object oTemplate
             */
            const oTemplate = await dbTemplates.findOne(
                {
                    idCliente: sIdCliente,
                    hashTemplateInterno: sTemplate
                }
            )
  
            return oTemplate
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para listar os contatos
     * 
     * @async
     * @function listarContatos
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * @param object oDados
     * 
     * @return object Retorna os dados do contato ou null
     */
    async listarContatos(sIdCliente, sNumero, oDados) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbContatos
             */ 
            const dbContatos = await db.Contatos()

            /**
             * Define os dados da busca
             * 
             * @var {object} oBusca
             */ 
            const oBusca = {
                idCliente: sIdCliente
            }

            if(sNumero != undefined){
                oBusca.numero = sNumero
            }     
            
            if(!oDados.registrosPorPagina){
                oDados.registrosPorPagina = 20
            }
            
            if(oDados.arquivado){
                oBusca.arquivado = oDados.arquivado == 'true' ? true : { $ne: true }
            }

            /**
             * Insere no banco de dados
             * 
             * @var object oContatos
             */
            const oContatos = await dbContatos.find(oBusca)
            .skip( oDados.pagina > 0 ? ( ( oDados.pagina - 1 ) * oDados.registrosPorPagina ) : 0 )
            .limit( oDados.registrosPorPagina )

            return oContatos
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para contar os contatos
     * 
     * @async
     * @function totalContatos
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * @param object oDados
     * 
     * @return object Retorna os dados do contato ou null
     */
    async totalContatos(sIdCliente, sNumero, oDados) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbContatos
             */ 
            const dbContatos = await db.Contatos()

            /**
             * Define os dados da busca
             * 
             * @var {object} oBusca
             */ 
            const oBusca = {
                idCliente: sIdCliente
            }

            if(sNumero != undefined){
                oBusca.numero = sNumero
            }   
            
            if(oDados.arquivado){
                oBusca.arquivado = oDados.arquivado == 'true' ? true : { $ne: true }
            }

            /**
             * Conta no banco de dados
             * 
             * @var int iContatos
             */
            const iContatos = await dbContatos.count(oBusca)

            return iContatos
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para contar os contatos arquivados
     * 
     * @async
     * @function totalContatosArquivados
     * 
     * @param string sIdCliente
     * @param string sTemplate
     * 
     * @return object Retorna os dados do contato ou null
     */
    async totalContatosArquivados(sIdCliente, sNumero) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbContatos
             */ 
            const dbContatos = await db.Contatos()

            /**
             * Define os dados da busca
             * 
             * @var {object} oBusca
             */ 
            const oBusca = {
                idCliente: sIdCliente,
                arquivado: true
            }

            if(sNumero != undefined){
                oBusca.numero = sNumero
            } 

            /**
             * Conta no banco de dados
             * 
             * @var int iContatos
             */
            const iContatos = await dbContatos.count(oBusca)

            return iContatos
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar a ultima mensagem no banco de dados
     * 
     * @async
     * @function buscaUltimaMensagem
     * 
     * @param string sContato
     * 
     * @return object Retorna os dados ou null
     */
    async buscaUltimaMensagem(sContato) {
        try {  
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            /**
             * Define os dados da busca
             * 
             * @var object oBusca
             */ 
            const oBusca = {
                idContato: sContato
            }

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemEnviada
             */
            const oBuscaMensagemEnviada = await dbMensagensEnviadas.find(
                oBusca,
                {
                    "conteudo": 1,
                    "dataCadastro": 1,
                    "dataEnvio": 1
                }
            )
            .sort(
                {
                    _id:-1
                }
            )
            .limit(1)

            if(Object.keys(oBuscaMensagemEnviada).length > 0){
                oBusca.dataCadastro = {
                    $gte: oBuscaMensagemEnviada[0].dataEnvio
                }
            }

            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemRecebida
             */
            const oBuscaMensagemRecebida = await dbMensagensRecebidas.find(
                oBusca,
                {
                    "conteudo": 1,
                    "dataCadastro": 1
                }
            )
            .sort(
                {
                    _id:-1
                }
            )
            .limit(1)

            if(Object.keys(oBuscaMensagemRecebida).length == 0){
                if(Object.keys(oBuscaMensagemEnviada).length > 0){
                    oBuscaMensagemEnviada[0]._doc.tipo = 'IN'

                    return oBuscaMensagemEnviada[0]._doc
                }
                
                return {}
            }

            oBuscaMensagemRecebida[0]._doc.tipo = 'OUT'

            return oBuscaMensagemRecebida[0]._doc
        } catch (error) {
            console.log(error)
        }
    }
    
    /**
     * Função para contar as mensagens nao lidas no banco de dados
     * 
     * @async
     * @function contagemMensagensNaoLidas
     * 
     * @param string sContato
     * 
     * @return object Retorna a contagem dos dados ou null
     */
    async contagemMensagensNaoLidas(sContato) {
        try {  
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            /**
             * Busca no banco de dados
             * 
             * @var int iContagem
             */
            const iContagem = await dbMensagensRecebidas.count(
                {
                    idContato: sContato,
                    statusEntregaCliente: {
                        $ne: 'READ'
                    }
                }
            )

            return iContagem
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar as mensagens no banco de dados
     * 
     * @async
     * @function listarMensagens
     * 
     * @param string sIdCliente
     * @param string sNumero
     * @param object oDados
     * 
     * @return object Retorna os dados ou null
     */
    async listarMensagens(sIdCliente, sNumero, oDados) {
        try { 
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensEnviadas
             */ 
            const dbMensagensEnviadas = await db.MensagensEnviadas()

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemEnviada
             */
            const oBuscaMensagemEnviada = await dbMensagensEnviadas.find(
                {
                    idCliente: sIdCliente,
                    numeroDestinatario: sNumero
                },
                {
                    "conteudo": 1,
                    "status": 1,
                    "dataCadastro": 1
                }
            ).sort({ dataCadastro: 1 })

            for (let oMensagemEnviada in oBuscaMensagemEnviada) {
                oBuscaMensagemEnviada[oMensagemEnviada] = oBuscaMensagemEnviada[oMensagemEnviada]._doc
                oBuscaMensagemEnviada[oMensagemEnviada].tipo = "IN"
            }

            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            /**
             * Busca no banco de dados
             * 
             * @var object oBuscaMensagemRecebida
             */
            const oBuscaMensagemRecebida = await dbMensagensRecebidas.find(
                {
                    idCliente: sIdCliente,
                    numeroRemetente: sNumero
                },
                {
                    "conteudo": 1,
                    "statusEntregaCliente": 1,
                    "dataCadastro": 1
                }
            ).sort({ dataCadastro: 1 })

            for (let oMensagemRecebida in oBuscaMensagemRecebida) {
                oBuscaMensagemRecebida[oMensagemRecebida] = oBuscaMensagemRecebida[oMensagemRecebida]._doc
                oBuscaMensagemRecebida[oMensagemRecebida].tipo = "OUT"
            }

            /**
             * Inicia a variavel das mensagens
             * 
             * @var object oMensagens
             */
            let oMensagens = []

            if(!oDados.tipoMensagem || oDados.tipoMensagem == 'ALL'){
                oMensagens = oBuscaMensagemEnviada.concat(oBuscaMensagemRecebida)
            }

            if(oDados.tipoMensagem == 'RECEIVED'){
                oMensagens = oBuscaMensagemRecebida
            }

            if(oDados.tipoMensagem == 'SENT'){
                oMensagens = oBuscaMensagemEnviada
            }

            oMensagens.sort((a, b) => {
                return new Date(b.dataCadastro) - new Date(a.dataCadastro)
            })

            if(!oDados.registrosPorPagina){
                oDados.registrosPorPagina = 20
            }

            oMensagens = oMensagens.slice(0, oDados.registrosPorPagina)

            return oMensagens
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para buscar as mensagens no banco de dados
     * 
     * @async
     * @function listarMensagens
     * 
     * @param string sIdCliente
     * @param string sNumero
     * @param object oDados
     * 
     * @return object Retorna os dados ou null
     */
    async marcarMensagensLidas(sIdCliente, sNumero) {
        try { 
            /**
             * Define o model
             * 
             * @var {mongoose} dbMensagensRecebidas
             */ 
            const dbMensagensRecebidas = await db.MensagensRecebidas()

            /**
             * Busca no banco de dados
             * 
             * @var object oMensagemRecebida
             */
            const oMensagemRecebida = await dbMensagensRecebidas.updateMany(
                {
                    idCliente: sIdCliente,
                    numeroRemetente: sNumero,
                    statusEntregaCliente: { $ne: 'READ' }
                },
                {
                    $set: {
                        statusEntregaCliente: 'READ'
                    }
                }
            )

            return oMensagemRecebida
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para atualizar o contato no banco de dados
     * 
     * @async
     * @function atualizarContato
     * 
     * @param string sIdCliente
     * @param object oDados
     * @param string sNumero
     * 
     * @return object Retorna os dados do contato ou null
     */
    async atualizarContato(sIdCliente, oDados, sNumero) {
        try { 
            /**
             * Instancia o model
             * 
             * @var {mongoose} dbContatos
             */ 
            const dbContatos = await db.Contatos()

            /**
             * Define as datas
             */
            oDados.dataAtualizacao = moment().format('YYYY-MM-DD HH:mm:ss')

            /**
             * Insere no banco de dados
             * 
             * @var object oAtualiza
             */
            const oAtualiza = await dbContatos.findOneAndUpdate(
                {
                    numero: sNumero,
                    idCliente: sIdCliente
                },
                {
                    $set: oDados
                },
                {
                    returnOriginal: false
                }
            )
  
            return oAtualiza
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir o arquivo no banco de dados
     * 
     * @async
     * @function insereArquivo
     * 
     * @param string sIdCliente
     * @param string sIdMensagem
     * @param object oArquivo
     * 
     * @return object Retorna os dados do arquivo ou null
     */
    async insereArquivo(sIdCliente, sIdMensagem, oArquivo) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbArquivos
             */ 
            const dbArquivos = await db.Arquivos()

            /**
             * Insere no banco de dados
             * 
             * @var object oInsereArquivo
             */
            const oInsereArquivo = await dbArquivos.create(
                {
                    idCliente: sIdCliente,
                    idMensagem: sIdMensagem,
                    urlArquivo: oArquivo.urlArquivo ?? '',
                    urlOriginal: oArquivo.fileUrl ?? oArquivo.url ?? '',
                    nomeArquivo: oArquivo.filename ?? oArquivo.fileName ?? '',
                    tipoArquivo: oArquivo.mime_type ?? oArquivo.fileMimeType ?? '',
                    identificacao: oArquivo.id ?? '',
                    status: 0
                }
            )

            return oInsereArquivo
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir o arquivo no banco de dados
     * 
     * @async
     * @function buscaArquivo
     * 
     * @param object oBusca
     * 
     * @return object Retorna os dados do arquivo ou null
     */
    async buscaArquivo(oBusca) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbArquivos
             */ 
            const dbArquivos = await db.Arquivos()

            /**
             * Insere no banco de dados
             * 
             * @var object oDados
             */
            const oDados = await dbArquivos.findOne(oBusca)

            return oDados
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Função para inserir o arquivo no banco de dados
     * 
     * @async
     * @function editarArquivo
     * 
     * @param object oDados
     * 
     * @return object Retorna os dados do arquivo ou null
     */
    async editarArquivo(sId, sUrl) {
        try { 
            /**
             * Instacia a tabela
             * 
             * @var {mongoose} dbArquivos
             */ 
            const dbArquivos = await db.Arquivos()

            /**
             * Atualiza no banco de dados
             * 
             * @var object oDados
             */
            const oDados = await dbArquivos.updateOne(
                {
                    _id: sId
                },
                {
                    $set: {
                        urlArquivo: sUrl
                    }
                }
            )

            return oDados
        } catch (error) {
            console.log(error)
        }
    }
}

/**
 * Arquivo do composer para montar a comunica��o entre a rota, db e outros
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
const moment = require('moment')
const db = require('../models')

/**
 * Classe WhatsappRepository
 * 
 * @package  src\infra\repositories
 */
module.exports = class WhatsappRepository {
    /**
     * Fun��o para inserir o contato no banco de dados
     * 
     * @async
     * @function insereContato
     * 
     * @param string sIdCliente
     * @param string sNumero
     * 
     * @return object Retorna os dados do contato ou null
     */
    async insereContato(sIdCliente, sNumero) {
        try { 
            /**
             * Insere no banco de dados
             * 
             * @var {mongoose} dbWhatsapp
             */ 
            const dbContatos = await db.Contatos()

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
                        numero: sNumero
                    }
                },
                { 
                    upsert: true,
                    returnNewDocument: true
                }
            )

            return oInsereContato
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Fun��o para buscar o cliente no banco de dados
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
     * Fun��o para buscar a mensagem enviada no banco de dados
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
     * Fun��o para contar mensagens
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
     * Fun��o para inserir a mensagem enviada no banco de dados
     * 
     * @async
     * @function insereMensagemEnviada
     * 
     * @param object oDadosContato
     * @param object oDadosMensagem
     * 
     * @return object Retorna os dados da mensagem enviada ou null
     */
    async insereMensagemEnviada(oDadosContato, oDadosMensagem) {
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
                    mensagem: oDadosMensagem.contents,
                    idMensagem: oDadosMensagem.id,
                    idCliente: oDadosContato.idCliente,
                    dataEnvio: moment().format()
                }
            )

            return oInsereMensagensEnviadas
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Fun��o para atualizar a mensagem no banco de dados
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
     * Fun��o para inserir a mensagem recebida no banco de dados
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
                    mensagem: oDadosMensagem.contents,
                    idMensagem: oDadosMensagem.id,
                    idCliente: oDadosContato.idCliente
                }
            )

            return oInsereMensagensRecebidas
        } catch (error) {
            console.log(error)
        }
    }
}

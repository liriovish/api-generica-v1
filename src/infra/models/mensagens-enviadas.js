/**
 * Arquivo da modelagem do banco de dados
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
const env = require('../../main/config/env')
require('dotenv').config()

/**
 * Exporta fun��o com as colunas do banco de dados
 *
 * @param {mongoose} mongoose
 * @param {DataTypes} DataTypes
 *
 * @return {mongoose}
 */
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        idContato: {
            type: mongoose.ObjectId
        },
        numeroRemetente: {
            type: String
        },
        numeroDestinatario: {
            type: String
        },
        mensagem: {
            type: Object
        },
        idMensagem: {
            type: String
        },
        idCliente: {
            type: mongoose.ObjectId
        },
        status: {
            type: String
        },
        dataEnvio: {
            type: Date
        },
        dataCadastro: {
            type: Date,
            default: Date()
        },
        dataAtualizacao: {
            type: Date,
            default: Date()
        }
    }
)

let MensagensEnviadas = null

module.exports = async () => {
    await env()
    MensagensEnviadas = mongoose.model(`${process.env.sigla_db}mensagens_enviadas`, schema)
    return MensagensEnviadas
}
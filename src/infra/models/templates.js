/**
 * Arquivo da modelagem do banco de dados
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  09/02/2023
 */

/**
 * Configurações globais
 */
const env = require('../../main/config/env')
require('dotenv').config()

/**
 * Exporta função com as colunas do banco de dados
 *
 * @param {mongoose} mongoose
 * @param {DataTypes} DataTypes
 *
 * @return {mongoose}
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    idCliente: {
        type: mongoose.ObjectId
    },
    titulo: {
        type: String
    },
    campos: {
        type: Object
    },
    identificadorTemplateZenvia: {
        type: String
    },
    identificadorTemplateMeta: {
        type: String
    },
    hashTemplateInterno: {
        type: String
    },
    texto: {
        type: String
    },
    dataCadastro: {
        type: Date
    },
    dataAtualizacao: {
        type: Date
    }
})


let Templates = null

module.exports = async () => {
    await env()
    Templates = mongoose.model(`${process.env.sigla_db}templates`, schema)
    return Templates
}
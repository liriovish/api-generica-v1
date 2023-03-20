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
 * @CriadoEm  15/03/2023
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

const schema = new mongoose.Schema({
    idCliente: {
        type: mongoose.ObjectId
    },
    idMensagem: {
        type: String
    },
    urlArquivo: {
        type: String
    },
    urlOriginal: {
        type: String
    },
    nomeArquivo: {
        type: String
    },
    tipoArquivo: {
        type: String
    },
    identificacao: {
        type: String
    },
    status: {
        type: Number
    },
    tentativasProcessamento:{
        type: Number,
        default: 0
    },
    dataCadastro: {
        type: Date,
        default: Date()
    }
})


let Arquivos = null

module.exports = async () => {
    await env()
    Arquivos = mongoose.model(`${process.env.sigla_db}arquivos`, schema)
    return Arquivos
}
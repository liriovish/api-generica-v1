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
 * @CriadoEm  20/10/2022
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
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    numero: {
        type: String
    },
    idCliente: {
        type: mongoose.ObjectId
    }
})


let Contatos = null

module.exports = async () => {
    await env()
    Contatos = mongoose.model(`${process.env.sigla_db}contatos`, schema)
    return Contatos
}
/**
 * Arquivo da modelagem do banco de dados
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcart?rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  15/03/2023
 */

/**
 * Configura��es globais
 */
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
    hash: {
        type: String
    },
    filtros: {
        type: Array
    },
    situacao: {
        type: Number
    },
    tentativasProcessamento: {
        type: Number
    },
    caminhoArquivo: {
        type: String
    },
    dataGeracao: {
        type: Date
    },
    dataExclusao: {
        type: Date
    },
    dataCadastro:{
        type: Date
    },
    dataAtualizacao: {
        type: Date
    }
})


let exportacoesMongo = null

module.exports = async () => {
    exportacoesMongo = mongoose.model('exportacoes', schema)
    return exportacoesMongo
}
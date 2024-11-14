/**
 * Arquivo de inícialização da API
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api Gen�rica
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  14/11/2024
 */

/**
 * Configurações globais
 */
const env = require('./env')
const cors = require('../middlewares/cors')
const auth = require('../middlewares/auth')
const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')
const database = require('../../infra/helpers/db-helper')
require('dotenv').config()

/**
 * Exporta os parâmetros padrões
 *
 * Por boas práticas, o x-powered-by é desativado
 *
 * @param {app} app
 */
//module.exports = async (app, env) => {
module.exports = async (app) => {
    app.disable('x-powered-by')
    app.use(cors)
    app.use(auth)
    app.use(jsonParser)
    app.use(contentType)

    /**
     * Realiza conexão com o banco de dados
     */
    await database.initDatabase();

}
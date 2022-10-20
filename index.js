/**
 * Arquivo de inicialização da API
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
const env = require('./src/main/config/env')
const app = require('./src/main/config/app')
const serverless = require('serverless-http')
require('dotenv').config()

if (process.env.APP_ENV === 'development') {
    env().then((env) => {
        app.listen(env.port, function () {
            console.log("Servidor: http://localhost:" + env.port);
        });
    })
} else {
    module.exports.handler = serverless(app)
}
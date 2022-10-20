/**
 * Arquivo de inícialização da API
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
const router = require('express').Router()
const fg = require('fast-glob')

/**
 * Localiza todos os arquivos das rotas e realiza o export
 * Seta base da URL da API.
 * Ex: http://exemplo.com/api/...
 * 
 * @param {app} app 
 */
module.exports = app => {
    fg.sync('**/src/main/routes/**routes.js').forEach(file => require(`../../../${file}`)(app))
}
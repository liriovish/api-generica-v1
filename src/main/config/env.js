/**
 * Arquivo para carregamento das variáveis de ambiente
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
//const AWSParameters = require('../../util/helpers/aws-parameters-helper')
require('dotenv').config()

/**
 * Exporta os dados recebidos das variáveis para utilização na API
 */
module.exports = async () => {
   
    return {
        // DB_USERNAME
        // DB_HOSTNAME
        // DB_PORT
        // DB_PASSWORD
        // DB_NAME
        // DATABASE
        // APP_ENV
        // DIRETORIO_ARQUIVOS
        // HOST_RABBITMQ
        // PORT_RABBITMQ
        // NOME_FILA_RABBITMQ
        // PASS_RABBITMQ
        // USER_RABBITMQ
        // ENDPOINT_AUTENTICACAO
    }
}
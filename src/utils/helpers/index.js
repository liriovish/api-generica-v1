/**
 * Classe para realizar o export das classes de helpers
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
const AxiosClient = require('./axios-client-helper')
const ZenviaClient = require('./zenvia-client-helper')
const LogAWSCloudWatch = require('./aws-cloudwatch-helper')
const AWSSNS = require('./aws-sns-helper')
const AWSParameters = require('./aws-parameters-helper')

/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = {
    AxiosClient,
    ZenviaClient,
    LogAWSCloudWatch,
    AWSSNS,
    AWSParameters
}
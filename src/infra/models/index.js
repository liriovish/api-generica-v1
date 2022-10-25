/**
 * Classe para realizar o export das classes da modelagem do banco de dados
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
const Contatos = require('./contatos')
const MensagensEnviadas = require('./mensagens-enviadas')
const MensagensRecebidas = require('./mensagens-recebidas')

/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = {
    Contatos,
    MensagensEnviadas,
    MensagensRecebidas
}
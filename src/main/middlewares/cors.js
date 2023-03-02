/**
 * Função para setar as permissões do CORS
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
 * Exporta os CORS de response realizado para o usuário
 * 
 * @param {request} req 
 * @param {response} res 
 * @param {next} next 
 */
module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('access-control-allow-methods', '*')
    res.header('access-control-allow-headers', '*')
    next()
}
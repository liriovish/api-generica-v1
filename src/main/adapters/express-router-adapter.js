/**
 * Arquivo para criação do adapter que será utilizado para o protocolo HTTP
 * O adapter é responsável pelo request e response
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
 * Classe ExpressRouterAdapter
 * @package  src\main\adapters
 */
module.exports = class ExpressRouterAdapter {
    /**
     * Função de adaptdaor do express
     * 
     * @function adapt
     * 
     * @param object router ID do arquivo
     * 
     * @return object Retorna os dados do token ou null
     */
    static adapt(rRouter) {
        return async(req, res) => {
            /**
             * Pega o IP do usuario pela requisição
             * 
             * @param string sIp
             */
            const sIp = req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        (req.connection.socket ? req.connection.socket.remoteAddress : null)
            
            /**
             * Função de adaptador do express
             * 
             * @var object oHttpResponse Realiza as operações da rota e retorna
             */
            const oHttpResponse = await rRouter.route(
               { 
                body: req.body,
                ip: sIp,
                params: req.params,
                query: req.query,
               } 
            )

            if(oHttpResponse.body && oHttpResponse.body.retorno){
                res.status(oHttpResponse.statusCode).send(oHttpResponse.body.retorno)
            }else if(oHttpResponse.body && oHttpResponse.body.download){
                res.download(oHttpResponse.body.download, oHttpResponse.body.download)
            }else{
                res.status(oHttpResponse.statusCode).json(oHttpResponse.body)
            }
        }
    }
}
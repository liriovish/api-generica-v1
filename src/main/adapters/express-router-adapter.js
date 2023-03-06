/**
 * Arquivo para criação do adapter que será utilizado para o protocolo HTTP
 * O adapter é responsável pelo request e response
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
const { LogAWSCloudWatch } = require('../../utils/helpers')

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
             * Define o token enviado na requisição
             * 
             * @param string sToken
             */
            const sToken = req.headers['authorization'] || ''

            /**
             * Define a rota da requisição
             * 
             * @param string sRota
             */
            const sRota = req.route.path

            /**
             * Define os parametros da requisição
             * 
             * @param string sRota
             */
            const sParametros = JSON.stringify(req.query)+JSON.stringify(req.body)+JSON.stringify(req.params)

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
                req.body,
                sIp,
                res.get('chaveAplicativo'),
                req.params,
                sToken,
                req.query
            )
            
            if(oHttpResponse.body && oHttpResponse.body.retorno){
                res.status(oHttpResponse.statusCode).send(oHttpResponse.body.retorno)
            }else{
                res.status(oHttpResponse.statusCode).json(oHttpResponse.body)
            }

            /**
             * Grava o log na AWS CloudWatch
             *
             * @var {bool} bLog
             */
            const bLog = await LogAWSCloudWatch.gravarLog(
                sToken.replace('Bearer ', ''), 
                sRota, 
                sParametros, 
                oHttpResponse.body, 
                sIp
            )
        }
    }
}
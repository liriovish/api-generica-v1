/**
 * Função para verificar e capturar o id do cliente por meio da autenticação recebida
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

const envFile = require('../config/env')

/**
 * Captura o token de autorização
 *
 * @param {request} req
 * @param {response} res
 * @param {next} next
 */
module.exports = async(req, res, next) => {
    try {
        /**
         * Defina a rota
         *
         * @var {string} sRota
         */
        const sRota = req.originalUrl

        if(sRota.includes('webhook')){
            /**
             * Adiciona as configurações do cliente
             */
            res.set('chaveAplicativo', 'TOKEN')
        }else{
            /**
             * Carrega variáveis
             */
            const env = await envFile();

            /**
             * Token de autorização recebido via header
             *
             * @var {string} authToken
             */
            const authToken = req.headers['authorization']
            const apiToken =  req.headers['x-api-token']

            /**
             * Inicia a chave do cliente para utilização da api rest como vazia
             *
             * @var {string} idClienteApiRest
             */
            let idClienteApiRest = ''

            /**
             * Verifica se o token não foi informado, e retorna um erro
             */
            if (!authToken && !apiToken)
                return res.status(401).json({
                    message: 'Não foi informado um token de autenticação'
                })

            if(authToken){
                /**
                 * Verifica se o token não começa com Bearer, e retorna um erro
                 */
                if (!authToken.toString().startsWith('Bearer ') && !apiToken)
                    return res.status(401).json({
                        message: 'Token de autenticação inválido'
                    })

                /**
                 * Transforma o token JWT em um array, quebrando pelo caractere ponto (.)
                 *
                 * @var {string} header
                 * @var {string} payload
                 * @var {string} signature
                 */
                const [header, payload, signature] = authToken
                    .toString()
                    .split('.')

                /**
                 * Transforma o dado em base64 para string legível
                 *
                 * @var {Object} decryptedPayload
                 */
                const decryptedPayload = JSON.parse(
                    (new Buffer.from(payload, 'base64'))
                    .toString('ascii')
                )

                /**
                 * Verifica se o object de payload não tem a chave client_id, para retornar
                 *      um erro
                 */
                if (!decryptedPayload.client_id)
                    return res.status(401).json({
                        message: 'Token de autenticação não apresenta a chave de cliente'
                    })

                idClienteApiRest = decryptedPayload.client_id
            }

            if(apiToken){
                idClienteApiRest = apiToken
            }

            /**
             * Adiciona as configurações do cliente
             */
            res.set('chaveAplicativo', idClienteApiRest)
        }

        next()
    } catch (error) {
        console.error(error)
        return res
            .status(400)
            .json({ message: 'Ocorreu um erro' })
    }
}
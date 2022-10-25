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
            res.set('chaveAplicativo', '')
            res.set('token', 'Bearer eyJraWQiOiJHZHM1a1NqVlwvVFpUblNsTU1PbW9cL1F1UEdkc05CSVZ6NUJxbjdwbDZ1Ylk9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI0bWNrNjEwdmxza2dmNHViNnQ0czNpODh0cSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGV2LWFzc2luYWRvcndlYlwvd3JpdGUucmVnaXN0cm9zLnNpbXBsZXMgZGV2LWFzc2luYWRvcndlYlwvcmVhZC5uYXR1cmV6YXMgZGV2LWFzc2luYWRvcndlYlwvcmVhZC5zaXR1YWNvZXMgZGV2LWFzc2luYWRvcndlYlwvcmVhZC5yZWdpc3Ryb3MgZGV2LWFzc2luYWRvcndlYlwvd3JpdGUucmVnaXN0cm9zLmxvdGUiLCJhdXRoX3RpbWUiOjE2NjYyOTYzMTMsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5zYS1lYXN0LTEuYW1hem9uYXdzLmNvbVwvc2EtZWFzdC0xX05jaFpCUXFsbiIsImV4cCI6MTY2NjI5OTkxMywiaWF0IjoxNjY2Mjk2MzEzLCJ2ZXJzaW9uIjoyLCJqdGkiOiI5OTIzMGRkOC0yYTBjLTQyOGYtOWQ3Yy1mODcwYzAyMDY4YWEiLCJjbGllbnRfaWQiOiI0bWNrNjEwdmxza2dmNHViNnQ0czNpODh0cSJ9.ppcC3Z021OXdXE4OZnevTBtjDS37U9UD37VLs4HLhVehdsefgaRLKpkuuEyXbK2TAQQDytWN_nXYAQbBbksSLGsV9lJTf7oLTarnpDxAIrWG3P82KBR-GalrUG2BNP-B_nheLfzemqUEFNuccT2Po7wTeI1YDrqOSV4LfgsLz3viDqZFW9PnajEDET0bn_o-SfS_z2sev6xNuBaUy-XF-lyfmstpWCK7cGmlEvsrcdX-9ATdU-FJ7z-itsku4SDUOXQ6-rnvOJtl9uF9ID89NCR4gXbwdcj1EmEm2V_hdUj6YicdxNkgoLHB0h7Udagy66XACJvAQMmpxGm2vQJhZg')
        }else{
            /**
             * Carrega variáveis
             */
            const env = await envFile()

            /**
             * Token de autorização recebido via header
             *
             * @var {string} authToken
             */
            const authToken = req.headers['authorization']

            /**
             * Verifica se o token não foi informado, e retorna um erro
             */
            if (!authToken)
                return res.status(401).json({
                    message: 'Não foi informado um token de autenticação'
                })

            /**
             * Verifica se o token não começa com Bearer, e retorna um erro
             */
            if (!authToken.toString().startsWith('Bearer '))
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

            /**
             * Captura a chave do cliente para utilização da api rest
             *
             * @var {string} idClienteApiRest
             */
            const idClienteApiRest = decryptedPayload.client_id

            /**
             * Adiciona as configurações do cliente
             */
            res.set('chaveAplicativo', idClienteApiRest)
            res.set('token', authToken)
        }
     
        next()
    } catch (error) {
        console.error(error)
        return res
            .status(400)
            .json({ message: 'Ocorreu um erro' })
    }
}
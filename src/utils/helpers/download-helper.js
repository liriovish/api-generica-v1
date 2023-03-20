/**
 * Helper para o download de arquivos
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
const HttpResponse = require('../../presentation/helpers/http-response')
const AxiosClient = require('./axios-client-helper')
const AWSS3 = require('./aws-s3-helper')
const fs = require('fs')

/**
 * Classe Download
 * 
 * @package  src\main\composers
 */
module.exports = class Download {
    /**
     * Função para buscar o arquivo
     * 
     * @async
     * @function baixarArquivo
     * 
     * @param object oDados
     * @param object oCliente
     * 
     * @return object Retorna os dados da api ou erro
     */
    static async baixarArquivo(oDados, oCliente) {
        try {
            return new Promise(async (resolve, reject) => {
                try {
                    /**
                     * Descriptografa o token
                     *
                     * @var {string} sTokenDecrypted
                     */
                    // const sTokenDecrypted = await Crypto.decrypt(oCliente.whatsapp.metaTokenIntegracao, oCliente._id) 
                    const sTokenDecrypted = oCliente.whatsapp.metaTokenIntegracao

                    /**
                     * Define o retorno
                     *
                     * @var {object} oRetorno
                     */
                    const oRetorno = {
                        download: oDados.nomeArquivo
                    }

                    /**
                     * Define o header
                     *
                     * @var {object} oHeaders
                     */
                    const oHeaders = {}

                    /**
                     * Define a URL
                     *
                     * @var {string} sUrl
                     */
                    const sUrl = oDados.urlArquivo == '' ? oDados.urlOriginal : oDados.urlArquivo

                    /**
                     * Se o arquivo for da meta, define a auth
                     */
                    if(sUrl.includes('whatsapp_business')){
                        oHeaders.Authorization = 'Bearer ' + sTokenDecrypted
                    }
                    
                    /**
                     * Busca o arquivo
                     *
                     * @var {oResponse}
                     */
                    let oResponse = await AxiosClient.get(
                        sUrl, 
                        {}, 
                        oHeaders,
                        'stream'
                    )

                    if(sUrl.includes('amazonaws.com')){
                        if(oResponse.statusCode == 403){
                            /**
                             * Salva o arquivo
                             *
                             * @var {object} sUrlArquivo
                             */
                            const sUrlArquivo = await AWSS3.buscarUrlArquivo(oCliente._id, oDados.nomeArquivo)

                            /**
                             * Busca o arquivo
                             *
                             * @var {oResponse}
                             */
                            oResponse = await AxiosClient.get(
                                sUrlArquivo, 
                                {}, 
                                oHeaders,
                                'stream'
                            )

                            oRetorno.urlArquivo = sUrlArquivo
                        }
                    }

                    /**
                     * Salva o arquivo
                     *
                     * @var {object} oWriteStream
                     */
                    const oWriteStream = await fs.createWriteStream(oDados.nomeArquivo)
                    oResponse.pipe(oWriteStream)
                
                    oWriteStream.on('error', (err) => {
                        console.error(`Erro no download do arquivo: ${err}`)
                        reject(null)
                    })
                
                    oWriteStream.on('finish', () => {
                        resolve(oRetorno)
                    })
                } catch (err) {
                    console.error(`Erro no download do arquivo: ${err}`)
                    reject(null)
                }
            })
        } catch (error) {
            console.log(error)
            /**
             * Caso gere algum erro
             * Retorna o erro
             */
            return HttpResponse.serverError()
        }
    }
}
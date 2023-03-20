/**
 * Helper para enviar arquivos para o S3
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Cartoon
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configurações globais
 */
const { PutObjectCommand, S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl, S3RequestPresigner } = require("@aws-sdk/s3-request-presigner")
require('dotenv').config()
const fs = require('fs')

/**
 * Classe AWSS3
 * 
 * @package  src\main\composers
 */
module.exports = class AWSS3 {
    /**
     * Função para enviar o arquivo para o S3
     * 
     * @async
     * @function enviarArquivo
     * 
     * @param object oArquivo
     * @param string sIdCliente
     * 
     * @return object Retorna os dados
     */
    static async enviarArquivo(oArquivo, sIdCliente) {
        try {
            /**
             * Define o arquivo
             *
             * @var {string} sArquivo
             */
            const sArquivo = fs.readFileSync(oArquivo.path)            

            /**
             * Instancia o S3
             * 
             * @var object oArquivoS3
             */
            const oArquivoS3 = new S3Client({ region: process.env.regionAws })

            /**
             * Monta o JSON para o S3 para realizar a notificação
             *
             * @var object oDadosS3
             */
            const oDadosS3 = new PutObjectCommand({
                Bucket: process.env.bucketS3,
                Key: `${sIdCliente}/${oArquivo.originalname}`,
                Body: sArquivo
            })

            /**
             * Envia uma mensagem com o S3 para realizar o processamento
             */
            await oArquivoS3.send(oDadosS3)

            /**
             * Define o caminho do arquivo
             *
             * @var string sUrlArquivo
             */
            const sUrlArquivo = await this.buscarUrlArquivo(sIdCliente, oArquivo.originalname)

            fs.unlink(oArquivo.path, (error) => {
                if (error) return reject(error)
            })

            return sUrlArquivo
        } catch (erro) {
            console.error(erro)
            return null
        }
    }

    /**
     * Função para enviar o arquivo para o S3
     * 
     * @async
     * @function buscarUrlArquivo
     * 
     * @param object oParams
     * 
     * @return object Retorna os dados
     */
    static async buscarUrlArquivo(sIdCliente, sNomeArquivo) {
        try {
            /**
             * Instancia o S3
             * 
             * @var object oArquivoS3
             */
            const oArquivoS3 = new S3Client({ region: process.env.regionAws })

            /**
             * Monta o JSON para o S3 para realizar a notificação
             *
             * @var object oDadosS3
             */
            const oBuscarDadosS3 = new GetObjectCommand({
                Bucket: process.env.bucketS3,
                Key: `${sIdCliente}/${sNomeArquivo}`
            })

            /**
             * Define o caminho do arquivo
             *
             * @var string sUrlArquivo
             */
            const sUrlArquivo = await getSignedUrl(oArquivoS3, oBuscarDadosS3, { expiresIn: 3600 })
            
            return sUrlArquivo
        } catch (erro) {
            console.error(erro)
            return null
        }
    }
}
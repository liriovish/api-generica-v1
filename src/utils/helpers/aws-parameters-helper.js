/**
 * Helper para retornar o valor do parametro na AWS
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
const AWS = require('aws-sdk'),
      {
       SSM
      } = require("@aws-sdk/client-ssm");
require('dotenv').config()

/**
 * Configurações AWS
 */
AWS.config.update({region: process.env.REGION_AWS, accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY})

/**
 * Classe AWSParameters
 * 
 * @package  src\main\composers
 */
module.exports = class AWSParameters {
    /**
     * Função para retornar o valor do parametro
     * 
     * @async
     * @function getValueParameter
     * 
     * @param string sParametro Nome do parametro
     * 
     * @return object Retorna os dados
     */
    static async getValueParameter(sNomeParametro, sValorParametro) {
        try {

            /**
             * Se o parametro for invalido ou não existir dados, retorna o mesmo
             * valor
             */
            if (typeof sValorParametro === 'undefined'
                || sValorParametro === null
            ) {
                return sValorParametro
            }

            /**
             * Se as iniciais não forem BDL_, considera o parametro sendo o valor
             */
            if (sValorParametro.substr(0, 4) !=  process.env.PREFIXO_VARIAVEIS_SSM) {
                return sValorParametro
            }

            /**
             * Inicia o SSM
             *
             * @var mix  mSsm
             */
            const mSsm = new SSM()

            /**
             * Busca os dados do parametro
             *
             * @var object oDadosParametro
             */
            const oDadosParametro = await mSsm.getParameter({
                Name: sValorParametro,
                WithDecryption: true
            })

            /**
             * Valor da variavel
             *
             * @var {String} sValor
             */
            const sValor = oDadosParametro?.Parameter?.Value ?? null

            /**
             * Altera o valor da variavel se existir
             */
            if (typeof sValor !== 'undefined'
                && sValor.length > 0
            ) {
                process.env[sNomeParametro] = sValor
            }

            /**
             * Retorna o valor
             */
            return oDadosParametro?.Parameter?.Value ?? null
        } catch (erro) {
            console.error(erro)
            return null
        }
    }
}
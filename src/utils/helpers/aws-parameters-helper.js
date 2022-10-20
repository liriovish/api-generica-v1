/**
 * Helper para retornar o valor do par�metro na AWS
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Cartoon
 * @author    Equipe Webcart�rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem
 * @CriadoEm  20/10/2022
 */

/**
 * Configura��es globais
 */
const AWS = require('aws-sdk')
require('dotenv').config()

/**
 * Configura��es AWS
 */
AWS.config.update({region: process.env.REGION_AWS, accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY})

/**
 * Classe AWSParameters
 * 
 * @package  src\main\composers
 */
module.exports = class AWSParameters {
    /**
     * Fun��o para retornar o valor do par�metro
     * 
     * @async
     * @function getValueParameter
     * 
     * @param string sParametro Nome do par�metro
     * 
     * @return object Retorna os dados
     */
    static async getValueParameter(sNomeParametro, sValorParametro) {
        try {

            /**
             * Se o par�metro for inv�lido ou n�o existir dados, retorna o mesmo
             * valor
             */
            if (typeof sValorParametro === 'undefined'
                || sValorParametro === null
            ) {
                return sValorParametro
            }

            /**
             * Se as in�ciais n�o forem BDL_, considera o par�metro sendo o valor
             */
            if (sValorParametro.substr(0, 4) !=  process.env.PREFIXO_VARIAVEIS_SSM) {
                return sValorParametro
            }

            /**
             * In�cia o SSM
             *
             * @var mix  mSsm
             */
            const mSsm = new AWS.SSM()

            /**
             * Busca os dados do par�metro
             *
             * @var object oDadosParametro
             */
            const oDadosParametro = await mSsm.getParameter({
                Name: sValorParametro,
                WithDecryption: true
            }).promise()

            /**
             * Valor da vari�vel
             *
             * @var {String} sValor
             */
            const sValor = oDadosParametro?.Parameter?.Value ?? null

            /**
             * Altera o valor da vari�vel se existir
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
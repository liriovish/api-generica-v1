/**
 * Helper para gravação dos logs no AWS CloudWatch
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Cartoon
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/visualizacao-matricula-getimagem
 * @CriadoEm  20/10/2022
 */

/**
 * Configurações globais
 */
//const env = require('../../main/config/env')
const AWS = require('aws-sdk')
require('dotenv').config()

/**
 * Configurações AWS
 */
AWS.config.update({region: process.env.REGION_AWS})

/**
 * Classe LogAWSCloudWatch
 * 
 * @package  src\main\composers
 */
module.exports = class LogAWSCloudWatch {
    /**
     * Função para gravar o log
     * 
     * @async
     * @function gravarlog
     * 
     * @param string sToken Token da requisição
     * @param string sRota Rota da requisição
     * @param string sParametros Parametros da requisição
     * @param string sRetorno Retorno da requisição
     * @param string sIp IP do usuario
     * 
     * @return object Retorna os dados da solicitação ou null
     */
    static async gravarlog(sToken, sRota, sParametros, sRetorno, sIp) {
        try {
            /**
             * Variáveis padrões Log
             *
             * @var bool bCreateLogGroup        Se o grupo de log encontra-se criado
             * @var object oDescribeLogGroups   Retorno da verificação se já existe o grupo de log
             * @var oCreateLogGroup             Retorno da criação do grupo de log
             * @var sSequenciaToken             Proximo log de sequeência
             */
            let bCreateLogGroup = false
            let oDescribeLogGroups = null
            let oCreateLogGroup = null
            let sSequenciaToken = null

            /**
             * Inícia o CloudWatch
             *
             * @var mix  mCloudWatchLogs
             */
            const mCloudWatchLogs = new AWS.CloudWatchLogs()

            /**
             * Verifica se o grupo de log existe
             *
             * @var object oDescribeLogGroups
             */
            oDescribeLogGroups = await mCloudWatchLogs.describeLogGroups({
                logGroupNamePrefix: process.env.cloudwatchGroup
            }).promise()

            /**
             * Se não existir, cria o grupo de log
             */
            if (oDescribeLogGroups.logGroups.length === 0) {
                oCreateLogGroup = await mCloudWatchLogs.createLogGroup({
                    logGroupName: process.env.cloudwatchGroup
                }).promise()

                /**
                 * Define como grupo existente
                 */
                bCreateLogGroup = true
            } else {
                /**
                 * Se já existir o grupo criado, define como grupo existente
                 */
                bCreateLogGroup = true
            }

            /**
             * Variáveis padrões Stream
             *
             * @var bool bCreateStream          Se o stream de log encontra-se criado
             * @var object oDescribeLogStreams  Retorno da verificação se já existe o stream de log
             * @var oCreateLogStreams           Retorno da criação do stream de log
             */
            let bCreateStream = false
            let oDescribeLogStreams = null
            let oCreateLogStreams = null

            /**
             * Se o grupo já existir, segue o processo para criação do Stream
             */
            if (bCreateLogGroup) {

                /**
                 * Verifica se o stream de log existe
                 *
                 * @var object oDescribeLogStreams
                 */
                oDescribeLogStreams = await mCloudWatchLogs.describeLogStreams({
                    logGroupName: process.env.cloudwatchGroup,
                    logStreamNamePrefix: process.env.cloudwatchStream,
                    limit: 1
                }).promise()

                /**
                 * Se não existir, cria o grupo de log
                 */
                if (oDescribeLogStreams.logStreams.length === 0) {
                    oCreateLogStreams = await mCloudWatchLogs.createLogStream({
                        logGroupName: process.env.cloudwatchGroup,
                        logStreamName: process.env.cloudwatchStream
                    }).promise()

                    /**
                     * Define como stream existente
                     */
                    bCreateStream = true
                } else {
                    /**
                     * Se já existir o stram criado, define como stream existente
                     */
                    bCreateStream = true
                }

                /**
                 * Define o token sequencial
                 */
                if (typeof oDescribeLogStreams.logStreams[0] !== 'undefined'
                    && typeof oDescribeLogStreams.logStreams[0].uploadSequenceToken !== 'undefined'
                    && oDescribeLogStreams.logStreams[0].uploadSequenceToken.length > 0
                ) {
                    sSequenciaToken = oDescribeLogStreams.logStreams[0].uploadSequenceToken;
                }
            }

            /**
             * Se o grupo estream de log existirem, grava o log, caso contrário, gera erro
             */
            if (bCreateLogGroup && bCreateStream) {
                /**
                 * Monta JSON do log para a gravação
                 *
                 * @var object oDadosLog
                 */
                let oDadosLog = {
                    token: sToken,
                    rota: sRota,
                    parametros: sParametros,
                    retorno: sRetorno,
                    ip_origem: sIp
                }

                /**
                 * Monta os parâmetros para o log
                 *
                 * @var object oParametrosCloudWatchLogs
                 */
                let oParametrosCloudWatchLogs = {
                    logEvents: [{message: JSON.stringify(oDadosLog), timestamp: (new Date()).getTime()}],
                    logGroupName: process.env.cloudwatchGroup,
                    logStreamName: process.env.cloudwatchStream
                }

                /**
                 * Verifica se existe o token sequência, se existir, adiciona
                 */
                if (typeof sSequenciaToken !== 'undefined') {
                    oParametrosCloudWatchLogs = {
                        ...oParametrosCloudWatchLogs,
                        sequenceToken: sSequenciaToken
                    }
                }

                /**
                 * Grava o log no CloudWatch
                 */
                const oResultadoCloudWatchLogs = await mCloudWatchLogs.putLogEvents(oParametrosCloudWatchLogs).promise()

                /**
                 * Verifica se o log foi gravado e gerou o próximo token
                 */
                if (typeof oResultadoCloudWatchLogs.nextSequenceToken === 'undefined'
                    || !oResultadoCloudWatchLogs.nextSequenceToken
                    || oResultadoCloudWatchLogs.nextSequenceToken === ''
                ) {
                    // Gera erro
                    throw 'Erro ao tentar gravar o log'
                }

                return true
            }

            // Gera erro
            throw 'Erro geral ao tentar gravar o log'
        } catch (erro) {
            console.error(erro)
            return false
        }
    }
}
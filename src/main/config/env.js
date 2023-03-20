/**
 * Arquivo para carregamento das variáveis de ambiente
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
//const AWSParameters = require('../../util/helpers/aws-parameters-helper')
require('dotenv').config()
const helper = require('../../utils/helpers')
const { AWSParameters } = helper

/**
 * Exporta os dados recebidos das variáveis para utilização na API
 */
module.exports = async () => {
    process.env.database_uri = await AWSParameters.getValueParameter(
        'DATABASE_URI',
        process.env.DATABASE_URI
    )
    process.env.port = await AWSParameters.getValueParameter(
        'API_PORT',
        process.env.API_PORT
    )
    process.env.sigla_db = await AWSParameters.getValueParameter(
        'SIGLA_DB',
        process.env.SIGLA_DB
    )
    process.env.environment = await AWSParameters.getValueParameter(
        'APP_ENV',
        process.env.APP_ENV
    )
    process.env.regionAws = await AWSParameters.getValueParameter(
        'REGION_AWS',
        process.env.REGION_AWS
    )
    process.env.cloudwatchGroup = await AWSParameters.getValueParameter(
        'CLOUDWATCH_GROUP',
        process.env.CLOUDWATCH_GROUP
    )
    process.env.cloudwatchStream = await AWSParameters.getValueParameter(
        'CLOUDWATCH_STREAM',
        process.env.CLOUDWATCH_STREAM
    )
    process.env.bucketS3 = await AWSParameters.getValueParameter(
        'BUCKET_S3',
        process.env.BUCKET_S3
    )
    process.env.topicArnNotificacaoStatus = await AWSParameters.getValueParameter(
        'TOPIC_ARN_NOTIFICACAO_STATUS',
        process.env.TOPIC_ARN_NOTIFICACAO_STATUS
    )
    process.env.topicArnNotificacao = await AWSParameters.getValueParameter(
        'TOPIC_ARN_NOTIFICACAO',
        process.env.TOPIC_ARN_NOTIFICACAO
    )
    process.env.topicArnDownload = await AWSParameters.getValueParameter(
        'TOPIC_ARN_DOWNLOAD',
        process.env.TOPIC_ARN_DOWNLOAD
    )

    return {
        database_uri: process.env.database_uri,
        port: process.env.port,
        sigla_db: process.env.sigla_db,
        environment: process.env.environment,
        regionAws: process.env.regionAws,
        cloudwatchGroup: process.env.cloudwatchGroup,
        cloudwatchStream: process.env.cloudwatchStream,
        bucketS3: process.env.bucketS3,
        topicArnNotificacaoStatus: process.env.topicArnNotificacaoStatus,
        topicArnNotificacao: process.env.topicArnNotificacao,
        topicArnDownload: process.env.topicArnDownload
    }
}
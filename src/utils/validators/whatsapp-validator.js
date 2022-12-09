/**
 * Classe para validação do cliente
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
const { CustomError, NotFoundError, InvalidRequestError, InvalidParamError } = require('../../utils/errors/')
const HttpResponse = require('../../presentation/helpers/http-response')

/**
 * Classe WhatsappValidator
 * @package  src\presentation\routers
 */
module.exports = class WhatsappValidator {
    /**
     * Construtor
     * @param {whatsappRepository}
     */
    constructor({ whatsappRepository } = {}) {
        this.whatsappRepository = whatsappRepository
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarEnviarMensagem
     *
     * @param  {object} oDados
     * @param  {object} oDadosCliente
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarEnviarMensagem(oDados, oDadosCliente) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.numeroDestinatario ||
            oDados.numeroDestinatario.length < 1
        ) {
            return HttpResponse.badRequest(
                new CustomError('Número do destinatário inválido', 4)
            )
        }

        /**
         * Valida se existe o tipo da mensagem
         */
        if (!oDados.tipo ||
            oDados.tipo.length < 1
        ) {
            // return HttpResponse.badRequest(
            //     new CustomError('Tipo não informado', 5)
            // )
        }

        /**
         * Valida se existe o template se necessario
         */
        if (oDados.template &&
            oDados.template.length < 1
        ) {
            // return HttpResponse.badRequest(
            //     new CustomError('Template não informado', 6)
            // )
        }

        /**
         * Valida se o numero do destinatario é valido
         */
        if (!/^\d+$/.test(oDados.numeroDestinatario) || oDados.numeroDestinatario.toString().length != 13) {
            return HttpResponse.badRequest(
                new CustomError('Número do destinatário inválido', 4)
            )
        }

        /**
         * Faz a contagem das mensagens enviadas
         *
         * @var int iContadorMensagens
         */
        const iContadorMensagens = await this.whatsappRepository.contarMensagens(oDadosCliente._id)

        // Verifica o limite de mensagens
        if(oDadosCliente.whatsapp.limiteMensagens > 0 && oDadosCliente.whatsapp.limiteMensagens < iContadorMensagens){
            return HttpResponse.badRequest(
                new CustomError('Limite de envio de mensagens atingido', 7)
            )
        }

        return null;
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarHistoricoMensagens
     *
     * @param  {object} oDados
     * @param  {object} oDadosCliente
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarHistoricoMensagens(oParams, oDados, oDadosCliente){
        /**
         * Validação dos dados
         */
        if (oParams.tipoMensagem != 'recebida' && oParams.tipoMensagem != 'enviada') {
            return HttpResponse.badRequest(
                new InvalidParamError('tipoMensagem')
            )
        }

        /**
         * Validação dos dados
         */
        if (oDados.pagina && oDados.pagina < 1) {
            return HttpResponse.badRequest(
                new InvalidParamError('pagina')
            )
        }

        /**
         * Faz um parse no json de filtros, caso exista no body
         * 
         * @var {object} oFiltros
         */
        let oFiltros = []
        if ('filtros' in oDados){
            oFiltros = oDados.filtros
        }

        /**
         * Realiza um parse no json de ordem, caso exista no body
         * 
         * @var {object} oOrdem
         */
        let oOrdem = []
        if ('ordem' in oDados){
            oOrdem = oDados.ordem
        }

        /**
         * Campos permitidos
         * @var {array} aCamposPermitidos
         */
        const aCamposPermitidos = ['statusMensagem', 'dataCadastro', 'numeroDestinatario', 'statusEntregaCliente']

        /**
         * Campos permitidos para operações ao realizar o filtro dos dados
         * @var {array} aCamposFiltrosOperacoesPermitidos
         */
        const aCamposFiltrosOperacoesPermitidos = [
            '=',
            '!=',
            'in',
            '&&'
        ]

        /**
         * Campos permitidos para operações ao realizar o filtro dos dados
         * @var {array} aCamposOrdemOperacoesPermitidos
         */
        const aCamposOrdemOperacoesPermitidos = [
            'asc',
            'desc',
            'ASC',
            'DESC'
        ]

        /**
         * Array com a definição da ordenação, seguindo o padrão do sequelize
         * 
         * @var {Array} aOrdemArr
         */
        const aOrdemArr = []

        /**
         * Valida se existem campos para ordenar, e se é um dos campos permitidos
         */
        if (oOrdem.campo &&
            oOrdem.ordem &&
            aCamposPermitidos.indexOf(oOrdem.campo) >= 0 &&
            aCamposOrdemOperacoesPermitidos.indexOf(oOrdem.ordem) >= 0) {
            aOrdemArr.push(oOrdem.campo)
            aOrdemArr.push(oOrdem.ordem)
        } else if (oOrdem.campo &&
            oOrdem.ordem
        ) {
            return HttpResponse.badRequest(
                new InvalidParamError(`ordem`)
            )
        }

        /**
         * Total de filtro inválido
         * serve para verificar se exibe mensagem de erro
         * ou não
         * 
         * @var {int} iFiltroInvalido
         */
        let iFiltroInvalido = 0;

        /**
         * Filtra os itens passados como o filter na requisição.
         * Permite somente os filtros que estão liberados em aCamposPermitidos
         * 
         * @var {Array} aFiltroArr
         */
        const aFiltroArr = oFiltros.filter((oFilter) => {
            /**
             * Verifica se o filtro não tem campo, operação ou valor, e ignora caso
             *     não tenha pelo menos um dos 3 itens
             */
            if (!oFilter.campo || !oFilter.operacao || !oFilter.valor) {
                iFiltroInvalido = iFiltroInvalido + 1
                return false
            }
            /**
             * Verifica se as operações recebidas no filtro são permitidas pela api.
             *     Caso não seja, ignora o filtro
             */
            if (aCamposFiltrosOperacoesPermitidos.indexOf(oFilter.operacao) < 0) {
                iFiltroInvalido = iFiltroInvalido + 1
                return false
            }
            /**
             * Verifica se o campo é um dos permitidos pelo filtro. Caso não seja,
             *     ignora o filtro
             */
            if (aCamposPermitidos.indexOf(oFilter.campo) < 0) {
                iFiltroInvalido = iFiltroInvalido + 1
                return false
            }

            return true
        })

        if (iFiltroInvalido > 0) {
            return HttpResponse.badRequest(
                new InvalidParamError(`filtros`)
            )
        }

        return null;
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarWebhookStatus
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarWebhookStatus(oDados) {
        /**
         * Valida se existe o status
         */
        if (oDados.type 
            && (oDados.type != 'MESSAGE_STATUS'
            || !oDados.messageStatus)
        ) {
            return HttpResponse.badRequest(
                new CustomError('Request inválido', 1)
            )
        }

        /**
         * Valida se existe o status
         */
        if (oDados.entry && !oDados.entry[0].changes[0].value.statuses) {
            return HttpResponse.badRequest(
                new CustomError('Request inválido', 1)
            )
        }

        return null;
    }

    /**
     * Função responsável por fazer a validação
     *
     * @function validarWebhookRecebimento
     *
     * @param  {object} oDados
     *
     * @return {object|null}  Retorna a resposta de erro ou null no caso de OK
     */
    async validarWebhookRecebimento(oDados) {
        /**
         * Valida se existe o numero do destinatario
         */
        if (!oDados.type 
            || oDados.type != 'MESSAGE'
        ) {
            return HttpResponse.badRequest(
                new CustomError('Request inválido', 1)
            )
        }

        return null;
    }
}
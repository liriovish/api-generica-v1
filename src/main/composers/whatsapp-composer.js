/**
 * Arquivo do composer para montar a comunicação entre a rota, db e outros
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
const WhatsappRouter = require('../../presentation/routers')
const WhatsappUseCase = require('../../domain/usecases/whatsapp-usecase')
const WhatsappRepository = require('../../infra/repositories/whatsapp-repository')
const WhatsappValidator = require('../../utils/validators/whatsapp-validator')
const ClienteFilter = require('../../utils/filters/cliente-filter')
const ConsultaFilter = require('../../utils/filters/consulta-filter')

/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = class WhatsappComposer {
    /**
     * Função resposável por montar a chamada das classes do whatsapp
     *
     * @returns
     */
    static enviarMensagem() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappRepository = new WhatsappRepository()

        /**
         * Chama a classe de filtro do cliente.
         *
         * @var {ClienteFilter} clienteFilter
         */
        const clienteFilter = new ClienteFilter()

        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {WhatsappValidator} whatsappValidator
         * 
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappValidator = new WhatsappValidator({
            whatsappRepository,
            clienteFilter
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {WhatsappUseCase} whatsappUseCase
         *
         * @param {WhatsappRepository} whatsappRepository
         */
        const whatsappUseCase = new WhatsappUseCase({
            whatsappRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {WhatsappUseCase} whatsappUseCase
         * @param {WhatsappValidator} whatsappValidator
         * @param {ClienteFilter} clienteFilter
         *
         * @return {object}
         */
        return new WhatsappRouter.EnviarMensagem({
            whatsappUseCase,
            whatsappValidator,
            clienteFilter
        })
    }

    /**
     * Função resposável por montar a chamada das classes do whatsapp
     *
     * @returns
     */
    static historicoMensagens() {
        /**
         * Chama a classe de filtro do cliente.
         *
         * @var {ConsultaFilter} consultaFilter
         */
        const consultaFilter = new ConsultaFilter()

        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappRepository = new WhatsappRepository({
            consultaFilter
        })

        /**
         * Chama a classe de filtro do cliente.
         *
         * @var {ClienteFilter} clienteFilter
         */
        const clienteFilter = new ClienteFilter()

        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {WhatsappValidator} whatsappValidator
         * 
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappValidator = new WhatsappValidator({
            whatsappRepository,
            clienteFilter
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {WhatsappUseCase} whatsappUseCase
         *
         * @param {WhatsappRepository} whatsappRepository
         */
        const whatsappUseCase = new WhatsappUseCase({
            whatsappRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {HistoricoMensagens}
         *
         * @param {WhatsappUseCase} whatsappUseCase
         * @param {WhatsappValidator} whatsappValidator
         * @param {ClienteFilter} clienteFilter
         *
         * @return {object}
         */
        return new WhatsappRouter.HistoricoMensagens({
            whatsappUseCase,
            whatsappValidator,
            clienteFilter
        })
    }

    /**
     * Função resposável por montar a chamada as classes do whatsapp
     *
     * @returns
     */
    static webhookStatus() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappRepository = new WhatsappRepository()

        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {WhatsappValidator} whatsappValidator
         * 
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappValidator = new WhatsappValidator({
            whatsappRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {WhatsappUseCase} whatsappUseCase
         *
         * @param {WhatsappRepository} whatsappRepository
         */
        const whatsappUseCase = new WhatsappUseCase({
            whatsappRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {WebhookStatus}
         *
         * @param {WhatsappUseCase} whatsappUseCase
         * @param {WhatsappValidator} whatsappValidator
         *
         * @return {object}
         */
        return new WhatsappRouter.WebhookStatus({
            whatsappUseCase,
            whatsappValidator
        })
    }

    /**
     * Função resposável por montar a chamada as classes do whatsapp
     *
     * @returns
     */
    static webhookRecebimento() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappRepository = new WhatsappRepository()

        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {WhatsappValidator} whatsappValidator
         * 
         * @var {WhatsappRepository} whatsappRepository
         */
        const whatsappValidator = new WhatsappValidator({
            whatsappRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {WhatsappUseCase} whatsappUseCase
         *
         * @param {WhatsappRepository} whatsappRepository
         */
        const whatsappUseCase = new WhatsappUseCase({
            whatsappRepository
        })

        /**
         * Chama a classe de filtro do cliente.
         *
         * @var {ClienteFilter} clienteFilter
         */
        const clienteFilter = new ClienteFilter()

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {WebhookRecebimento}
         *
         * @param {WhatsappUseCase} whatsappUseCase
         * @param {WhatsappValidator} whatsappValidator
         * @param {ClienteFilter} clienteFilter
         *
         * @return {object}
         */
        return new WhatsappRouter.WebhookRecebimento({
            whatsappUseCase,
            whatsappValidator,
            clienteFilter
        })
    }
}
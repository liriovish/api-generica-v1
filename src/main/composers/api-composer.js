/**
 * Arquivo do composer para montar a comunicação entre a rota, db e outros
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   Api Genérica
 * @author    Equipe Webcartórios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  14/11/2024
 */

/**
 * Configurações globais
 */
const ApiRouter = require('../../presentation/routers')
const ApiUseCase = require('../../domain/usecases/api-usecase')
const ApiRepository = require('../../infra/repositories/api-repository')
const ApiValidator = require('../../utils/validators/api-validator')
/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = class ApiComposer {
    /**
     * Função resposável por montar a chamada das classes do whatsapp
     *
     * @returns
     */
    static tabelas() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator()
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {WhatsappUseCase} whatsappUseCase
         * @param {WhatsappValidator} whatsappValidator         *
         * @return {object}
         */
        return new ApiRouter.Tabelas({
            apiUseCase,
            apiValidator,
        })
    }

    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static listagem() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.Listagem({
            apiUseCase,
            apiValidator
        })
    }

    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static exportacao() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.Exportacao({
            apiUseCase,
            apiValidator
        })
    }
    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static listarExportacoes() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.ListarExportacoes({
            apiUseCase,
            apiValidator
        })
    }
    
    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static obterExportacao() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.ObterExportacao({
            apiUseCase,
            apiValidator
        })
    }
    
    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static baixarArquivo() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.BaixarArquivo({
            apiUseCase,
            apiValidator
        })
    }
    
    /**
     * Função resposável por montar a chamada das classes
     *
     * @returns
     */
    static excluirExportacao() {
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @var {ApiRepository} apiRepository
         */
        const apiRepository = new ApiRepository()

       
        /**
         * Chama a classe do respositório que é resposável pela comunicação com
         * o banco de dados.
         *
         * @param {ApiValidator} apiValidator
         * 
         * @var {ApiRepository} apiRepository
         */
        const apiValidator = new ApiValidator({
            apiRepository
        })
        
        /**
         * Chama a classe do caso de uso que é responsável pela consulta no
         * banco de dados
         *
         * @var {ApiUseCase} apiUseCase
         *
         * @param {ApiRepository} apiRepository
         */
        const apiUseCase = new ApiUseCase({
            apiRepository
        })

        /**
         * Chama a classe da rota para montar e responder ao usuário com os
         * dados consultados no banco de dados
         *
         * @var {EnviarMensagem}
         *
         * @param {ApiUseCase} apiUseCase
         * @param {ApiValidator} apiValidator      
         *    *
         * @return {object}
         */
        return new ApiRouter.ExcluirExportacao({
            apiUseCase,
            apiValidator
        })
    }
}
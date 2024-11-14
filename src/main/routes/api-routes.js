/**
 * Função para geração das rotas
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
const { adapt } = require('../adapters/express-router-adapter')
const ApiRouteComposer = require('../composers/api-composer')


/**
 * Realiza o export das rotas dos whatsapp
 */
module.exports = router => {
    /**
     * Rota GET para listar tabelas
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.tabelas
     * @return {object}
     */
    router.get('/v1/tabelas', adapt(ApiRouteComposer.tabelas()))

    /**
     * Rota GET para listar os dados das tabelas
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.listagem
     * 
     * @return {object}
     */
    router.get('/v1/listagem', adapt(ApiRouteComposer.listagem()))
    
    /**
     * Rota POST para exportacao 
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.exportacao
     * 
     * @return {object}
     */
    router.post('/v1/exportacao', adapt(ApiRouteComposer.exportacao()))
    
    /**
     * Rota GET para listar exportacoes
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.listarExportacoes
     * 
     * @return {object}
     */
    router.get('/v1/exportacao', adapt(ApiRouteComposer.listarExportacoes()))
    
    
    /**
     * Rota GET para listar uma exportacao
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.obterExportacao
     * 
     * @return {object}
     */
    router.get('/v1/exportacao/:hashExportacao', adapt(ApiRouteComposer.obterExportacao()))
    
    /**
     * Rota GET para fazer download dos dados
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.baixarArquivo
     * 
     * @return {object}
     */
    router.get('/v1/download/:hashExportacao', adapt(ApiRouteComposer.baixarArquivo()))
    
    /**
     * Rota GET para fazer download dos dados
     * 
     * @UsaFuncao adapt
     * @UsaFuncao ApiRouteComposer.excluirExportacao
     * 
     * @return {object}
     */
    router.delete('/v1/exportacao/:hashExportacao', adapt(ApiRouteComposer.excluirExportacao()))
}
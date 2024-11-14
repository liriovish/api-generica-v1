/**
 * Classe para realizar o export das classes das rotas de retorno para o usuário
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
const Tabelas = require('./tabelas-router')
const Listagem = require('./listagem-router')
const Exportacao = require('./exportacao-router')
const ListarExportacoes = require('./listar-exportacoes-router')
const ObterExportacao = require('./obter-exportacao-router')
const BaixarArquivo = require('./baixar-arquivo-router')
const ExcluirExportacao = require('./excluir-exportacao-router')
/**
 * Realiza o export das classes de geração dos erros
 */
module.exports = {
    Tabelas,
    Listagem,
    Exportacao,
    ListarExportacoes,
    ObterExportacao,
    BaixarArquivo,
    ExcluirExportacao
}
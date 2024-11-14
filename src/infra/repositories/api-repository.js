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
const db = require('../models')
const mongoose = require('mongoose')
const sequelize = require('sequelize')
/**
 * Classe ExportacaoRepository
 * 
 * @package  src\infra\repositories
 */
module.exports = class ExportacaoRepository {
    /**
    * Função para inserir o contato no banco de dados
    * 
    * @async
    * @function listarTabelas
    * 
    * @return object Retorna tabelas com campos
    */
    async listarTabelas() {
        try {
            if (process.env.DATABASE === 'mongodb') {

                /**
                * busca tabelas e campos no mongo
                * 
                * @var array aTabelas
                */
                const aTabelas = await mongoose.connection.db.listCollections().toArray();
                
                return aTabelas;
                
            } else {
                /**
                * busca coleções e campos no mongo
                * 
                * @var array aTabelas
                */
                const aTabelas = await sequelize.query('SHOW TABLES');
                
    
                return aTabelas;
            }
        } catch (error) {
            console.error('Erro ao listar tabelas:', error);
            return false;
        }

    }


     /**
     * Função para listar colunas da tabela 
     * 
     * @async
     * @function listarColunas
     * 
     * @param string sIdCliente
     * @param string sNumero
     * 
     * @return object Retorna os dados do contato ou null
     */
    async listarColunas(sNomeTabela) {
        try {
            if (process.env.DATABASE === 'mongodb') {
                
                /**
                 * Busca os colunas da tabela pelo nome
                 * 
                 * @var array aColunas
                 */
                const aColunas = await mongoose.connection.db.collection(sNomeTabela).findOne({});
                
                return aColunas;
                
            } else {
                /**
                 * Busca na base de dados os campos da tabela
                 * 
                 * @var array aColunas
                 */
                const aColunas = await sequelize.query(`SHOW COLUMNS FROM ${sNomeTabela}`);

                return aColunas;
            }
        } catch (error) {
            console.error('Erro ao listar colunas:', error);
            return false;
        }

    }
     /**
     * Função para listar dados da tabela a partir do nome e filtros
     * 
     * @async
     * @function listarDados
     * 
     * @param object oDados
     * @param object oBusca
     * 
     * @return object Retorna os dados da tabela
     */
    async listarDados(oDados, oBusca) {
        try {
            /**
            * @var array aDados
            * @var int iTotalRegistros
            */
            let aDados = []
            let iTotalRegistros = 0

            if (process.env.DATABASE === 'mongodb') {
                /**
                * Busca tabela no mongo pelo nome 
                * @var object oTabela
                */
                const oTabela = mongoose.connection.db.oTabela(oDados.nomeTabela);

                if (!oTabela) {
                    return false;
                }

                /**
                * Busca dados da tabela com filtros 
                * @var array aDados
                */
                aDados = await oTabela.find(oBusca)
                    .limit(Number(oDados.numeroRegistros ?? 100))
                    .skip((oDados.pagina - 1) * (oDados.numeroRegistros ?? 100))
                    .toArray();


                /**
                * Calcula o total de registros
                * @var int iTotalRegistros
                */
                iTotalRegistros = await oTabela.countDocuments(oBusca);
            } else {    
                const sequelize = await db.authenticate();
                const model = sequelize.models[oDados.nomeTabela]; 
                if (!model) {
                    return false
                }
    
                // Busca os dados da tabela sem filtros
                aDados = await model.findAll();
                iTotalRegistros = aDados.length;
            }

            return {
                dados: aDados,
                totalRegistros: iTotalRegistros,
            }
        } catch (error) {
            console.error('Erro ao listar dados:', error);
            return false;
        }

    }
     /**
     * Função para exportar dados 
     * 
     * @async
     * @function exportarDados
     *
     * @param object oDados
     * 
     * @return object Retorna hash da exportacao
     */
    async salvarExportacao(oDados) {
        try {
            let oExportacao;
            if (process.env.DATABASE === 'mongodb') {
                
                /**
                 * Cria um novo registro no MongoDB
                 * 
                 * @var {object} oExportacao
                 */
                const dbExportacao = await db.ExportacaoMongo();
                
                oExportacao = await dbExportacao.create(oDados);
            } else {
                // /**
                //  * instancia banco de dados sql
                //  *  @var {object} sequelize
                //  */
                // const sequelize = getDatabase();
                // const ExportacaoSQL = defineExportacaoSQL(sequelize);
                
                // /**
                //  * Cria um novo registro no SQL
                //  * 
                //  * @var {object} oExportacao
                //  */
                // await ExportacaoSQL.create(oDados);
            } 
    
            // Retorna o hash da exporta��o para o cliente
            return { hash: oExportacao.hash };
    
        } catch (error) {
            console.error('Erro ao solicitar exportação:', error);
            return false
        }

    }
    
    /**
    * Função para listar exportacoes
    * 
    * @async
    * @function exportarDados
    */
    async listarExportacoes(oBusca) {
        try {
             /**
            * @var array aDados
            * @var int iTotalRegistros
            */
            let aDados = []
            let iTotalRegistros = 0
            
            if (process.env.DATABASE === 'mongodb') {
                /**
                * Instancia o model
                * 
                * @var {mongoose} dbExportacoes
                */ 
               const dbExportacoes = await db.ExportacaoMongo(); 
                /**
                * busca exportações
                * 
                * @var {array} aDados 
                */ 
                aDados = await dbExportacoes.find(oBusca);

                /**
                * total de registros
                * 
                * @var {int} iTotalRegistros 
                */ 
                iTotalRegistros = await dbExportacoes.countDocuments(oBusca);
            } else {

                // criar logica para sql
            }

            return {
                dados: aDados,
                totalRegistros: iTotalRegistros,
            }

        } catch (error) {
            console.error('Erro ao listar dados:', error);
            return false;
        }

    }
    /**
    * Função para listar exportações
    * 
    * @async
    * @function exportarDados
    */
    async obterExportacao(sHash) {
        try {
            if (process.env.DATABASE === 'mongodb') {
               /**
               * Instancia o model
               * 
               * @var {mongoose} dbExportacoes
               */ 
               const dbExportacoes = await db.ExportacaoMongo(); 
                /**
                * Retorna exportação pelo hash
                * 
                * @var {object} oExportacao
                */
               oExportacao = await dbExportacoes.findOne({ hash: sHash });
            } else {

                // criar regra sql
            }

            return {
                oExportacao
            }


        } catch (error) {
            console.error('Erro ao obter exportação:', error);
            return false;
        }

    }
    /**
     * Função para fazer download
     * 
     * @async
     * @function exportarDados
     */
    async buscaArquivo(sHash) {
        try {
            let oExportacao = {};
            if (process.env.DATABASE === 'mongodb') {
                /**
                 * Instancia o model
                 * 
                 * @var {mongoose} dbExportacoes
                */ 
               const dbExportacoes = await db.ExportacaoMongo(); 
                 /**
                 * Busca exportação pra baixar
                 * 
                 * @var {object} oExportacao
                */
                 oExportacao = await dbExportacoes.findOne({ hash: sHash });
            } else {
                // Busca no MySQL (usando Sequelize)
                const sequelize = getDatabase();
                const ExportacaoSQL = defineExportacaoSQL(sequelize);
                oExportacao = await ExportacaoSQL.findOne({ where: { hash: sHash } });
            }

            return oExportacao;

        }catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            return false;
        }          
    }

    /**
     * Função para excluir exportação
     * 
     * @async
     * @function exportarDados
     */
    async excluirExportacao(sHash ) {
        try {
            let oExportacao = {};

            if (process.env.DATABASE === 'mongodb') {
                /**
                 * Instancia o model
                 * 
                 * @var {mongoose} dbExportacoes
                */ 
                const dbExportacoes = await db.ExportacaoMongo(); 
                 /**
                 * Busca exportação pra baixar
                 * 
                 * @var {object} oExportacao
                */
                 oExportacao = await dbExportacoes.updateOne(
                    { 
                        hash: sHash 
                    },
                    {
                        $set: {
                            situacao: 4,
                            dataExclusao: new Date()
                        }
                    }

                );

            } else {
                const sequelize = getDatabase();
                const ExportacaoSQL = defineExportacaoSQL(sequelize);
                exportacao = await ExportacaoSQL.findOne({ where: { hash: hashExportacao } });
            }


            return oExportacao;
        } catch (error) {
            console.error('Erro ao excluir exportação', error);
            return false;
        }   

    }

    
}
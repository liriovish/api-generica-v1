/**
 * Arquivo do composer para montar a comunicaÃ§Ã£o entre a rota, db e outros
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe WebcartÃ³rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * ConfiguraÃ§Ãµes globais
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
     * FunÃ§Ã£o para inserir o contato no banco de dados
     * 
     * @async
     * @function listarTabelas
     * 
     * @return object Retorna tabelas com campos
     */
    async listarTabelas() {
        try {
            if (process.env.DATABASE === 'mongodb') {
                // Conexão com MongoDB: Listar as coleções e seus campos
                const collections = await mongoose.connection.db.listCollections().toArray();
                
                return collections;
                
            } else {
                // Conexão com MySQL: Listar tabelas e campos
                
                // const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
                //     host: process.env.DB_HOSTNAME,
                //     port: process.env.DB_PORT,
                //     dialect: process.env.DATABASE,
                // });
    
                const [aTabelas] = await sequelize.query('SHOW TABLES');
                
    
                return aTabelas;
            }
        } catch (error) {
            console.error('Erro ao listar tabelas:', error);
            return false;
        }

    }


     /**
     * FunÃ§Ã£o para listar colunas da tabela 
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
                 * Busca na base de dados os campos da tabela
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
            let aDados = []
            let iTotalRegistros = 0

            if (process.env.DATABASE === 'mongodb') {
                // Conectar ao MongoDB e acessar a coleção com o nome fornecido
                const collection = mongoose.connection.db.collection(oDados.nomeTabela);

                if (!collection) {
                    return false;
                }

                // Realiza a consulta no MongoDB com paginação
                aDados = await collection.find(oBusca)
                    .limit(Number(oDados.numeroRegistros ?? 100))
                    .skip((oDados.pagina - 1) * (oDados.numeroRegistros ?? 100))
                    .toArray();

                iTotalRegistros = await collection.countDocuments(oBusca);
            } else {    
                const sequelize = await db.authenticate();
                const model = sequelize.models[oDados.nomeTabela];  // Acessa o modelo da tabela no Sequelize
    
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
            if (process.env.SIGLA_DB === 'mongodb') {
                
                /**
                 * Cria um novo registro no MongoDB
                 * 
                 * @var {object} oExportacao
                 */
                oExportacao = new db.Exportacao(oDados);
                await oExportacao.save();
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
    
            // Retorna o hash da exportação para o cliente
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
    async listarExportacoes(oDados, oBusca) {
        try {
            let aDados = []
            let iTotalRegistros = 0
            
            if (process.env.DATABASE === 'mongodb') {
                /**
                * Instancia o model
                * 
                * @var {mongoose} dbExportacoes
                */ 
               const dbExportacoes = await db.Exportacao(); 
                /**
                * busca exportaçõoes
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
     * Função para listar exportacoes
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
               const dbExportacoes = await db.Exportacao(); 
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
     * Função para fazer dowmload
     * 
     * @async
     * @function exportarDados
     */
    async baixarArquivo(sHash) {
        try {
            if (process.env.SIGLA_DB === 'mongodb') {
                /**
                 * Instancia o model
                 * 
                 * @var {mongoose} dbExportacoes
                */ 
               const dbExportacoes = await db.Exportacao(); 
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
    async excluirExportacao(sHash, iSituacao, dDataExclusao ) {
        try {
            if (process.env.SIGLA_DB === 'mongodb') {
                /**
                 * Instancia o model
                 * 
                 * @var {mongoose} dbExportacoes
                */ 
                const dbExportacoes = await db.Exportacao(); 
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
                            situacao: iSituacao,
                            dataExclusao: dDataExclusao
                        }
                    }

                );
            } else {
                const sequelize = getDatabase();
                const ExportacaoSQL = defineExportacaoSQL(sequelize);
                exportacao = await ExportacaoSQL.findOne({ where: { hash: hashExportacao } });
            }
        }catch (error) {
            console.error('Erro ao excluir exportação', error);
            return false;
        }   

    }

    
}
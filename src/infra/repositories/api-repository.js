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
const {getDatabase} = require('../helpers/db-helper')
const { Op } = require('sequelize')
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
                 * Instancia banco de dados
                 */
                const db = getDatabase();
                /**
                * busca coleções e campos no mongo
                * 
                * @var array aTabelas
                */
                const aTabelas = await db.query('SHOW TABLES');
                
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
                 * Instancia banco de dados
                 */
                const db = getDatabase();
                /**
                 * Busca na base de dados os campos da tabela
                 * 
                 * @var array aColunas
                 */
                const aColunas = await db.query(`SHOW COLUMNS FROM ${sNomeTabela}`);

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
                 * Busca a coleção pelo nome
                 * @var object oTabela
                 */
                const oTabela = mongoose.connection.db.collection(oDados.nomeTabela);

                if (!oTabela) {
                    return false;
                }

                /**
                 * Constrói a cláusula WHERE 
                 */
                let whereClauses = {};

                if (oDados.filtros && oDados.operadores && oDados.valores) {
                   
                    const filtros = oDados.filtros.split(','); 
                    const operadores = oDados.operadores.split(',');
                    const valores = oDados.valores.split(',');

                    for (let i = 0; i < filtros.length; i++) {
                        const filtro = filtros[i]?.trim(); 
                        const operador = operadores[i]?.trim();
                        const valor = valores[i]?.trim(); 

                        if (filtro && operador && valor !== undefined) {
                            switch (operador.toLowerCase()) {
                                case '=': // Igual
                                    whereClauses[filtro] = valor;
                                    break;
                                case '!=': // Diferente de
                                    whereClauses[filtro] = { $ne: valor };
                                    break;
                                case 'in': // Valores em uma lista
                                    whereClauses[filtro] = { $in: valor.split(',').map(v => v.trim()) };
                                    break;
                                case 'notin': // Valores fora de uma lista
                                    whereClauses[filtro] = { $nin: valor.split(',').map(v => v.trim()) };
                                    break;
                                case '&&': // Entre
                                    const [min, max] = valor.split(',');
                                    whereClauses[filtro] = { $gte: min.trim(), $lte: max.trim() };
                                    break;
                                case '>': // Maior que
                                    whereClauses[filtro] = { $gt: valor };
                                    break;
                                case '<': // Menor que
                                    whereClauses[filtro] = { $lt: valor };
                                    break;
                                case '>=': // Maior ou igual a
                                    whereClauses[filtro] = { $gte: valor };
                                    break;
                                case '<=': // Menor ou igual a
                                    whereClauses[filtro] = { $lte: valor };
                                    break;
                                case 'like': // Busca parcial (similar ao LIKE)
                                    whereClauses[filtro] = { $regex: valor, $options: 'i' }; // 'i' é para case-insensitive
                                    break;
                                case 'or': // Condições alternadas
                                    const orConditions = valor.split('|').map(v => ({ [filtro]: v.trim() }));
                                    whereClauses[filtro] = { $or: orConditions };
                                    break;
                                default:
                                    throw new Error(`Operador desconhecido: ${operador}`);
                            }
                        }
                    }
                }

                /**
                 * Busca dados da coleção com filtros
                 * @var array aDados
                 */
                aDados = await oTabela.find(whereClauses) 
                    .limit(Number(oDados.numeroRegistros ?? 100))
                    .skip((oDados.pagina - 1) * (oDados.numeroRegistros ?? 100))
                    .toArray();

                /**
                 * Calcula o total de registros
                 * @var int iTotalRegistros
                 */
                iTotalRegistros = await oTabela.countDocuments(whereClauses);
            } else {   
                /**
                 * Instancia banco de dados sql
                 */
                const db = getDatabase();

                /**
                 * Constrói a cláusula WHERE 
                 */
                let whereClauses = [];
                if (oDados.filtros && oDados.operadores && oDados.valores) {
                    // Garantir que filtros, operadores e valores sejam arrays
                    const filtros = oDados.filtros.split(','); // Transformando em array
                    const operadores = oDados.operadores.split(',');
                    const valores = oDados.valores.split(',');

                    for (let i = 0; i < filtros.length; i++) {
                        const filtro = filtros[i]?.trim(); // Nome do campo
                        const operador = operadores[i]?.trim(); // Operador
                        const valor = valores[i]?.trim(); // Valor do filtro

                        if (filtro && operador && valor !== undefined) {
                            switch (operador.toLowerCase()) {
                                case '=': // Igual
                                    whereClauses.push(`\`${filtro}\` = '${valor}'`);
                                    break;
                                case '!=': // Diferente de
                                    whereClauses.push(`\`${filtro}\` != '${valor}'`);
                                    break;
                                case 'in': // Valores em uma lista
                                    whereClauses.push(`\`${filtro}\` IN (${valor.split(',').map(v => `'${v.trim()}'`).join(',')})`);
                                    break;
                                case 'notin': // Valores fora de uma lista
                                    whereClauses.push(`\`${filtro}\` NOT IN (${valor.split(',').map(v => `'${v.trim()}'`).join(',')})`);
                                    break;
                                case '&&': // Entre
                                    const [min, max] = valor.split(',');
                                    whereClauses.push(`\`${filtro}\` BETWEEN '${min.trim()}' AND '${max.trim()}'`);
                                    break;
                                case '>': // Maior que
                                    whereClauses.push(`\`${filtro}\` > '${valor}'`);
                                    break;
                                case '<': // Menor que
                                    whereClauses.push(`\`${filtro}\` < '${valor}'`);
                                    break;
                                case '>=': // Maior ou igual a
                                    whereClauses.push(`\`${filtro}\` >= '${valor}'`);
                                    break;
                                case '<=': // Menor ou igual a
                                    whereClauses.push(`\`${filtro}\` <= '${valor}'`);
                                    break;
                                case 'like': // Busca parcial
                                    whereClauses.push(`\`${filtro}\` LIKE '%${valor}%'`);
                                    break;
                                case 'or': // Condições alternadas
                                    const orConditions = valor.split('|').map(v => `\`${filtro}\` = '${v.trim()}'`).join(' OR ');
                                    whereClauses.push(`(${orConditions})`);
                                    break;
                                default:
                                    throw new Error(`Operador desconhecido: ${operador}`);
                            }
                        }
                    }
                }

                // Combina as cláusulas WHERE
                const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';


                /**
                 * Executa a query
                 */
                const query = `SELECT * FROM \`${oDados.nomeTabela}\` ${where}`;
                console.log('Query gerada:', query);

                [aDados] = await db.query(query);
                if (!aDados) {
                    return false;
                }

                /**
                 * Calcula o total de registros sem paginação
                 */
                const countQuery = `SELECT COUNT(*) AS total FROM \`${oDados.nomeTabela}\` ${where}`;
                const [countResult] = await db.query(countQuery);
                iTotalRegistros = countResult[0]?.total ?? 0;

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
     * @function salvarExportacao
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
                 /**
                 * Instancia banco de dados sql
                 */ 
                const sequelize = getDatabase();
                /**
                 * Cria um novo registro no SQL
                 * 
                 * @var {object} oExportacao
                 */
                const dbExportacao = await db.ExportacaoSql(sequelize);
                
                oExportacao = await dbExportacao.create(oDados);
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
    * @function listarExportacoes
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
               
               let whereClauses = {};

               if (oBusca.filtros && oBusca.operadores && oBusca.valores) {
                  
                   const filtros = oBusca.filtros.split(','); 
                   const operadores = oBusca.operadores.split(',');
                   const valores = oBusca.valores.split(',');

                   for (let i = 0; i < filtros.length; i++) {
                       const filtro = filtros[i]?.trim(); 
                       const operador = operadores[i]?.trim();
                       const valor = valores[i]?.trim(); 

                       if (filtro && operador && valor !== undefined) {
                           switch (operador.toLowerCase()) {
                               case '=': // Igual
                                   whereClauses[filtro] = valor;
                                   break;
                               case '!=': // Diferente de
                                   whereClauses[filtro] = { $ne: valor };
                                   break;
                               case 'in': // Valores em uma lista
                                   whereClauses[filtro] = { $in: valor.split(',').map(v => v.trim()) };
                                   break;
                               case 'notin': // Valores fora de uma lista
                                   whereClauses[filtro] = { $nin: valor.split(',').map(v => v.trim()) };
                                   break;
                               case '&&': // Entre
                                   const [min, max] = valor.split(',');
                                   whereClauses[filtro] = { $gte: min.trim(), $lte: max.trim() };
                                   break;
                               case '>': // Maior que
                                   whereClauses[filtro] = { $gt: valor };
                                   break;
                               case '<': // Menor que
                                   whereClauses[filtro] = { $lt: valor };
                                   break;
                               case '>=': // Maior ou igual a
                                   whereClauses[filtro] = { $gte: valor };
                                   break;
                               case '<=': // Menor ou igual a
                                   whereClauses[filtro] = { $lte: valor };
                                   break;
                               case 'like': // Busca parcial (similar ao LIKE)
                                   whereClauses[filtro] = { $regex: valor, $options: 'i' }; // 'i' é para case-insensitive
                                   break;
                               case 'or': // Condições alternadas
                                   const orConditions = valor.split('|').map(v => ({ [filtro]: v.trim() }));
                                   whereClauses[filtro] = { $or: orConditions };
                                   break;
                               default:
                                   throw new Error(`Operador desconhecido: ${operador}`);
                           }
                       }
                   }
               }


               /**
                * busca exportações
                * 
                * @var {array} aDados 
                */ 
                aDados = await dbExportacoes.find(whereClauses);

                /**
                * total de registros
                * 
                * @var {int} iTotalRegistros 
                */ 
                iTotalRegistros = await dbExportacoes.countDocuments(whereClauses);
            } else {

                /**
                 * Instancia banco de dados sql
                 */
                const sequelize = getDatabase();

                /**
                 * Constrói a cláusula WHERE
                 */
                let whereClauses = [];
                if (oBusca.filtros && oBusca.operadores && oBusca.valores) {
                    // Garantir que filtros, operadores e valores sejam arrays
                    const filtros = oBusca.filtros.split(','); // Transformando em array
                    const operadores = oBusca.operadores.split(',');
                    const valores = oBusca.valores.split(',');

                    for (let i = 0; i < filtros.length; i++) {
                        const filtro = filtros[i]?.trim(); // Nome do campo
                        const operador = operadores[i]?.trim(); // Operador
                        const valor = valores[i]?.trim(); // Valor do filtro

                        if (filtro && operador && valor !== undefined) {
                            switch (operador.toLowerCase()) {
                                case '=': // Igual
                                    whereClauses.push({ [filtro]: valor });
                                    break;
                                case '!=': // Diferente de
                                    whereClauses.push({ [filtro]: { [Op.ne]: valor } });
                                    break;
                                case 'in': // Valores em uma lista
                                    whereClauses.push({ [filtro]: { [Op.in]: valor.split(',').map(v => v.trim()) } });
                                    break;
                                case 'notin': // Valores fora de uma lista
                                    whereClauses.push({ [filtro]: { [Op.notIn]: valor.split(',').map(v => v.trim()) } });
                                    break;
                                case '&&': // Entre
                                    const [min, max] = valor.split(',');
                                    whereClauses.push({ [filtro]: { [Op.between]: [min.trim(), max.trim()] } });
                                    break;
                                case '>': // Maior que
                                    whereClauses.push({ [filtro]: { [Op.gt]: valor } });
                                    break;
                                case '<': // Menor que
                                    whereClauses.push({ [filtro]: { [Op.lt]: valor } });
                                    break;
                                case '>=': // Maior ou igual a
                                    whereClauses.push({ [filtro]: { [Op.gte]: valor } });
                                    break;
                                case '<=': // Menor ou igual a
                                    whereClauses.push({ [filtro]: { [Op.lte]: valor } });
                                    break;
                                case 'like': // Busca parcial
                                    whereClauses.push({ [filtro]: { [Op.like]: `%${valor}%` } });
                                    break;
                                case 'or': // Condições alternadas
                                    const orConditions = valor.split('|').map(v => ({ [filtro]: v.trim() }));
                                    whereClauses.push({ [Op.or]: orConditions });
                                    break;
                                default:
                                    throw new Error(`Operador desconhecido: ${operador}`);
                            }
                        }
                    }
                }

                // Cria a condição WHERE para o Sequelize
                const where = whereClauses.length > 0 ? { [Op.and]: whereClauses } : {};

                // Busca no banco de dados utilizando o Sequelize
                const dbExportacao = await db.ExportacaoSql(sequelize);

                // Integrar a cláusula WHERE ao oBusca para o Sequelize
                oBusca.where = where;

                // Realiza a consulta no banco de dados
                aDados = await dbExportacao.findAll(oBusca);

                /**
                 * Total de registros
                 * 
                 * @var {int} iTotalRegistros
                 */
                iTotalRegistros = aDados.length;

                
            }
            return {
                dados: aDados,
                totalRegistros: iTotalRegistros,
            };

        } catch (error) {
            console.error('Erro ao listar dados:', error);
            return false;
        }

    }
    /**
    * Função para listar exportações
    * 
    * @async
    * @function obterExportacao
    */
    async obterExportacao(sHash) {
        try {
            let oExportacao;

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
                 /**
                 * Instancia banco de dados sql
                 */ 
                 const sequelize = getDatabase();
                /**
                * Retorna exportação pelo hash
                * 
                * @var {object} oExportacao
                */
                const dbExportacao = await db.ExportacaoSql(sequelize);
                oExportacao = await dbExportacao.findOne({ hash: sHash });

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
     * @function buscaArquivo
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
                 /**
                 * Instancia banco de dados sql
                 */ 
                 const sequelize = getDatabase();
                const dbExportacoes = await db.ExportacaoSql(sequelize);
                oExportacao = await dbExportacoes.findOne({ where: { hash: sHash } });
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
     * @function excluirExportacao
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
                 /**
                 * Instancia banco de dados sql
                 */ 
                 const sequelize = getDatabase();
                 /**
                  * Cria um novo registro no SQL
                  * 
                  * @var {object} oExportacao
                  */
                 const dbExportacao = await db.ExportacaoSql(sequelize);
                 oExportacao = await dbExportacao.update(
                    {
                        situacao: 4,
                        dataExclusao: new Date()
                    },
                    {
                        where :{
                            hash: sHash
                        }
                    }
                );
            }


            return oExportacao;
        } catch (error) {
            console.error('Erro ao excluir exportação', error);
            return false;
        }   

    }

    
}
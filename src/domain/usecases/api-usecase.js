/**
 * Esse arquivo é responsável pelas validações e tratamentos antes de enviar
 * a consulta ou cadastro ao banco de dados
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
const HttpResponse = require('../../presentation/helpers/http-response')
const MensageriaHelper = require('../../utils/helpers/mensageria-helper')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

/**
 * Classe ApiUseCase
 * @package  src\domain\usecases
 */
module.exports = class ApiUseCase {
    /**
    * Construtor
    * @param {apiRepository}
    */
    constructor({ apiRepository } = {}) {
        this.apiRepository = apiRepository
        
    }
    /**
    * Função responsável pela listagem de tabelas e campos      
    */
    async tabelas() {
        try {
            /**
            * Define os dados das tabelas
            * 
            * @var object oTabelas
            */
            const oTabelas = {};

            if (process.env.DATABASE === 'mongodb') {
                /**
                * Define as coleções da tabela
                * 
                * @var array aCollections
                */
                const aCollections = await this.apiRepository.listarTabelas()
    
                for (const oCollection of aCollections) {
                    /**
                    * Busca as colunas da tabela
                    * 
                    * @var array aColunas 
                    */
                    const aColunas = await this.apiRepository.listarColunas(oCollection.name)

                    /**
                    * Define os campos da tabela
                    * 
                    * @var array aCampos 
                    */
                    const aCampos = Object.keys(aColunas || {});

                    oTabelas[oCollection.name] = aCampos;
                }    
            } else {
                /**
                * Define as tabela
                * 
                * @var array aTabelas
                */
                const [aTabelas] = await this.apiRepository.listarTabelas()    
                
                for (const oTabela of aTabelas) {
                    /**
                    * Define os dados das colunas e campos
                    * 
                    * @var string sNomeTabela
                    * @var object oColunas
                    * @var object oCampos
                    */
                    const sNomeTabela = Object.values(oTabela)[0];
                    const [oColunas] = await this.apiRepository.listarColunas(sNomeTabela)
                    const oCampos = oColunas.map(col => col.Field);

                    oTabelas[sNomeTabela] = oCampos ;
                }   
            } 
            
            return oTabelas;
        } catch (error) {
            console.error('Erro ao listar tabelas:', error);
            /**
            * Caso gere algum erro
            * Retorna o erro
            */
            return HttpResponse.badRequest( { message: 'Não foi possível buscar as tabelas.' } )
        }    
    }

    /**
    * Função responsável pela listagem de dados da tabela pelo nome
    *
    * @param {object} oDados
    *
    * @returns {object}
    */
    async listagem(oDados) {
        const { campo, tipoFiltro, valor, numeroRegistros = 100 } = oDados;
    
        try {
             /**
             * Define os dados da busca
             * 
             * @var object oBusca
             */
            let oBusca = {};
    
            if (campo && tipoFiltro && valor) {
                campo.forEach((field, index) => {
                    oBusca[field] = { [`$${tipoFiltro[index]}`]: valor[index] };
                });
            }
             /**
             * Realiza a consulta na base de dados
             * 
             * @var object oRetorno
             */
            const oRetorno = await this.apiRepository.listarDados(oDados, oBusca);
    
            if (!oRetorno) {
                return HttpResponse.badRequest('Erro ao consultar os dados');
            }
            
             /**
             * Calcula o total de páginas com base no total de registros e número de registros por página
             * 
             * @var int iTotalPaginas
             */
            const iTotalPaginas = Math.ceil(oRetorno.totalRegistros / numeroRegistros);
    
            return {
                totalRegistros: oRetorno.totalRegistros,
                iTotalPaginas,
                dados: oRetorno.dados
            };
        } catch (error) {
            console.error('Erro ao listar dados:', error);
            return HttpResponse.badRequest({ message: 'Não foi possível buscar dados.' });
        }
    }
    
     /**
     * Função responsável pela exportacao de dados da tabela
     *
     * @param {object} oDados
     *
     * @returns {object}
     */
     async exportacao(oDados) {
        try {
             /**
             * Salva os dados da exportação
             * 
             * @var {object} oExportacao
             */
            const oExportacao = await this.apiRepository.salvarExportacao({
                hash: uuidv4(),
                filtros: oDados,
                situacao: 0,
                dataCadastro: new Date(),
                dataGeracao: new Date(),
                dataExclusao: null,
                tentativasProcessamento: 0,
            });
            console.log(oExportacao);
             /**
             * Envia uma mensagem para o RabbitMQ com os dados da exporta??o solicitada
             * 
             * @var {bool} bEnvioProcessamento
             */
            const bEnvioProcessamento = await MensageriaHelper.enviarProcessamento({
                hash: oExportacao.hash,
                nomeTabela: oDados.nomeTabela,
                filtros: oDados,
                dataSolicitacao: new Date()
            });
            
            if (!bEnvioProcessamento) {
                return HttpResponse.badRequest("Erro ao gerar exportação")
            }

            return { hash: oExportacao.hash };


        } catch (error) {
            console.error(error)
            return HttpResponse.badRequest("Erro ao gerar exportação ")
        }

    }
    
    /**
    * Função responsável por listar as exportações
    *
    * @param {object} oDados
    *
    * @returns {object}
    */
     async listarExportacoes(oDados) {
            const {
                sHash,
                iSituacao,
                DdataInicialCadastro,
                DdataFinalCadastro,
                DdataInicialGeracao,
                DdataFinalGeracao,
                DdataInicialExclusao,
                DdataFinalExclusao,
                iNumeroRegistros = 100} = oDados;
            
            try {
                /**
                * Define os dados da busca
                * 
                * @var {object} oBusca
                */
                let oBusca = {};
                

                if (sHash) oBusca.sHash = sHash;
                if (iSituacao) oBusca.iSituacao = parseInt(iSituacao);
        
                if (DdataInicialCadastro || DdataFinalCadastro) {
                    oBusca.dataCadastro = {};
                    if (DdataInicialCadastro) oBusca.dataCadastro.$gte = new Date(DdataInicialCadastro);
                    if (DdataFinalCadastro) oBusca.dataCadastro.$lte = new Date(DdataFinalCadastro);
                }
                if (DdataInicialGeracao || DdataFinalGeracao) {
                    oBusca.dataGeracao = {};
                    if (DdataInicialGeracao) oBusca.dataGeracao.$gte = new Date(DdataInicialGeracao);
                    if (DdataFinalGeracao) oBusca.dataGeracao.$lte = new Date(DdataFinalGeracao);
                }
                if (DdataInicialExclusao || DdataFinalExclusao) {
                    oBusca.dataExclusao = {};
                    if (DdataInicialExclusao) oBusca.dataExclusao.$gte = new Date(DdataInicialExclusao);
                    if (DdataFinalExclusao) oBusca.dataExclusao.$lte = new Date(DdataFinalExclusao);
                }
                /**
                * Realiza a consulta na base de dados
                * 
                * @var {object} oRetorno
                */
                const oRetorno = await this.apiRepository.listarExportacoes(oDados, oBusca);

                if (!oRetorno) {
                    return HttpResponse.badRequest('Erro ao consultar exportações');
                }
                /**
                * Calcula o total de páginas com base no total de registros e número de registros por página
                * @var int iTotalPaginas
                */
                const iTotalPaginas = Math.ceil(oRetorno.totalRegistros / iNumeroRegistros);

                return {
                    totalRegistros: oRetorno.totalRegistros,
                    iTotalPaginas,
                    dados: oRetorno.dados
                };
        } catch (error) {
                console.error('Erro ao listar exportações:', error);
                return HttpResponse.badRequest({ message: 'Não foi possível buscar exportações.' });
        }
       
        
    }
    
    
     /**
     * Função responsável por obter exportação
     *
     * @param {object} oDados
     *
     * @returns {object}
     */
     async obterExportacao(oDados) {
        try {
           /**
           * Retorna exportação pelo hash
           * 
           * @var {object} oExportacao
           */
           const oExportacao = await this.apiRepository.obterExportacao(oDados.hashExportacao);
           
           return oExportacao
           
       } catch (error) {
            console.error('Erro ao listar exportações:', error);
            return HttpResponse.badRequest({ message: 'Não foi possível buscar exportações.' });
       }
    }

    /**
    * Função responsável por fazer download
    *
    * @param {object} oDados
    *
    * @returns {object}
    */
    async baixarArquivo(oDados) {
       try {
            /**
            * Busca exportação pelo hash
            * 
            * @var {object} oExportacao
            */
            let oExportacao;

            oExportacao = await this.apiRepository.buscaArquivo(oDados.hashExportacao);

            if(oExportacao) {
                /**
                * caminho do arquivo
                * 
                * @var {string} sCaminhoArquivo
                */
                const sCaminhoArquivo = oExportacao.caminhoArquivo
                
                /**
                * Verifica se o arquivo existe no diretório especificado e faz download 
                * */ 
                if (fs.existsSync(sCaminhoArquivo)) {
                    return {download:sCaminhoArquivo}
                    
                } else {
                    
                    return HttpResponse.badRequest({ message: 'Arquivo não encontrado no diretório especificado' });
                } 
            } else {
                return HttpResponse.badRequest({ message: 'Exportação não encontrada ou caminho do arquivo ausente' });
            }

       } catch (error) {
        console.error('Erro ao baixar arquivo:', error);
        return HttpResponse.badRequest({ message: 'Erro ao processar a solicitação de download' });
        }
    }
    
    /**
    * Função responsável por excluir exportação
    *
    * @param {object} oDados
    *
    * @returns {object}
    */
     async excluirExportacao(oDados) {
       try {
           /**
           * Busca exportação no banco pelo hash
           *  
           * @var {object} oDadosExportacao
           */
           const oDadosExportacao = await this.apiRepository.buscaArquivo(oDados.hashExportacao);

           /**
           * Verifica se o arquivo existe no diretório especificado e exclui 
           * */ 
           if (oDadosExportacao) {
                if (fs.existsSync(oDadosExportacao.caminhoArquivo)) {
                    fs.unlinkSync(oDadosExportacao.caminhoArquivo); 
                }
           } else {
                return HttpResponse.badRequest({ message: 'Exportação não encontrada' });
           }
            
           await this.apiRepository.excluirExportacao(oDados.hashExportacao);

           return { descricao: 'Exportação excluida com sucesso' };

       } catch (error) {
            console.error('Erro ao excluir exportação:', error);
            return HttpResponse.badRequest({ message: 'Erro ao excluir exportação' });
       }
    }

}
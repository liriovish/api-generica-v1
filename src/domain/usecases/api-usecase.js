/**
 * Esse arquivo Ã© responsÃ¡vel pelas validaÃ§Ãµes e tratamentos antes de enviar
 * a consulta ou cadastro ao banco de dados
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
const HttpResponse = require('../../presentation/helpers/http-response')
const { ServerError } = require('../../presentation/helpers/http-response')
const { CustomError } = require('../../utils/errors')
const {MensageriaHelper} = require('../../utils/helpers/mensageria-helper')
const { v4: uuidv4 } = require('uuid')

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

                    oTabelas[sNomeTabela] = { oCampos };
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
        const { nomeTabela, campo, tipoFiltro, valor, pagina = 1, numeroRegistros = 100 } = oDados;
    
        try {
            // Define os dados da busca
            let oBusca = {};
    
            // Monta o objeto de busca
            if (campo && tipoFiltro && valor) {
                campo.forEach((field, index) => {
                    oBusca[field] = { [`$${tipoFiltro[index]}`]: valor[index] };
                });
            }
    
            // Realiza a consulta na base de dados e aguarda o retorno
            const oRetorno = await this.apiRepository.listarDados(oDados, oBusca);
    
            if (!oRetorno) {
                return HttpResponse.badRequest('Erro ao consultar os dados');
            }
            
            // Calcula o total de páginas com base no total de registros e número de registros por página
            const totalPaginas = Math.ceil(oRetorno.totalRegistros / numeroRegistros);
    
            // Retorna os dados no formato esperado
            return {
                totalRegistros: oRetorno.totalRegistros,
                totalPaginas,
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
            
             /**
             * Envia uma mensagem para o RabbitMQ com os dados da exportação solicitada
             * 
             * @var {bool} bEnvioProcessamento
             */
            const bEnvioProcessamento = await MensageriaHelper.enviarProcessamento({
                hash: oExportacao.hash,
                nomeTabela: oDados.nomeTabela,
                filtros: oExportacao.filtros,
                dataSolicitacao: new Date()
            });
            
            if (!bEnvioProcessamento) {
                return HttpResponse.badRequest("Erro ao gerar exportação")
            }

            return { hash: oExportacao.hash };


        } catch (error) {
            console.error("Erro ao gerar exportação")
            return HttpResponse.badRequest("Erro ao gerar exportação")
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
            

            // if (sHash) oBusca.sHash = sHash;
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
            
            const totalPaginas = Math.ceil(oRetorno.totalRegistros / iNumeroRegistros);

            return {
                totalRegistros: oRetorno.totalRegistros,
                totalPaginas,
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
     async obterExportacao(sHash) {
        try {
            /**
           * Retorna exportação pelo hash
           * 
           * @var {object} oExportacao
            */
           const oExportacao = await this.apiRepository.obterExportacao(sHash);
                return {
                    oExportacao
                }
           
       } catch (error) {
        console.error('Erro ao listar exportações:', error);
        return HttpResponse.badRequest({ message: 'Não foi possível buscar exportações.' });
       }
    }

    /**
     * Função responsável por fazer download
    *
    * @param {string} sHash
    *
    * @returns {object}
    */
    async baixarArquivo(sHash) {
       try {
         /**
         * Salva os dados da exportação
         * 
         * @var {object} oExportacao
         */
        let oExportacao;

        oExportacao = await this.apiRepository.baixarArquivo(sHash);
        
        if(oExportacao) {
             /**
             * caminho do arquivo
             * 
             * @var {string} sCaminhoArquivo
             */
            const sCaminhoArquivo = oExportacao.caminhoArquivo
             // Verifica se o arquivo existe no diretório especificado
             console.log(sCaminhoArquivo);
             if (fs.existsSync(sCaminhoArquivo)) {
                 return res.download(sCaminhoArquivo);
                 
             } else {
                 return res.status(404).json({ error: 'Arquivo não encontrado no diretório especificado' });
             } 
        } else {
            return res.status(404).json({ error: 'Exportação não encontrada ou caminho do arquivo ausente' });
        }

       } catch (error) {
        console.error('Erro ao baixar arquivo:', error);
        return res.status(500).json({ error: 'Erro ao processar a solicitação de download' });
        }
    }
    
    /**
     * Função responsável excluir exportação
    *
    * @param {string} sHash
    *
    * @returns {object}
    */
     async excluirExportacao(sHash) {
       try {
            /**
             * soft delete da exportação
             * 
             * @var {object} oExportacao
             */
            let oExportacao;

            oExportacao = await this.apiRepository.excluirExportacao(sHash);

            if (oExportacao) {
                const filePath = path.join(process.env.DIRETORIO_ARQUIVOS, oExportacao.caminhoArquivo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); 
                }
        
                oExportacao.situacao = 4;
                oExportacao.dataExclusao = new Date();
                await oExportacao.save();
                res.json({ message: 'Exportação excluída com sucesso' });
            } else {
                res.status(404).json({ error: 'Exportação não encontrada' });
            }



       } catch (error) {
        console.error('Erro ao excluir exportação:', error);
        return res.status(500).json({ error: 'Erro ao excluir exportação' });
       }
    }

}
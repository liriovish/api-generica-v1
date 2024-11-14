/**
 * Arquivo para cria√ß√£o da conex√£o com o banco de dados
 *
 * NodeJS version 16.x
 *
 * @category  JavaScript
 * @package   WhatsApp
 * @author    Equipe Webcart√≥rios <contato@webcartorios.com.br>
 * @copyright 2022 (c) DYNAMIC SYSTEM e Vish! Internet e Sistemas Ltda. - ME
 * @license   https://github.com/dynamic-system-vish/api-whatsapp/licence.txt BSD Licence
 * @link      https://github.com/dynamic-system-vish/api-whatsapp
 * @CriadoEm  20/10/2022
 */

/**
 * Configura√ß√µes globais
 */
const  dotenv = require('dotenv');
const mongoose = require('mongoose');
const  { Sequelize } = require('sequelize');

// Carregar as vari·veis de ambiente
dotenv.config();

let dbInstance;

const initDatabase = async () => {
    if (process.env.DATABASE === 'mongodb') {
        // Conectar com MongoDB usando Mongoose
        try {
            const mongoURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log('Conex„o com MongoDB Atlas realizada com sucesso!');
            dbInstance = mongoose;
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;  // LanÁar erro para interromper a execuÁ„o
        }
    } else {
        // Conectar com MySQL usando Sequelize
        try {
            dbInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
                host: process.env.DB_HOSTNAME,
                port: process.env.DB_PORT,
                dialect: process.env.DATABASE,
                logging: false,  // Desabilita logs do Sequelize
            });

            // Testa a conex„o com o banco de dados MySQL
            await dbInstance.authenticate();
            console.log('Conex„o com MySQL realizada com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao MySQL:', error);
            throw error;  // LanÁar erro para interromper a execuÁ„o
        }
    }

    return dbInstance;
};

// FunÁ„o para obter a inst‚ncia do banco de dados
const getDatabase = () => dbInstance;
module.exports = {initDatabase, getDatabase};
// export default { initDatabase, getDatabase };


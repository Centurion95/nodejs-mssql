const sql = require('mssql')
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true /*false*/ // change to true for local dev / self-signed certs
    }
};

const options = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    // timeZone: 'America/Los_Angeles'
};

const getDate = () => {
    return new Intl.DateTimeFormat('es-ES', options).format(new Date())
}

(async function () {
    try {
        let pool = await sql.connect(sqlConfig)
        console.log(getDate(), ' >>> Iniciando el proceso')

        //en este proyecto de prueba -> truncate table borramos todos los registros...
        await pool.request().query('truncate table pais_sql') //deleteAllPaises()

        //vamos a insertar algunos registros..
        const registro1 = await pool.request()
            .input('nombre', sql.VarChar(50), 'Paraguay')
            .query('insert into pais_sql(nombre) values(@nombre)')

        const registro2 = await pool.request()
            .input('nombre', sql.VarChar(50), 'Argentina')
            .query('insert into pais_sql(nombre) values(@nombre)')

        const registro3 = await pool.request()
            .input('nombre', sql.VarChar(50), 'Brasil')
            .query('insert into pais_sql(nombre) values(@nombre)')

        //hacemos select de toda la coleccion..
        console.log('registros', await pool.request().query('select * from pais_sql')) //await getPaises())

        //para hacer select de 1 solo documento..
        const getRegistroById = await pool.request()
            .input('id', sql.Int, 1)
            .query('select * from pais_sql where id = @id')
        console.log('getRegistroById', getRegistroById.recordset[0])

        //para eliminar, por ejemplo el segundo registro:
        await pool.request()
            .input('id', sql.Int, 2)
            .query('delete from pais_sql where id = @id')
        console.log('registros', await pool.request().query('select * from pais_sql')) //await getPaises())

        //y para hacer update de un registro..
        await pool.request()
            .input('id', sql.Int, 3)
            .input('nombre', sql.VarChar(50), 'ACTUALIZADO')
            .query('update pais_sql set nombre = @nombre where id = @id')
        console.log('registros', await pool.request().query('select * from pais_sql')) //await getPaises())

        //aqui vamos a insertar algunos registros cuyo "FK" está en la primera colección..
        await pool.request()
            .input('nombre', sql.VarChar(50), 'Alto Paraguay')
            .input('id_pais', sql.Int, 1)
            .query('insert into estado_sql(nombre, id_pais) values(@nombre, @id_pais)')
        await pool.request()
            .input('nombre', sql.VarChar(50), 'Alto Paraná')
            .input('id_pais', sql.Int, 1)
            .query('insert into estado_sql(nombre, id_pais) values(@nombre, @id_pais)')
        await pool.request()
            .input('nombre', sql.VarChar(50), 'Amambay')
            .input('id_pais', sql.Int, 1)
            .query('insert into estado_sql(nombre, id_pais) values(@nombre, @id_pais)')

        await pool.request()
            .input('nombre', sql.VarChar(50), 'Mato Grosso')
            .input('id_pais', sql.Int, 3)
            .query('insert into estado_sql(nombre, id_pais) values(@nombre, @id_pais)')
        await pool.request()
            .input('nombre', sql.VarChar(50), 'Minas Gerais')
            .input('id_pais', sql.Int, 3)
            .query('insert into estado_sql(nombre, id_pais) values(@nombre, @id_pais)')

        //hacemos select de toda la coleccion..
        console.log(getDate(), ' >>> registros2', await pool.request().query('select * from estado_sql')) //await getPaises())

        //--->luego sería el mismo mecanismo para:
        //para hacer select de 1 solo documento..
        //para eliminar, por ejemplo el segundo registro:
        //y para hacer update de un registro..


        // Stored procedure
        // let result2 = await pool.request()
        //     .input('input_parameter', sql.Int, value)
        //     .output('output_parameter', sql.VarChar(50))
        //     .execute('procedure_name')
        // console.log('result2', result2)

        console.log(getDate(), ' >>> Finalizó el proceso')
    } catch (error) {
        console.error(getDate(), ' >>> catch(error)', error)
    }
})()

sql.on('error', error => {
    console.error(getDate(), ' >>> sql.on(error)', error)
})
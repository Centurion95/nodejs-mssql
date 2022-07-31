-- rc95 31/07/2022 02:53
CREATE TABLE [dbo].[pais_sql](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[pais_sql] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
-- drop table pais_sql

-- insert into pais_sql(nombre) VALUES('Paraguay');
-- insert into pais_sql(nombre) VALUES('Argentina');
-- insert into pais_sql(nombre) VALUES('Brasil');


CREATE TABLE [dbo].[estado_sql](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](50) NOT NULL,
	[id_pais] [int] NOT NULL,
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[estado_sql] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
-- drop table estado_sql


----------------------------------------------------------v
-- rc95 31/07/2022 01:51

-- DROP DATABASE [db-test];

IF NOT EXISTS (SELECT 1 FROM master.sys.databases WHERE name = 'db-test') CREATE DATABASE [db-test];

-- DROP LOGIN [login-test]; 
-- DROP LOGIN [user-test]; 

-- use [db-test]
-- DROP USER [user-test]; 

use master
CREATE LOGIN [user-test] WITH PASSWORD = 'user-test-password-123456';

use [db-test]
create user [user-test] for login [user-test]

EXEC sp_addrolemember N'db_owner', N'user-test' 

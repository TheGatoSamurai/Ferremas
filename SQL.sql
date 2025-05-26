-- -----------------------------------------------------
-- Table Roles
-- -----------------------------------------------------
CREATE TABLE Roles (
  id_rol INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  estado VARCHAR(45) NOT NULL DEFAULT 1,
  PRIMARY KEY (id_rol),
  UNIQUE NONCLUSTERED (id_rol)
);
-- -----------------------------------------------------
-- Table Usuarios
-- -----------------------------------------------------
CREATE TABLE Usuarios (
  id_usuario INT IDENTITY(1,1) NOT NULL,
  rut VARCHAR(12) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombres VARCHAR(45) NOT NULL,
  ap_paterno VARCHAR(45) NOT NULL,
  ap_materno VARCHAR(45) NULL,
  esta_suscrito BIT NOT NULL DEFAULT 0, -- Changed to BIT for boolean
  id_rol INT NOT NULL,
  estado TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_usuario),
  UNIQUE NONCLUSTERED (id_usuario),
  INDEX fk_USUARIOS_USUARIO_ROLES_idx NONCLUSTERED (id_rol),
  CONSTRAINT fk_USUARIOS_USUARIO_ROLES
    FOREIGN KEY (id_rol)
    REFERENCES Roles (id_rol)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
-- Table Ventas
-- -----------------------------------------------------
CREATE TABLE Ventas (
  ID_VENTA INT IDENTITY(1,1) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NULL, -- Changed to TIME for time values
  id_usuario INT NOT NULL,
  estado INT NOT NULL DEFAULT 1,
  PRIMARY KEY (ID_VENTA),
  UNIQUE NONCLUSTERED (ID_VENTA),
  INDEX fk_VENTAS_USUARIOS1_idx NONCLUSTERED (id_usuario),
  CONSTRAINT fk_VENTAS_USUARIOS1
    FOREIGN KEY (id_usuario)
    REFERENCES Usuarios (id_usuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
-- Table Estado_Despacho
-- -----------------------------------------------------
CREATE TABLE Estado_Despacho (
  id_estado_despacho INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_estado_despacho),
  UNIQUE NONCLUSTERED (id_estado_despacho)
);
-- -----------------------------------------------------
-- Table Despachos
-- -----------------------------------------------------
CREATE TABLE Despachos (
  id_despacho INT IDENTITY(1,1) NOT NULL,
  fecha_despacho DATE NOT NULL,
  fecha_entrega DATE NULL,
  id_venta INT NOT NULL,
  id_estado_despacho INT NOT NULL,
  PRIMARY KEY (id_despacho),
  UNIQUE NONCLUSTERED (id_despacho),
  INDEX fk_DESPACHOS_VENTAS1_idx NONCLUSTERED (id_venta),
  INDEX fk_Despachos_Estado_Despacho1_idx NONCLUSTERED (id_estado_despacho),
  CONSTRAINT fk_DESPACHOS_VENTAS1
    FOREIGN KEY (id_venta)
    REFERENCES Ventas (ID_VENTA)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_Despachos_Estado_Despacho1
    FOREIGN KEY (id_estado_despacho)
    REFERENCES Estado_Despacho (id_estado_despacho)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
-- Table Promociones
-- -----------------------------------------------------
CREATE TABLE Promociones (
  id_promocion INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  porcentaje_descuento INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_promocion),
  UNIQUE NONCLUSTERED (id_promocion)
);
-- -----------------------------------------------------
-- Table Categorias
-- -----------------------------------------------------
CREATE TABLE Categorias (
  id_categoria INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  estado TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_categoria),
  UNIQUE NONCLUSTERED (id_categoria)
);
-- -----------------------------------------------------
-- Table Marcas
-- -----------------------------------------------------
CREATE TABLE Marcas (
  id_marca INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NULL,
  estado TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_marca),
  UNIQUE NONCLUSTERED (id_marca)
);
-- -----------------------------------------------------
-- Table Productos
-- -----------------------------------------------------
CREATE TABLE Productos (
  id_producto INT IDENTITY(1,1) NOT NULL,
  codigo_producto VARCHAR(45) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  modelo VARCHAR(100) NULL,
  stock INT NOT NULL,
  imagen VARCHAR(205) NOT NULL,
  id_promocion INT NULL,
  id_marca INT NULL,
  id_categoria INT NOT NULL,
  estado INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_producto),
  UNIQUE NONCLUSTERED (id_producto),
  INDEX fk_PRODUCTOS_PROMOCIONES1_idx NONCLUSTERED (id_promocion),
  INDEX fk_PRODUCTOS_MARCAS1_idx NONCLUSTERED (id_marca),
  INDEX fk_PRODUCTOS_CATEGORIAS1_idx NONCLUSTERED (id_categoria),
  CONSTRAINT fk_PRODUCTOS_PROMOCIONES1
    FOREIGN KEY (id_promocion)
    REFERENCES Promociones (id_promocion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PRODUCTOS_MARCAS1
    FOREIGN KEY (id_marca)
    REFERENCES Marcas (id_marca)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_PRODUCTOS_CATEGORIAS1
    FOREIGN KEY (id_categoria)
    REFERENCES Categorias (id_categoria)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table Precios_Producto
-- -----------------------------------------------------
CREATE TABLE Precios_Producto (
  id_precio_producto INT IDENTITY(1,1) NOT NULL,
  id_producto INT NOT NULL,
  fecha DATETIME2 NOT NULL DEFAULT GETDATE(), -- Changed to DATETIME2 and GETDATE()
  valor DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id_precio_producto),
  UNIQUE NONCLUSTERED (id_precio_producto),
  INDEX fk_PRECIOS_PRODUCTO_PRODUCTOS1_idx NONCLUSTERED (id_producto),
  CONSTRAINT fk_PRECIOS_PRODUCTO_PRODUCTOS1
    FOREIGN KEY (id_producto)
    REFERENCES Productos (id_producto)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
-- -----------------------------------------------------
-- Table Productos_Ventas
-- -----------------------------------------------------
CREATE TABLE Productos_Ventas (
  id_producto_venta INT IDENTITY(1,1) NOT NULL,
  valor_venta INT NOT NULL,
  cantidad_venta INT NOT NULL,
  id_producto INT NOT NULL,
  id_venta INT NOT NULL,
  estado INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id_producto_venta),
  UNIQUE NONCLUSTERED (id_producto_venta),
  INDEX fk_PRODUCTOSVENTAS_PRODUCTOS1_idx NONCLUSTERED (id_producto),
  INDEX fk_PRODUCTOSVENTAS_VENTAS1_idx NONCLUSTERED (id_venta),
  CONSTRAINT fk_PRODUCTOSVENTAS_PRODUCTOS1
    FOREIGN KEY (id_producto)
    REFERENCES Productos (id_producto)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_PRODUCTOSVENTAS_VENTAS1
    FOREIGN KEY (id_venta)
    REFERENCES Ventas (ID_VENTA)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
-- Table Contactos
-- -----------------------------------------------------
CREATE TABLE Contactos (
  id_contacto INT IDENTITY(1,1) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefono VARCHAR(45) NULL,
  asunto VARCHAR(100) NOT NULL,
  mensaje NVARCHAR(MAX) NOT NULL, -- Changed to NVARCHAR(MAX) for large text
  fecha_consulta DATETIME2 NOT NULL DEFAULT GETDATE(), -- Changed to DATETIME2 and GETDATE()
  estado VARCHAR(45) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (id_contacto),
  UNIQUE NONCLUSTERED (id_contacto)
);

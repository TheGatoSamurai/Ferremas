# 🛠️ Ferremas – Evaluación Parcial 2 ASY5131

Este repositorio contiene el desarrollo del sistema web **Ferremas**, correspondiente a la **Evaluación Parcial 2** de la asignatura **ASY5131 – Integración de Plataformas**.

## 📚 Descripción del proyecto

Ferremas es una tienda de ferretería que ya contaba con un sitio web básico. En esta etapa, se implementó una **API RESTful** para permitir:

- Consulta de productos (código, nombre, marca, precio, stock).
- Consumo interno (sucursales) y externo (otras tiendas).
- Integración con Webpay para pagos en línea.
- Conversión de divisas en tiempo real vía API del Banco Central de Chile.
- Sección de contacto para clientes.

> El proyecto utiliza una arquitectura por capas y buenas prácticas de integración de sistemas.

---

## ⚙️ Tecnologías utilizadas

- Java 17
- Spring Boot
- MySQL
- API Banco Central de Chile
- Webpay (Transbank)
- Postman (pruebas y documentación)

---

## 🚀 Instrucciones para ejecución local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TheGatoSamurai/Ferremas.git
   cd Ferremas
Configurar la base de datos

Crear una base de datos MySQL llamada ferremas_db

Ajustar las credenciales en src/main/resources/application.properties:

properties
Copiar
Editar
spring.datasource.url=jdbc:mysql://localhost:3306/ferremas_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
Compilar y ejecutar

bash
Copiar
Editar
mvn spring-boot:run
El proyecto estará disponible en http://localhost:8080.

📡 Endpoints principales
🔍 Obtener todos los productos
http
Copiar
Editar
GET /api/productos
📦 Consultar producto por código
http
Copiar
Editar
GET /api/productos/{codigo}
💱 Conversión de divisa
http
Copiar
Editar
GET /api/cambio?moneda=USD
📑 Ejemplo de respuesta
json
Copiar
Editar
{
  "codigo": "FER-12345",
  "marca": "Bosch",
  "nombre": "Taladro Percutor Bosch",
  "precio": [
    {
      "fecha": "2023-05-10T03:00:00.000Z",
      "valor": 89090.99
    }
  ],
  "stock": 15
}
🧪 Pruebas con Postman
Incluye una colección de pruebas para importar en Postman:
ferremas.postman_collection.json

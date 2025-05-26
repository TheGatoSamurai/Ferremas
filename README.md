Ferremas
Este proyecto corresponde a la Evaluación Parcial 2 de la asignatura ASY5131 - Integración de Plataformas, en la cual se desarrolla la fase de construcción e integración del sistema web de "Ferremas", una tienda de ferretería.

Descripción
Se implementó una solución basada en Java utilizando una arquitectura en capas, integrando una API RESTful que permite consultar información detallada de productos (código, marca, nombre, precios, stock), diseñada para ser consumida tanto internamente por sucursales como externamente por otras tiendas.

El sistema también contempla:

Sección de contacto para clientes.

Integración de pagos mediante Webpay.

Conversión de divisas en tiempo real utilizando la API del Banco Central de Chile.

Tecnologías utilizadas
Java

Spring Boot

MySQL

Postman (para pruebas y documentación)

API Banco Central de Chile

Webpay (Transbank)

🛠️ Instrucciones para ejecutar el proyecto
Clona el repositorio

bash
Copiar
Editar
git clone https://github.com/TheGatoSamurai/Ferremas.git
cd Ferremas
Configura la base de datos

Crea una base de datos MySQL con el nombre ferremas_db.

Actualiza el archivo application.properties o application.yml con tus credenciales de conexión.

Instala las dependencias y ejecuta el proyecto
Asegúrate de tener instalado Maven y JDK 17. Luego ejecuta:

bash
Copiar
Editar
mvn spring-boot:run
Accede a la API
El proyecto se ejecuta por defecto en http://localhost:8080.

📡 Endpoints principales de la API
Obtener todos los productos
http
Copiar
Editar
GET /api/productos
Consultar producto por código
http
Copiar
Editar
GET /api/productos/{codigo}
Ejemplo de respuesta
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
Conversión de divisa (ejemplo)
http
Copiar
Editar
GET /api/cambio?moneda=USD
📄 Documentación de pruebas
El archivo de colección de pruebas de Postman (ferremas.postman_collection.json) se encuentra en el repositorio y puede ser importado para facilitar las pruebas de los endpoints.

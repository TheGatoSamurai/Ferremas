# 🛠️ Ferremas – Evaluación Parcial 2 y 3 ASY5131: Pruebas y Validación de Plataforma

Este repositorio contiene el desarrollo del sistema web **Ferremas**, enfocado ahora en la fase de **pruebas, validación y documentación**, correspondiente a la **Evaluación Parcial 3** de la asignatura **ASY5131 – Integración de Plataformas**. Se construyó sobre la base de la Evaluación Parcial 2, donde se implementaron las APIs y microservicios.

## 📚 Descripción del proyecto

Ferremas es una tienda de ferretería que está modernizando sus operaciones mediante una plataforma de comercio electrónico. En la Evaluación Parcial 2, se implementó una **API RESTful** para gestionar el catálogo de productos y diversas integraciones.

Para esta **Evaluación Parcial 3**, el enfoque principal ha sido **asegurar la calidad, funcionalidad y la correcta integración** de los componentes desarrollados. Se ha llevado a cabo un riguroso proceso de pruebas, incluyendo:

* **Pruebas unitarias:** Para validar el funcionamiento individual de cada módulo y función, incluyendo Web Services personales (JAVA y .NET).
* **Pruebas de integración:** Para verificar la comunicación fluida entre los microservicios internos y las APIs externas (Webpay, Banco Central).
* **Pruebas automatizadas:** Para garantizar el rendimiento y la robustez del sistema bajo diferentes escenarios de carga y uso.
* **Documentación exhaustiva:** Se ha elaborado un "Plan de Pruebas" detallado, que describe la estrategia, casos de prueba y resultados obtenidos.

> El proyecto utiliza una arquitectura por capas y microservicios, aplicando buenas prácticas de integración y aseguramiento de la calidad del software.

---

## ⚙️ Tecnologías utilizadas

### Desarrollo y Backend
- Java 17
- Spring Boot
- MySQL
- API Banco Central de Chile
- Webpay (Transbank)

### Pruebas y Gestión de Calidad
- **Postman:** Para pruebas de API manuales y automatizadas.
- **Apache JMeter:** Para pruebas de rendimiento y carga.
- **Testlink:** (Herramienta externa para la gestión de casos de prueba y resultados).
- **JUnit / NUnit / Jest (u otras):** Para el desarrollo de pruebas unitarias.
- Git / GitHub: Para control de versiones y colaboración del equipo.

---

## 🚀 Instrucciones para ejecución local

1.  **Clonar el repositorio**
    ```bash
    git clone [https://github.com/TheGatoSamurai/Ferremas.git](https://github.com/TheGatoSamurai/Ferremas.git)
    cd Ferremas
    ```

2.  **Configurar la base de datos**
    * Crear una base de datos MySQL llamada `ferremas_db`.
    * Ajustar las credenciales en `src/main/resources/application.properties`:
        ```properties
        spring.datasource.url=jdbc:mysql://localhost:3306/ferremas_db
        spring.datasource.username=tu_usuario
        spring.datasource.password=tu_contraseña
        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.show-sql=true
        ```

3.  **Compilar y ejecutar la aplicación**
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    El proyecto estará disponible en `http://localhost:8080`.

---

## 📡 Endpoints principales (para pruebas)

Estos son los endpoints clave que fueron desarrollados y extensivamente probados:

* **🔍 Obtener todos los productos**
    ```http
    GET /api/productos
    ```
* **📦 Consultar producto por código**
    ```http
    GET /api/productos/{codigo}
    ```
* **💱 Conversión de divisa**
    ```http
    GET /api/cambio?moneda=USD
    ```
* **💰 Simulación de pago (Webpay)**
    ```http
    POST /api/pagos
    ```
    *(Nota: Revisa la colección de Postman para el `body` de esta solicitud)*
* **🏬 Solicitud de productos desde sucursales**
    ```http
    POST /api/solicitudes
    ```
    *(Nota: Revisa la colección de Postman para el `body` de esta solicitud)*

---

## 📑 Ejemplo de respuesta (GET /api/productos/{codigo})

```json
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

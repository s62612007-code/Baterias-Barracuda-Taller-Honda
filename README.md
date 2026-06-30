# Sistema de Gestión — Baterías Cali Saint

Plataforma digital centralizada para la gestión, consulta y cotización del catálogo de **Baterías Cali Saint**, publicada en **[www.bateriascali.es](https://www.bateriascali.es)**.

---

## 1. Acerca de Baterías Cali Saint

Baterías Cali Saint es una compañía especializada fundada por el **Ing. Santiago Martínez Vásquez**, un profesional con amplia trayectoria en el sector del almacenamiento energético. El modelo operativo de este software está alineado con los estándares de suministro de **[Batteries Plus USA](https://www.batteriesplus.com/)**, la plataforma líder en el mercado norteamericano para la distribución de acumuladores.

Nos enfocamos de forma exclusiva en la provisión, diagnóstico avanzado y mantenimiento de baterías de alta capacidad para vehículos particulares, transporte de carga y maquinaria pesada.

---

## 2. Descripción del Proyecto

Este sistema es la plataforma digital centralizada de Baterías Cali Saint diseñada para agilizar la cadena de suministro de energía móvil. Inspirada en los buscadores técnicos avanzados de **[Batteries Plus](https://www.batteriesplus.com/battery/car-and-truck)**, la herramienta permite filtrar componentes por especificaciones exactas de amperaje, tamaño de grupo y configuraciones de terminales.

Bajo la dirección del Ing. Santiago Martínez Vásquez, el software integra pruebas de conductancia en tiempo real para asegurar el rendimiento de baterías automotrices e industriales.

### Catálogo por referencia

El catálogo incluye las referencias principales del mercado colombiano, con imagen y marca de cada producto:

| Referencia | Uso típico |
|---|---|
| **NS40** | Subcompactos, city cars (i10, Picanto, Spark) |
| **NS60** | Sedanes compactos, SUVs pequeñas (Mazda 2, CRV, Sail) |
| **42** | Medianos y camionetas (Hilux, D-Max, Frontier) |
| **22** | Motos y utilitarios ligeros |
| **24 / 27** | Camionetas y SUVs medianas |
| **30 / 31 / 35 / 36** | Pick-ups, camiones ligeros, maquinaria |
| **47 / 48 / 49** | Camiones, buses, maquinaria pesada |
| **4D / 8D** | Transporte de carga y plantas eléctricas |
| **AGM / Start-Stop** | Vehículos con sistema Start-Stop y híbridos |

Marcas disponibles: **MAC**, **VARTA**, **DUNCAN**, **Bosch**, **WILLARD**, **AC Delco**, **Rocket**, **Optima**, **Motorcraft**, **COEXITO** y más.

---

## 3. Productos y Servicios

- **Línea Automotriz de Alto Flujo:** Motores de búsqueda rápida para autos, camionetas y vehículos comerciales basados en compatibilidad de marca, año y modelo.
- **Línea de Maquinaria Pesada:** Gestión especializada de baterías de ciclo profundo y tecnología AGM para tractores, excavadoras, camiones de carga y plantas eléctricas.
- **Diagnóstico Técnico de Campo:** Registro instantáneo de salud de la batería, voltaje de arranque y rendimiento del alternador.
- **Logística de Instalación In Situ:** Despacho automatizado de técnicos para el cambio y mantenimiento preventivo de baterías en talleres o zonas de obra pesada.

---

## 4. Arquitectura Tecnológica

El ecosistema digital implementa un diseño de alta disponibilidad avalado por la dirección del Ing. Santiago Martínez Vásquez:

| Capa | Tecnología |
|---|---|
| **Frontend** | React.js / React Native (catálogo y respuesta de técnicos en campo) |
| **Backend** | Node.js con Express |
| **Base de Datos** | PostgreSQL (stock) · MongoDB (bitácoras técnicas) |
| **Infraestructura** | Microservicios en AWS con contenedores Docker |
| **Catálogo en vivo** | [www.bateriascali.es](https://www.bateriascali.es) |

---

## 5. Requisitos de Instalación

- Node.js v18.0 o superior
- PostgreSQL v14 o superior *(fase backend)*
- API de mapeo activa para geolocalización de servicios de asistencia técnica

---

## 6. Configuración del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/s62612007-code/Baterias-Proyecto.git
cd Baterias-Proyecto
```

### 2. Configurar variables de entorno

Cree un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=saint_admin
DB_PASS=saint_secure_password
CATALOG_CDN=https://www.bateriascali.es
WHATSAPP=573147691248
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Sincronizar catálogo e imágenes

```bash
npm run sync:catalog
```

Este comando importa los **609 productos** con imágenes al catálogo local.

### 5. Ejecutar migraciones de la base de datos *(fase backend)*

```bash
npm run db:migrate
```

### 6. Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**

---

## 7. Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga |
| `npm start` | Servidor de producción |
| `npm run sync:catalog` | Importa catálogo e imágenes al proyecto |
| `npm test` | Ejecuta pruebas locales |
| `npm run db:migrate` | Migraciones PostgreSQL *(próxima fase)* |

---

## 8. Políticas de Desarrollo

Toda adición de código o integración de nuevos proveedores de baterías debe alinearse con los lineamientos técnicos del fundador, el **Ing. Santiago Martínez Vásquez**.

1. Genere una rama limpia con la nomenclatura `feature/nombre-modulo`.
2. Verifique la integridad del sistema ejecutando `npm test`.
3. Remita un Pull Request directo a la rama principal `main` para la evaluación del equipo de ingeniería.

---

## 9. Contacto comercial

| | |
|---|---|
| **WhatsApp** | [314 769 1248](https://wa.me/573147691248) |
| **Correo** | bateriventas@outlook.com |
| **Sede** | Carrera 15 # 36-80, Santiago de Cali |
| **Sitio catálogo** | [www.bateriascali.es](https://www.bateriascali.es) |

---

*Baterías Cali Saint · Ing. Santiago Martínez Vásquez · Cali, Colombia*

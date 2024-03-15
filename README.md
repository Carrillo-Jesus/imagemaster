# Imagemaster
App de procesamiento de imagenes primera version, contiene opcion de escalas de grises y redimensionar imagenes,   utilizo sharp

## Getting Started
Para comenzar
Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para fines de desarrollo y pruebas.

### Prerrequisitos

Lo que necesitas para instalar el software y cómo instalarlo:

- Node.js
- npm

### Instalación

Una serie de ejemplos paso a paso que te indican cómo poner en funcionamiento un entorno de desarrollo:

1. Clona el repositorio
    ```
    git clone https://github.com/Carrillo-Jesus/imagemaster.git
    ```
2. Instala los paquetes NPM
    ```
    npm install
    ```
3. levanta
    ```
    npm run dev
    ```
## 4. Importante: crear una carpeta en la raiz del proyecto llamado uploads

## rutas de prueba

### Subir Imagen
reemplaza [name-imagen] por el nombre de tu imagen, recuerda ubicarte en la carpeta de la imagen antes de ejecutar el comando.

```
 curl -X POST -H "Content-Type: image/png" --data-binary @[name-image].png http://localhost:3000/uploads/[name-imagen].png
```

#### Otra opción es pegar una imagen en uploads y consultar con el nombre de la imagen.


###consultar imagenes en este ejemplo con un archivo jpg, recuerda poner el que subiste

Aquí están las diferentes rutas que puedes consultar en el navegador

Imagen normal: 

```
 http://localhost:3000/uploads/jesu.jpg
```
Escalas de grises:

```
 http://localhost:3000/uploads/bw-jesu.jpg
```

Modificando tamaño
```
 http://localhost:3000/uploads/200x_-bw-jesu.jpg
```

## Puedes consultar el archivos routes para ver las demás rutas, son 8 combinaciones en total.




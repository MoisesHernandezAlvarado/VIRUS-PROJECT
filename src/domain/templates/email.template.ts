import { envs } from "../../config/envs.plugin";

export function generateInfectionEmailTemplate(genre: string, age: number, lat: number, lng: number): string {
    const mapboxUrl = generateMapboxStaticImageURL(lat, lng)
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Informe de Caso - Actualización de Salud</title>
        <style>
            body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 620px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .header {
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 22px;
                font-weight: 700;
            }
            .content {
                padding: 20px;
                font-size: 15px;
                line-height: 1.7;
            }
            .map-container {
                text-align: center;
                padding: 20px;
            }
            .map-img {
                width: 100%;
                border-radius: 10px;
            }
            .footer {
                background-color: #eff3f8;
                color: #5a5a5a;
                padding: 12px;
                text-align: center;
                font-size: 13px;
                border-top: 1px solid #e6e6e6;
            }
            .bold {
                color: #2a2a2a;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Informe de Caso - Salud Pública</h1>
            </div>
            <div class="content">
                <p><strong class="bold">Género:</strong> ${genre}</p>
                <p><strong class="bold">Edad:</strong> ${age} años</p>
                <p><strong class="bold">Ubicación del Caso:</strong> Latitud ${lat}, Longitud ${lng}</p>
                <div class="map-container">
                    <img class="map-img" src="${mapboxUrl}" alt="Mapa de ubicación del caso"/>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

export const generateMapboxStaticImageURL = (lat: number, lng: number) => {
    const accessToken = envs.MAPBOX_ACCESS_TOKEN;
    const zoom = 13;
    const width = 800;
    const height = 500;

    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-marker+f74e4e(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}?access_token=${accessToken}`;
}

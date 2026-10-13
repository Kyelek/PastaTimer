# Roadmap — Tiempos para pasta

Estados: `Pendiente` · `En curso` · `Hecho`

| ID | Objetivo / Tarea | Estado | Notas |
|----|------------------|--------|-------|
| T-00 | Preparación del entorno y del repositorio | Hecho | Node 24.21.0 (nvm), EAS CLI 24.13.0, rama `desarrollo`, `CLAUDE.md` y `ROADMAP.md`. Sin Android Studio. |
| T-01 | Configuración inicial del proyecto (ng-native + Expo Go) | Hecho | Plantilla `@ng-native/template` 0.13.0 (Angular 22, Expo SDK 57, RN 0.86). Solo Android. Tests, typecheck y bundle Android OK. Probado en el móvil con Expo Go. Paquete: `com.kyelek.pastatimer`. |
| T-02 | Estructura de navegación y pantallas principales | En curso | Router nativo (`@ng-native/router`), Inicio con Cronómetro / Pasta, pantallas vacías. Paleta pastel (fondo trigo) en `src/app/app.ts` y `tema.ts`; modo claro forzado. Fuentes Playfair Display (títulos) + Lora (texto) en `estilos-globales.ts`. Falta probar en el móvil. |
| T-03 | Listado de pastas, selección de marca y solicitud de imágenes | Pendiente | Investigar tiempos reales por marca. Pedir imágenes al usuario. |
| T-04 | Pantalla de detalle de pasta y botones de cocción | Pendiente | Al dente / Suave / Terminar en salsa. |
| T-05 | Temporizador, notificaciones en segundo plano y pantalla de bloqueo | Pendiente | Development build con EAS. Módulo Kotlin propio: notificación persistente, pantalla completa, acciones Apagar / +3 min, sonido con el móvil en silencio. |
| T-06 | Integración de Google AdMob | Pendiente | Banner vía módulo Kotlin propio. Consentimiento RGPD (UMP). |
| T-07 | Política de privacidad en Vercel | Pendiente | Incluir AdMob y consentimiento. |
| T-08 | Compilación de release y publicación en Google Play | Pendiente | Paso a paso junto con el usuario. |

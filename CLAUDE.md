# Tiempos para pasta — Guía del proyecto

Este documento es la guía central del proyecto. Síguelo estrictamente.

## 1. Contexto
- **Nombre:** Tiempos para pasta (repo: PastaTimer)
- **Descripción:** App móvil para calcular y cronometrar el tiempo de cocción perfecto de distintos tipos de pasta (*al dente*, *suave* o *terminar en salsa*), con recomendaciones de preparación (agua, temperatura, sal).
- **Plataforma:** **solo Android**. iOS queda fuera del alcance.
- **Editor:** Visual Studio Code.

## 2. Stack tecnológico
- **Framework:** [Angular Native (ng-native)](https://ng-native.com) — Angular renderizado como vistas nativas sobre Expo / React Native. Estado: **alfa** (0.x).
  - Requisitos: Angular 22, Expo SDK 57, React Native 0.86 (New Architecture), Node ≥ 22.18 (se usa Node 24 LTS vía nvm-windows).
  - Plantilla: `npx create-expo-app@latest <app> --template @ng-native/template`
- **Desarrollo y pruebas:** Expo Go en el móvil (T-01 a T-04). A partir de T-05, **development build** compilado con **EAS Build** en la nube.
- **Código nativo:** módulos Expo propios en Kotlin (alarma/notificaciones avanzadas y banner AdMob), compilados en EAS.
- **Monetización:** Google AdMob (requiere consentimiento RGPD/UMP para usuarios de la UE).
- **Legal / web:** política de privacidad alojada en Vercel.
- **Control de versiones:** Git / GitHub (`https://github.com/Kyelek/PastaTimer`).

### Restricción: sin Android Studio
El usuario **no quiere usar Android Studio**. Todas las compilaciones nativas se hacen con **EAS Build** (nube). El APK se instala en el móvil desde el enlace/QR de EAS. El código Kotlin se edita en VS Code. No proponer flujos que requieran Android Studio ni el emulador.

## 3. Estética y diseño
- Tonos claros y colores pastel. Interfaz limpia, minimalista y visualmente agradable.

## 4. Flujo de pantallas
1. **Home:** dos opciones directas.
   - **Cronómetro:** temporizador libre.
   - **Pasta:** listado de tipos de pasta. *Al implementar el listado, pedir al usuario las imágenes de cada tipo.*
2. **Selección de marca:** tras elegir el tipo de pasta, el usuario elige la marca. **El usuario nunca decide el tiempo**: lo damos nosotros a partir de datos reales de marcas (hay que investigar y recopilar los tiempos de cada marca/tipo).
3. **Detalle de pasta:**
   - Imagen centrada arriba.
   - Instrucciones breves (agua, temperatura, sal…).
   - 3 botones centrados: **Al dente**, **Suave**, **Terminar en salsa**.
4. **Temporizador:** al pulsar un botón de cocción se abre esta pantalla y la cuenta atrás arranca sola.

## 5. Requisitos del temporizador (críticos)
- Basado en **timestamps** + notificaciones locales (`expo-notifications`): la cuenta atrás no se detiene si se cierra la app o se apaga la pantalla.
- **Notificación persistente** con el tiempo restante.
- Al llegar a cero: alarma **a pantalla completa / pantalla de bloqueo** con dos acciones:
  1. **Apagar alarma:** cierra el aviso y detiene el sonido.
  2. **Añadir 3 minutos más:** extiende el temporizador automáticamente.
- **Sonido imprescindible**, incluso con el móvil en silencio (canal de alarma de Android).

## 6. Flujo de trabajo con Git
- `main`: producción.
- `desarrollo`: rama base del día a día.
- Por cada tarea:
  1. Crear una rama temporal desde `desarrollo` (p. ej. `tarea/T-02-navegacion`).
  2. Al terminar, fusionar en `desarrollo`.
  3. **Obligatorio:** preguntar al usuario si quiere subir los cambios a `main`.

## 7. Reglas de operación para Claude
- Consultar `ROADMAP.md` al iniciar cada tarea y actualizarlo al terminarla (marcar el estado explícitamente).
- **Preguntar siempre** antes de pasar cambios de `desarrollo` a `main`.
- Pedir las imágenes de las pastas al implementar el listado.
- Si se ve una mejora, **preguntar antes de implementarla**.
- Ir paso a paso; la publicación en Google Play se hace junto con el usuario.

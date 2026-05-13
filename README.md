# Multimedia Tycoon 🎬

Prototipo educativo de **React Native + Expo (JavaScript)** que simula dirigir un estudio multimedia. Los jugadores aceptan contratos de clientes ficticios y completan **minijuegos cortos** ligados a roles reales de la ingeniería multimedia (UI/UX, audio, frontend).

> Objetivo pedagógico: relacionar **roles profesionales** con **actividades prácticas** en un entorno colorido y ligero, apto para portfolio y aulas.

---

## Tabla de contenidos

1. [Requisitos](#requisitos)
2. [Instalación y ejecución](#instalación-y-ejecución)
3. [Qué enseña cada pantalla](#qué-enseña-cada-pantalla)
4. [Minijuegos y roles](#minijuegos-y-roles)
5. [Arquitectura del proyecto](#arquitectura-del-proyecto)
6. [Datos mock (JSON)](#datos-mock-json)
7. [Audio (expo-av)](#audio-expo-av)
8. [Navegación](#navegación)
9. [Animaciones](#animaciones)
10. [Créditos y extensiones](#créditos-y-extensiones)

---

## Requisitos

- **Node.js** LTS recomendado
- **npm** (incluido con Node)
- **Expo CLI** vía `npx` (no hace falta instalación global)
- Para dispositivo físico: app **Expo Go** (iOS/Android)

---

## Instalación y ejecución

```bash
cd multimedia-engineer
npm install
npx expo start
```

Luego elige:

- `i` — simulador iOS (macOS + Xcode)
- `a` — emulador Android
- Escanea el QR con **Expo Go** en tu teléfono

---

## Qué enseña cada pantalla

| Pantalla | Propósito educativo |
|----------|---------------------|
| **Splash** | Identidad visual y tiempo para precarga psicológica + ocultar splash nativo de Expo |
| **Home** | Hub principal: economía del juego (monedas, XP), mascota animada, acceso a flujo y teoría |
| **Selección de proyectos** | Lee **diálogos de clientes** y el tipo de producto multimedia (juego, streaming, etc.) |
| **Minijuego** | Practica un rol concreto según el contrato elegido |
| **Resultados** | Traduce desempeño en **estrellas**, **monedas**, **XP** y menciona logros tipo achievement |
| **Roles** | Tarjetas con herramientas reales, dificultad y “dato divertido” por rol |
| **Ajustes** | Preferencia de música — ejemplo de **estado global** que afecta `AudioManager` |

---

## Minijuegos y roles

### 1. UI Fixer — UI/UX Designer

- **Mecánica:** ante problemas típicos (texto ilegible, colores, botones pegados…), el jugador elige la mejor práctica.
- **Aprendizaje:** jerarquía visual, contraste, targets táctiles, feedback de interfaz.

### 2. Audio Match — Audio Designer

- **Mecánica:** escucha clips WAV locales y los asocia a etiquetas (explosión, clic, ambiente, victoria).
- **Aprendizaje:** vocabulario de **SFX vs música**, atención auditiva como en sesiones de mezcla.

### 3. Bug Smasher — Frontend Developer

- **Mecánica:** “bugs” humorísticos aparecen en un área tipo IDE; hay que tocarlos antes de que acabe el tiempo.
- **Aprendizaje:** lectura rápida de errores y priorización (similar a depurar bajo presión).

---

## Arquitectura del proyecto

Se prioriza **legibilidad** sobre frameworks extra:

```
src/
  App.js                 # Proveedores + navegación raíz
  assets/sounds/         # WAV generados localmente (efectos + música en bucle)
  audio/                 # AudioManager, mapa soundAssets
  components/            # UI reutilizable cartoon (botones, tarjetas, barra XP…)
  screens/               # Una carpeta por pantalla de la especificación
  navigation/            # Stack Navigator + constantes de rutas
  data/                  # JSON mock + helpers getProjectById / getMinigameById
  hooks/                 # Estado global del juego + preferencias de audio
  styles/                # Tema (colores, spacing) para consistencia visual
  utils/                 # Cálculos puros de estrellas / recompensas
  games/                 # Implementación de cada minijuego (desacoplada de navegación)
  animations/            # Presets para react-native-animatable
App.js                   # Punto de entrada que Expo resuelve por defecto
```

**Capas:**

1. **Datos:** JSON estático (`require`) — sin backend.
2. **Dominio ligero:** funciones en `utils/gameHelpers.js`.
3. **Presentación:** componentes y pantallas.
4. **Efectos:** `audio/AudioManager.js` encapsula `expo-av`.

---

## Datos mock (JSON)

| Archivo | Contenido |
|---------|-----------|
| `projects.json` | Clientes, tipo de producto, `minigameId`, recompensas |
| `roles.json` | Siete roles con herramientas y dificultad |
| `minigames.json` | Metadatos para headers de pantalla |
| `sounds.json` | Documentación humana del catálogo de audio |
| `achievements.json` | Logros falsos para gamificación |
| `uiFixerScenarios.json` | Banco de preguntas UI Fixer |

Los loaders viven en `src/data/index.js`.

---

## Audio (expo-av)

- **Configuración:** `Audio.setAudioModeAsync` en `initAudioMode()` para reproducir en silencio iOS si se desea ampliar.
- **Efectos:** `Audio.Sound` en caché (`soundCache`) para latencia baja.
- **Música:** un único loop (`bg_music.wav`) controlado por `startBackgroundMusic` / `stopBackgroundMusic`.
- **Mapa de archivos:** `src/audio/soundAssets.js` — cualquier nuevo clip debe registrarse ahí y en `sounds.json` para documentación.

Los WAV del repo fueron generados con un script corto de Python (tonos y ruido) para mantener el proyecto **autocontenido** sin dependencias de red.

---

## Navegación

- **React Navigation 7** — `createNativeStackNavigator`
- Flujo lineal: Splash → Home → (Proyectos | Roles | Ajustes) → Minijuego → Resultados
- Transiciones nativas (`slide_from_right`)

Archivos clave: `src/navigation/RootNavigator.js`, `navigationConfig.js`.

---

## Animaciones

- **react-native-animatable:** mascota, botones, tarjetas (entrada bounce/fade).
- **react-native-reanimated:** barra XP (`XPBar`) con resorte.

---

## Créditos y extensiones

Ideas para ampliar el curso:

- Persistencia con **AsyncStorage** (monedas/XP)
- **Lottie** para la mascota
- Tabla de clasificación local
- Más minijuegos (Motion: timeline ficticio; Video: sincronía beat)

---

Licencia del código: uso educativo del autor del curso / portfolio salvo que el repositorio indique otra cosa.

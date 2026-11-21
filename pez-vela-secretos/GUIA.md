# Secretos del Azul: cómo hacer y publicar estos videos

Este video piloto es **"Secretos del Azul #1: el pez vela"**. Está en formato vertical 9:16 y dura unos 58 segundos. Todo está hecho con código: la animación, los subtítulos que se resaltan palabra por palabra y la música.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `score.js` | El **guion y los tiempos**: los textos, cuándo aparece cada palabra, los cambios de escena y la música. Para un video nuevo, normalmente solo cambias esto. |
| `film.js` | Los **dibujos**: el pez vela, las sardinas, el velocímetro y el logo final. |
| `song.js` | La **música** (lo-fi tranquilo) y los efectos de sonido. |
| `out/` | Lo que se genera al renderizar (no se sube a git). |

## Cómo volver a generar el video

Necesitas Node 22 o más nuevo, ffmpeg y Chrome.

```bash
cd pez-vela-secretos
node song.js                 # crea la música
node engine/render.js video  # dibuja todos los cuadros (tarda unos minutos)
node engine/render.js mux    # une imagen y sonido → out/pez-vela-secretos.mp4
```

## Cómo agregarle voz (recomendado)

Este piloto no tiene narración porque aquí no se pudo instalar un programa de voz. Tienes dos opciones:

1. **La más fácil:** abre el MP4 en **CapCut**, ve a *Texto → Texto a voz*, pega el guion de abajo y elige una voz en español latino. Baja la música a un 30 %.
2. **Automática:** instala `piper` (texto a voz gratuito que funciona sin internet) con una voz en español. Después agrega las líneas en `score.js` como `vo` y el motor sincroniza solo la voz y los subtítulos.

**Guion del episodio 1:**
> Este pez cambia de color en un instante. Es el pez vela, y dicen que es el más rápido del océano: ¡110 kilómetros por hora! ¡Mentira! Ese dato salió de viejas pruebas con carretes de pesca. Estudios modernos calculan que es mucho menos. Pero tiene un arma mejor: caza en equipo. Rodean un banco de sardinas y lo empujan hacia la superficie. Levantan la vela para verse enormes y se encienden con rayas azules. Atacan por turnos, golpeando a las sardinas con su pico. Y cuando termina la caza, su color se apaga. Sígueme para más secretos del azul.

## Ideas para los próximos episodios

Usa siempre la misma fórmula: un **gancho** en los primeros 2 segundos, un **dato que sorprende**, un **giro** ("¡Mentira!" o "Pero…") y un cierre con **"Sígueme"**.

2. El marlin azul: por qué las hembras son hasta 4 veces más grandes que los machos.
3. El dorado (mahi-mahi): pierde sus colores en minutos al salir del agua.
4. El atún rojo: puede calentar su cuerpo por encima de la temperatura del mar.
5. El pez volador: planea decenas de metros sobre el agua.
6. ¿Por qué los peces muerden más con la marea cambiando?

Antes de publicar, revisa cada dato en una fuente seria, como FishBase, NOAA o artículos científicos.

## Cómo automatizar la publicación

**Recomendado para empezar: Metricool (tiene plan gratis)**
1. Conecta Instagram, Facebook, TikTok y YouTube en metricool.com.
2. Una vez por semana, sube los 3 a 5 videos de esa semana con su texto y hashtags.
3. Prográmalos en las mejores horas (Metricool te las sugiere según tu audiencia).

**Texto sugerido para el episodio 1:**
> ¿Sabías que el pez vela cambia de color para cazar? 🐟⚡ El dato de los 110 km/h… no es lo que crees. #pesca #pezvela #oceano #pescadeportiva #sabiasque #ReyesDelAzul

**Más adelante, automatización completa con código:** un GitHub Action que cada día tome el siguiente video de una carpeta y lo publique usando las APIs oficiales:
- YouTube Data API (para Shorts)
- Instagram Graph API (necesita una cuenta Business vinculada a una página de Facebook)
- TikTok Content Posting API (TikTok tiene que aprobar la app)

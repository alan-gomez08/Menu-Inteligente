import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  businessName?: string;
  logoUrl?: string;
}

/**
 * Logotipo Vectorial Gastronómico Oficial (Logo.svg) animado apilando capa por capa:
 * 1. Pan inferior aterriza como base sólida.
 * 2. Medallón de carne cae sobre el pan inferior.
 * 3. Queso cheddar cae sobre la carne caliente.
 * 4. Lechuga ondulada cae sobre el queso.
 * 5. Pan superior con semillas corona la hamburguesa con rebote elástico.
 * 6. Luego, las letras "TU LOGO" se escriben caligráficamente debajo letra por letra.
 */
const AnimatedBurgerLogo: React.FC = () => {
  return (
    <motion.svg
      width="425"
      height="384"
      viewBox="0 0 425 384"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full object-contain overflow-visible"
    >
      {/* 
        Ajuste de simetría y centrado:
        La hamburguesa original tenía su centro en X = 200.9.
        El texto 'TU LOGO' está centrado a la perfección en X = 212.4 (centro de los 425px de ancho).
        Al trasladar la hamburguesa +11.5px en el eje X, su centro queda exactamente en X = 212.4,
        sincronizada milimétricamente con el texto inferior.
      */}
      <g transform="translate(11.5, 0)">
        {/* 1. Pan inferior - Cae primero como base de la hamburguesa */}
        <motion.path
          d="M98.3281 201.4H303.528V209C303.528 235.6 282.248 256.88 255.648 256.88H146.208C119.608 256.88 98.3281 235.6 98.3281 209V201.4Z"
          fill="#F69B25"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.35,
            ease: [0.25, 1, 0.5, 1],
          }}
        />

        {/* 2. Medallón de Carne / Tomate - Cae sobre el pan inferior */}
        <motion.path
          d="M297.068 152H104.788C94.9239 152 86.9277 159.996 86.9277 169.86C86.9277 179.724 94.9239 187.72 104.788 187.72H297.068C306.932 187.72 314.928 179.724 314.928 169.86C314.928 159.996 306.932 152 297.068 152Z"
          fill="#C83D2B"
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.42,
            duration: 0.32,
            ease: [0.34, 1.25, 0.64, 1],
          }}
        />

        {/* 3. Queso Cheddar - Cae sobre el medallón caliente */}
        <motion.path
          d="M146.967 152H226.767L194.087 177.84C192.469 179.135 190.459 179.841 188.387 179.841C186.315 179.841 184.304 179.135 182.687 177.84L146.967 152Z"
          fill="#FFD165"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.68,
            duration: 0.3,
            ease: [0.34, 1.25, 0.64, 1],
          }}
        />

        {/* 4. Lechuga ondulada - Cae sobre el queso */}
        <motion.path
          d="M86.9277 131.48C105.168 117.04 118.848 145.92 137.088 131.48C155.328 117.04 169.008 145.92 187.248 131.48C205.488 117.04 219.168 145.92 237.408 131.48C255.648 117.04 269.328 145.92 287.568 131.48C305.808 117.04 319.488 145.92 328.608 131.48"
          strokeWidth="16.72"
          strokeLinecap="round"
          stroke="#438B52"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.92,
            duration: 0.3,
            ease: [0.34, 1.25, 0.64, 1],
          }}
        />

        {/* 5. Pan Superior con Semillas de Sésamo - Cae coronando la hamburguesa con rebote */}
        <motion.g
          initial={{ y: -110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 1.18,
            duration: 0.38,
            ease: [0.34, 1.35, 0.64, 1],
          }}
        >
          {/* Tapa de pan */}
          <path
            d="M90.7285 102.6C90.7285 41.04 140.129 0 200.929 0C261.729 0 311.129 41.04 311.129 102.6C311.129 108.68 306.569 113.24 300.489 113.24H101.369C95.2885 113.24 90.7285 108.68 90.7285 102.6Z"
            fill="#F69B25"
          />
          {/* Semillas de sésamo */}
          <motion.path
            d="M150.589 50.6922C149.218 48.5801 146.393 47.9798 144.281 49.3514C142.169 50.723 141.569 53.5472 142.941 55.6593L148.322 63.9454C149.693 66.0575 152.517 66.6578 154.63 65.2861C156.742 63.9145 157.342 61.0904 155.97 58.9783L150.589 50.6922Z"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.38, duration: 0.2 }}
          />
          <motion.path
            d="M205.576 36.0079C206.1 33.5445 204.527 31.1231 202.064 30.5994C199.6 30.0758 197.179 31.6483 196.655 34.1117L194.601 43.7758C194.078 46.2392 195.65 48.6606 198.114 49.1842C200.577 49.7079 202.998 48.1354 203.522 45.672L205.576 36.0079Z"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.42, duration: 0.2 }}
          />
          <motion.path
            d="M255.9 55.7699C257.308 53.682 256.757 50.8478 254.669 49.4396C252.581 48.0313 249.747 48.5822 248.339 50.6701L242.814 58.861C241.406 60.9488 241.957 63.783 244.044 65.1913C246.132 66.5996 248.966 66.0487 250.375 63.9608L255.9 55.7699Z"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.46, duration: 0.2 }}
          />
        </motion.g>
      </g>

      {/* 6. Letras "TU LOGO" - Se escriben caligráficamente debajo una vez armada la hamburguesa */}
      {/* T */}
      <motion.path
        d="M8.74023 306.873H32.6802M32.6802 306.873H56.6202M32.6802 306.873V373.753"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.55, duration: 0.22, ease: 'easeOut' }}
      />
      {/* U */}
      <motion.path
        d="M80.1797 306.873V350.953C80.1797 382.113 125.78 382.113 125.78 350.953V306.873"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.72, duration: 0.22, ease: 'easeOut' }}
      />
      {/* L */}
      <motion.path
        d="M168.34 306.873V373.753H205.58"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.88, duration: 0.18, ease: 'easeOut' }}
      />
      {/* O */}
      <motion.path
        d="M251.561 306.873C263.943 306.873 273.981 316.911 273.981 329.293V351.333C273.981 363.715 263.943 373.753 251.561 373.753C239.178 373.753 229.141 363.715 229.141 351.333V329.293C229.141 316.911 239.178 306.873 251.561 306.873Z"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 2.02, duration: 0.22, ease: 'easeOut' }}
      />
      {/* G */}
      <motion.path
        d="M344.661 315.993C329.461 297.753 299.061 306.873 299.061 328.913V351.713C299.061 381.353 346.181 381.353 346.181 351.713V341.833H327.181"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 2.18, duration: 0.24, ease: 'easeOut' }}
      />
      {/* O */}
      <motion.path
        d="M393.68 306.873C406.062 306.873 416.1 316.911 416.1 329.293V351.333C416.1 363.715 406.062 373.753 393.68 373.753C381.298 373.753 371.26 363.715 371.26 351.333V329.293C371.26 316.911 381.298 306.873 393.68 306.873Z"
        strokeWidth="17.48"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#56271F"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 2.36, duration: 0.22, ease: 'easeOut' }}
      />
    </motion.svg>
  );
};

export const SplashScreen: React.FC<SplashScreenProps> = ({
  businessName,
  logoUrl,
}) => {
  const isCustomSvgLogo = Boolean(
    !logoUrl || logoUrl.toLowerCase().includes('logo.svg')
  );

  return (
    <motion.div
      key="splash-screen"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div className="relative flex items-center justify-center">
        {isCustomSvgLogo ? (
          /* LOGOTIPO OFICIAL ANIMADO APILANDO CAPA POR CAPA DIRECTO EN EL LIENZO LIMPIO */
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1, 1.035, 1] }}
            transition={{
              duration: 0.45,
              delay: 2.58,
              ease: 'easeOut',
            }}
            className="w-52 h-48 sm:w-64 sm:h-56 relative flex items-center justify-center"
          >
            <AnimatedBurgerLogo />
          </motion.div>
        ) : logoUrl ? (
          /* Fallback para otra imagen personalizada */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center"
          >
            <img
              src={logoUrl}
              alt={businessName || 'Logo'}
              width="192"
              height="192"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default SplashScreen;

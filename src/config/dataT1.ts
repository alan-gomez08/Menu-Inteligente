import type { ClientData } from '../types/index';

export const configT1: ClientData = {
  templateId: 'template-1',
  businessName: 'Tu Logo',
  identidad: {
    logo: '/assets-t1/Logo 2.png',
    logoNavbar: '/assets-t1/Logo 2.png',
    logoSplash: '/assets-t1/Logo.svg',
  },
  theme: { primaryColor: '#ffffff', secondaryColor: '#111827' },
  
  config: {
    ecommerceMode: true, // Mantiene el carrito encendido
    mostrarPrecios: true, // 👇 AGREGÁS ESTO PARA OCULTAR LOS PRECIOS
    deliveryMethod: 'ambos',
    deliveryZones: [
      { name: 'Retiro en Local', price: 0 },
      { name: 'Ramos Mejía', price: 1500 },
      { name: 'San Justo', price: 2000 },
      { name: 'Haedo', price: 1800 },
      { name: 'Morón', price: 2200 },
    ],
  },
  
  hero: {
    title: 'Bienvenidos!\nPreparamos El\nMejor Sabor Para\nVos.',
    titleTablet: 'Preparamos El Mejor Sabor\nPara Vos.',
    subtitle: 'Ingredientes frescos, recetas auténticas y una pasión genuina por la comida. ¡Descubrí tu nuevo plato favorito con nosotros!',
    buttonText: 'Hacé Tu Pedido Ahora',
    images: { desktop: '/assets-t1/hero-desktop.webp', tablet: '/assets-t1/hero-tablet.webp', mobile: '/assets-t1/hero-mobile.webp' },
  },
  
  about: { 
    title: '¿Por qué elegir nuestra cocina?', 
    subtitle: 'Nuestra pasión por la gastronomía se refleja en cada detalle. Descubrí una propuesta donde la técnica, la tradición y la innovación se encuentran para despertar todos tus sentidos.', 
    description: 'Creemos que la verdadera magia ocurre en el corazón de nuestra cocina, donde el fuego, la técnica y la pasión convergen todos los días. Por eso, nuestro equipo selecciona personalmente cada ingrediente trabajando de la mano con productores locales, priorizando siempre la frescura absoluta y la calidad premium en cada etapa de nuestra preparación. No nos conformamos con simplemente servir un plato; nuestra misión es llevarte a un viaje de sabores. Queremos que cada bocado sea una experiencia memorable y única para vos. Desde el primer aroma que llega a tu mesa hasta la calidez de nuestra atención, trabajamos incansablemente para brindarte el mejor servicio, un ambiente inigualable y los sabores más extraordinarios.', 
    images: { desktop: '/assets-t1/nosotros-desktop.webp', tablet: '/assets-t1/nosotros-tablet.webp', mobile: '/assets-t1/nosotros-mobile.webp' } 
  },
  
  menu: { 
    title: 'Nuestro Menú Destacado', 
    categories: ['Destacados', 'Hamburguesas', 'Veggie', 'Tacos', 'Bebidas'],
    items: [
      // === DESTACADOS (COINCIDENTE CON EL CATÁLOGO ACTIVO) ===
      { id: '1', title: 'Veggie Burger', description: 'Medallón de lentejas y quinoa, rúcula, tomate, cebolla morada y mayonesa vegana.', price: '.500', category: 'Destacados', imagePath: '/assets-t1/menu-burger-veggie.webp' },
      { id: '2', title: 'Burger Clásica Doble', description: 'Doble carne, doble queso cheddar, lechuga, tomate y salsa especial.', price: '.900', category: 'Destacados', imagePath: '/assets-t1/menu-burger-doble.webp', badge: 'Más Vendido' },
      { id: '3', title: 'Sándwich Especial', description: 'Jamón, queso, huevo, tomate y lechuga en pan de masa madre tostado.', price: '.200', category: 'Destacados', imagePath: '/assets-t1/menu-sandwich.webp' },
      { id: '4', title: 'Combo Wrap', description: 'Wrap de carne asada con papas fritas y bebida a elección.', price: '.000', category: 'Destacados', imagePath: '/assets-t1/menu-wrap.webp' },
      { id: '5', title: 'Tacos al Pastor', description: 'Tres tacos de carne marinada, cebolla, cilantro fresco y un toque de lima.', price: '.500', category: 'Destacados', imagePath: '/assets-t1/menu-tacos.webp', badge: 'Picante' },
      { id: '6', title: 'Burger Crispy', description: 'Doble medallón frito extra crujiente, lechuga, tomate y nuestra salsa casera.', price: '.500', category: 'Destacados', imagePath: '/assets-t1/menu-burger-crispy.webp' },
      
      // === HAMBURGUESAS ===
      { id: '7', title: 'Burger Clásica Doble', description: 'Doble carne, doble queso cheddar, lechuga, tomate y salsa especial.', price: '$7.900', category: 'Hamburguesas', imagePath: '/assets-t1/menu-burger-doble.webp', badge: 'Más Vendido' },
      { id: '8', title: 'Burger Crispy', description: 'Doble medallón frito extra crujiente, lechuga, tomate y nuestra salsa casera.', price: '$8.500', category: 'Hamburguesas', imagePath: '/assets-t1/menu-burger-crispy.webp' },
      { id: '9', title: 'Doble Cheddar & Bacon', description: 'Doble medallón smash, cuádruple cheddar derretido, panceta súper crocante y pan brioche tostado.', price: '$10.500', category: 'Hamburguesas', imagePath: '/assets-t1/burger-doble-cheddar.webp', badge: 'Más Vendido' },
      { id: '10', title: 'Burger Completa', description: 'Medallón de carne, queso cheddar, lechuga, tomate, aros de cebolla morada y mayonesa ahumada.', price: '$8.900', category: 'Hamburguesas', imagePath: '/assets-t1/burger-completa.webp' },
      { id: '11', title: 'Veggie Burger', description: 'Medallón de lentejas y quinoa, lechuga crespa, tomate fresco, cebolla morada y lactonesa de zanahoria.', price: '$8.200', category: 'Hamburguesas', imagePath: '/assets-t1/burger-veggie.webp' },
      { id: '12', title: 'Crispy Chicken', description: 'Pechuga de pollo frita extra crujiente, queso dambo, lechuga fresca y mayonesa casera en pan de papa.', price: '$9.200', category: 'Hamburguesas', imagePath: '/assets-t1/burger-crispy-chicken.webp', badge: 'Nuevo' },

      // === TACOS ===
      { id: '13', title: 'Tacos al Pastor', description: 'Tres tacos de carne marinada, cebolla, cilantro fresco y un toque de lima.', price: '$6.500', category: 'Tacos', imagePath: '/assets-t1/menu-tacos.webp', badge: 'Picante' },
      { id: '14', title: 'Combo Wrap', description: 'Wrap de carne asada con papas fritas y bebida a elección.', price: '$8.000', category: 'Tacos', imagePath: '/assets-t1/menu-wrap.webp' },
      { id: '15', title: 'Tacos con Queso Fundido', description: 'Tortillas rellenas de carne picada sazonada, lechuga fresca y abundante salsa de queso cheddar derretido.', price: '$7.200', category: 'Tacos', imagePath: '/assets-t1/tacos-queso-fundido.webp' },
      { id: '16', title: 'Tacos Dorados Crocantes', description: 'Tortillas de maíz crujientes rellenas de carne, lechuga, queso rallado y nuestra salsa especial de la casa.', price: '$6.800', category: 'Tacos', imagePath: '/assets-t1/tacos-dorados-crocantes.webp' },
      { id: '17', title: 'Tacos de Asada y Palta', description: 'Tradicionales tacos de carne asada servidos con cebolla, cilantro fresco y abundantes láminas de palta.', price: '$7.500', category: 'Tacos', imagePath: '/assets-t1/tacos-asada-palta.webp' },
      { id: '18', title: 'Tacos Estilo Callejero', description: 'Auténticos tacos mexicanos con carne fileteada, pico de gallo, cebolla morada y limas para acompañar.', price: '$6.000', category: 'Tacos', imagePath: '/assets-t1/tacos-estilo-callejero.webp', badge: 'Agotado', isSoldOut: true },

      // === OPCIONES VEGGIE ===
      { id: '19', title: 'Veggie Burger', description: 'Medallón de lentejas y quinoa, rúcula, tomate, cebolla morada y mayonesa vegana.', price: '$7.500', category: 'Opciones Veggie', imagePath: '/assets-t1/menu-burger-veggie.webp' },
      { id: '20', title: 'NotBurger Clásica', description: 'Medallón plant-based, queso vegetal derretido, tomate, cebolla morada y lechuga fresca.', price: '$8.500', category: 'Opciones Veggie', imagePath: '/assets-t1/notburger-clasica.webp' },
      { id: '21', title: 'Ciabatta Veggie', description: 'Pan ciabatta rústico relleno con queso, finas rodajas de tomate y hojas de lechuga.', price: '$6.500', category: 'Opciones Veggie', imagePath: '/assets-t1/ciabatta-veggie.webp' },
      { id: '22', title: 'Sándwich Integral Triple', description: 'Triple capa de pan integral tostado, lechuga crespa, tomate fresco y aros de cebolla morada.', price: '$6.800', category: 'Opciones Veggie', imagePath: '/assets-t1/sandwich-integral.webp' },
      { id: '23', title: 'Wrap de Soja y Vegetales', description: 'Tortillas rellenas de soja texturizada sazonada, lechuga fresca y vegetales asados.', price: '$7.000', category: 'Opciones Veggie', imagePath: '/assets-t1/wrap-soja-vegetales.webp' },
      { id: '24', title: 'Sándwich Baguette Fresco', description: 'Baguette crujiente y fresca con rodajas de vegetales de estación, queso y hojas verdes.', price: '$6.200', category: 'Opciones Veggie', imagePath: '/assets-t1/baguette-fresco.webp' },

      // === BEBIDAS ===
      { id: '25', title: 'Coca-Cola Regular', description: 'Lata de 354ml de la clásica gaseosa cola, bien helada para acompañar.', price: '$1.500', category: 'Bebidas', imagePath: '/assets-t1/lata-coca-cola.webp' },
      { id: '26', title: 'Pepsi Regular', description: 'Lata de 354ml, súper refrescante y con el sabor original de siempre.', price: '$1.500', category: 'Bebidas', imagePath: '/assets-t1/lata-pepsi.webp' },
      { id: '27', title: 'Fanta Naranja', description: 'Lata de 354ml de gaseosa sabor naranja, dulce, con gas y muy fría.', price: '$1.500', category: 'Bebidas', imagePath: '/assets-t1/lata-fanta.webp' },
      { id: '28', title: 'Sprite Sin Azúcar', description: 'Lata de 354ml, el mejor sabor lima-limón para refrescarte sin calorías.', price: '$1.500', category: 'Bebidas', imagePath: '/assets-t1/lata-sprite-zero.webp' },
      { id: '29', title: 'Cerveza Heineken', description: 'Lata de 473ml de cerveza premium lager, de sabor suave, rubia y ligera.', price: '$2.500', category: 'Bebidas', imagePath: '/assets-t1/lata-heineken.webp' },
      { id: '30', title: 'Agua Mineral Crystal', description: 'Botella de 500ml de agua purificada sin gas, ideal para tu comida.', price: '$1.200', category: 'Bebidas', imagePath: '/assets-t1/botella-agua-crystal.webp' }
    ] 
  },
  
  stats: { 
    title: 'Creemos en la calidad absoluta', 
    items: [
      { value: '10K+', label: 'Pedidos entregados' }, 
      { value: '98%', label: 'Clientes felices' }, 
      { value: '5+', label: 'Años de experiencia' }, 
      { value: '50+', label: 'Opciones en el menú' }
    ] 
  },
  
  events: { 
    title: 'Llevamos Nuestro Sabor A Tus Eventos', 
    description: '¿Tenés un cumpleaños, una juntada con amigos o un evento de fin de año? Nos encargamos de la comida para que vos solo te preocupes por disfrutar. Armamos un presupuesto a medida con las opciones que a vos más te gusten para tus invitados.', 
    buttonText: 'Consultar por Eventos' 
  },
  
  testimonials: { 
    title: 'Lo que dicen nuestros clientes', 
    items: [
      { id: '1', name: 'Mateo J.', rating: 5, text: 'La mejor hamburguesa que probé en mi vida. La carne en su punto exacto y las papas súper crujientes. ¡10/10, sin dudas los vuelvo a elegir!', imagePath: '/assets-t1/review-martin.webp' },
      { id: '2', name: 'Laura C.', rating: 5, text: 'Excelente servicio. El pedido llegó súper rápido, caliente y todo estaba riquísimo. Súper recomendados y la atención es de primera.', imagePath: '/assets-t1/review-laura.webp' },
      { id: '3', name: 'Sofía M.', rating: 5, text: 'Soy vegetariana y me cuesta encontrar opciones ricas. La veggie burger de acá es una locura, súper sabrosa y con ingredientes frescos de verdad.', imagePath: '/assets-t1/review-sofia.webp' }
    ] 
  },
  
  location: { 
    title: 'Nuestro Local.\n¿Dónde Encontrarnos?', 
    description: '¿Preferís pasar a buscar tu pedido? Estás invitado a conocer nuestro local, con un ambiente cálido y la mejor atención. Encontrá la sucursal más cercana y vení a visitarnos.', 
    buttonText: 'Hacer pedido para retirar', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016713276848!2d-58.38375908477038!3d-34.60373888045942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11be2277a064115b!2sObelisco!5e0!3m2!1ses-419!2sar!4v1680000000000!5m2!1ses-419!2sar' 
  },
  
  contact: { 
    whatsapp: '5491100000000', 
    instagram: 'tu_instagram', 
    facebook: 'tu_facebook' 
  }
};
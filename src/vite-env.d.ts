/// <reference types="vite/client" />

// Declare CSS modules and CSS imports
declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'swiper/css' {
  const content: string;
  export default content;
}

declare module 'swiper/css/effect-fade' {
  const content: string;
  export default content;
}

declare module 'swiper/css/navigation' {
  const content: string;
  export default content;
}

declare module 'swiper/css/pagination' {
  const content: string;
  export default content;
}

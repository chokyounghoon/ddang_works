import { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export function useKakaoMap(mapContainerId: string, initialLat = 37.5665, initialLng = 126.9780) {
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    
    // 키가 없으면 초기화 중단 (개발 중 임시 처리 포함)
    if (!kakaoMapKey) {
      console.warn("NEXT_PUBLIC_KAKAO_MAP_KEY is missing. Map will not load properly.");
    }

    const scriptId = 'kakao-map-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey || 'dummy_key'}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      document.head.appendChild(script);
    }

    const onLoad = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
        const container = document.getElementById(mapContainerId);
        if (container && !map) {
          const options = {
            center: new window.kakao.maps.LatLng(initialLat, initialLng),
            level: 3,
          };
          const newMap = new window.kakao.maps.Map(container, options);
          setMap(newMap);
        }
      });
    };

    if (window.kakao && window.kakao.maps) {
      onLoad();
    } else {
      script.addEventListener('load', onLoad);
      script.addEventListener('error', (e) => {
        setError(new Error('Failed to load Kakao Maps script.'));
      });
    }

    return () => {
      if (script) {
        script.removeEventListener('load', onLoad);
      }
    };
  }, [mapContainerId, initialLat, initialLng]);

  return { map, isLoaded, error };
}

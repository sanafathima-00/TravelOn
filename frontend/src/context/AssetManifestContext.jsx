import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAssetManifest } from '../utils/assetManifest';

const AssetManifestContext = createContext(null);

export function AssetManifestProvider({ children }) {
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    fetchAssetManifest().then(setManifest);
  }, []);

  return (
    <AssetManifestContext.Provider value={manifest}>
      {children}
    </AssetManifestContext.Provider>
  );
}

export function useAssetManifest() {
  return useContext(AssetManifestContext);
}

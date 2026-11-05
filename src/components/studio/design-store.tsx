"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { configKey, normalizeConfig } from "@/lib/pricing";
import type { Catalog, DesignConfig, FinishId } from "@/lib/types";

export type DesignStoreState = {
  config: DesignConfig;
  name: string;
  savedId: string | null;
  savedConfigKey: string | null;
  savedName: string | null;
  setName: (name: string) => void;
  setSize: (sizeId: string) => void;
  setTierFlavor: (index: number, flavorId: string) => void;
  setTierColor: (index: number, colorHex: string) => void;
  setFrosting: (frostingId: string) => void;
  setFinish: (finish: FinishId) => void;
  toggleDecoration: (decorationId: string) => void;
  setInscription: (inscription: string) => void;
  replaceConfig: (config: DesignConfig) => void;
  markSaved: (id: string, name: string) => void;
};

function createDesignStore(
  initialConfig: DesignConfig,
  initialName: string,
  initialSavedId: string | null,
  catalog: Catalog,
): StoreApi<DesignStoreState> {
  const initialNormalized = normalizeConfig(initialConfig, catalog);

  return createStore<DesignStoreState>((set, get) => ({
    config: initialNormalized,
    name: initialName,
    savedId: initialSavedId,
    savedConfigKey: initialSavedId ? configKey(initialNormalized) : null,
    savedName: initialSavedId ? initialName : null,

    setName: (name) => set({ name }),

    setSize: (sizeId) => {
      const size = catalog.sizes.find((item) => item.id === sizeId);
      if (!size) {
        return;
      }
      const current = get().config.tiers;
      const last = current[current.length - 1];
      const fallbackFlavor = catalog.flavors[0]?.id ?? "";
      const tiers = Array.from({ length: size.tiers }, (_, index) => {
        return (
          current[index] ?? {
            flavorId: last?.flavorId ?? fallbackFlavor,
            colorHex: last?.colorHex ?? "#F3E9D8",
          }
        );
      });
      set({
        config: normalizeConfig(
          { ...get().config, sizeId, tiers },
          catalog,
        ),
      });
    },

    setTierFlavor: (index, flavorId) => {
      const tiers = get().config.tiers.map((tier, tierIndex) =>
        tierIndex === index ? { ...tier, flavorId } : tier,
      );
      set({
        config: normalizeConfig({ ...get().config, tiers }, catalog),
      });
    },

    setTierColor: (index, colorHex) => {
      const tiers = get().config.tiers.map((tier, tierIndex) =>
        tierIndex === index ? { ...tier, colorHex } : tier,
      );
      set({
        config: normalizeConfig({ ...get().config, tiers }, catalog),
      });
    },

    setFrosting: (frostingId) =>
      set({
        config: normalizeConfig({ ...get().config, frostingId }, catalog),
      }),

    setFinish: (finish) =>
      set({
        config: normalizeConfig({ ...get().config, finish }, catalog),
      }),

    toggleDecoration: (decorationId) => {
      const current = get().config.decorationIds;
      const decorationIds = current.includes(decorationId)
        ? current.filter((id) => id !== decorationId)
        : [...current, decorationId];
      set({
        config: normalizeConfig(
          { ...get().config, decorationIds },
          catalog,
        ),
      });
    },

    setInscription: (inscription) =>
      set({
        config: normalizeConfig(
          { ...get().config, inscription: inscription.slice(0, 30) },
          catalog,
        ),
      }),

    replaceConfig: (config) =>
      set({ config: normalizeConfig(config, catalog) }),

    markSaved: (id, name) => {
      set({
        name,
        savedId: id,
        savedConfigKey: configKey(get().config),
        savedName: name,
      });
    },
  }));
}

const DesignStoreContext = createContext<StoreApi<DesignStoreState> | null>(
  null,
);

export function DesignProvider({
  initialConfig,
  initialName,
  initialSavedId,
  catalog,
  children,
}: {
  initialConfig: DesignConfig;
  initialName: string;
  initialSavedId: string | null;
  catalog: Catalog;
  children: ReactNode;
}) {
  const [store] = useState(() =>
    createDesignStore(initialConfig, initialName, initialSavedId, catalog),
  );

  return (
    <DesignStoreContext.Provider value={store}>
      {children}
    </DesignStoreContext.Provider>
  );
}

export function useDesignStore<T>(
  selector: (state: DesignStoreState) => T,
): T {
  const store = useContext(DesignStoreContext);
  if (!store) {
    throw new Error("useDesignStore must be used inside DesignProvider");
  }
  return useStore(store, selector);
}

import { ComponentType, PropsWithChildren, ReactNode } from 'react';

export type ProviderComponent = ComponentType<PropsWithChildren>;

export type ProviderSlot = {
  id: string;
  Provider: ProviderComponent;
  enabled?: boolean;
};

export function composeProviders(slots: readonly ProviderSlot[]): ProviderComponent {
  return function ComposedProviders({ children }: PropsWithChildren) {
    return slots.reduceRight<ReactNode>((acc, slot) => {
      if (slot.enabled === false) {
        return acc;
      }

      const Provider = slot.Provider;
      return <Provider>{acc}</Provider>;
    }, children);
  };
}

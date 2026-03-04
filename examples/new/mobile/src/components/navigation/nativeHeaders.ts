export type NativeHeaderOptionsInput = {
  title: string;
  largeTitle?: boolean;
};

export function createNativeHeaderOptions({
  title,
  largeTitle = true,
}: NativeHeaderOptionsInput) {
  return {
    title,
    headerLargeTitle: largeTitle,
    headerShadowVisible: false,
    headerBackTitleVisible: false,
  };
}
